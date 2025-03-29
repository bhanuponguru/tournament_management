-- MySQL dump 10.13  Distrib 9.1.0, for Win64 (x86_64)
--
-- Host: 139.59.73.145    Database: tournament_db
-- ------------------------------------------------------
-- Server version	8.0.41-0ubuntu0.24.10.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `log`
--

DROP TABLE IF EXISTS `log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `log` (
  `log_id` int NOT NULL AUTO_INCREMENT,
  `match_id` int NOT NULL,
  `batsman_id` int NOT NULL,
  `bowler_id` int NOT NULL,
  `bowler_score` int NOT NULL,
  `batsman_score` int NOT NULL,
  `ball_type` enum('wide','no_ball','legal') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `wicket_type` enum('bowled','caught','run_out','stumped') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `wicket_by_id` int DEFAULT NULL,
  `catch_by_id` int DEFAULT NULL,
  `is_stumping` tinyint(1) NOT NULL,
  `date_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`),
  KEY `batsman_id` (`batsman_id`),
  KEY `bowler_id` (`bowler_id`),
  KEY `wicket_by_id` (`wicket_by_id`),
  KEY `catch_by_id` (`catch_by_id`),
  KEY `log_match_FK` (`match_id`),
  CONSTRAINT `log_ibfk_2` FOREIGN KEY (`batsman_id`) REFERENCES `player` (`player_id`),
  CONSTRAINT `log_ibfk_3` FOREIGN KEY (`bowler_id`) REFERENCES `player` (`player_id`),
  CONSTRAINT `log_ibfk_4` FOREIGN KEY (`wicket_by_id`) REFERENCES `player` (`player_id`),
  CONSTRAINT `log_ibfk_5` FOREIGN KEY (`catch_by_id`) REFERENCES `player` (`player_id`),
  CONSTRAINT `log_match_FK` FOREIGN KEY (`match_id`) REFERENCES `matches` (`match_id`)
) ENGINE=InnoDB AUTO_INCREMENT=144 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log`
--

