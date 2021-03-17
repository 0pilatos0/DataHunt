<?php 
    include '../elements/header.php';
?>
<div class="content">
</div>
<?php
    include '../elements/footer.php';
?>
<?php
require "../php/database.php";
require "../php/functions.php";
$dbh = db();
$stmt = $dbh->prepare("DELETE FROM logintokens WHERE user_id = (:uid)");
$stmt->bindParam(':uid', getSessionValue("user"));
$stmt->execute();
$dbh = null;
resetSession();
header( "refresh:0.1;url=http://datahunt.duckdns.org" );
?>

