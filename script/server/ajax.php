<?php

require_once('database.php');


// INSERT new user content
if($_GET['action'] == 'new')
{
    // SEARCH FOR REFERENCE (auto insert if none exists)
    $reference = $database->referenceSelect();

    $_GET['privacy'] = 'public';
    $_GET['reference'] = $reference[0];

    if(!empty($_GET['content_note']))
    {
        $database->contentInsert('note');
    }

    if(!empty($_GET['content_tag']))
    {
        $tags = explode(',', $_GET['content_tag']);

        foreach($tags as $tag)
        {
            $_GET['content_tag'] = trim($tag);

            $database->contentInsert('tag');
        }
    }
}


// GET user content
if($_GET['action'] == 'get')
{
    $database->contentSelect();
}

?>