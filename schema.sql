CREATE DATABASE IF NOT EXISTS `q3rcon-bridge` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `q3rcon-bridge`;

CREATE TABLE IF NOT EXISTS `rcon_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `servers` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
