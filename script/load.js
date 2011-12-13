Bread.Load = new Object();
var Load = Bread.Load;


// Empties main column
Load.clear = function(col)
{
  $(Current.output[col]).html('');
}


// Opens/loads various filetypes
Load.file = function(path, ext)
{
  // HTML (return)
  if(ext == 'html')
  {
    return $.ajax({
      url: path,
      async: false,
      dataType: 'html'
    }).responseText;
  }

  // XML (return)
  if(ext == 'xml')
  {
    return $.ajax({
      url: path,
      async: false,
      dataType: 'xml'
    }).responseXML;
  }

  // JS (load)
  if(ext == 'js')
  {  
    var tag = document.createElement('script');
    tag.setAttribute('type','text/javascript');
    tag.setAttribute('src', path);
    if( $('head').append(tag) ) return true;
    else return false;
  }
  
  // CSS (load)
  if(ext == 'css')
  {
    var tag = document.createElement('link');
    tag.setAttribute('rel', 'stylesheet');
    tag.setAttribute('type', 'text/css');
    tag.setAttribute('href', path);
    if( $('head').append(tag) ) return true;
    else return false;
  }
}


// Loads columns and fills with column-type-specified content
Load.cols = function(book, n)
{
  // Set current book
  if(!book) book = Current.book;
  else Current.book = book;

  // Set current chapter
  if(!n) n = Current.chap;
  else Current.chap = n * 1;

  // Loop through (and fill) columns
  for(i = 1; i <= Current.cols; i++){
    // Column type: BIBLE
    if(types[Current.type[i]] == 'bible')
    {
      xml = this.file('data/' + Current.tran[i] + '/' + book + '/' + n + '.xml', 'xml');
      xsl = this.file('script/template/bible.xsl', 'xml');
      xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsl);
      html = xsltProcessor.transformToFragment(xml,document);

      this.clear(i);
    }

    // Column type: NOTES
    if(types[Current.type[i]] == 'notes')
    {
      html = this.file('script/template/form.html', 'html');

      this.clear(i);
    }

    $(Current.output[i]).append(html);
  }

  // Run after-load stuff
  this.after();
}


// Things to run after content-load (Bread.Load.cols())
Load.after = function()
{
  // Fills input with current book and chapter
  $(Current.input.book).text(Book[Current.book].name);
  $(Current.input.chap).val(Current.chap);

  // Verse ref grabber
  $('.verse').click(function(){
    $(Current.input.chap).val( Current.chap + ':' + $(this).attr('verse') );
  });

  // Make verses selectable
  $('.chapter').selectable({
    filter: '.verse',
    autoRefresh: false,
    stop: Auto.form
  });
}


// Load previous chapter
Load.prev = function()
{
  if(Current.chap > 1)
    this.cols(Current.book, Current.chap - 1);
  else if(Current.chap == 1 && Current.book != 1)
    this.cols(Current.book - 1, Book[Current.book - 1].chapters);
}


// Load next chapter
Load.next = function()
{
  if(Current.chap < Book[Current.book].chapters)
    this.cols(Current.book, Current.chap + 1);
  else if(Current.chap == Book[Current.book].chapters)
    this.cols(Current.book + 1, 1);
}