<?php
include '../elements/header.php' ;

$userinfo = $_SESSION["userinfo"];
if(!$userinfo["role_id"]){
    echo "<script>location = \"http://datahunt.duckdns.org\";</script>";
}

?>
    <div id="container">
        <h1>Admin Panel</h1>
    </div>

<?php include '../elements/footer.php'; ?>