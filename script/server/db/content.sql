CREATE TABLE `content` (
  `content_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `content_type_id` int(11) DEFAULT NULL,
  `content_privacy_id` int(11) DEFAULT NULL,
  `content_reference_id` int(11) DEFAULT NULL,
  `content` text,
  `translation` text,
  `archived` tinyint(1) NOT NULL DEFAULT '0',
  `created` timestamp NULL DEFAULT NULL,
  `modified` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`content_id`),
  KEY `content_type_id` (`content_type_id`),
  KEY `content_privacy_id` (`content_privacy_id`),
  KEY `content_reference_id` (`content_reference_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;