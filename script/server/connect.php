<?php
$host = 'localhost';
$username = 'root';
$password = '';
$database = 'bread';

try
{
    $db = new PDO('mysql:dbname='.$database.';host='.$host, $username, $password);
}
catch(PDOException $e)
{
    echo $e->getMessage();
}
?>