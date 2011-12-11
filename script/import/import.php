<?php

$import = simplexml_load_file('kjv_revised.xml');

foreach($import->book as $book):

    $n = 1;

    if(!mkdir('kjv/' . $book['name'])) die('dir fail');

    foreach($book->chapter as $chap):
    $filename = 'kjv/' . $book['name'] . '/' . $n . '.xml';

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