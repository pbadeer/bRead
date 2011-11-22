<?php

foreach(glob('bible/KJV/*/{*.xml}', GLOB_BRACE) as $filename){

    $book = substr($filename, 10);
    $book = strtok($book, "/");

    $file = simplexml_load_file($filename);

    $file['book'] = $book;

    $xml = $file->asXML();

    $file = fopen( $filename, 'w' );
    fwrite( $file, $xml );
    fclose( $file );
}

?>
