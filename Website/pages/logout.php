<?php 
session_start();
setSessionValue("user", '');
header('location: http://datahunt.duckdns.org');
?>