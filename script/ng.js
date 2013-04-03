var book = 'test',
    chapter = 1,
    bookId = 1,
    translation = 'NASB';

function bible($scope, $http) {
    $http({
        method: 'GET',
        url: 'data/' + translation + '/' + bookId + '/' + chapter + '.xml',
        transformResponse: function(data) {
            var json = x2js.xml_str2json(data);
            return json;
        }
    }).success(function(data, status){
        $scope.passage = data;
        console.log(data)
    });
}