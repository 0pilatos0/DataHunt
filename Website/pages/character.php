<?php
    include '../elements/header.php' ;

if(empty($_SESSION["user"])){
    echo "<script>location = \"http://datahunt.duckdns.org\";</script>";
}

$stats = getStats($_GET['id'])[0];
?>

    <div class="statsContainer">
        <h3><?php echo $stats[2]; ?>, <?php echo $stats[5]; ?></h3>
    </div>
    <div>
        <p><?php echo "Your K/D (Kills divived by Deaths): " . calculateKD($stats[0], $stats[1]) . "<br>" . "Health: " . $stats[3] . "<br>" . "Level: " . $stats[4]?></p>
    </div>

<?php include '../elements/footer.php'; ?>