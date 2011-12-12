<?php

require_once('connect.php');

try
{
    $sql = file_get_contents('insert.sql');
    $stmt = $db->prepare($sql);

    $stmt->bindParam(':start_book_id', $_GET['start_book_id']);
    $stmt->bindParam(':start_chapter', $_GET['start_chapter']);
    $stmt->bindParam(':start_verse', $_GET['start_verse']);

    $stmt->bindParam(':end_book_id', $_GET['end_book_id']);
    $stmt->bindParam(':end_chapter', $_GET['end_chapter']);
    $stmt->bindParam(':end_verse', $_GET['end_verse']);

    $stmt->bindParam(':translation', $_GET['translation']);
    $stmt->bindParam(':type', $_GET['type']);
    $stmt->bindParam(':privacy', $_GET['privacy']);
    $stmt->bindParam(':content', $_GET['content']);

    $stmt->execute();
}
catch(PDOException $e)
{
    echo $e->getMessage();
}

$db = null;

?>