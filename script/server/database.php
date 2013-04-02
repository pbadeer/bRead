<?php

require_once('connect.php');

class Database
{
    public function referenceInsert(){
        global $db;

        try
        {
            $sql = file_get_contents('insert_reference.sql');
            $stmt = $db->prepare($sql);

            $stmt->bindParam(':start_book_id', $_GET['start_book_id']);
            $stmt->bindParam(':start_chapter', $_GET['start_chapter']);
            $stmt->bindParam(':start_verse', $_GET['start_verse']);
            $stmt->bindParam(':start_index', $_GET['start_index']);
            $stmt->bindParam(':end_book_id', $_GET['end_book_id']);
            $stmt->bindParam(':end_chapter', $_GET['end_chapter']);
            $stmt->bindParam(':end_verse', $_GET['end_verse']);
            $stmt->bindParam(':end_index', $_GET['end_index']);

            return $stmt->execute();
        }
        catch(PDOException $e)
        {
            echo $e->getMessage();
        }

        $db = null;
    }

    public function referenceSelect(){
        global $db;

        try
        {
            $sql = file_get_contents('select_reference.sql');
            $stmt = $db->prepare($sql);

            $stmt->bindParam(':start_book_id', $_GET['start_book_id']);
            $stmt->bindParam(':start_chapter', $_GET['start_chapter']);
            $stmt->bindParam(':start_verse', $_GET['start_verse']);
            $stmt->bindParam(':start_index', $_GET['start_index']);
            $stmt->bindParam(':end_book_id', $_GET['end_book_id']);
            $stmt->bindParam(':end_chapter', $_GET['end_chapter']);
            $stmt->bindParam(':end_verse', $_GET['end_verse']);
            $stmt->bindParam(':end_index', $_GET['end_index']);

            $stmt->execute();

            $result = $stmt->fetch();

            // If no reference exists, make it, then run this function again
            if(empty($result))
            {
                if($this->referenceInsert())
                {
                    $result = $this->referenceSelect();
                }
            }
            
            return $result;

        }
        catch(PDOException $e)
        {
            echo $e->getMessage();
        }

        $db = null;
    }

    public function contentInsert($type)
    {
        global $db;

        try
        {
            $sql = file_get_contents('insert_content.sql');
            $stmt = $db->prepare($sql);

            $stmt->bindParam(':type', $type);
            $stmt->bindParam(':privacy', $_GET['privacy']);
            $stmt->bindParam(':reference', $_GET['reference']);
            $stmt->bindParam(':translation', $_GET['translation']);

            if($type == 'note')
                $stmt->bindParam(':content', $_GET['content_note']);
            else if($type == 'tag')
                $stmt->bindParam(':content', $_GET['content_tag']);
            else
                $stmt->bindParam(':content', $_GET['content']);

            $stmt->execute();

            return $stmt->fetch();
        }
        catch(PDOException $e)
        {
            echo $e->getMessage();
        }

        $db = null;
    }

    public function contentSelect()
    {
        global $db;

        try
        {
            $sql = file_get_contents('select.sql');
            $stmt = $db->prepare($sql);
            $stmt->bindParam(':book_id', $_GET['book_id']);
            $stmt->bindParam(':chapter', $_GET['chapter']);
            $stmt->execute();
            $content = $stmt->fetchAll();

            if(!empty($content))
            {
                $currentReference = 'start';
                echo '<?xml version="1.0" encoding="UTF-8"?>';
                echo '<payload>';

                foreach($content as $row)
                {
                    if($currentReference != $row['content_reference_id'])
                    {
                        if($currentReference != 'start') echo '</passage>';
                        
                        $currentReference = $row['content_reference_id'];

                        echo '<passage id="' . $row['content_id'] . '">',
                            '<reference id="' . $row['content_reference_id'] . '">',
                                '<startBookId>'  . $row['start_book_id'] . '</startBookId>',
                                '<endBookId>'    . $row['end_book_id']   . '</endBookId>',
                                '<startChapter>' . $row['start_chapter'] . '</startChapter>',
                                '<endChapter>'   . $row['end_chapter']   . '</endChapter>',
                                '<startVerse>'   . $row['start_verse']   . '</startVerse>',
                                '<endVerse>'     . $row['end_verse']     . '</endVerse>',
                                '<startIndex>'   . $row['start_index']   . '</startIndex>',
                                '<endIndex>'     . $row['end_index']     . '</endIndex>',
                            '</reference>';
                    }

                    echo '<' . $row['content_type'] . '>',
                        '<content>' . $row['content' ]. '</content>',
                    '</' . $row['content_type'] . '>';
                }

                echo '</passage></payload>';
            }

        }
        catch(PDOException $e)
        {
            echo $e->getMessage();
        }

        $db = null;
    }
}

$database = new Database;

?>