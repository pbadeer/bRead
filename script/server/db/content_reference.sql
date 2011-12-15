CREATE TABLE `content_reference` (
  `content_reference_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `start_book_id` tinyint(2) DEFAULT NULL,
  `start_chapter` tinyint(3) DEFAULT NULL,
  `start_verse` tinyint(3) DEFAULT NULL,
  `end_book_id` tinyint(2) DEFAULT NULL,
  `end_chapter` tinyint(3) DEFAULT NULL,
  `end_verse` tinyint(3) DEFAULT NULL,
  PRIMARY KEY (`content_reference_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;