<?php 
    include '../elements/header.php';
?>
<div class="content">
</div>
<?php
    include '../elements/footer.php';
?>
<?php 
require "../functions.php";
resetSession();
header( "refresh:0.1;url=http://datahunt.duckdns.org" );
?>

