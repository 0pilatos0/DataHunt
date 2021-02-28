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
 * @return bool
 */
function account()
{
    // Als het huidig wachtwoord niet is ingevuld mag je niet verder
    if (empty($_POST['password-current'])) {
        echo 'huidig wachtwoord mag niet leeg zijn';
        return false;
    }

    // Als het huidige wachtwoord wel is ingevuld dan moeten we kijken of die klopt
    if (!empty($_POST['password-current'])) {
        $current = hash('sha512', $_POST['password-current']);
        // Kijk of het huidige wachtwoord klopt.
        if ($current !== $_SESSION['user']['password']) {
            echo 'Huidig wachtwoord is niet correct';
            return false;
        }
    }

    // Kijk of we een nieuw wachtwoord willen instellen.
    if (!empty($_POST['password-new'])) {
        $passwordNew = hash('sha512', $_POST['password-new']);
        $passwordConfirmation = hash('sha512', $_POST['password-new-confirmation']);
        // Zorg dat het nieuwe wachtwoord dubbel word ingevuld hetzelfde zodat we het kunnen controleren.
        if ($passwordNew !== $passwordConfirmation) {
            echo 'Nieuw wachtwoord komt niet overeen';
            return false;
        }
    } else {
        $passwordNew = $current;
    }

    // Maak de query om de nieuwe gegevens weg te schrijven in de database.
    $mysqli = startMysqlConnection();
    $query = "UPDATE `users` SET `name` = ?, `username` = ?, `password` = ?, `phone` = ?, `email` = ? WHERE `id` = ?; ";
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param('sssssi', $_POST['name'], $_POST['username'], $passwordNew, $_POST['phone'], $_POST['email'], $_SESSION['user']['id']);
    $stmt->execute();

    $affectedRows = $stmt->affected_rows;
    closeMysqlConnection($mysqli);

    // Als de "affected rows" (bijgewerkte rijen) niet 1 is dan weten we dat het niet goed is gegaan.
    if ($affectedRows !== 1) {
        echo 'er ging iets mis bij het bijwerken van je account';
    } else {
        // doe het huidige account gegevens bijwerken met de nieuwe informatie.
        $_SESSION['user']['name'] = $_POST['name'];
        $_SESSION['user']['username'] = $_POST['username'];
        $_SESSION['user']['email'] = $_POST['email'];
        $_SESSION['user']['phone'] = $_POST['phone'];
        $_SESSION['user']['password'] = $passwordNew;

        echo 'Account is bijgewerkt';
    }

    return true;
}

/**
 * @return bool
 */
function delete()
{
    $mysqli = startMysqlConnection();
    $query = "DELETE FROM `users` WHERE `id` = ?";
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param('i', $_SESSION['user']['id']);
    $stmt->execute();
    $stmt->close();
    closeMysqlConnection($mysqli);

    unset($_SESSION['user']);
    return true;
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