var output = 'me'; // The ID of the HTML element where the scripture html is dumped.


function openXML(path)
{
  xhttp = new XMLHttpRequest();

  xhttp.open('GET', path, false);
  xhttp.send('');

  return xhttp.responseXML;
}

function getHTML(file)
{
  xml = openXML(file);
  xsl = openXML('index.xsl');

  xsltProcessor = new XSLTProcessor();
  xsltProcessor.importStylesheet(xsl);
  
  html = xsltProcessor.transformToFragment(xml,document);

  return html;
}

function loadBook(book)
{
  document.getElementById(output).appendChild( getHTML( book + '.xml') );
}

function load()
{
  loadBook('1jo');
}