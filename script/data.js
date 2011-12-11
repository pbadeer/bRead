Bread.Data = new Object();
var Data = Bread.Data;


// Create empty object for data storage
Data.content = {};


// Send data to server
Data.send = function(data)
{
    $.ajax({
        url: 'script/server/ajax.php',
        type: 'GET',
        data: this.content
    });
}