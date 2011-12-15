SELECT content.*, content_reference.*, content_type.*
FROM content_reference
LEFT JOIN content ON content.content_reference_id = content_reference.content_reference_id
LEFT JOIN content_type ON content.content_type_id = content_type.content_type_id
WHERE start_book_id = :book_id AND start_chapter = :chapter