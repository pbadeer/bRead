function bible($scope, $http) {
    $scope.chapter = 1;
    $scope.bookId = 1;
    $scope.translation = 'NASB';

    $scope.title = function(){
        return Book[$scope.bookId].name + ' ' + $scope.chapter;
    }

    $scope.next = function() {
        $scope.chapter++;
    }

    $scope.previous = function() {
        $scope.chapter--;
    }

    // convert to $resource (http://docs.angularjs.org/api/ngResource.$resource)
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