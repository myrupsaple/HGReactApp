-- MySQL dump 10.13  Distrib 8.0.19, for macos10.15 (x86_64)
--
-- Host: localhost    Database: HGApp
-- ------------------------------------------------------
-- Server version	8.0.18

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `donations`
--

DROP TABLE IF EXISTS `donations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `donations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tribute_email` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `donor_name` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `method` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `date` date DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `tags` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donations`
--

LOCK TABLES `donations` WRITE;
/*!40000 ALTER TABLE `donations` DISABLE KEYS */;
INSERT INTO `donations` VALUES (1,'michaelcuc24@gmail.com','Anonymous','Vemo','2020-01-24',672,'none'),(2,'Jnl9018@g.ucla.edu','Anonymous','Google Wallet','2020-01-17',562,'Starting Balance'),(3,'makim7200@gmail.com','Anonymous','Venmo','2020-01-31',622,'Starting Balance'),(4,'graceskalin10@gmail.com','Anonymous','Website','2020-01-21',958,'Starting Balance'),(5,'cmlau2468@gmail.com','Liinus','Venmo','2020-01-25',1637,'none'),(6,'wangjenny31128@gmail.com','Linus','Venmo','2020-01-19',1563,'Starting Balance'),(7,'sherylghoubrial@yahoo.com','Anonymous','Venmo','2020-01-31',55,'Starting Balance'),(8,'Djeli321@gmail.com','Anonymous','Venmo','2020-01-31',363,'none'),(9,'ng.nathan.k@gmail.com','Nobody','  ','2020-01-27',342,'none'),(10,'markymark.yamamoto@gmail.com','Self','Someone','2020-01-31',419,'none'),(11,'msaiki24@hotmail.com','Anonymous','Somewhere','2020-01-31',478,'none'),(12,'juliadlindner@gmail.com','Someone','Venmo','2020-01-31',619,'none'),(13,'lexxis002@gmail.com','Someone','Misc.','2020-01-27',351,'none'),(14,'rachaelkhh@ucla.edu','Someone','Misc.','2020-01-27',1522,'none'),(15,'svsaraveerman@gmail.com','Someone','Misc.','2020-01-06',414,'none'),(16,'mik500@g.ucla.edu','Someone','Misc.','2020-01-31',678,'none');
/*!40000 ALTER TABLE `donations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_state`
--

DROP TABLE IF EXISTS `game_state`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_state` (
  `start_time` datetime DEFAULT NULL,
  `tributes_remaining` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_state`
--

LOCK TABLES `game_state` WRITE;
/*!40000 ALTER TABLE `game_state` DISABLE KEYS */;
INSERT INTO `game_state` VALUES ('2020-01-21 11:20:00',12);
/*!40000 ALTER TABLE `game_state` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_list`
--

DROP TABLE IF EXISTS `item_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_list` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_name` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `quantity` tinyint(4) DEFAULT NULL,
  `tier1_cost` int(11) DEFAULT NULL,
  `tier2_cost` int(11) DEFAULT NULL,
  `tier3_cost` int(11) DEFAULT NULL,
  `tier4_cost` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1018 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_list`
--

LOCK TABLES `item_list` WRITE;
/*!40000 ALTER TABLE `item_list` DISABLE KEYS */;
INSERT INTO `item_list` VALUES (100,'life','life',1,45,70,100,150),(200,'immunity','immunity',1,300,300,300,300),(300,'golden_resource','golden resource',1,300,300,300,300),(301,'food_resource','food resource',1,80,100,100,100),(302,'water_resource','water resource',1,100,100,120,120),(303,'medicine_resource','medicine resource',1,75,100,125,125),(1001,'Baseball Bat (Thin)','A thin baseball bat',3,60,70,80,80),(1002,'Baseball Bat (Fat)','Comes with 3 balls',3,35,50,60,60),(1003,'Police Baton','Shorter than a bat, but fairly sturdy',5,45,60,70,70),(1004,'Whirly Tube','You already know',3,45,60,70,70),(1005,'Cutlass','A short sword',3,35,50,60,60),(1006,'Nerf Gun (triple shot)','A deadly long range weapon',3,200,250,300,300),(1007,'Nerf Revolver','A long range weapon that holds up to 6 shots',1,150,175,200,200),(1008,'Zing Bow','Comes with 3 arrows',3,200,250,300,300),(1009,'Nerf Ammo (x5)','Ammo for nerf guns. Must be purchased in packs of 5 (price is per-5-pack)',20,20,25,30,40),(1010,'Soaker Ball','A squishy projectile',20,10,10,15,20),(1011,'Hacky Sack','A semi-firm projectile',1,15,15,20,20),(1012,'Soft Projectiles (Small)','Any of the soft projectiles',20,15,15,20,25),(1013,'Hollow Golf Balls','Lightweight projectile',10,15,15,20,25),(1014,'Hollow Baseballs','Large lightweight projectile',5,15,15,20,25),(1015,'Suction Cup Ball','Solid and lightweight',3,15,15,20,25),(1016,'Large Soft Football','A large projectile',3,50,75,80,100),(1017,'Shield','A necessity for close range combat',10,200,200,200,200);
/*!40000 ALTER TABLE `item_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `life_events`
--

DROP TABLE IF EXISTS `life_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `life_events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tribute_email` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `type` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `method` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `time` int(11) DEFAULT NULL,
  `notes` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `life_events`
--

LOCK TABLES `life_events` WRITE;
/*!40000 ALTER TABLE `life_events` DISABLE KEYS */;
/*!40000 ALTER TABLE `life_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchases`
--

DROP TABLE IF EXISTS `purchases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchases` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `time` int(11) DEFAULT NULL,
  `status` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mentor_email` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `payer_email` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `receiver_email` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `category` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `item_name` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `item_id` int(11) DEFAULT NULL,
  `cost` int(11) DEFAULT NULL,
  `quantity` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchases`
--

LOCK TABLES `purchases` WRITE;
/*!40000 ALTER TABLE `purchases` DISABLE KEYS */;
/*!40000 ALTER TABLE `purchases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resource_events`
--

DROP TABLE IF EXISTS `resource_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resource_events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tribute_email` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `type` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `method` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `time` int(11) DEFAULT NULL,
  `notes` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resource_events`
--

LOCK TABLES `resource_events` WRITE;
/*!40000 ALTER TABLE `resource_events` DISABLE KEYS */;
/*!40000 ALTER TABLE `resource_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resource_list`
--

DROP TABLE IF EXISTS `resource_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resource_list` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `type` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `times_used` tinyint(4) DEFAULT NULL,
  `max_uses` tinyint(4) DEFAULT NULL,
  `used_by` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `notes` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=122 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resource_list`
--

LOCK TABLES `resource_list` WRITE;
/*!40000 ALTER TABLE `resource_list` DISABLE KEYS */;
INSERT INTO `resource_list` VALUES (1,'85Bakery00','food',0,1,'{not used}','None'),(2,'albertostacos37','food',0,1,'{not used}','None'),(3,'apple95','food',0,1,'{not used}','None'),(4,'balut29','food',0,1,'{not used}','None'),(5,'bananatree80','food',0,1,'{not used}','None'),(6,'bcdtofu87','food',0,1,'{not used}','None'),(7,'blazepizza90','food',0,1,'{not used}','None'),(8,'bplateisbae82','food',0,1,'{not used}','None'),(9,'buddijigae77','food',0,1,'{not used}','None'),(10,'budnamu64','food',0,1,'{not used}','None'),(11,'chinchikurin16','food',0,1,'{not used}','None'),(12,'communitydinner82','food',0,1,'{not used}','None'),(13,'coraltreecafe60','food',0,1,'{not used}','None'),(14,'curryhouse94','food',0,1,'{not used}','None'),(15,'fakepanda85','food',0,1,'{not used}','None'),(16,'feastfriday72','food',0,1,'{not used}','None'),(17,'freshcorngrill16','food',0,1,'{not used}','None'),(18,'gen40','food',0,1,'{not used}','None'),(19,'gomen75','food',0,1,'{not used}','None'),(20,'grapeswithegg91','food',0,1,'{not used}','None'),(21,'innout34','food',0,1,'{not used}','None'),(22,'jajangmyeon24','food',0,1,'{not used}','None'),(23,'jenisicecream71','food',0,1,'{not used}','None'),(24,'jerseymikes71','food',0,1,'{not used}','None'),(25,'katsu51','food',0,1,'{not used}','None'),(26,'kimbap77','food',0,1,'{not used}','None'),(27,'kitchenstory65','food',0,1,'{not used}','None'),(28,'kushbowl32','food',0,1,'{not used}','None'),(29,'lamen15','food',0,1,'{not used}','None'),(30,'marugame05','food',0,1,'{not used}','None'),(31,'naanbread25','food',0,1,'{not used}','None'),(32,'okonomiyaki89','food',0,1,'{not used}','None'),(33,'pandaexpress12','food',0,1,'{not used}','None'),(34,'pbjpizza56','food',0,1,'{not used}','None'),(35,'pho95','food',0,1,'{not used}','None'),(36,'ramen87','food',0,1,'{not used}','None'),(37,'ramenfixesall07','food',0,1,'{not used}','None'),(38,'rankedfirstnationally44','food',0,1,'{not used}','None'),(39,'saffronrose49','food',0,1,'{not used}','None'),(40,'sake2me32','food',0,1,'{not used}','None'),(41,'shinsengumi95','food',0,1,'{not used}','None'),(42,'springroll27','food',0,1,'{not used}','None'),(43,'swipezaddy75','food',0,1,'{not used}','None'),(44,'tatsu31','food',0,1,'{not used}','None'),(45,'thehabit92','food',0,1,'{not used}','None'),(46,'umaya57','food',0,1,'{not used}','None'),(47,'walnutcookie71','food',0,1,'{not used}','None'),(48,'walnutshrimp05','food',0,1,'{not used}','None'),(49,'yakult04','food',0,1,'{not used}','None'),(50,'bruinburger68','food',0,1,'{not used}','None'),(51,'aqua53','water',0,1,'{not used}','None'),(52,'dihydrogenmonoxide62','water',0,1,'{not used}','None'),(53,'polarcompound51','water',0,1,'{not used}','None'),(54,'hydroxylicacid49','water',0,1,'{not used}','None'),(55,'iceicebaby00','water',0,1,'{not used}','None'),(56,'idoneneedit43','water',0,1,'{not used}','None'),(57,'h2019','water',0,1,'{not used}','None'),(58,'donttouchthefountain26','water',0,1,'{not used}','None'),(59,'boringsoda41','water',0,1,'{not used}','None'),(60,'dinosaursdrankthis64','water',0,1,'{not used}','None'),(61,'wateryoudoing76','water',0,1,'{not used}','None'),(62,'ineedit85','water',0,1,'{not used}','None'),(63,'antman17','medicine',0,1,'{not used}','None'),(64,'blackorder35','medicine',0,1,'{not used}','None'),(65,'blackpanther83','medicine',0,1,'{not used}','None'),(66,'captainamerica12','medicine',0,1,'{not used}','None'),(67,'captainmarvel29','medicine',0,1,'{not used}','None'),(68,'blackwidow15','medicine',0,1,'{not used}','None'),(69,'hawkeye34','medicine',0,1,'{not used}','None'),(70,'hulk11','medicine',0,1,'{not used}','None'),(71,'ironman99','medicine',0,1,'{not used}','None'),(72,'nickfury91','medicine',0,1,'{not used}','None'),(73,'rocket43','medicine',0,1,'{not used}','None'),(74,'scarletwitch74','medicine',0,1,'{not used}','None'),(75,'starlord06','medicine',0,1,'{not used}','None'),(76,'thanos05','medicine',0,1,'{not used}','None'),(77,'thor07','medicine',0,1,'{not used}','None'),(78,'banana28','roulette',0,1,'{not used}','You snuck out 20 bananas -> Free Food'),(79,'zaddyblock25','roulette',0,1,'{not used}','You went to Daddy Blocks office hours and he paid your tuition -> Free life'),(80,'dtrcon20','roulette',0,1,'{not used}','You were healed at summer con -> Free medicine'),(81,'livingwater13','roulette',0,1,'{not used}','Youve accepted Jesus and have living water -> Free water'),(82,'5bread2fish28','roulette',0,1,'{not used}','Jesus multiplied your bread and fish -> Free water'),(83,'canyouswipeme42','roulette',0,1,'{not used}','You upgraded to 19P -> Free food'),(84,'joe15','roulette',0,1,'{not used}','You went on a snack run at Trader Joes -> Free food'),(85,'freesample24','roulette',0,1,'{not used}','You took all of the free samples from Costco -> Free food'),(86,'vaccine35','roulette',0,1,'{not used}','Congrats, you were vaccinated -> Free medicine'),(87,'calidrought66','roulette',0,1,'{not used}','The drought is over -> Free water'),(88,'idksummer10','roulette',0,1,'{not used}','Whos Summer'),(89,'noahsark99','roulette',0,1,'{not used}','Someone accidentally set off the water sprinklers in your dorm -> Free water'),(90,'antivaxxers47','roulette',0,1,'{not used}','Measles -> Need Medicine'),(91,'covfefe47','roulette',0,1,'{not used}','Only drank coffee last 3 days -> Need water'),(92,'bug39','roulette',0,1,'{not used}','Bug in salad at bplate -> Food resource'),(93,'makeitrain63','roulette',0,1,'{not used}','California in another drought -> Need water'),(94,'swipesfordays35','roulette',0,1,'{not used}','You befriended a senior and they took all of your swipes -> Need food'),(95,'doggo33','roulette',0,1,'{not used}','You forgot to comment good luck doggo. Doggo is upset and released all of the mutts.'),(96,'theucla8clap06','roulette',0,1,'{not used}','Congrats! You got into UCLA. Show your spirit by going to a ref and doing the 8 clap in the next 5 minutes'),(97,'4hrclass73','roulette',0,1,'{not used}','You have class 10-2 -> Need food'),(98,'abba65','life',0,1,'{not used}','None'),(99,'adonai47','life',0,1,'{not used}','None'),(100,'alphaomega00','life',0,1,'{not used}','None'),(101,'heavenlyfather00','life',0,1,'{not used}','None'),(102,'holyspirit77','life',0,1,'{not used}','None'),(103,'iam37','life',0,1,'{not used}','None'),(104,'jehovah31','life',0,1,'{not used}','None'),(105,'jesus94','life',0,1,'{not used}','None'),(106,'mosthigh39','life',0,1,'{not used}','None'),(107,'provider05','life',0,1,'{not used}','None'),(108,'themanupstairs25','life',0,1,'{not used}','None'),(109,'yahweh04','life',0,1,'{not used}','None'),(110,'bitcoin066','golden',0,5,'{not used}','None'),(111,'denarius236','golden',0,5,'{not used}','None'),(112,'dollar257','golden',0,5,'{not used}','None'),(113,'euro197','golden',0,5,'{not used}','None'),(114,'franc067','golden',0,5,'{not used}','None'),(115,'penny155','golden',0,5,'{not used}','None'),(116,'peso092','golden',0,5,'{not used}','None'),(117,'rupee046','golden',0,5,'{not used}','None'),(118,'venmo074','golden',0,5,'{not used}','None'),(119,'won007','golden',0,5,'{not used}','None'),(120,'yen211','golden',0,5,'{not used}','None'),(121,'yuan746','golden',0,5,'{not used}','None');
/*!40000 ALTER TABLE `resource_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tribute_stats`
--

DROP TABLE IF EXISTS `tribute_stats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tribute_stats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `last_name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `funds_remaining` int(11) NOT NULL,
  `lives_remaining` tinyint(4) NOT NULL,
  `food_resources` tinyint(4) NOT NULL,
  `water_resources` tinyint(4) NOT NULL,
  `medicine_resources` tinyint(4) NOT NULL,
  `roulette_resources` tinyint(4) NOT NULL,
  `life_resources` tinyint(4) NOT NULL,
  `lives_starting` tinyint(4) NOT NULL,
  `lives_purchased` tinyint(4) NOT NULL,
  `lives_lost` tinyint(4) NOT NULL,
  `kill_count` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tribute_stats`
--

LOCK TABLES `tribute_stats` WRITE;
/*!40000 ALTER TABLE `tribute_stats` DISABLE KEYS */;
/*!40000 ALTER TABLE `tribute_stats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tributes`
--

DROP TABLE IF EXISTS `tributes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tributes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `last_name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `district` tinyint(4) NOT NULL,
  `districtPartner_email` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `area` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `mentor_email` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `paid_registration` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tributes`
--

LOCK TABLES `tributes` WRITE;
/*!40000 ALTER TABLE `tributes` DISABLE KEYS */;
INSERT INTO `tributes` VALUES (1,'Michael','Cuc','michaelcuc24@gmail.com',1,'Jnl9018@g.ucla.edu','hedrick','adayychen@yahoo.com',1),(2,'Jaeinn','Lee','Jnl9018@g.ucla.edu',1,'michaelcuc24@gmail.com','hedrick','adayychen@yahoo.com',1),(3,'Michelle','Kim','makim7200@gmail.com',2,'graceskalin10@gmail.com','hedrick','adayychen@yahoo.com',1),(4,'Grace','Skalinder','graceskalin10@gmail.com',2,'makim7200@gmail.com','hedrick','adayychen@yahoo.com',1),(5,'Courtney','Lau','cmlau2468@gmail.com',3,'wangejenny31128@gmail.com','hedrick','adayychen@gmail.com',1),(6,'Jenny','Wang','wangjenny31128@gmail.com',3,'cmlau2468@gmail.com','hedrick','adayychen@gmail.com',1),(7,'Sheryl','Ghoubrial','sherylghoubrial@yahoo.com',4,'Djeli321@gmail.com','rieber','nwobig45@gmail.com',1),(8,'Elizabeth','Castro','Djeli321@gmail.com',4,'sherylghoubrial@yahoo.com','rieber','nwobig45@gmail.com',1),(9,'Nathan','Ng','ng.nathan.k@gmail.com',6,'markymark.yamamoto@gmail.com','sunsprout','7ryanlo@gmail.com',1),(10,'Mark','Yamamoto','markymark.yamamoto@gmail.com',6,'ng.nathan.k@gmail.com','sunsprout','7ryanlo@gmail.com',1),(11,'Matthew','Saiki','msaiki24@hotmail.com',5,'juliadlindner@gmail.com','rieber','nwobig45@gmail.com',1),(12,'Julia','Lindner','juliadlindner@gmail.com',5,'msaiki24@hotmail.com','rieber','nwobig45@gmail.com',1),(13,'Lex','Toledo','lexxis002@gmail.com',7,'rachaelkhh@ucla.edu','sunsprout','7ryanlo@gmail.com',1),(14,'Rachael','Koh','rachaelkhh@ucla.edu',7,'lexxis002@gmail.com','sunsprout','7ryanlo@gmail.com',1),(15,'Sara','Veerman','svsaraveerman@gmail.com',8,'mik500@g.ucla.edu','sunsprout','7ryanlo@gmail.com',1),(16,'Mikhael','Rasiah','mik500@g.ucla.edu',8,'svsaraveerman@gmail.com','sunsprout','7ryanlo@gmail.com',1);
/*!40000 ALTER TABLE `tributes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `last_name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(70) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `permissions` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Riley','Matsuda','myrupsaple@gmail.com','owner'),(2,'Mattie','Green','mattiemarcellg@gmail.com','gamemaker'),(3,'Hyejin','Hong','hyejin8@g.ucla.edu','gamemaker'),(4,'Ashley','Tseng','ashley.tseng2300@gmail.com','gamemaker'),(5,'Derek','Shidla','shidladerek@gmail.com','gamemaker'),(6,'Alexia','Rafael','krafael1109@gmail.com','gamemaker'),(7,'RileyGM','gm','riley@thematsudas.com','gamemaker'),(8,'RileyT','Tribute','riley4coclol@gmail.com','tribute'),(9,'RileyH','Mentor','riley4coclol2@gmail.com','mentor'),(10,'RileySH','Helper','11rocks11@gmail.com','gamemaker'),(32,'Michael','Cuc','michaelcuc24@gmail.com','tribute'),(33,'Courtney','Lau','cmlau2468@gmail.com','tribute'),(34,'Jaeinn','Lee','Jnl9018@g.ucla.edu','tribute'),(35,'Nathan','Ng','ng.nathan.k@gmail.com','tribute'),(36,'Mark','Yamamoto','markymark.yamamoto@gmail.com','tribute'),(37,'Michelle','Kim','makim7200@gmail.com','tribute'),(38,'Grace','Skalinder','graceskalin10@gmail.com','tribute'),(39,'Sheryl','Ghoubrial','sherylghoubrial@yahoo.com','tribute'),(40,'Elizabeth','Castro','Djeli321@gmail.com','tribute'),(41,'Jenny','Wang','wangjenny3128@gmail.com','tribute'),(42,'Matthew','Saiki','msaiki24@hotmail.com','tribute'),(43,'Lex','Toledo','lexxis002@gmail.com','tribute'),(44,'Rachael','Koh','rachaelkhh@ucla.edu','tribute'),(45,'Julia','Lindner','juliadlindner@gmail.com','tribute'),(46,'Sara','Veerman','svsaraveerman@gmail.com','tribute'),(47,'Mikhael','Rasiah','mik500@g.ucla.edu','tribute'),(48,'Timmy','Gozali','timmygozali@gmail.com','helper'),(49,'Ricky','Chen','rrc41314@gmail.com','helper'),(50,'Ada','Chen','adayychen@yahoo.com','mentor'),(51,'Ryan','Lo','7ryanlo@gmail.com','mentor'),(52,'Nathan','Wobig','nwobig45@gmail.com','mentor');
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

-- Dump completed on 2020-02-01 18:38:57
