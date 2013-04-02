<?php

require_once('database.php');


// GET user content
if($_GET['action'] == 'get')
{
    $database->contentSelect();
}


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


// DELETE user content
if($_GET['action'] == 'delete')
{
    // delete content
    // check if reference is being used
    // delete reference if obsolete
    echo 'deleted '.$_GET['type'].' with id '.$_GET['id'];
}

?>