<?php
include '../elements/header.php';

if (empty($_SESSION["user"])) {
    echo "<script>location = \"http://datahunt.duckdns.org\";</script>";
}
if (!$userinfo["role_id"]) {
    echo "<script>location = \"http://datahunt.duckdns.org\";</script>";
}
?>
    <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
    <div id="editor"></div>

    <button type="button" class="btn btn-block btn-primary" onclick="getData()">Submit</button>
    <script src="//cdn.quilljs.com/1.3.6/quill.js"></script>
    <script src="//cdn.quilljs.com/1.3.6/quill.min.js"></script>
    <script src="./../js/editor.js"></script>

<?php
    if(isset($_POST['data']) && $_POST['data'] !== '<p><br></p>'){
        makePatchnote($_POST['data']);
    }
?>

<?php include '../elements/footer.php'; ?>