INSERT INTO content_reference (
    start_book_id,
    start_chapter,
    start_verse,
    end_book_id,
    end_chapter,
    end_verse,
    translation,
    created
) VALUES (
    :start_book_id,
    :start_chapter,
    :start_verse,
    :end_book_id,
    :end_chapter,
    :end_verse,
    :translation,
    NOW()
);

SET @reference_id = LAST_INSERT_ID();
SET @type_id = (SELECT content_type_id FROM content_type WHERE content_type = :type);
SET @privacy_id = (SELECT content_privacy_id FROM content_privacy WHERE content_privacy = :privacy);

INSERT INTO content (
    content_type_id,
    content_reference_id,
    content_privacy_id,
    content
) VALUES (
    @type_id,
    @reference_id,
    @privacy_id,
    :content
);