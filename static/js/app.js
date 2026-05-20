const App = {
  chapter: 1,
  bookId: 40,
  translation: 'NASB',
  passage: null,
  userContent: [],
  selection: null,
  privacy: 'public',
  notes: '',
  ckEditor: null,

  init() {
    this.setupCKEditor();
    this.setupEventListeners();
    this.loadPassage();
  },

  setupCKEditor() {
    if (window.CKEDITOR) {
      const editor = window.CKEDITOR.replace('notes');
      this.ckEditor = editor;
    }
  },

  setupEventListeners() {
    document.addEventListener('mouseup', (e) => this.handleSelection(e));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') this.next();
      if (e.key === 'ArrowLeft') this.previous();
    });

    const prevBtn = document.getElementById('prev-btn');
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.previous();
      });
    }

    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.next();
      });
    }

    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.saveNotes();
      });
    }

    const privacyBadge = document.querySelector('.privacy-badge');
    if (privacyBadge) {
      privacyBadge.addEventListener('click', () => {
        this.privacy = this.privacy === 'public' ? 'private' : 'public';
        this.updatePrivacyBadge();
      });
    }
  },

  bookName(abbr = false, bookId = null) {
    const id = bookId || this.bookId;
    if (typeof Book === 'undefined' || !Book[id]) {
      return '';
    }
    let name = Book[id].name;
    name = name.charAt(0).toUpperCase() + name.slice(1);
    return abbr ? name.substr(0, 4) + '.' : name;
  },

  title() {
    return this.bookName() + ' ' + this.chapter;
  },

  reference(ref) {
    if (ref.startBookId === ref.endBookId && ref.startChapter === ref.endChapter && ref.startVerse === ref.endVerse) {
      return this.bookName(true) + ' ' + ref.startChapter + ':' + ref.startVerse;
    } else if (ref.startBookId === ref.endBookId && ref.startChapter === ref.endChapter) {
      return this.bookName(true) + ' ' + ref.startChapter + ':' + ref.startVerse + '-' + ref.endVerse;
    } else if (ref.startBookId === ref.endBookId) {
      return this.bookName(true) + ' ' + ref.startChapter + ':' + ref.startVerse + '-' + ref.endChapter + ':' + ref.endVerse;
    } else {
      return this.bookName(true) + ' ' + ref.startChapter + ':' + ref.startVerse + ' - ' + this.bookName(true, ref.endBookId) + ' ' + ref.endChapter + ':' + ref.endVerse;
    }
  },

  async loadPassage() {
    this.showLoading();

    const response = await fetch(`static/data/${this.translation}/${this.bookId}/${this.chapter}.xml`);
    const xmlText = await response.text();

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    this.passage = this.xml2json(xmlDoc);

    await this.loadUserContent();
    this.render();
  },

  xml2json(xmlDoc) {
    const result = {};
    const chapterElement = xmlDoc.querySelector(':root') || xmlDoc;

    result._translation = chapterElement.getAttribute('translation');
    result._book = chapterElement.getAttribute('book');
    result._book_id = parseInt(chapterElement.getAttribute('book_id')) || this.bookId;
    result._n = parseInt(chapterElement.getAttribute('n')) || this.chapter;

    const verses = chapterElement.querySelectorAll('verse');
    result.verse = Array.from(verses).map((verse, index) => {
      const verseNum = index + 1;
      const verseText = verse.textContent.trim();
      return {
        _index: verseNum,
        content: verseText
      };
    });

    return result;
  },

  async loadUserContent() {
    try {
      const response = await fetch(`/api/content?book_id=${this.bookId}&chapter=${this.chapter}`);
      this.userContent = await response.json();
    } catch (error) {
      console.error('Error loading user content:', error);
      this.userContent = [];
    }
  },

  async saveNotes() {
    if (!this.selection) return;

    const content = this.ckEditor ? this.ckEditor.getData() : document.getElementById('notes').value;
    if (!content.trim()) return;

    try {
      const params = new URLSearchParams({
        start_book_id: this.selection.startBookId,
        start_chapter: this.selection.startChapter,
        start_verse: this.selection.startVerse,
        start_index: this.selection.startIndex,
        end_book_id: this.selection.endBookId,
        end_chapter: this.selection.endChapter,
        end_verse: this.selection.endVerse,
        end_index: this.selection.endIndex
      });
      const response = await fetch('/api/reference?' + params.toString());

      const reference = await response.json();
      const referenceId = reference.id;

      await this.createContentItem('note', content, referenceId);
      if (this.ckEditor) this.ckEditor.setData('');
    } catch (error) {
      console.error('Error saving note:', error);
    }
  },

  async createContentItem(type, content, referenceId) {
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference_id: referenceId,
          type: type,
          content: content,
          privacy: this.privacy,
          translation: this.translation
        })
      });

      await response.json();
      await this.loadUserContent();
      this.renderUserContent();
    } catch (error) {
      console.error('Error creating content:', error);
    }
  },

  next() {
    const maxChapters = Book[this.bookId].chapters;
    const totalBooks = Object.keys(Book).length;

    if (this.chapter < maxChapters) {
      this.chapter++;
    } else if (this.chapter === maxChapters && this.bookId !== totalBooks) {
      this.bookId++;
      this.chapter = 1;
    }

    this.loadPassage();
  },

  previous() {
    const maxChapters = Book[this.bookId].chapters;

    if (this.chapter > 1) {
      this.chapter--;
    } else if (this.chapter === 1 && this.bookId !== 1) {
      this.bookId--;
      this.chapter = Book[this.bookId].chapters;
    }

    this.loadPassage();
  },

  handleSelection(e) {
    const start = this.getSelectedNode('start');
    const end = this.getSelectedNode('end');
    const range = this.getSelectionRange();

    if (!start || !end || !range) return;

    const sb = parseInt(start.getAttribute('book-id')) || this.bookId;
    const sc = parseInt(start.getAttribute('chapter')) || this.chapter;
    const sv = parseInt(start.getAttribute('verse')) || 1;
    const si = range.startOffset;

    const eb = parseInt(end.getAttribute('book-id')) || this.bookId;
    const ec = parseInt(end.getAttribute('chapter')) || this.chapter;
    const ev = parseInt(end.getAttribute('verse')) || 1;
    const ei = range.endOffset;

    this.selection = {
      startBookId: sb,
      endBookId: eb,
      startChapter: sc,
      endChapter: ec,
      startVerse: sv,
      endVerse: ev,
      startIndex: si,
      endIndex: ei
    };

    this.highlightVerses();
    this.updateReferenceDisplay();
  },

  getSelectedNode(pos) {
    let node, selection;
    if (window.getSelection) {
      selection = window.getSelection();
      if (pos === 'start') node = selection.anchorNode;
      if (pos === 'end') node = selection.focusNode;
    }
    if (!node && document.selection) {
      selection = document.selection;
      const range = selection.getRangeAt ? selection.getRangeAt(0) : selection.createRange();
      node = range.commonAncestorContainer ? range.commonAncestorContainer : range.parentElement;
    }
    if (node) {
      return node.nodeName === '#text' ? node.parentNode : node;
    }
    return null;
  },

  getSelectionRange() {
    const sel = window.getSelection();
    if (sel.rangeCount) {
      return sel.getRangeAt(0);
    }
    return null;
  },

  highlightVerses() {
    document.querySelectorAll('.verse').forEach(verse => {
      verse.classList.remove('verse-highlight');
    });

    if (!this.selection) return;

    const startVerse = this.findVerseByAttributes(this.selection.startBookId, this.selection.startChapter, this.selection.startVerse);
    const endVerse = this.findVerseByAttributes(this.selection.endBookId, this.selection.endChapter, this.selection.endVerse);

    if (startVerse && endVerse) {
      let current = startVerse;
      while (current && current !== endVerse && current.nextElementSibling) {
        if (current.classList.contains('verse')) {
          current.classList.add('verse-highlight');
        }
        current = current.nextElementSibling;
      }
      if (endVerse.classList.contains('verse')) {
        endVerse.classList.add('verse-highlight');
      }
    }
  },

  findVerseByAttributes(bookId, chapter, verseNum) {
    return document.querySelector(`.verse[book-id="${bookId}"][chapter="${chapter}"][verse="${verseNum}"]`);
  },

  showLoading() {
    const bibleElement = document.getElementById('bible');
    if (bibleElement) {
      bibleElement.innerHTML = '<div class="loading">Loading...</div>';
    }
  },

  updatePrivacyBadge() {
    const badge = document.querySelector('.privacy-badge');
    if (badge) {
      badge.textContent = this.privacy === 'public' ? 'Public' : 'Private';
      badge.className = `privacy-badge ${this.privacy}`;
    }
  },

  updateReferenceDisplay() {
    const refElement = document.getElementById('reference');
    if (!refElement || !this.selection) return;
    refElement.textContent = this.bookName(true) + ' ' + this.selection.startChapter + ':' + this.selection.startVerse + ' - ' + this.bookName(true, this.selection.endBookId) + ' ' + this.selection.endChapter + ':' + this.selection.endVerse;
  },

  updateNavigationButtons() {
    const prevBtn = document.querySelector('button:contains("previous")');
    const nextBtn = document.querySelector('button:contains("next")');

    if (prevBtn) prevBtn.disabled = this.bookId === 1 && this.chapter === 1;
    if (nextBtn) {
      const maxChapters = Book[this.bookId].chapters;
      const totalBooks = Object.keys(Book).length;
      nextBtn.disabled = this.chapter === maxChapters && this.bookId === totalBooks;
    }
  },

  render() {
    const bibleElement = document.getElementById('bible');
    const titleElement = document.querySelector('.nav-title');

    titleElement.textContent = this.title();

    if (this.passage && this.passage.verse) {
      bibleElement.innerHTML = `
        <div class="chapter-header">${this.passage._translation} - ${this.bookName()} ${this.chapter}</div>
        <div class="chapter">
          ${this.passage.verse.map(v => `
            <span class="verse" book-id="${this.passage._book_id}" chapter="${this.chapter}" verse="${v._index}">
              <span class="verse-number">${v._index}</span>
              ${v.content}
            </span>
          `).join(' ')}
        </div>
      `;

      this.highlightVerses();
    } else {
      bibleElement.innerHTML = '<div class="error">Error loading passage</div>';
    }

    this.renderUserContent();
  },

  renderUserContent() {
    const userContentElement = document.querySelector('.user-content-list');
    if (!userContentElement) return;

    if (!this.userContent || this.userContent.length === 0) {
      userContentElement.innerHTML = '<div class="no-content">No notes or tags yet</div>';
      return;
    }

    userContentElement.innerHTML = this.userContent.map(passage => {
      const privacyClass = passage.privacy === 'private' ? 'private' : '';
      const notesHtml = passage.notes && passage.notes.length > 0 ? `
          <div class="content-notes">
            Notes: ${passage.notes.join(', ')}
          </div>
        ` : '';
      const tagsHtml = passage.tags && passage.tags.length > 0 ? `
          <div class="content-tags">
            ${passage.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')}
          </div>
        ` : '';
      return `
      <div class="user-content-item ${privacyClass}">
        <div class="reference">${this.reference(passage.reference)}</div>
        ${notesHtml}
        ${tagsHtml}
      </div>
    `;
    }).join('');
  }
};