<?php

function login()
{
    // mysql connection opzetten.
    $mysqli = startMysqlConnection();


    // query schrijven om in te loggen
    $query = "SELECT * FROM `users` WHERE `username` = ? AND `password` = ? AND `enabled` = 1 AND `verified` = 1";
    $stmt = $mysqli->prepare($query);

    // Test of er geen fouten in de query zitten.
    if (!$stmt) {
        echo $mysqli->error;
        closeMysqlConnection($mysqli);
        exit();
    }

    $username = $_POST['username'];
    $password = hash('sha512', $_POST['password']);

    $stmt->bind_param('ss', $username, $password);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $stmt->close();

    // gebruiker sessie aanmaken op basis van query resultaat
    $_SESSION['user'] = $row;

    // als we klaar zijn mysql ook weer afsluiten
    closeMysqlConnection($mysqli);

    // als inloggen gelukt is return true
    return (!empty($_SESSION['user']));
}

/**
 * @return null
 */
function logout()
{
    unset($_SESSION['user']);
}




/**
 * @return mysqli
 */
function startMysqlConnection()
{
    return new mysqli(
        getenv('MYSQLHOST'),
        getenv('MYSQLUSERNAME'),
        getenv('MYSQLPASSWORD'),
        getenv('MYSQLDATABASE')
    );
}

/**
 * @param mysqli $mysql
 * @return bool
 */
function closeMysqlConnection(mysqli $mysql)
{
    return $mysql->close();
}