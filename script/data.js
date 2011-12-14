Bread.Data = new Object();
var Data = Bread.Data;


// Create empty object for data storage
Data.content = {};


// Send data
Data.send = function()
{
  $.get('script/server/ajax.php', $('#form').serialize());
}


// Get data
Data.get = function()
{
    $.get('script/server/ajax.php', {
        action: 'get',
        type: 'note',
        book_id: Current.book,
        chapter: Current.chap
    }, function(data){
        return data;
    });
}