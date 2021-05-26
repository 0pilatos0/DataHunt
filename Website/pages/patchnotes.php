<?php include '../elements/header.php'; ?>
<div id="patchnoteContainer">
    <?php
    $patchnotes = getPatchnotes();
    ?>
    <div id="latestPatch">
        <h2>Latest Patchnotes: </h2>
        <?php echo $patchnotes[0]['note'] ?>
    </div>

    <div id="normalPatch">
        <h2>Older Patchnotes:</h2>
        <?php
        for ($i = 1; $i < count($patchnotes); $i++) {
            echo "<button class=\"btn btn-primary\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#collapseExample" . $i . "\" aria-expanded=\"false\" aria-controls=\"collapseExample" . $i . "\">" . $patchnotes[$i]['date_created'] . "</button><br>";
            echo "<br><div class=\"collapse patchText\" id=\"collapseExample" . $i . "\">" . $patchnotes[$i]['note'] . "</div>";
        }
        ?>

    </div>
</div>
<?php include '../elements/footer.php'; ?>