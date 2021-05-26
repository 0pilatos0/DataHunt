<?php
include '../elements/header.php' ;

if(!$userinfo["role_id"]){
    echo "<script>location = \"http://datahunt.duckdns.org\";</script>";
}

if(isset($_GET["delete"])){
    if($_GET["delete"] === "confirm"){
        adminDelete($_GET["id"]);
        echo "<script>location = \"../admin\"</script>";
    }
}
if(isset($_GET["ban"])){
    if ($_GET["ban"] === "true") {
        echo "
            <div id=\"delete-account-overlay\" onclick='removeOverlay()' class=\"overlay delete-element\">
            
                
            </div>
            <div class=\"card card-info delete-confirm delete-element\">
                 <div class=\"card-header\">
                    <h3 class=\"card-title\">Ban User</h3>
                </div>
                <form class=\"form-horizontal\" target=\"_self\" method='post'>
                    <div class=\"card-body\">
                        <div class=\"form-group row\">
                            <label for=\"id\" class=\"col-sm-2 col-form-label\">User ID</label>
                            <div class=\"col-sm-10\">
                                <input class=\"form-control\" id=\"id\" type='number' value='{$_GET["id"]}'>
                            </div>
                        </div>
                        <div class=\"form-group row\">
                            <label for=\"date\" class=\"col-sm-2 col-form-label\">Ban Until</label>
                            <div class=\"col-sm-10\">
                                <input type=\"date\" class=\"form-control\" id=\"date\">
                            </div>
                        </div>
                        <input class='hide' id=\"banBy\" value='{$userinfo["id"]}'>
                    </div>
                    <div class=\"card-footer\">
                        <button type=\"submit\" class=\"btn btn-info\">Confirm</button>
                        <button type=\"submit\" class=\"btn btn-default float-right\">Cancel</button>
                    </div>
                </form>
            </div>
            ";
    }
}
if(isset($_POST["date"])){
    banUser($_POST);
}

?>
    <div id="container">
        <h1>Admin Panel</h1>
        <div id="buttons">
            <button onclick="show('usertable')">usertable</button>
            <button onclick="show('patchnotes')">patchnotes</button>
        </div>
        <div id="usertable">
            <h1>User Table</h1>
            <table>
                <tr>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Enabled</th>
                    <th>Verified</th>
                    <th>Role</th>
                    <th></th>
                </tr>
                <?php

                foreach(getUsers() as $user){
                    echo "<tr>
                    <td>{$user["id"]}</td>
                    <td>{$user["name"]}</td>
                    <td>{$user["username"]}</td>
                    <td>{$user["email"]}</td>
                    <td>{$user["enabled"]}</td>
                    <td>{$user["verified"]}</td>
                    <td>{$user["role_id"]}</td>
                    
                    <td>
                    ";
                    if(!$user["role_id"] >= $userinfo["role_id"]){
                        echo "
                        <a class='btn btn-primary' href=\"?ban=true&id={$user["id"]}\">Ban</a>
                        <button type=\"button\" class=\"btn btn-primary\" data-bs-toggle=\"modal\" data-bs-target=\"#deleteUser\" data-bs-whatever=\"{$user["id"]}\">Delete</button>
                        ";
                    }
                    echo "
                    </td>
                    </tr>";
                }


                ?>
            </table>
        </div>
        <div class="modal fade" id="deleteUser" tabindex="-1" aria-labelledby="deleteUserLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="deleteUserLabel" style="color: black;">Delete user</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="mb-3">
                                <label for="recipient-name" class="col-form-label">User ID</label>
                                <input type="text" class="form-control" id="recipient-name">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <a class="btn btn-confirm">Confirm</a>
                    </div>
                </div>
            </div>
        </div>
        <div id="patchnotes" class="hide">
            <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
            <div id="editor">

            </div>

            <button type="button" class="btn btn-block btn-primary" onclick="getData()">Submit</button>
            <script src="//cdn.quilljs.com/1.3.6/quill.js"></script>
            <script src="//cdn.quilljs.com/1.3.6/quill.min.js"></script>
            <script src="./../js/editor.js"></script>

            <?php
            if(isset($_POST['data']) && $_POST['data'] !== '<p><br></p>'){
                makePatchnote($_POST['data']);
            }
            ?>
        </div>

    </div>
    <script>
        var exampleModal = document.getElementById('deleteUser');
        exampleModal.addEventListener('show.bs.modal', function (event) {
            var button = event.relatedTarget;
            var recipient = button.getAttribute('data-bs-whatever');
            var modalBodyInput = exampleModal.querySelector('.modal-body input');

            var a = exampleModal.querySelector('.modal-footer a');
            a.setAttribute('href', '?delete=confirm&id='+recipient);

            modalBodyInput.value = recipient
        });

        function removeOverlay(){
            let f = document.getElementsByClassName("delete-element");
            while (f.length > 0){
                f[0].remove();
            }
        }
        function show(div){
            let buttons = document.getElementById("buttons").children;
            for(let i = 0; i < buttons.length; i++){
                document.getElementById(buttons[i].innerHTML).classList.add("hide");
            }
            document.getElementById(div).classList.remove("hide");
        }

    </script>
<?php include '../elements/footer.php'; ?>