-- MySQL dump 10.13  Distrib 9.1.0, for Win64 (x86_64)
--
-- Host: localhost    Database: tournament_db
-- ------------------------------------------------------
-- Server version	9.1.0

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
-- Current Database: `tournament_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `tournament_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `tournament_db`;

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
  `ball_type` varchar(50) NOT NULL,
  `wicket_type` varchar(50) DEFAULT NULL,
  `wicket_by_id` int DEFAULT NULL,
  `catch_by_id` int DEFAULT NULL,
  `is_stumping` tinyint(1) not null,
  PRIMARY KEY (`log_id`),
  FOREIGN KEY (match_id) REFERENCES match_table(match_id),
  FOREIGN KEY (batsman_id) REFERENCES player(player_id),
  FOREIGN KEY (bowler_id) REFERENCES player(player_id),
  FOREIGN KEY (wicket_by_id) REFERENCES player(player_id),
  FOREIGN KEY (catch_by_id) REFERENCES player(player_id)
  

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log`
--

LOCK TABLES `log` WRITE;
/*!40000 ALTER TABLE `log` DISABLE KEYS */;
/*!40000 ALTER TABLE `log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `match_table`
--

DROP TABLE IF EXISTS `match_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `match_table` (
  `match_id` int NOT NULL AUTO_INCREMENT,
  `team_a` int NOT NULL,
  `team_b` int NOT NULL,
  `outcome` varchar(50) NOT NULL,
  `location` varchar(255) NOT NULL,
  `date_time` datetime NOT NULL,
  PRIMARY KEY (`match_id`),
  KEY `team_a` (`team_a`),
  KEY `team_b` (`team_b`),
  CONSTRAINT `match_table_ibfk_1` FOREIGN KEY (`team_a`) REFERENCES `team` (`team_id`) ON DELETE CASCADE,
  CONSTRAINT `match_table_ibfk_2` FOREIGN KEY (`team_b`) REFERENCES `team` (`team_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `match_table`
--

LOCK TABLES `match_table` WRITE;
/*!40000 ALTER TABLE `match_table` DISABLE KEYS */;
/*!40000 ALTER TABLE `match_table` ENABLE KEYS */;
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
  CONSTRAINT `match_tournament_relation_ibfk_1` FOREIGN KEY (`match_id`) REFERENCES `match_table` (`match_id`) ON DELETE CASCADE,
  CONSTRAINT `match_tournament_relation_ibfk_2` FOREIGN KEY (`tournament_id`) REFERENCES `tournament` (`tournament_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `match_tournament_relation`
--

LOCK TABLES `match_tournament_relation` WRITE;
/*!40000 ALTER TABLE `match_tournament_relation` DISABLE KEYS */;
/*!40000 ALTER TABLE `match_tournament_relation` ENABLE KEYS */;
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
  `runs` int DEFAULT '0',
  `wickets` int DEFAULT '0',
  `bowling_average` float DEFAULT NULL,
  `batting_average` float DEFAULT NULL,
  PRIMARY KEY (`player_id`),
  KEY `team_id` (`team_id`),
  CONSTRAINT `player_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `team` (`team_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `player`
--

LOCK TABLES `player` WRITE;
/*!40000 ALTER TABLE `player` DISABLE KEYS */;
/*!40000 ALTER TABLE `player` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team`
--

DROP TABLE IF EXISTS `team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team` (
  `team_id` int NOT NULL AUTO_INCREMENT,
  `team_name` varchar(255) NOT NULL,
  captain int not null,
  `matches_played` int DEFAULT '0',
  `wins` int DEFAULT '0',
  `losses` int DEFAULT '0',
  `nrr` float DEFAULT '0',
  `ranking` int DEFAULT NULL,
  tournament_id int not null,
  PRIMARY KEY (`team_id`),
  foreign key (tournament_id) references tournament(tournament_id),
  foreign key (captain) references player(player_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team`
--

LOCK TABLES `team` WRITE;
/*!40000 ALTER TABLE `team` DISABLE KEYS */;
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
  organizer_id int not null,
  manager_id int not null,
  PRIMARY KEY (`tournament_id`),
  foreign key (manager_id) references users(user_id),
  foreign key (organizer_id) references users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tournament`
--

LOCK TABLES `tournament` WRITE;
/*!40000 ALTER TABLE `tournament` DISABLE KEYS */;
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
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` enum('admin','viewer', 'manager', 'organizer') NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-27 18:53:02
