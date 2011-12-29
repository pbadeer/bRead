<?php

$host = 'localhost';
$username = 'root';
$password = '';
$database = 'bread';

try
{
    global $db;
    $db = new PDO('mysql:dbname='.$database.';host='.$host, $username, $password);
}
catch(PDOException $e)
{
    echo $e->getMessage();
}

?>