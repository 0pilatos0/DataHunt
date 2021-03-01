<h1>REGISTER</h1>
<form method="post">
    <p>Your irl name: </p>
    <input type="text" name="AccName"><br>
    <p>Your ingame username: </p>
    <input type="text" name="AccUsername"><br>
    <p>Your email: </p>
    <input type="text" name="AccEmail"><br>
    <p>Your password, make it strong: </p>
    <input type="password" name="AccPassword"><br>
    <p>Verify password, insert the same: </p>
    <input type="password" name="AccPasswordCheck">
    <p>Remember me: <input type="checkbox" name="AccRemember"></p>
    <input type="submit">
</form>
<?php
session_start();

require "../../env.php";
require "mail.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = changeInput($_POST["AccName"]);
    $username = changeInput($_POST["AccUsername"]);
    $email = changeInput($_POST["AccEmail"]);
    $password = password_hash($_POST["AccPassword"], PASSWORD_BCRYPT, ['cost' => 12]);
    $password2 = password_hash($_POST["AccPasswordCheck"], PASSWORD_BCRYPT, ['cost' => 12]);
    $verificationtoken = password_hash(rand(1, 1000000), PASSWORD_BCRYPT, ['cost' => 12]);
    $token = password_hash(rand(1, 1000000), PASSWORD_BCRYPT, ['cost' => 12]);
    setcookie("token", $token, time() + (86400 * 30), "/");
    define("nameRegex", '/^[a-z ,.\'-]+$/i', true);
    define("usernameRegex", '/\w{5,29}/i', true);
    define("mailRegex", '/(?:[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/', true);
    define("passwordRegex", '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/', true);

    try {
        if (!preg_match(nameRegex, $name)) {
            echo "<p>You are the type of person to have a red line under your name in word</p>";
            die();
        }
        if (!preg_match(usernameRegex, $username)) {
            echo "<p>Your username is fucked</p>";
            die();
        }
        if (!preg_match(mailRegex, $email)) {
            echo "<p>This isn't a valid email adress</p>";
            die();
        }
        if (!preg_match(passwordRegex, $_POST["AccPassword"])) {
            echo "<p>Your password should be 8 characters long, have one uppercase and lowercase letters and a number!</p>";
            die();
        }
        if ($_POST["AccPassword"] !== $_POST["AccPasswordCheck"]) {
            echo "<p>Passwords don't match</p>";
            die();
        }
        $dbh = new PDO("mysql:host=" . getenv("MYSQLHOST") . ";" . "dbname=" . getenv("MYSQLDATABASE") . ";", getenv("MYSQLUSERNAME"), getenv("MYSQLPASSWORD"));

        $stmt = $dbh->prepare("INSERT INTO `users` (name, username, email, password, verifytoken) VALUES (:name, :username, :email, :password, :verifytoken)");
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $password);
        $stmt->bindParam(':verifytoken', $verificationtoken);
        $stmt->execute();

        $id = $dbh->lastInsertId();

        $stmt = $dbh->prepare("INSERT INTO logintokens (user_id, token) VALUES (:user_id, :token)");
        $stmt->bindParam(':user_id', $id);
        $stmt->bindParam(':token', $token);
        $stmt->execute();


        $dbh = null;
        echo "<p id='succesMessage'>added to the database</p>";
        sendVerificationMail($email, $name, $verificationtoken);

    } catch (PDOException $e) {
        print "Error!: " . $e->getMessage() . "<br/>";
        die();

    }
}

function changeInput($data)
{
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}