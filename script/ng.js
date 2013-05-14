function bible($scope, $http) {
    $scope.chapter = 1;
    $scope.bookId = 1;
    $scope.translation = 'NASB';

    update();

    $scope.title = function(){
        return Book[$scope.bookId].name + ' ' + $scope.chapter;
    }

    $scope.next = function() {
        if($scope.chapter < Book[$scope.bookId].chapters)
            $scope.chapter++;
        else if($scope.chapter == Book[$scope.bookId].chapters && $scope.bookId != 66) {// doesn't account for diff book amounts
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
            transformResponse: function(data) {
                var json = x2js.xml_str2json(data);
                return json;
            }
        }).success(function(data, status){
            $scope.passage = data;
        });
    }
}