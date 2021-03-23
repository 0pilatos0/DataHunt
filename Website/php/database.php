<?php
require "env.php";

function db(){
   return new PDO("mysql:host=" . getenv("MYSQLHOST") . ";" . "dbname=" . getenv("MYSQLDATABASE") . ";", getenv("MYSQLUSERNAME"), getenv("MYSQLPASSWORD"));

}

function userInfo($param){
    $dbh = db();

    $stmt = $dbh->prepare("SELECT * FROM users where id = :id");
    $stmt->bindParam(':id', $param);
    $stmt->execute();
    $result = $stmt->fetch();
    $dbh = null;
    return $result;

}

function deleteUser($param){
    $dbh = db();

    $stmt = $dbh->prepare("DELETE FROM users where id = :id");
    $stmt->bindParam(':id', $param);
    $stmt->execute();
    $dbh = null;
}

function characters($param){
    $dbh = db();

    $stmt = $dbh->prepare("SELECT characters.id, class.name, stats.level, characters.name as char_name FROM characters INNER JOIN class ON class.id = characters.class_id INNER JOIN stats ON stats.id = characters.stats_id  where characters.user_id = :id");
    $stmt->bindParam(':id', $param);
    $stmt->execute();
    $result = $stmt->fetchAll();
    $dbh = null;
    return $result;

}



