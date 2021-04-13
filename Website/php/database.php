<?php
require $_SERVER["DOCUMENT_ROOT"] . "/env.php";

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

/**
 * set friendship
 * @param int
 * @param int
 * @param int
 *
 * userA will always be the person that send the request first!
 * 0 = userA send request userB didn't accept nor decline
 * 1 = userA and UserB are friends
 *
 * @return void
 */

function setFriendship($userA, $userB, $friendship)
{
    $dbh = db();
    $stmt = $dbh->prepare("INSERT INTO `friends` (userA, userB, friendship) VALUES (:userA, :userB, :friendship)");
    $stmt->bindParam(':userA', $userA);
    $stmt->bindParam(':userB', $userB);
    $stmt->bindParam(':friendship', $friendship);
    $stmt->execute();
    $dbh = null;
}

/**
 * set friendship
 * @param int
 * @param int
 *
 * Allows you to update friendships
 *
 * @return void
 */

function updateFriendship($friendshipID, $friendship)
{
    $dbh = db();
    $stmt = $dbh->prepare("UPDATE friends SET friendship=:friendship WHERE id=:friendshipId");
    $stmt->bindParam(':friendshipId', $friendshipID);
    $stmt->bindParam(':friendship', $friendship);
    $stmt->execute();
    $dbh = null;
}


function getFriendship($userA, $userB)
{
    $dbh = db();
    $stmt = $dbh->prepare("SELECT * FROM friends WHERE userA = (:userA) AND userB = (:userB) OR userA = (:userB) AND userB = (:userA)");
    $stmt->bindParam(':userA', $userA);
    $stmt->bindParam(':userB', $userB);
    $stmt->execute();
    $results = $stmt->fetch(PDO::FETCH_ASSOC);
    $dbh = null;

    return $results;
}

function deleteFriendship ($param) {
    $dbh = db();
    $stmt = $dbh->prepare("DELETE FROM friends WHERE id=:id;");
    $stmt->bindParam(':id', $param);
    $stmt->execute();
    $dbh = null;

}

function getMultipleFriendships($user)
{
    $dbh = db();
    $stmt = $dbh->prepare("SELECT * FROM friends WHERE userA = (:user) OR userB = (:user)");
    $stmt->bindParam(':user', $user);
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $dbh = null;

    return $results;
}

function getUserId($param)
{
    $dbh = db();

    $stmt = $dbh->prepare("SELECT id FROM users where username = :username");
    $stmt->bindParam(':username', $param);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_NUM);
    $dbh = null;
    return $result;
}

function getUsername($param)
{
    $dbh = db();

    $stmt = $dbh->prepare("SELECT username FROM users where id = :id");
    $stmt->bindParam(':id', $param);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_NUM);
    $dbh = null;
    return $result;
}