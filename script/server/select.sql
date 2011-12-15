SELECT
    content.*,
    content_reference.start_book_id,
    content_reference.start_chapter,
    content_reference.start_verse,
    content_reference.end_book_id,
    content_reference.end_chapter,
    content_reference.end_verse,
    content_type.content_type,
    content_privacy.content_privacy
FROM content_reference
LEFT JOIN content ON content.content_reference_id = content_reference.content_reference_id
LEFT JOIN content_type ON content.content_type_id = content_type.content_type_id
LEFT JOIN content_privacy ON content.content_privacy_id = content_privacy.content_privacy_id
WHERE start_book_id = :book_id AND start_chapter = :chapter