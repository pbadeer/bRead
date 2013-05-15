angular.module('bread', ['ngResource']);
var uc;

function bible($scope, $http, $resource) {
    $scope.chapter = 1;
    $scope.bookId = 40;
    $scope.translation = 'NASB';
    $scope.passage;
    $scope.userContent;
    $scope.selection;

    update();
    userContent();

    $scope.title = function() {
        return Book[$scope.bookId].name + ' ' + $scope.chapter;
    }

    $scope.next = function() {
        var chapters = Book[$scope.bookId].chapters,
            books = Object.keys(Book).length;
        if($scope.chapter < chapters)
            $scope.chapter++;
        else if($scope.chapter == chapters && $scope.bookId != books) {
            $scope.bookId++;
            $scope.chapter = 1;
        }
        update();
        userContent();
    }

    $scope.previous = function() {
        if($scope.chapter > 1)
            $scope.chapter--;
        else if($scope.chapter == 1 && $scope.bookId != 1) {
            $scope.bookId--;
            $scope.chapter = Book[$scope.bookId].chapters;
        }
        update();
        userContent();
    }

    function update() {
        $http({
            method: 'GET',
            url: 'data/' + $scope.translation + '/' + $scope.bookId + '/' + $scope.chapter + '.xml',
            transformResponse: function(xml) {
                var json = x2js.xml_str2json(xml);
                return json;
            }
        }).success(function(data){
            $scope.passage = data;
        });
    }

    function userContent() {
        $http({
            method: 'GET',
            url: 'script/server/ajax.php?action=get&book_id=' + $scope.bookId + '&chapter=' + $scope.chapter,
            transformResponse: function(xml) {
                var json = x2js.xml_str2json(xml);
                return json;
            }
        }).success(function(data){
            $scope.userContent = data;
        });
    }

    var uc = $resource('script/server/ajax.php',
        {
            action: '@action'
        },
        {
            GetContent: {
                method: "GET",
                params: {
                    action: 'get',
                    book_id: $scope.bookId,
                    chapter: $scope.chapter
                }
            },
            CreateContent: {
                method: "GET",
                params: {
                    action: 'new',
                    privacy: $scope.selection.privacy,
                    content_note: '', //text
                    content_tag: '', //comma separated array
                    start_book_id: $scope.selection.start_book_id,
                    start_chapter: $scope.selection.start_chapter,
                    start_verse: $scope.selection.start_verse,
                    start_index: $scope.selection.start_index,
                    end_book_id: $scope.selection.end_book_id,
                    end_chapter: $scope.selection.end_chapter,
                    end_verse: $scope.selection.end_verse,
                    end_index: $scope.selection.end_index,

                }
            },
            DeleteContent: {
                method: "GET",
                params: {
                    action: 'delete',
                    id: '',
                    type: ''
                }
            }
        });

/*
    // Populate the input form with the selected passage info
    function form()
    {
      // Get Start Node
      var sn = selectedNode('s');
      // Get End Node
      var en = selectedNode('e');
      // Get range
      var r = selectionRange();

      var t = $(sn).parent().attr("translation"),
          sb = $(sn).parent().attr("book-id") * 1,
          sc = $(sn).parent().attr("chapter") * 1,
          sv = $(sn).attr("verse") * 1,
          si = r.startOffset * 1;

      var eb = $(en).parent().attr("book-id") * 1,
          ec = $(en).parent().attr("chapter") * 1,
          ev = $(en).attr("verse") * 1,
          ei = r.endOffset * 1;

      // Create and fill Data.content with reference info
      $scope.selection = {
        start_book_id: sb,
        end_book_id: eb,
        start_chapter: sc,
        end_chapter: ec,
        start_verse: sv,
        end_verse: ev,
        start_index: si,
        end_index: ei, 
        translation: t,
        privacy: // from ???
      }

      // Populate form with Data.content info
      $('#form input, #form textarea').each(function(){
        var data = $scope.selection[$(this).attr('name')];
        if(data && data != null)
          $(this).val(data);
      });
    }


    // Get (start or end) node from selection
    function selectedNode(pos) {
        var node, selection;
        if (window.getSelection) {
            selection = getSelection();
            if (pos == 's') node = selection.anchorNode;
            if (pos == 'e') node = selection.focusNode;
        }
        if (!node && document.selection) {
            selection = document.selection
            var range = selection.getRangeAt ? selection.getRangeAt(0) : selection.createRange();
            node = range.commonAncestorContainer ? range.commonAncestorContainer : range.parentElement ? range.parentElement() : range.item(0);
        }
        if (node) {
            return (node.nodeName == "#text" ? node.parentNode : node);
        }
    }


    // Get selection range
    function selectionRange() {
        var sel;
        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.rangeCount) {
                return sel.getRangeAt(0);
            }
        } else if (document.selection) {
            return document.selection.createRange();
        }
        return null;
    }*/
}