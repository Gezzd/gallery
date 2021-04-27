/*
Navicat MySQL Data Transfer

Source Server         : mh
Source Server Version : 50726
Source Host           : localhost:3306
Source Database       : mm

Target Server Type    : MYSQL
Target Server Version : 50726
File Encoding         : 65001

Date: 2021-04-26 20:42:39
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for picturedepot
-- ----------------------------
DROP TABLE IF EXISTS `picturedepot`;
CREATE TABLE `picturedepot` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sign` varchar(255) NOT NULL COMMENT '代表哪个图库',
  `origin_url` varchar(1000) NOT NULL COMMENT '原图',
  `thumbnail_url` varchar(1000) NOT NULL COMMENT '缩略图',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `origin_name` varchar(1000) NOT NULL COMMENT '图片原始名称',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=880 DEFAULT CHARSET=utf8;
