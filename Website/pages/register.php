<h1>REGISTER</h1>
<form method="post">
    <p>Your irl name: </p>
    <input type="text" name="AccName"><br>
    <p>Your ingame username: </p>
    <input type="text" name="AccUsername"><br>
    <p>Your email: </p>
    <input type="text" name="AccEmail"><br>
    <p>Your phone number: </p>
    <input type="text" name="AccPhone"><br>
    <p>Your password, make it strong: </p>
    <input type="text" name="AccPassword"><br>
    <input type="submit">
</form>
<?php
//starts the session
session_start();

//requires the file
require "../env.php";

//sets a value in the session
$_SESSION["test"] = "test test test";

//gets a value from the session
//print_r($_SESSION["test"]);

//thesekcan get the env values
getenv("MYSQLUSERNAME");
getenv("MYSQLPASSWORD");
getenv("MYSQLHOST");
getenv("MYSQLDATABASE");
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = changeInput($_POST["AccName"]);
    $username = changeInput($_POST["AccUsername"]);
    $email = changeInput($_POST["AccEmail"]);
    $phone = changeInput($_POST["AccPhone"]);
    $password = changeInput($_POST["AccPassword"]);
    $password = hash('md5', $password);
    $password = hash('sha256', $password);
    try {
        $dbh = new PDO("mysql:host=" . getenv("MYSQLHOST") . ";" . "dbname=" . getenv("MYSQLDATABASE") . ";", getenv("MYSQLUSERNAME"), getenv("MYSQLPASSWORD"));

        $stmt = $dbh->prepare("INSERT INTO `users` (name, username, email, phone, password) VALUES (:name, :username, :email, :phone, :password)");
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':phone', $phone);
        $stmt->bindParam(':password', $password);
        $stmt->execute();

        $dbh = null;
        echo "<p id='succesMessage'>added to the database</p>";
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