<?php
include '../elements/header.php' ;

if(!$userinfo["role_id"]){
    echo "<script>location = \"http://datahunt.duckdns.org\";</script>";
}

?>
    <div id="container">
        <h1>Admin Panel</h1>

        <div>
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
                    <td>{$user["role_id"]}</td></tr>";
                }


                ?>
            </table>
        </div>

    </div>

<?php include '../elements/footer.php'; ?>