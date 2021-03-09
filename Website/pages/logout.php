<?php 
    include '../elements/header.php';
?>
<div class="content">
</div>
<?php
    include '../elements/footer.php';
?>
<?php 
session_destroy();
header( "refresh:0.1;url=http://datahunt.duckdns.org" );
?>

