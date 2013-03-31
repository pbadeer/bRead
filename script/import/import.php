<?php

$version = $_GET['v'];

$import = simplexml_load_file('translations/' . $version . '.xml');

if (!is_dir($version)):
    mkdir($version);
endif;

$bn = 1;
foreach($import->book as $book):
    $n = 1;

    if(!is_dir($version . '/' . $bn)):
        mkdir($version . '/' . $bn);
    endif;

    foreach($book->chapter as $chap):
        $chap->addAttribute('translation', $book['translation']);
        $chap->addAttribute('testament', $book['testament']);
        $chap->addAttribute('book', $book['name']);
        $chap->addAttribute('book-id', $bn);
        $chap->addAttribute('n', $n);

        $xml = $chap->asXML();

        $filename = $version . '/' . $bn . '/' . $n . '.xml';
        $file = fopen( $filename, 'w' );
        fwrite( $file, $xml );
        fclose( $file );

        $n++;
    endforeach;

    $bn++;
endforeach;

?>