LOCK TABLES `log` WRITE;
/*!40000 ALTER TABLE `log` DISABLE KEYS */;
INSERT INTO `log` VALUES (6,3,31,39,0,0,'legal',NULL,NULL,NULL,0,'2025-03-28 11:09:08'),(7,3,31,39,0,0,'legal',NULL,NULL,NULL,0,'2025-03-28 11:10:03'),(8,3,31,39,0,0,'legal',NULL,NULL,NULL,0,'2025-03-28 11:11:44'),(9,3,31,39,0,0,'legal',NULL,NULL,NULL,0,'2025-03-28 11:15:28'),(10,3,42,34,6,6,'legal',NULL,NULL,NULL,0,'2025-03-28 11:17:05'),(11,5,90,109,1,1,'legal',NULL,NULL,NULL,0,'2025-03-28 11:20:20'),(12,5,90,109,0,0,'legal',NULL,NULL,NULL,0,'2025-03-28 15:56:26'),(13,5,92,109,6,6,'legal',NULL,NULL,NULL,0,'2025-03-28 15:57:03'),(14,5,90,109,4,4,'legal',NULL,NULL,NULL,0,'2025-03-28 15:57:54'),(15,5,90,101,1,1,'legal',NULL,NULL,NULL,0,'2025-03-28 15:58:34'),(16,5,90,109,6,6,'legal',NULL,NULL,NULL,0,'2025-03-28 15:59:12'),(17,5,90,109,0,1,'legal',NULL,NULL,NULL,0,'2025-03-28 15:59:38'),(18,5,92,109,4,4,'legal',NULL,NULL,NULL,0,'2025-03-28 16:00:13'),(19,5,92,109,6,6,'legal',NULL,NULL,NULL,0,'2025-03-28 16:00:44'),(20,5,92,109,4,4,'legal',NULL,NULL,NULL,0,'2025-03-28 16:01:16'),(21,5,90,101,1,1,'legal',NULL,NULL,NULL,0,'2025-03-28 16:02:10'),(22,5,92,101,4,4,'legal',NULL,NULL,NULL,0,'2025-03-28 16:02:36'),(23,5,92,101,2,2,'legal',NULL,NULL,NULL,0,'2025-03-28 16:03:54'),(24,5,90,108,1,1,'legal',NULL,NULL,NULL,0,'2025-03-28 16:04:48'),(25,5,91,108,0,0,'legal',NULL,NULL,NULL,0,'2025-03-28 16:07:26'),(26,5,91,108,4,4,'legal',NULL,NULL,NULL,0,'2025-03-28 16:07:55'),(27,5,92,111,0,0,'wide',NULL,NULL,NULL,0,'2025-03-28 16:11:43'),(28,5,92,111,1,1,'legal',NULL,NULL,NULL,0,'2025-03-28 16:14:38'),(29,5,91,111,1,1,'legal',NULL,NULL,NULL,0,'2025-03-28 16:15:08'),(30,5,92,111,6,6,'legal',NULL,NULL,NULL,0,'2025-03-28 16:15:33'),(31,5,92,111,4,4,'legal',NULL,NULL,NULL,0,'2025-03-28 16:15:58'),(32,5,92,111,1,1,'legal',NULL,NULL,NULL,0,'2025-03-28 16:16:31'),(33,5,91,111,0,0,'legal',NULL,NULL,NULL,0,'2025-03-28 16:16:59'),(34,5,92,108,6,6,'legal',NULL,NULL,NULL,0,'2025-03-28 16:17:29'),(35,5,92,108,1,1,'legal',NULL,NULL,NULL,0,'2025-03-28 16:17:54'),(36,5,91,108,6,6,'legal',NULL,NULL,NULL,0,'2025-03-28 16:18:21'),(37,5,91,108,6,6,'legal',NULL,NULL,NULL,0,'2025-03-28 16:18:43'),(38,5,91,108,0,0,'legal',NULL,NULL,NULL,0,'2025-03-28 16:19:13'),(39,5,91,108,6,6,'legal',NULL,NULL,NULL,0,'2025-03-28 16:19:40'),(40,5,92,112,0,0,'legal',NULL,NULL,NULL,0,'2025-03-28 16:20:20'),(41,5,92,112,1,1,'legal',NULL,NULL,NULL,0,'2025-03-28 16:20:45'),(42,5,91,112,4,4,'legal',NULL,NULL,NULL,0,'2025-03-28 16:21:20'),(43,5,91,112,0,0,'legal',NULL,NULL,NULL,0,'2025-03-28 16:21:42'),(44,5,91,112,4,4,'legal',NULL,NULL,NULL,0,'2025-03-28 16:22:06'),(45,5,91,112,0,0,'legal',NULL,NULL,NULL,0,'2025-03-28 16:22:29'),(46,5,92,110,1,1,'legal',NULL,NULL,NULL,0,'2025-03-28 16:23:08'),(47,5,91,110,1,0,'wide',NULL,NULL,NULL,0,'2025-03-28 16:23:36'),(48,5,91,110,1,1,'legal',NULL,NULL,NULL,0,'2025-03-28 16:24:11'),(49,5,92,110,1,0,'wide',NULL,NULL,NULL,0,'2025-03-28 16:24:37'),(50,5,92,110,1,1,'legal',NULL,NULL,NULL,0,'2025-03-28 16:25:03'),(51,5,91,110,1,1,'legal',NULL,NULL,NULL,0,'2025-03-28 16:25:31'),(52,5,92,110,4,4,'legal',NULL,NULL,NULL,0,'2025-03-28 16:26:00'),(53,5,92,110,0,0,'legal',NULL,NULL,NULL,0,'2025-03-28 16:26:23'),(54,5,91,112,1,1,'legal',NULL,NULL,NULL,0,'2025-03-28 16:26:51'),(55,5,92,112,0,0,'legal',NULL,NULL,NULL,0,'2025-03-28 16:27:19'),(56,5,92,112,0,0,'legal',NULL,NULL,NULL,0,'2025-03-28 16:27:45'),(57,5,92,112,6,6,'legal',NULL,NULL,NULL,0,'2025-03-28 16:28:25'),(58,5,92,112,1,1,'legal',NULL,NULL,NULL,0,'2025-03-28 16:28:49'),(59,5,91,112,1,1,'legal',NULL,NULL,NULL,0,'2025-03-28 16:29:13'),(60,5,91,110,4,4,'legal',NULL,NULL,NULL,0,'2025-03-28 16:30:31'),(61,5,91,110,1,1,'legal',NULL,NULL,NULL,0,'2025-03-28 16:30:57'),(62,5,92,110,1,0,'legal',NULL,NULL,NULL,0,'2025-03-28 16:31:29'),(63,5,91,110,1,1,'legal',NULL,NULL,NULL,0,'2025-03-28 16:31:54'),(64,5,91,110,0,0,'legal','caught',NULL,108,0,'2025-03-28 16:32:51'),(65,5,102,96,1,1,'legal',NULL,NULL,NULL,0,'2025-03-28 16:37:16'),(66,5,103,96,1,1,'legal',NULL,NULL,NULL,0,'2025-03-28 16:37:48'),(67,5,102,96,0,0,'legal','caught',NULL,95,0,'2025-03-28 16:38:34'),(68,5,104,96,0,0,'legal',NULL,NULL,NULL,0,'2025-03-28 16:39:07'),(69,5,104,96,0,0,'legal','caught',NULL,91,0,'2025-03-28 16:39:48'),(70,5,106,96,4,4,'legal',NULL,NULL,NULL,0,'2025-03-28 16:41:09'),(71,5,103,99,1,1,'legal',NULL,NULL,NULL,0,'2025-03-28 16:41:58'),(72,5,106,99,0,0,'legal',NULL,NULL,NULL,0,'2025-03-28 16:42:22'),(73,5,106,99,0,0,'legal',NULL,NULL,NULL,0,'2025-03-28 16:43:22'),(74,5,106,99,0,0,'legal','caught',NULL,88,0,'2025-03-28 16:43:57'),(75,5,101,99,1,1,'legal',NULL,NULL,NULL,0,'2025-03-28 16:44:51'),(76,5,103,99,0,0,'legal',NULL,NULL,NULL,0,'2025-03-28 16:45:30'),(77,5,101,98,0,0,'legal',NULL,NULL,NULL,0,'2025-03-28 16:47:07'),(78,5,101,98,0,0,'legal',NULL,NULL,NULL,0,'2025-03-28 16:47:31'),(79,5,101,98,4,4,'legal',NULL,NULL,NULL,0,'2025-03-28 16:47:56'),(80,5,101,98,1,1,'legal',NULL,NULL,NULL,0,'2025-03-28 16:48:30'),(81,5,103,98,4,4,'legal',NULL,NULL,NULL,0,'2025-03-28 16:48:54'),(82,5,103,98,0,0,'legal',NULL,NULL,NULL,0,'2025-03-28 16:49:19'),(83,5,101,99,6,6,'legal',NULL,NULL,NULL,0,'2025-03-28 16:49:54'),(84,5,101,99,1,1,'legal',NULL,NULL,NULL,0,'2025-03-28 16:50:15'),(85,5,103,99,0,0,'legal',NULL,NULL,NULL,0,'2025-03-28 16:50:42'),(86,5,103,99,0,0,'legal',NULL,NULL,NULL,0,'2025-03-28 16:51:12'),(87,5,103,99,4,4,'legal',NULL,NULL,NULL,0,'2025-03-28 16:51:43'),(88,5,103,99,4,4,'legal',NULL,NULL,NULL,0,'2025-03-28 16:52:13'),(89,5,101,96,4,4,'legal',NULL,NULL,NULL,0,'2025-03-28 16:52:51'),(90,5,101,96,1,1,'legal',NULL,NULL,NULL,0,'2025-03-28 16:53:37'),(91,5,103,96,6,6,'legal',NULL,NULL,NULL,0,'2025-03-28 16:54:08'),(92,5,103,96,0,0,'legal',NULL,NULL,NULL,0,'2025-03-28 16:54:39'),(93,5,103,96,1,0,'wide',NULL,NULL,NULL,0,'2025-03-28 16:55:10'),(94,5,103,96,0,0,'legal',NULL,NULL,NULL,0,'2025-03-28 16:55:38'),(95,5,103,96,1,1,'legal',NULL,NULL,NULL,0,'2025-03-28 16:56:09'),(96,5,103,98,1,1,'legal',NULL,NULL,NULL,0,'2025-03-28 16:58:01'),(97,5,101,98,4,4,'legal',NULL,NULL,NULL,0,'2025-03-28 16:58:24'),(98,5,101,98,0,0,'legal','caught',NULL,91,0,'2025-03-28 16:59:07'),(99,5,105,98,1,1,'legal',NULL,NULL,NULL,0,'2025-03-28 16:59:42'),(100,5,103,98,4,0,'wide',NULL,NULL,NULL,0,'2025-03-28 17:01:00'),(101,5,103,98,1,1,'legal',NULL,NULL,NULL,0,'2025-03-28 17:01:39'),(102,5,105,98,1,1,'legal',NULL,NULL,NULL,0,'2025-03-28 17:02:06'),(103,5,105,100,1,1,'legal',NULL,NULL,NULL,0,'2025-03-28 17:02:48'),(104,5,103,100,6,6,'legal',NULL,NULL,NULL,0,'2025-03-28 17:03:29'),(105,5,103,100,0,0,'legal',NULL,NULL,NULL,0,'2025-03-28 17:04:12'),(106,5,103,100,0,0,'legal','caught',NULL,89,0,'2025-03-28 17:05:00'),(107,5,107,100,1,1,'legal',NULL,NULL,NULL,0,'2025-03-28 17:05:42'),(108,5,105,100,0,0,'legal',NULL,NULL,NULL,0,'2025-03-28 17:06:14'),(109,5,107,98,1,1,'legal',NULL,NULL,NULL,0,'2025-03-28 17:06:49'),(110,5,105,98,1,1,'legal',NULL,NULL,NULL,0,'2025-03-28 17:07:29'),(111,5,107,98,4,4,'legal',NULL,NULL,NULL,0,'2025-03-28 17:08:04'),(112,5,107,98,0,0,'legal',NULL,NULL,NULL,0,'2025-03-28 17:08:29'),(113,5,107,98,0,0,'legal',NULL,NULL,NULL,0,'2025-03-28 17:08:52'),(114,5,107,98,0,0,'legal',NULL,NULL,NULL,0,'2025-03-28 17:09:13'),(115,5,105,100,6,6,'legal',NULL,NULL,NULL,0,'2025-03-28 17:09:57'),(116,5,105,100,1,1,'legal',NULL,NULL,NULL,0,'2025-03-28 17:10:19'),(117,5,107,100,4,4,'legal',NULL,NULL,NULL,0,'2025-03-28 17:10:42'),(118,5,107,100,0,0,'legal',NULL,NULL,NULL,0,'2025-03-28 17:11:08'),(119,5,107,100,0,0,'legal',NULL,NULL,NULL,0,'2025-03-28 17:11:29'),(120,5,107,100,0,0,'legal',NULL,NULL,NULL,0,'2025-03-28 17:11:52'),(121,5,107,99,1,1,'legal',NULL,NULL,NULL,0,'2025-03-28 17:13:26'),(122,5,107,99,2,2,'legal',NULL,NULL,NULL,0,'2025-03-28 17:13:53'),(123,5,107,99,1,1,'legal',NULL,NULL,NULL,0,'2025-03-28 17:14:19'),(124,5,105,99,0,0,'legal',NULL,NULL,NULL,0,'2025-03-28 17:14:44'),(125,5,105,99,4,4,'legal',NULL,NULL,NULL,0,'2025-03-28 17:15:18'),(126,5,105,99,6,6,'legal',NULL,NULL,NULL,0,'2025-03-28 17:15:59'),(127,6,70,119,0,0,'legal',NULL,NULL,NULL,0,'2025-03-29 08:10:57'),(128,6,70,119,0,0,'legal',NULL,NULL,NULL,0,'2025-03-29 08:11:19'),(129,6,70,119,4,4,'legal',NULL,NULL,NULL,0,'2025-03-29 08:11:43'),(130,6,70,119,4,4,'legal',NULL,NULL,NULL,0,'2025-03-29 08:12:14'),(131,6,70,119,1,1,'legal',NULL,NULL,NULL,0,'2025-03-29 08:12:40'),(132,6,67,119,1,1,'legal',NULL,NULL,NULL,0,'2025-03-29 08:13:01'),(133,6,67,120,1,0,'wide',NULL,NULL,NULL,0,'2025-03-29 08:15:12'),(134,6,67,120,2,2,'legal',NULL,NULL,NULL,0,'2025-03-29 08:15:48'),(135,6,67,120,0,0,'legal',NULL,NULL,NULL,0,'2025-03-29 08:16:16'),(136,6,67,120,0,0,'legal',NULL,NULL,NULL,0,'2025-03-29 08:16:38'),(137,6,67,120,4,4,'legal',NULL,NULL,NULL,0,'2025-03-29 08:17:01'),(138,6,67,120,6,6,'legal',NULL,NULL,NULL,0,'2025-03-29 08:17:25'),(139,6,67,120,0,0,'legal',NULL,NULL,NULL,0,'2025-03-29 08:17:46'),(140,6,70,119,4,4,'legal',NULL,NULL,NULL,0,'2025-03-29 09:15:02'),(141,6,70,120,4,4,'legal',NULL,NULL,NULL,0,'2025-03-29 10:25:13'),(142,6,70,120,0,6,'legal',NULL,NULL,NULL,0,'2025-03-29 10:26:32'),(143,6,70,120,6,0,'legal',NULL,NULL,NULL,0,'2025-03-29 10:27:40');
/*!40000 ALTER TABLE `log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `match_tournament_relation`
--

DROP TABLE IF EXISTS `match_tournament_relation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `match_tournament_relation` (
  `match_id` int NOT NULL,
  `tournament_id` int NOT NULL,
  PRIMARY KEY (`match_id`,`tournament_id`),
  KEY `tournament_id` (`tournament_id`),
  CONSTRAINT `match_tournament_relation_ibfk_1` FOREIGN KEY (`match_id`) REFERENCES `matches` (`match_id`) ON DELETE CASCADE,
  CONSTRAINT `match_tournament_relation_ibfk_2` FOREIGN KEY (`tournament_id`) REFERENCES `tournament` (`tournament_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `match_tournament_relation`
--

LOCK TABLES `match_tournament_relation` WRITE;
/*!40000 ALTER TABLE `match_tournament_relation` DISABLE KEYS */;
INSERT INTO `match_tournament_relation` VALUES (3,6),(4,6),(5,6),(6,6),(7,6);
/*!40000 ALTER TABLE `match_tournament_relation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `matches`
--

DROP TABLE IF EXISTS `matches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `matches` (
  `match_id` int NOT NULL AUTO_INCREMENT,
  `team_a_id` int NOT NULL,
  `team_b_id` int NOT NULL,
  `outcome` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `location` varchar(255) NOT NULL,
  `date_time` datetime NOT NULL,
  `team_a_score` int DEFAULT '0',
  `team_b_score` int NOT NULL DEFAULT '0',
  `toss_winner` enum('team_a','team_b') DEFAULT NULL,
  `first_batting` enum('team_a','team_b') DEFAULT NULL,
  `inning` int NOT NULL DEFAULT '1',
  `team_a_wickets` int NOT NULL DEFAULT '0',
  `team_b_wickets` int NOT NULL DEFAULT '0',
  `team_a_balls` int NOT NULL DEFAULT '0',
  `team_b_balls` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`match_id`),
  KEY `team_a` (`team_a_id`),
  KEY `team_b` (`team_b_id`),
  CONSTRAINT `matches_ibfk_1` FOREIGN KEY (`team_a_id`) REFERENCES `team` (`team_id`) ON DELETE CASCADE,
  CONSTRAINT `matches_ibfk_2` FOREIGN KEY (`team_b_id`) REFERENCES `team` (`team_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `matches`
--

LOCK TABLES `matches` WRITE;
/*!40000 ALTER TABLE `matches` DISABLE KEYS */;
INSERT INTO `matches` VALUES (3,8,9,NULL,'CHEPHAUK','2025-03-26 19:00:00',0,6,'team_a','team_b',1,0,0,0,5),(4,10,12,NULL,'EDEN GARDENS','2025-03-27 19:30:00',0,0,'team_b','team_b',2,0,0,0,0),(5,13,14,'team_a','GUHWATI','2025-03-28 19:30:00',117,96,'team_a','team_a',2,1,5,51,60),(6,11,15,NULL,'HYDERABAD','2025-03-29 18:00:00',37,0,'team_b','team_a',1,0,0,16,0),(7,9,10,NULL,'MUMBAI,WANKHADE STADIUM','2025-03-30 15:22:00',0,0,NULL,NULL,1,0,0,0,0);
/*!40000 ALTER TABLE `matches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `player`
--

DROP TABLE IF EXISTS `player`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `player` (
  `player_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `team_id` int DEFAULT NULL,
  `wickets` int DEFAULT '0',
  `batsman_runs` int NOT NULL DEFAULT '0',
  `bowler_runs` int NOT NULL DEFAULT '0',
  `innings` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`player_id`),
  KEY `team_id` (`team_id`),
  CONSTRAINT `player_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `team` (`team_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=125 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `player`
--

LOCK TABLES `player` WRITE;
/*!40000 ALTER TABLE `player` DISABLE KEYS */;
INSERT INTO `player` VALUES (27,'MAHENDRA SINGH DHONI',8,0,0,0,0),(28,'RUTURAJ GAIKWAD',8,0,0,0,0),(29,'RACHIN RAVINDRA',8,0,0,0,0),(30,'RAHUL TRIPATI',8,0,0,0,0),(31,'ROHIT SHARMA',9,0,0,0,0),(32,'BUMRAH',9,0,0,0,0),(33,'RAVICHANDRAN ASHWIN',8,0,0,0,0),(34,'SAM CURRAN',8,0,0,6,0),(35,'DEEPAK HOODA',8,0,0,0,0),(36,'RAVINDRA JADEJA',8,0,0,0,0),(37,'SHIVAM DUBE',8,0,0,0,0),(38,'PATHIRANA',8,0,0,0,0),(39,'KHALEEL AHAMAD',8,0,0,0,0),(40,'NOOR AHAMAD',8,0,0,0,0),(41,'SURYA KUMAR YADAV',9,0,0,0,0),(42,'RYAN RICKELTON',9,0,6,0,0),(43,'ROBIN MINZ',9,0,0,0,0),(44,'TILAK VARMA',9,0,0,0,0),(45,'HARDIK PANDYA',9,0,0,0,0),(46,'NAMAN DHIR',9,0,0,0,0),(47,'WILL JACKS',9,0,0,0,0),(48,'MITCHELL SANTNER',9,0,0,0,0),(49,'TRENT BOULT',9,0,0,0,0),(50,'VIGNESH PUTHUR',9,0,0,0,0),(51,'DEEPAK CHAHAR',9,0,0,0,0),(52,'RAJAT PATIDHAR',10,0,0,0,0),(53,'VIRAT KOHLI',10,0,0,0,0),(54,'PHIL SALT',10,0,0,0,0),(55,'JITESH SHARMA',10,0,0,0,0),(56,'DEVDUTT PADIKKAL',10,0,0,0,0),(57,'LIAM LIVINGSTONE',10,0,0,0,0),(58,'KRUNAL PANDYA',10,0,0,0,0),(59,'TIM DAVID',10,0,0,0,0),(60,'JOSH HAZELWOOD',10,0,0,0,0),(61,'SUYASH SHARMA',10,0,0,0,0),(62,'BHUVNESHWAR KUMAR',10,0,0,0,0),(63,'YASH DAYAL',10,0,0,0,0),(64,'ISHAN KISHAN',11,0,0,0,0),(65,'PAT CUMMINS',11,0,0,0,0),(66,'ABHINAV MANOHAR',11,0,0,0,0),(67,'TRAVIS HEAD',11,0,13,0,0),(68,'ANIKET VARMA',11,0,0,0,0),(69,'HENRICH KLASSEN',11,0,0,0,0),(70,'ABHISHEK SHARMA',11,0,23,0,0),(71,'HARSHAL PATEL',11,0,0,0,0),(72,'NITESH KUMAR REDDY',11,0,0,0,0),(73,'ADAM ZAMPA',11,0,0,0,0),(74,'MOHAMMAD SHAMI',11,0,0,0,0),(75,'SIMARJEET SINGH',11,0,0,0,0),(76,'AJINKYA RAHANE',12,0,0,0,0),(77,'RINKU SINGH',12,0,0,0,0),(78,'QUINTON DE KOCK',12,0,0,0,0),(79,'RAGHUVANSHI',12,0,0,0,0),(80,'VENKATESH IYER',12,0,0,0,0),(81,'RAMANDEEP SINGH',12,0,0,0,0),(82,'ANDRE RUSSELL',12,0,0,0,0),(83,'VAIBHAV ARORA',12,0,0,0,0),(84,'SPENCER JOHNSON',12,0,0,0,0),(85,'HARSHIT RANA',12,0,0,0,0),(86,'SUNIL NARINE',12,0,0,0,0),(87,'VARUN CHAKRAVARTHY',12,0,0,0,0),(88,'RISHAB PANT',13,0,0,0,0),(89,'DAVID MILLER',13,0,0,0,0),(90,'AIDEN MARKRAM',13,0,15,0,0),(91,'NICHOLAS POORAN',13,0,41,0,1),(92,'MITCHELL MARSH',13,0,59,0,0),(93,'ABDUL SAMAD',13,0,0,0,0),(94,'SHAHBAZ AHAMAD',13,0,0,0,0),(95,'AYUSH BADONI',13,0,0,0,0),(96,'SHARDUL THAKUR',13,2,0,19,0),(97,'AVESH KHAN',13,0,0,0,0),(98,'DIGVESH SINGH',13,1,0,27,0),(99,'PRINCE YADAV',13,1,0,31,0),(100,'RAVI BISHNOI',13,1,0,19,0),(101,'AXAR PATEL',14,0,22,8,1),(102,'JAKE FRASER-MCGURK',14,0,1,0,1),(103,'FAF DU PLESSIS',14,0,29,0,1),(104,'ABISHEK POREL',14,0,0,0,1),(105,'TRISTIAN STUBBS',14,0,21,0,0),(106,'SAMMER RIZVI',14,0,4,0,1),(107,'ASHUTOSH SHARMA',14,0,14,0,0),(108,'VIPRAJ NIGAM',14,0,0,30,0),(109,'MITCHELL STARC',14,0,0,31,0),(110,'MOHIT SHARMA',14,1,0,17,0),(111,'MUKESH KUMAR',14,0,0,13,0),(112,'KULDEEP YADAV',14,0,0,18,0),(113,'SHERYAS IYER',15,0,0,0,0),(114,'SHASHANK SINGH',15,0,0,0,0),(115,'GLENN MAXWELL',15,0,0,0,0),(116,'MARCO JANSEN',15,0,0,0,0),(117,'PRIYANSH ARYA',15,0,0,0,0),(118,'AZMATULLAH OMARZAI',15,0,0,0,0),(119,'ARSHDEEP SINGH',15,0,0,14,0),(120,'YUZVENDRA CHAHAL',15,0,0,23,0),(121,'VYSHAK VIJAYKUMAR',15,0,0,0,0),(122,'NEHAL WADHEERA',15,0,0,0,0),(123,'JOSH INGLIS',15,0,0,0,0),(124,'PRABSIMRAN SINGH',15,0,0,0,0);
/*!40000 ALTER TABLE `player` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_requests`
--

DROP TABLE IF EXISTS `role_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_requests` (
  `request_id` int NOT NULL AUTO_INCREMENT,
  `requested_role` enum('admin','manager','organizer') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `status` enum('pending','approved','declined') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `admin_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  `description` varchar(500) NOT NULL,
  PRIMARY KEY (`request_id`),
  KEY `role_requests_users_FK` (`admin_id`),
  KEY `role_requests_users_FK_1` (`user_id`),
  CONSTRAINT `role_requests_users_FK` FOREIGN KEY (`admin_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `role_requests_users_FK_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_requests`
--

LOCK TABLES `role_requests` WRITE;
/*!40000 ALTER TABLE `role_requests` DISABLE KEYS */;
INSERT INTO `role_requests` VALUES (5,'manager','approved',15,14,'i will take care of all the matches'),(6,'organizer','approved',15,16,'I am very good organiser.'),(7,'organizer','approved',15,19,'hello i want to be a organizer'),(8,'organizer','approved',15,22,'..');
/*!40000 ALTER TABLE `role_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team`
--

DROP TABLE IF EXISTS `team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team` (
  `team_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `captain_id` int DEFAULT NULL,
  `matches_played` int DEFAULT '0',
  `nrr` float DEFAULT '0',
  `tournament_id` int NOT NULL,
  `points` int NOT NULL DEFAULT '0',
  `wins` int NOT NULL DEFAULT '0',
  `losses` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`team_id`),
  KEY `tournament_id` (`tournament_id`),
  KEY `captain` (`captain_id`),
  CONSTRAINT `team_ibfk_1` FOREIGN KEY (`tournament_id`) REFERENCES `tournament` (`tournament_id`),
  CONSTRAINT `team_ibfk_2` FOREIGN KEY (`captain_id`) REFERENCES `player` (`player_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team`
--

LOCK TABLES `team` WRITE;
/*!40000 ALTER TABLE `team` DISABLE KEYS */;
INSERT INTO `team` VALUES (8,'CSK',27,0,0,6,0,0,0),(9,'MI',31,0,0,6,0,0,0),(10,'RCB',52,0,0,6,0,0,0),(11,'SRH',65,0,0,6,0,0,0),(12,'KKR',76,0,0,6,0,0,0),(13,'LSG',88,1,4.16471,6,2,1,0),(14,'DC',101,1,-4.16471,6,0,0,1),(15,'PBKS',113,0,0,6,0,0,0),(16,'INDIA',NULL,0,0,7,0,0,0),(17,'AUSTRALIA',NULL,0,0,7,0,0,0);
/*!40000 ALTER TABLE `team` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tournament`
--

DROP TABLE IF EXISTS `tournament`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tournament` (
  `tournament_id` int NOT NULL AUTO_INCREMENT,
  `tournament_name` varchar(255) NOT NULL,
  `tournament_format` varchar(50) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `organizer_id` int NOT NULL,
  `manager_id` int NOT NULL,
  PRIMARY KEY (`tournament_id`),
  KEY `manager_id` (`manager_id`),
  KEY `organizer_id` (`organizer_id`),
  CONSTRAINT `tournament_ibfk_1` FOREIGN KEY (`manager_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `tournament_ibfk_2` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tournament`
--

LOCK TABLES `tournament` WRITE;
/*!40000 ALTER TABLE `tournament` DISABLE KEYS */;
INSERT INTO `tournament` VALUES (6,'IPL','T20','2025-03-26','2025-04-01',16,14),(7,'BORDER GAVASKAR TROPHY - BGT 2025','Test','2025-03-30','2025-04-03',16,14),(8,'CHAMPIONS TROPHY - 2025','ODI','2025-03-31','2025-04-29',16,14);
/*!40000 ALTER TABLE `tournament` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` enum('viewer','admin','manager','organizer') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (14,'jp@gmail.com','$2b$12$w5DaZ2U8rmeqaDKj9WXDbu2DgcJJ49cJfAZ3Mc0JQEnb4FJkopCZq','jaya prakash','manager'),(15,'manojkumar@gmail.com','$2b$12$L5qTw9o0soKou76iifa40.dI6yJyXArtEZj.aBkt5vOoszrrgTUeK','Manoj Kumar','admin'),(16,'kt@gmail.com','$2b$12$rCQwr6.6ZDmSj9gpy.buMusdYs4BvGyRrBV5312uLf.WoI/USiaa6','Krishna Teja','organizer'),(17,'lol.boi@gmail.com','$2b$12$6kH/fYVqXSpsvsotfIuK/u9NaenhLgfgFCD96tMk7IDLP39I6B5Z2','stalin','viewer'),(18,'lolman@gmail.com','$2b$12$2GFT2QGR4R3yo3RSj7bcf.Qa8SevTO436B7PvzXiona4eaBTz4CbK','lolman','viewer'),(19,'hello@gmail.com','$2b$12$oQjZoFwyy0dPB2ACvR6wM./aJGyUistSq2c0V1djrQy7KkHdtN.C6','hello','organizer'),(20,'gapafpa@gmail.com','$2b$12$T2cQ/eUT1F5fKXS2s.YV9.u4EF45SfMIe1mqX8WPxMWlDppZf7WzK','gp','viewer'),(21,'avadla1044@gmail.com','$2b$12$6Uru8fZ15U9csp/r3hZXAe10V7lF5vFMPnH56KK7Ln8ZiIQxOryba','amshu','viewer'),(22,'hruthikpacha@gmail.com','$2b$12$LhNaF90cvVmVz2j3dEbf8uEY5zwmONBKPvu7Iu9PqPMmzin5ZlZye','Hruthik pacha ','organizer');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'tournament_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-29 16:42:53
