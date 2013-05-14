function bible($scope, $http) {
    $scope.chapter = 1;
    $scope.bookId = 1;
    $scope.translation = 'NASB';

    update();

    $scope.title = function(){
        return Book[$scope.bookId].name + ' ' + $scope.chapter;
    }

    $scope.next = function() {
        books = Object.keys(Book).length;
        if($scope.chapter < Book[$scope.bookId].chapters)
            $scope.chapter++;
        else if($scope.chapter == Book[$scope.bookId].chapters && $scope.bookId != books) {
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
        });
    }
}