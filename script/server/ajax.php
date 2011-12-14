<?php

require_once('connect.php');

if($_GET['action'] == 'new')
{
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
}

if($_GET['action'] == 'get')
{
    $reference_id = '';

    // Get reference ids
    try
    {
        $sql = file_get_contents('select_reference.sql');
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':book_id', $_GET['book_id']);
        $stmt->bindParam(':chapter', $_GET['chapter']);
        $stmt->execute();
        $id = $stmt->fetchAll();

        foreach($id as $row)
        {
            $reference_id .= $row['reference_id'].',';
        }

        $reference_id = '('.substr($reference_id, 0, -1).')';
    }
    catch(PDOException $e)
    {
        echo $e->getMessage();
    }

    // Get notes
    try
    {
        $sql = "SELECT * FROM content WHERE reference_id IN $reference_id";
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $content = $stmt->fetchAll();

        echo json_encode($content);
    }
    catch(PDOException $e)
    {
        echo $e->getMessage();
    }
}

$db = null;

?>