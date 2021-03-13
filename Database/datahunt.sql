-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Gegenereerd op: 07 mrt 2021 om 22:38
-- Serverversie: 8.0.18
-- PHP-versie: 7.3.11

SET
SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET
AUTOCOMMIT = 0;
START TRANSACTION;
SET
time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `groepsproject`
--

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `attack`
--

CREATE TABLE `attack`
(
    `id`            int(11) NOT NULL,
    `name`          varchar(255) NOT NULL,
    `value`         int(11) NOT NULL,
    `valueperlevel` int(11) NOT NULL,
    `level`         int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `class`
--

CREATE TABLE `class`
(
    `id`    int(11) NOT NULL,
    `name`  varchar(255) NOT NULL,
    `type`  varchar(255) NOT NULL,
    `value` int(11) NOT NULL,
    `speed` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `enemies`
--

CREATE TABLE `enemies`
(
    `id`         int(11) NOT NULL,
    `min_health` int(11) NOT NULL,
    `max_health` int(11) NOT NULL,
    `damage`     int(11) NOT NULL,
    `level`      int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `items`
--

CREATE TABLE `items`
(
    `id`      int(11) NOT NULL,
    `type`    varchar(255) NOT NULL,
    `texture` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `level`
--

CREATE TABLE `level`
(
    `id`           int(11) NOT NULL,
    `level`        int(11) NOT NULL,
    `required_exp` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `logintokens`
--

CREATE TABLE `logintokens`
(
    `user_id` int(11) NOT NULL,
    `token`   varchar(256) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `password_resets`
--

CREATE TABLE `password_resets`
(
    `email`      varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
    `token`      varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
    `created_at` datetime                                NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `stats`
--

CREATE TABLE `stats`
(
    `id`        int(11) NOT NULL,
    `user_id`   int(11) NOT NULL,
    `coins`     int(11) NOT NULL,
    `skin`      varchar(255) NOT NULL,
    `exp`       int(11) NOT NULL,
    `level`     int(11) NOT NULL,
    `health`    int(11) NOT NULL,
    `attack_id` int(11) NOT NULL,
    `class_id`  int(11) NOT NULL,
    `speed`     int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `stats_items`
--

CREATE TABLE `stats_items`
(
    `id`       int(11) NOT NULL,
    `stats_id` int(11) NOT NULL,
    `item_id`  int(11) NOT NULL,
    `slot`     int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `stats_skills`
--

CREATE TABLE `stats_skills`
(
    `id`        int(11) NOT NULL,
    `stats_id`  int(11) NOT NULL,
    `skills_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `users`
--

CREATE TABLE `users`
(
    `id`            int(11) NOT NULL,
    `name`          varchar(255) NOT NULL,
    `username`      varchar(255) NOT NULL,
    `email`         varchar(255) NOT NULL,
    `phone`         varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
    `password`      varchar(255) NOT NULL,
    `enabled`       tinyint(1) NOT NULL DEFAULT '1',
    `resetpassword` tinyint(1) NOT NULL DEFAULT '0',
    `verifytoken`   varchar(255) NOT NULL,
    `verified`      tinyint(1) NOT NULL DEFAULT '1',
    `remember_token` varchar(255) NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexen voor geëxporteerde tabellen
--

--
-- Indexen voor tabel `attack`
--
ALTER TABLE `attack`
    ADD PRIMARY KEY (`id`);

--
-- Indexen voor tabel `class`
--
ALTER TABLE `class`
    ADD PRIMARY KEY (`id`);

--
-- Indexen voor tabel `items`
--
ALTER TABLE `items`
    ADD PRIMARY KEY (`id`);

--
-- Indexen voor tabel `level`
--
ALTER TABLE `level`
    ADD PRIMARY KEY (`id`);

--
-- Indexen voor tabel `logintokens`
--
ALTER TABLE `logintokens`
    ADD PRIMARY KEY (`user_id`);

--
-- Indexen voor tabel `stats`
--
ALTER TABLE `stats`
    ADD PRIMARY KEY (`id`);

--
-- Indexen voor tabel `stats_items`
--
ALTER TABLE `stats_items`
    ADD PRIMARY KEY (`id`);

--
-- Indexen voor tabel `stats_skills`
--
ALTER TABLE `stats_skills`
    ADD PRIMARY KEY (`id`);

--
-- Indexen voor tabel `users`
--
ALTER TABLE `users`
    ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT voor geëxporteerde tabellen
--

--
-- AUTO_INCREMENT voor een tabel `attack`
--
ALTER TABLE `attack`
    MODIFY `id` int (11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT voor een tabel `class`
--
ALTER TABLE `class`
    MODIFY `id` int (11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT voor een tabel `items`
--
ALTER TABLE `items`
    MODIFY `id` int (11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT voor een tabel `level`
--
ALTER TABLE `level`
    MODIFY `id` int (11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT voor een tabel `logintokens`
--
ALTER TABLE `logintokens`
    MODIFY `user_id` int (11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT voor een tabel `stats`
--
ALTER TABLE `stats`
    MODIFY `id` int (11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT voor een tabel `stats_items`
--
ALTER TABLE `stats_items`
    MODIFY `id` int (11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT voor een tabel `stats_skills`
--
ALTER TABLE `stats_skills`
    MODIFY `id` int (11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT voor een tabel `users`
--
ALTER TABLE `users`
    MODIFY `id` int (11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
