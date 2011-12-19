SET @type_id = (SELECT content_type_id FROM content_type WHERE content_type = :type);
SET @privacy_id = (SELECT content_privacy_id FROM content_privacy WHERE content_privacy = :privacy);

INSERT INTO content (
    content_type_id,
    content_privacy_id,
    content_reference_id,
    content,
    translation,
    created
) VALUES (
    @type_id,
    @privacy_id,
    :reference,
    :content,
    :translation,
    NOW()
);