CREATE TABLE `content` (
  `content_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `content_type_id` int(11) DEFAULT NULL,
  `content_privacy_id` int(11) DEFAULT NULL,
  `content_reference_id` int(11) DEFAULT NULL,
  `content` text,
  `archived` tinyint(1) NOT NULL DEFAULT '0',
  FOREIGN KEY (`content_type_id`) REFERENCES content_type(`content_type_id`),
  FOREIGN KEY (`content_privacy_id`) REFERENCES content_privacy(`content_privacy_id`),
  FOREIGN KEY (`content_reference_id`) REFERENCES content_reference(`content_reference_id`),
  PRIMARY KEY (`content_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;