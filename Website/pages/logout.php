<?php 
    include '../elements/header.php';
?>
<div class="content">
</div>
<?php
    include '../elements/footer.php';
?>
<?php 
require "../php/functions.php";
resetSession();
header( "refresh:0.1;url=http://live.datahunt.duckdns.org/" );
?>

