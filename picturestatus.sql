/*
Navicat MySQL Data Transfer

Source Server         : mh
Source Server Version : 50726
Source Host           : localhost:3306
Source Database       : mm

Target Server Type    : MYSQL
Target Server Version : 50726
File Encoding         : 65001

Date: 2021-04-26 20:42:22
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for picturestatus
-- ----------------------------
DROP TABLE IF EXISTS `picturestatus`;
CREATE TABLE `picturestatus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL COMMENT '图库名称',
  `sign` varchar(255) NOT NULL COMMENT '标志',
  `galleryDescribe` longtext NOT NULL COMMENT '图库的描述',
  `slidesImages` longtext COMMENT '头图轮播',
  `maxSlideNumber` int(2) DEFAULT NULL,
  `address` varchar(255) NOT NULL,
  `holdingTime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
