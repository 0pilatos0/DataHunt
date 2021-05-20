<?php
include '../elements/header.php';

if (empty($_SESSION["user"])) {
    echo "<script>location = \"http://datahunt.duckdns.org\";</script>";
}
if (!$userinfo["role_id"]) {
    echo "<script>location = \"http://datahunt.duckdns.org\";</script>";
}
?>

    <div id="editor">
        <p>Here goes the initial content of the editor.</p>
    </div>
    <button type="button" onclick="getData()">Submit</button>
    <script src="https://cdn.ckeditor.com/ckeditor5/27.1.0/classic/ckeditor.js"></script>
    <script src="./../js/editor.js"></script>

<?php include '../elements/footer.php'; ?>