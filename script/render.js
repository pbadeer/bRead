Bread.Render = new Object();
var Render = Bread.Render;


// Renders column content
Render.content = function(book, n)
{
  // Set current book
  if(!book) book = Current.book;
  else Current.book = book;

  // Set current chapter
  if(!n) n = Current.chap;
  else Current.chap = n * 1;

  // Loop through (and fill) columns
  for(i = 1; i <= 2; i++){
    // Column type: BIBLE
    if(types[Current.type[i]] == 'bible')
    {
      xml = Data.file('data/' + Current.tran[i] + '/' + book + '/' + n + '.xml', 'xml');
      xsl = Data.file('script/template/bible.xsl', 'xml');
      xslt = new XSLTProcessor();
      xslt.importStylesheet(xsl);
      html = xslt.transformToFragment(xml,document);

      this.content.clear(i);
    }

    // Column type: NOTES
    if(types[Current.type[i]] == 'notes')
    {
      html = Data.file('script/template/form.html', 'html');
      this.content.clear(i);
    }

    $(Current.output[i]).append(html);
  }

  // Run after-load stuff
  this.after();
}


// Empties main column
Render.content.clear = function(col)
{
  $(Current.output[col]).html('');
}


// Render USER content
Render.userContent = function(data)
{
  if(!data) 
    Data.get();
  else
  {
    xml = $.parseXML(data);
    xsl = Data.file('script/template/usercontent.xsl', 'xml');
    xslt = new XSLTProcessor();
    xslt.importStylesheet(xsl);
    html = xslt.transformToFragment(xml,document);
    $(Current.output[2]).append(html);
  }

}


// Things to run after content-load
Render.after = function()
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
    stop: Render.form
  });

  this.userContent();
}


// Render/load previous chapter
Render.previousChapter = function()
{
  if(Current.chap > 1)
    this.content(Current.book, Current.chap - 1);
  else if(Current.chap == 1 && Current.book != 1)
    this.content(Current.book - 1, Book[Current.book - 1].chapters);
}


// Render/load next chapter
Render.nextChapter = function()
{
  if(Current.chap < Book[Current.book].chapters)
    this.content(Current.book, Current.chap + 1);
  else if(Current.chap == Book[Current.book].chapters && Current.book != 66)
    this.content(Current.book + 1, 1);
}


// Populate the input form with the selected passage info
Render.form = function()
{
  // Get start and end of selection
  start = $('.ui-selected:first');
  end = $('.ui-selected:last');

  // Create and fill Data.content with reference info
  Data.content = {
    start_book_id: start.parent('.chapter').attr('book-id') * 1,
    end_book_id: end.parent('.chapter').attr('book-id') * 1,
    start_chapter: start.parent('.chapter').attr('chapter') * 1,
    end_chapter: end.parent('.chapter').attr('chapter') * 1,
    start_verse: start.attr('verse') * 1,
    end_verse: end.attr('verse') * 1,
    translation: start.parent('.chapter').attr('translation')
  }

  // Populate form with Data.content info
  $('#form input, #form textarea').each(function(){
    var data = Data.content[$(this).attr('name')];
    if(data && data != null)
      $(this).val(data);
  });
}