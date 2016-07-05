angular.module('recommender.controllers')
.controller('responseListCtrl', function ($scope, req, utils, info, dataService) {
    console.log('inside responsesCtrl');
    var responseStorage = utils.instance({name: '/responses'});
    $scope.responses = [];
    responseStorage.iterate((val, key) => {
        $scope.responses.push(val);
    });

    function putResponse(response) {
        return req.put('/responses/' + response._id, response)
            .then(httpRes => {
                var updatedResponse = httpRes.data;
                return responseStorage.setItem(updatedResponse._id,
                                               updatedResponse);
            });
    }

    function addResponse(contact, response) {
        return req.post('/responses', {
            participant: contact,
            parentTopic: response.parentTopic,
            shareDegree: response.shareDegree,
        });
    }

    $scope.updateResponseText = (response) => {
        info.loading(putResponse(response), {
            successMessage: 'response sent!',
            errorMessage: undefined
        });
    };

    $scope.forwardResponse = (response) => {
    };
});
