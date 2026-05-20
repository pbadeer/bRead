import pytest
from playwright.sync_api import Page, expect


@pytest.fixture(scope="module")
def browser_context_args(browser_context_args):
    return {
        **browser_context_args,
        "viewport": {"width": 1280, "height": 720},
        "ignore_https_errors": True,
        "locale": "en-US",
    }


class TestVerseDisplay:
    def test_verses_render_inline(self, page: Page):
        page.goto("http://localhost:5555/")
        expect(page.locator("#nav-title")).to_be_visible()
        verses = page.locator(".verse")
        expect(verses).to_have_count(25)
        first_verse = verses.first
        box = first_verse.bounding_box()
        next_verse = verses.nth(1)
        next_box = next_verse.bounding_box()
        if box and next_box:
            assert abs(box["y"] - next_box["y"]) < 5

    def test_verse_numbers_visible(self, page: Page):
        page.goto("http://localhost:5555/")
        verse_numbers = page.locator(".verse-number")
        expect(verse_numbers).to_have_count(25)
        expect(verse_numbers.nth(0)).to_have_text("1")
        expect(verse_numbers.nth(1)).to_have_text("2")
        expect(verse_numbers.nth(24)).to_have_text("25")

    def test_chapter_header_displays(self, page: Page):
        page.goto("http://localhost:5555/")
        chapter_header = page.locator(".chapter-header")
        expect(chapter_header).to_be_visible()
        expect(chapter_header).to_contain_text("Matthew")
        expect(chapter_header).to_contain_text("1")

    def test_navigation_buttons_exist(self, page: Page):
        page.goto("http://localhost:5555/")
        prev_btn = page.locator("#prev-btn")
        next_btn = page.locator("#next-btn")
        expect(prev_btn).to_be_visible()
        expect(next_btn).to_be_visible()
        expect(prev_btn).to_contain_text("previous")
        expect(next_btn).to_contain_text("next")

    def test_navigation_moves_to_next_chapter(self, page: Page):
        page.goto("http://localhost:5555/")
        title = page.locator("#nav-title")
        expect(title).to_contain_text("Matthew 1")
        page.locator("#next-btn").click()
        page.wait_for_selector(".verse", state="visible")
        page.wait_for_timeout(500)
        expect(title).to_contain_text("Matthew 2")

    def test_navigation_moves_to_previous_chapter(self, page: Page):
        page.goto("http://localhost:5555/")
        page.locator("#next-btn").click()
        page.wait_for_selector(".verse", state="visible")
        page.wait_for_timeout(500)
        title = page.locator("#nav-title")
        expect(title).to_contain_text("Matthew 2")
        page.locator("#prev-btn").click()
        page.wait_for_selector(".verse", state="visible")
        page.wait_for_timeout(500)
        expect(title).to_contain_text("Matthew 1")


class TestNoteSystem:
    def test_notes_form_visible(self, page: Page):
        page.goto("http://localhost:5555/")
        save_btn = page.locator("#save-btn")
        expect(save_btn).to_be_visible()
        expect(save_btn).to_have_text("Save Note")
        privacy_badge = page.locator("#privacy-badge")
        expect(privacy_badge).to_be_visible()

    def test_privacy_badge_clickable(self, page: Page):
        page.goto("http://localhost:5555/")
        privacy_badge = page.locator("#privacy-badge")
        expect(privacy_badge).to_have_text("Public")
        privacy_badge.click()
        expect(privacy_badge).to_have_text("Private")
        privacy_badge.click()
        expect(privacy_badge).to_have_text("Public")

    def test_save_note_button_works(self, page: Page):
        page.goto("http://localhost:5555/")
        page.wait_for_selector(".verse", state="visible")
        save_btn = page.locator("#save-btn")
        save_btn.click()
        page.wait_for_timeout(500)
        user_content = page.locator("#user-content-list")
        expect(user_content).to_contain_text("No notes or tags yet")

    def test_note_saving_with_selection(self, page: Page):
        page.goto("http://localhost:5555/")
        page.wait_for_selector(".verse", state="visible")
        verses = page.locator(".verse")
        first_verse = verses.first
        first_verse.click()
        page.wait_for_timeout(200)
        save_btn = page.locator("#save-btn")
        save_btn.click()
        page.wait_for_timeout(1000)
        user_content = page.locator("#user-content-list")
        expect(user_content).to_contain_text("No notes or tags yet")


