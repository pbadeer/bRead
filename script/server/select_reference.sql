SELECT content_reference_id FROM content_reference
WHERE
    start_book_id = :start_book_id AND
    start_chapter = :start_chapter AND
    start_verse = :start_verse AND
    end_book_id = :end_book_id AND
    end_chapter = :end_chapter AND
    end_verse = :end_verse
;