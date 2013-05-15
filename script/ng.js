angular.module('bread', ['ngResource']);

function bible($scope, $http, $resource) {
    $scope.chapter = 1;
    $scope.bookId = 40;
    $scope.translation = 'NASB';
    $scope.passage;
    $scope.userContent;

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

    function createUserContent() {

    }

    function deleteUserContent() {

    }
}