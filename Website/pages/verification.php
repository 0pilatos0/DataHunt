<h1>Please wait...</h1>
<?php
require "../../env.php";

$verificationtoken = $_GET["veri"];
$id;
try {
    $dbh = new PDO("mysql:host=" . getenv("MYSQLHOST") . ";" . "dbname=" . getenv("MYSQLDATABASE") . ";", getenv("MYSQLUSERNAME"), getenv("MYSQLPASSWORD"));
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $dbh->prepare("SELECT `verifytoken`, `id`, `name` FROM `users` WHERE `verifytoken` = (:verifytoken)");
    $stmt->bindParam(':verifytoken', $verificationtoken);
    $stmt->execute();
    $stmt->setFetchMode(PDO::FETCH_ASSOC);
    $dbh = null;
    foreach ($stmt->fetchAll() as $k => $v) {
        $id = intval($v['id']);
    }
    ResetVerification($id);
    die();
} catch (PDOException $e) {
    print "Error!: " . $e->getMessage() . "<br/>";
    die();
}

function ResetVerification($id)
{
    try {
        $dbh = new PDO("mysql:host=" . getenv("MYSQLHOST") . ";" . "dbname=" . getenv("MYSQLDATABASE") . ";", getenv("MYSQLUSERNAME"), getenv("MYSQLPASSWORD"));
        $stmt = $dbh->prepare("UPDATE `users` SET verifytoken=\"\", verified=1 WHERE id=(:id)");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $dbh = null;
        echo "you are verified!";
        header('Location: ../user');
    } catch (PDOException $e) {
        print "Error!: " . $e->getMessage() . "<br/>";
        die();
    }
}