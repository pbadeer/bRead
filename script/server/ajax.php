<?php

require_once('connect.php');

if($_GET['type'] == 'note'):
    try
    {
        $db->exec("INSERT INTO content");

        $db = null;
    }
    catch(PDOException $e)
    {
        echo $e->getMessage();
    }
endif;
?>