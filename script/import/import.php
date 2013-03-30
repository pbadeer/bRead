<?php

$version = $_GET['v'];

$import = simplexml_load_file($version . '.xml');

if (!is_dir($version))
    mkdir($version);

foreach($import->book as $book):

    $n = 1;

    if(!mkdir($version . '/' . $book['name'])) die('dir fail');

    foreach($book->chapter as $chap):
    $filename = $version . '/' . $book['name'] . '/' . $n . '.xml';

    $chap->addAttribute('translation', $book['translation']);
    $chap->addAttribute('testament', $book['testament']);
    $chap->addAttribute('book', $book['name']);
    $chap->addAttribute('n', $n);

    $xml = $chap->asXML();

    $file = fopen( $filename, 'w' );
    fwrite( $file, $xml );
    fclose( $file );

    $n++;
    endforeach;

endforeach;

?>