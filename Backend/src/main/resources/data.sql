-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: gamestore_db
-- ------------------------------------------------------
-- Server version	8.0.43

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
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `games`
--

LOCK TABLES `games` WRITE;
/*!40000 ALTER TABLE `games` DISABLE KEYS */;
INSERT INTO `games` VALUES (1,'Cyberpunk 2077','RPG',59.99,'https://www.cdprojekt.com/en/wp-content/uploads-en/2022/02/cyberpunk2077-02.png',NULL,NULL,NULL,NULL,NULL,NULL),(2,'The Witcher 3','RPG',19.99,'https://cdn1.epicgames.com/offer/14ee004dadc142faaaece5a6270fb628/EGS_TheWitcher3WildHuntCompleteEdition_CDPROJEKTRED_S1_2560x1440-82eb5cf8f725e329d3194920c0c0b64f?resize=1&w=480&h=270&quality=medium',39.99,NULL,NULL,NULL,NULL,NULL),(3,'Age of Empires IV','Strategy',49.99,'https://forums.ageofempires.com/uploads/default/original/3X/6/b/6bb83964e935c36cd6fcacd170ac64938b0e4df6.jpeg',NULL,NULL,NULL,NULL,NULL,NULL),(4,'Call of Duty: Black Ops 4','Action',44.99,'https://images8.alphacoders.com/921/thumbbig-921560.webp',69.99,NULL,NULL,NULL,NULL,NULL),(5,'Forza Horizon 5','Racing',59.99,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-NR4zKIO3DbJQdo8Szh4-Klrr5Pts9qUZhMMWdKBcm6ZocrbQDK_A_Y-DxVpVDQLhnhA&usqp=CAU',NULL,NULL,NULL,NULL,NULL,NULL),(6,'Stardew Valley','Simulation',14.99,'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/413150/capsule_616x353.jpg?t=1754692865',NULL,NULL,NULL,NULL,NULL,NULL),(7,'Elden Ring','RPG',59.99,'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/capsule_616x353.jpg?t=1748630546',NULL,NULL,NULL,NULL,NULL,NULL),(8,'Valorant','Action',0,'https://assets.xboxservices.com/assets/4e/bc/4ebcb533-e184-42f3-833b-9aa47a81f39e.jpg?n=153142244433_Poster-Image-1084_1920x720.jpg',NULL,NULL,NULL,NULL,NULL,NULL),(9,'FINAL FANTASY VII Rebirth','RPG',69.99,'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2909400/c4e617a13d511a72b2787c91e0e08fbe57c99191/capsule_616x353.jpg?t=1747042636',NULL,NULL,NULL,NULL,NULL,NULL),(10,'Assassin\'s Creed Origins','Action',14.99,'https://staticctf.ubisoft.com/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/2eDVwXRjOr4HFDdc3HIMh1/8ab17ffd07960a4154118846bcacb997/ACH_Keyart_RGB_meta.jpg',49.99,NULL,NULL,NULL,NULL,NULL),(11,'Hogwarts Legacy','Adventure',19.99,'https://www.hogwartslegacy.com/images/share.jpg',39.99,NULL,NULL,NULL,NULL,NULL),(12,'Wuthering Waves','Action',0,'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3513350/d63b9d52dd39c72fee8c43e286522640650d02b1/capsule_616x353.jpg?t=1756342405',NULL,NULL,NULL,NULL,NULL,NULL),(13,'Titan Quest II','RPG',26.99,'https://titanquest2.thqnordic.com/game-sites/titanquest2/editions/standard-edition.png',29.99,NULL,NULL,NULL,NULL,NULL),(14,'The Sims 4','Simulation',0,'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1222670/header.jpg?t=1757964647',NULL,NULL,NULL,NULL,NULL,NULL),(15,'InZOI','Simulation',39.99,'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2456740/169fdacc61e59aa8d0272b3a4f1e93c8dfe8d18a/capsule_616x353.jpg?t=1756261982',NULL,NULL,NULL,NULL,NULL,NULL),(16,'Tales of the Shire','Simulation',27.99,'https://www.nintendo.com/eu/media/images/assets/nintendo_switch_games/talesoftheshireathelordoftheringsgame/16x9_TalesOfTheShireATheLordOfTheRingsGame_image1600w.jpg',NULL,NULL,NULL,NULL,NULL,NULL),(17,'Total War: WARHAMMER II','Strategy',59.99,'https://cdn1.epicgames.com/salesEvent/salesEvent/EGS_TotalWarWARHAMMERII_CREATIVEASSEMBLY_S1_2560x1440-787d1d3d23a985419885f094cbefdfd3',NULL,NULL,NULL,NULL,NULL,NULL),(18,'Age of Mythology: Retold','Strategy',14.99,'https://cdn.ageofempires.com/aoe/wp-content/uploads/2024/02/239874_Wallpaper_Desktop_896x813.webp',29.99,NULL,NULL,NULL,NULL,NULL),(19,'Marvel\'s Spider-Man 2','Adventure',45.99,'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2651280/cb8da9b3e99cf7362cd88c10a0544b7fe892ccad/capsule_616x353.jpg?t=1750954033',59.99,NULL,NULL,NULL,NULL,NULL),(20,'SMITE 2','Adventure',0,'https://cdn1.epicgames.com/offer/16ed9f15b1b449ccb59cb610b13df5b8/SMITE2-LandscapeImage-F2P-2560x1440_2560x1440-fcfcbb2a6ea7088b16f5020c3eababfa',NULL,NULL,NULL,NULL,NULL,NULL),(21,'Sonic Racing: CrossWorlds','Racing',69.99,'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2486820/b8bd9ab5235c52a0ded94e07134727974831d766/capsule_616x353.jpg?t=1758823778',NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `games` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (1,69.99,'2025-09-28 00:18:01.845102',4,2),(2,19.99,'2025-09-28 00:18:01.870731',2,2),(3,14.99,'2025-09-28 01:43:56.342932',6,2),(4,59.99,'2025-09-28 01:43:56.357173',5,2),(5,59.99,'2025-09-30 20:07:36.859157',7,2),(6,0.00,'2025-09-30 20:07:36.881354',8,2),(7,59.99,'2025-09-30 20:07:36.896264',17,2),(8,69.99,'2025-09-30 20:07:36.913272',21,2);
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user_library_items`
--

LOCK TABLES `user_library_items` WRITE;
/*!40000 ALTER TABLE `user_library_items` DISABLE KEYS */;
INSERT INTO `user_library_items` VALUES (8,'2025-09-28 00:18:01.837965',4,2),(9,'2025-09-28 00:18:01.868672',2,2),(10,'2025-09-28 01:43:56.311212',6,2),(11,'2025-09-28 01:43:56.354020',5,2),(12,'2025-09-30 20:07:36.834567',7,2),(13,'2025-09-30 20:07:36.876353',8,2),(14,'2025-09-30 20:07:36.892258',17,2),(15,'2025-09-30 20:07:36.909273',21,2);
/*!40000 ALTER TABLE `user_library_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'testuser','test@example.com','$2a$10$j5Zyk7fw0UfPxWrBTC.Vjuv4R61qYJ5UJ6CTEBt.DnxqGF7Xm2aU2','ROLE_USER'),(2,'testuser1','test1@example.com','$2a$10$0G3/chFZKbCpMPD0YfB8Se0H51rMXJ/szRN1zBV3DVXcouO7ZiTeC','ROLE_USER'),(3,'geomech','geo1@gmail.com','$2a$10$Zgq1tT5dLASVWJmscWO60.bZSGc/qTnj1JMH/PiO58R./lidVlttK','ROLE_ADMIN'),(6,'testuser_integration','integration@test.com','$2a$10$qsgFnB/R8FvJhGPLWNKz9O/Ie6c69wDmgCpL9pKlwGenkFH/QiuaG','ROLE_USER');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `wishlist_items`
--

LOCK TABLES `wishlist_items` WRITE;
/*!40000 ALTER TABLE `wishlist_items` DISABLE KEYS */;
INSERT INTO `wishlist_items` VALUES (44,3,2),(46,1,2),(49,16,2),(50,14,2),(51,13,2);
/*!40000 ALTER TABLE `wishlist_items` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-07 13:04:18
