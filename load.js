var output = 'me'; // The ID of the HTML element where the scripture html is dumped.
var current_book = '1JN';
var current_chap = 1;

function openXML(path)
{
  req = new XMLHttpRequest();

  req.open('GET', path, false);
  req.send('');

  return req.responseXML;
}

function getHTML(book, n)
{
  if(!n) n = 1;

  xml = openXML('bible/kjv/' + book + '/' + n + '.xml');
  xsl = openXML('chapter.xsl');

  xsltProcessor = new XSLTProcessor();
  xsltProcessor.importStylesheet(xsl);
  
  html = xsltProcessor.transformToFragment(xml,document);

  return html;
}

function loadBook(book)
{
  document.getElementById(output).appendChild( getHTML( book ) );
}

function loadChapter(n)
{
  document.getElementById(output).appendChild( getHTML( current_book, n ) );
}

function loadRef()
{
  var ref = document.getElementById('ref').value;
  loadBook(ref);
}

function prev()
{
  current_chap--;
  loadChapter(current_chap);
}

function next()
{
  current_chap++;
  loadChapter(current_chap);
}