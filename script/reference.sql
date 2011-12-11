CREATE TABLE `reference` (
  `reference_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `start_book_id` tinyint(2) DEFAULT NULL,
  `start_chapter` tinyint(3) DEFAULT NULL,
  `start_verse` tinyint(3) DEFAULT NULL,
  `end_book_id` tinyint(2) DEFAULT NULL,
  `end_chapter` tinyint(3) DEFAULT NULL,
  `end_verse` tinyint(3) DEFAULT NULL,
  `translation` text,
  `created` timestamp NULL DEFAULT NULL,
  `modified` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`reference_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;