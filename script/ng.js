angular.module('bread', ['ngResource']);

function bible($scope, $http, $resource) {
    $scope.chapter = 1;
    $scope.bookId = 1;
    $scope.translation = 'NASB';
    $scope.passage;
    $scope.userContent;

    update();

    $scope.title = function(){
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

    function update(){
        $http({
            method: 'GET',
            url: 'data/' + $scope.translation + '/' + $scope.bookId + '/' + $scope.chapter + '.xml',
            transformResponse: function(xml) {
                var json = x2js.xml_str2json(xml);
                return json;
            }
        }).success(function(data){
            $scope.passage = data;
            $scope.userContent = UserContent.GetContent({book_id: $scope.bookId, chapter: $scope.chapter});
        });
    }

    // http://stackoverflow.com/questions/13269882/angularjs-resource-restful-example
    // testing requires data in db
    var UserContent = $resource('script/server/ajax.php',
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
                }
            },
            CreateContent: {
                method: "GET",
                params: {
                    action: 'new',
                    privacy: '', //get types from db
                    content_note: '', //text
                    content_tag: '', //comma separated array
                    start_book_id: '', //get all the rest of these from Data.form
                    start_chapter: '',
                    start_verse: '',
                    start_index: '',
                    end_book_id: '',
                    end_chapter: '',
                    end_verse: '',
                    end_index: ''
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

}