<?php
include '../elements/header.php';

if(empty($_SESSION["user"])){
    echo "<script>location = \"http://datahunt.duckdns.org\";</script>";
}

?>
<div class="content">
</div>
<?php
    include '../elements/footer.php';
?>
<?php
$dbh = db();
$stmt = $dbh->prepare("DELETE FROM logintokens WHERE user_id = (:uid)");
$stmt->bindParam(':uid', getSessionValue("user"));
$stmt->execute();
$dbh = null;
resetSession();
header( "refresh:0.1;url=http://datahunt.duckdns.org/" );
?>

