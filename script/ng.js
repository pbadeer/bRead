angular.module('bread', ['ngResource']);

function bible($scope, $http, $resource) {
    $scope.chapter = 1;
    $scope.bookId = 40;
    $scope.translation = 'NASB';
    $scope.passage;
    $scope.userContent;
    $scope.select = {};
    $scope.privacy = "public";
    $scope.bookName = Book[$scope.bookId].name;

    update();

    $scope.title = function() {
        return $scope.bookName + ' ' + $scope.chapter;
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
    }

    $scope.previous = function() {
        if($scope.chapter > 1)
            $scope.chapter--;
        else if($scope.chapter == 1 && $scope.bookId != 1) {
            $scope.bookId--;
            $scope.chapter = Book[$scope.bookId].chapters;
        }
        update();
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
            $scope.userContent = $scope.uc.GetContent({book_id: $scope.bookId, chapter: $scope.chapter});
        });
    }

    $scope.uc = $resource('script/server/ajax.php',
        {
            action: '@action'
        },
        {
            GetContent: {
                method: "GET",
                params: {
                    action: 'get',
                    book_id: '',
                    chapter: ''
                },
                transformResponse: function(xml) {
                    var json = x2js.xml_str2json(xml);
                    return json;
                }
            },
            CreateContent: {
                method: "GET",
                params: {
                    action: 'new',
                    privacy: $scope.privacy,
                    translation: $scope.translation,
                    content_note: $scope.select.note,
                    content_tag: $scope.select.tag, //comma separated array
                    start_book_id: $scope.select.start_book_id,
                    start_chapter: $scope.select.start_chapter,
                    start_verse: $scope.select.start_verse,
                    start_index: $scope.select.start_index,
                    end_book_id: $scope.select.end_book_id,
                    end_chapter: $scope.select.end_chapter,
                    end_verse: $scope.select.end_verse,
                    end_index: $scope.select.end_index,
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

    $scope.highlight = function()
    {
      // Get Start Node
      var sn = selectedNode('s');
      // Get End Node
      var en = selectedNode('e');
      // Get range
      var r = selectionRange();

      var sb = sn.parentNode.getAttribute("book-id") * 1,
          sc = sn.parentNode.getAttribute("chapter") * 1,
          sv = sn.getAttribute("verse") * 1,
          si = r.startOffset * 1;

      var eb = en.parentNode.getAttribute("book-id") * 1,
          ec = en.parentNode.getAttribute("chapter") * 1,
          ev = en.getAttribute("verse") * 1,
          ei = r.endOffset * 1;

      $scope.select = {
        start_book_id: sb,
        end_book_id: eb,
        start_chapter: sc,
        end_chapter: ec,
        start_verse: sv,
        end_verse: ev,
        start_index: si,
        end_index: ei
      }
    }

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
    }
}