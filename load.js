// Empties main column
function clear(col)
{
  $(output[col]).html('');
}

// Opens XML and returns the request
function openXML(path)
{
  req = new XMLHttpRequest();

  req.open('GET', path, false);
  req.send('');

  return req.responseXML;
}

// Main loading function, loads passages
function load(book, n)
{
  if(!book) book = current_book;
  else current_book = book;

  if(!n) n = current_chap;
  else current_chap = n;

  for(i=0; i<=current_cols; i++){
    if(i === 0) continue;

    if(types[current_type[i]] == 'bible')
    {
      xml = openXML('bible/' + current_tran[i] + '/' + book + '/' + n + '.xml');
      xsl = openXML('index.xsl');

      xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsl);
      html = xsltProcessor.transformToFragment(xml,document);

      clear(i);
      $(output[i]).append(html);
    }

    if(types[current_type[i]] == 'notes')
    {
      clear(i);
    }
  }

  afterLoad();
}

// Things to run after content-load (load())
function afterLoad()
{
  // Change current passage title
  $(input).val(current_book + ' ' + current_chap);

  // Verse ref grabber
  $('.verse').click(function(){
    $(input).val( $(this).attr('ref') );
  });
}

// Previous chapter
function prev()
{
  load(current_book, current_chap - 1);
}

// Next chapter
function next()
{
  load(current_book, current_chap + 1);
}

// Initialize!
window.onload = init;