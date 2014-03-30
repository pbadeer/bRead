"use strict";
CKEDITOR.replace("notes");
angular.module('bread', ['ngResource']);

function bible($scope, $http, $resource) {
    $scope.chapter = 1;
    $scope.bookId = 40;
    $scope.translation = 'NASB';
    $scope.passage = "";
    $scope.userContent = "";
    $scope.select = "";
    $scope.privacy = "public";
    $scope.bookName = function(abbr, id) {
        if(isNaN(id))
            id = $scope.bookId;
        var name = Book[id].name;
        if(abbr)
            return name.substr(0,4) + ".";
        else
            return name;
    }
    $scope.notes = "";
    $scope.tags = "";

    update();

    $scope.togglePrivacy = function() {
        $scope.privacy = $scope.privacy === "public" ? "private" : "public";
    }

    $scope.title = function() {
        return $scope.bookName() + ' ' + $scope.chapter;
    };

    $scope.reference = function(ref) {
        if (ref.startBookId === ref.endBookId && ref.startChapter === ref.endChapter && ref.startVerse === ref.endVerse)
            return $scope.bookName(true) + " " + ref.startChapter + ":" + ref.startVerse;
        else if (ref.startBookId === ref.endBookId && ref.startChapter === ref.endChapter)
            return $scope.bookName(true) + " " + ref.startChapter + ":" + ref.startVerse + "-" + ref.endVerse;
        else if (ref.startBookId === ref.endBookId)
            return $scope.bookName(true) + " " + ref.startChapter + ":" + ref.startVerse + "-" + ref.endChapter + ":" + ref.endVerse;
        else
            return $scope.bookName(true) + " " + ref.startChapter + ":" + ref.startVerse + " - " + $scope.bookName(true,$scope.select.endBookId) + " " + ref.endChapter + ":" + ref.endVerse;
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
    };

    $scope.previous = function() {
        if($scope.chapter > 1)
            $scope.chapter--;
        else if($scope.chapter == 1 && $scope.bookId != 1) {
            $scope.bookId--;
            $scope.chapter = Book[$scope.bookId].chapters;
        }
        update();
    };

    function update() {
        $http({
            method: 'GET',
            url: 'data/' + $scope.translation + '/' + $scope.bookId + '/' + $scope.chapter + '.xml',
            transformResponse: function(xml) {
                return x2js.xml_str2json(xml);
            }
        }).success(function(data){
            $scope.passage = data;
            $scope.userContent = UC.get({book_id: $scope.bookId, chapter: $scope.chapter});
        });
    }

    var UC = $resource('script/server/ajax.php?action=get&book_id=:book_id&chapter=:chapter');
    
    $scope.highlight = function()
    {
        var start = selectedNode('s');
        var end = selectedNode('e');
        var r = selectionRange();

        var sb = start.parentNode.getAttribute("book-id") * 1,
            sc = start.parentNode.getAttribute("chapter") * 1,
            sv = start.getAttribute("verse") * 1,
            si = r.startOffset * 1 - 29; // Index is +29 off due to verse number element

        var eb = end.parentNode.getAttribute("book-id") * 1,
            ec = end.parentNode.getAttribute("chapter") * 1,
            ev = end.getAttribute("verse") * 1,
            ei = r.endOffset * 1 - 29;

        $scope.select = {
            startBookId: sb,
            endBookId: eb,
            startChapter: sc,
            endChapter: ec,
            startVerse: sv,
            endVerse: ev,
            startIndex: si,
            endIndex: ei
        };
    };

    function selectedNode(pos) {
        var node, selection;
        if (window.getSelection) {
            selection = getSelection();
            if (pos == 's') node = selection.anchorNode;
            if (pos == 'e') node = selection.focusNode;
        }
        if (!node && document.selection) {
            selection = document.selection;
            var range = selection.getRangeAt ? selection.getRangeAt(0) : selection.createRange();
            node = range.commonAncestorContainer ? range.commonAncestorContainer : range.parentElement ? range.parentElement() : range.item(0);
        }
        if (node) {
            return (node.nodeName == "#text" ? node.parentNode : node);
        }
        else
            return null;
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