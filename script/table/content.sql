CREATE TABLE `content` (
  `content_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `content_type_id` int(11) DEFAULT NULL,
  `reference_id` int(11) DEFAULT NULL,
  `content` text,
  `archived` tinyint(1) NOT NULL DEFAULT '0',
  `content_privacy_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`content_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;