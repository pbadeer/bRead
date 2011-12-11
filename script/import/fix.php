<?php
// Place this file in the parent directory of the translation directories

// Set translation (case sensitive)
$translation = 'KJV';

// Loop through each chapter file
foreach(glob($translation . '/*/{*.xml}', GLOB_BRACE) as $filename){

    // Cut beginning of path out (the "bible/" or "bible/KJV/")
    $book = substr($filename, 4);

    // Cut out the end slash
    $book = strtok($book, "/");

    // Count the chapters of the current book folder
    #$chapters = count(glob($translation . '/' . $book . '/*.xml'));
    
    // Load the current chapter file in simplexml
    $file = simplexml_load_file($filename);

    // Set the book and chapters of the open file
    $file['book'] = $book;
    #$file['chapters'] = $chapters;

    // Save the changes as xml
    $xml = $file->asXML();

    // Open the actual file, write the new xml to it, and close it
    $file = fopen( $filename, 'w' );
    fwrite( $file, $xml );
    fclose( $file );
}

?>