class TestUserContentDisplay:
    def test_no_content_message_shown(self, page: Page):
        page.goto("http://localhost:5555/")
        page.wait_for_selector(".verse", state="visible")
        no_content = page.locator(".no-content")
        expect(no_content).to_be_visible()
        expect(no_content).to_have_text("No notes or tags yet")

    def test_user_content_list_exists(self, page: Page):
        page.goto("http://localhost:5555/")
        page.wait_for_selector(".verse", state="visible")
        user_content_list = page.locator("#user-content-list")
        expect(user_content_list).to_be_visible()


class TestSelectionHighlighting:
    def test_highlight_verses_class_applied(self, page: Page):
        page.goto("http://localhost:5555/")
        page.wait_for_selector(".verse", state="visible")
        page.evaluate('''() => {
            const range = document.createRange();
            const verse1 = document.querySelector('.verse[verse="1"]');
            const verse2 = document.querySelector('.verse[verse="2"]');
            const sel = window.getSelection();
            sel.removeAllRanges();
            range.setStart(verse1.firstChild, 0);
            range.setEnd(verse2.firstChild, 5);
            sel.addRange(range);
            document.dispatchEvent(new MouseEvent('mouseup', {bubbles: true, cancelable: true, view: window}));
        }''')
        page.wait_for_timeout(500)
        highlighted = page.locator(".verse-highlight")
        expect(highlighted).to_have_count(2)


class TestKeyboardNavigation:
    def test_left_arrow_previous(self, page: Page):
        page.goto("http://localhost:5555/")
        page.locator("#next-btn").click()
        page.wait_for_timeout(1000)
        title = page.locator("#nav-title")
        expect(title).to_contain_text("Matthew 2")
        page.keyboard.press("ArrowLeft")
        page.wait_for_timeout(1000)
        expect(title).to_contain_text("Matthew 1")

    def test_right_arrow_next(self, page: Page):
        page.goto("http://localhost:5555/")
        title = page.locator("#nav-title")
        expect(title).to_contain_text("Matthew 1")
        page.keyboard.press("ArrowRight")
        page.wait_for_timeout(1000)
        expect(title).to_contain_text("Matthew 2")


class TestApiEndpoints:
    def test_health_endpoint(self, page: Page):
        page.goto("http://localhost:5555/api/health")
        expect(page.locator("body")).to_contain_text("ok")

    def test_initialize_endpoint(self, page: Page):
        page.goto("http://localhost:5555/api/initialize")
        expect(page.locator("body")).to_contain_text("initialized")

    def test_content_endpoint_returns_json(self, page: Page):
        page.goto("http://localhost:5555/api/content?book_id=40&chapter=1")
        response = page.evaluate("() => fetch('/api/content?book_id=40&chapter=1').then(r => r.json())")
        assert isinstance(response, list)

    def test_reference_endpoint_creates_reference(self, page: Page):
        page.goto("http://localhost:5555/api/reference?start_book_id=40&start_chapter=1&start_verse=1&start_index=0&end_book_id=40&end_chapter=1&end_verse=1&end_index=10")
        response = page.evaluate("() => fetch('/api/reference?start_book_id=40&start_chapter=1&start_verse=1&start_index=0&end_book_id=40&end_chapter=1&end_verse=1&end_index=10').then(r => r.json())")
        assert "id" in response
        assert response["start_book_id"] == 40
        assert response["start_chapter"] == 1
