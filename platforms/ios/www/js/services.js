angular.module('ebApp.services', [])
    .factory('CommonService', function () {
        var service = {
            baseUrl: 'http://localhost:3000/',
            buildUrl: function (subUrl) {
                return this.baseUrl + subUrl;
            }
        };
        return service;
    })
    .factory('ShareState', function () {
        return {
            orders: null,
            total: 0,
            location: null,
            pickTime: null
        }
    })
    .factory('LocationService', function ($q, $http, $timeout, CommonService) {
        return {
            all: function () {
                return $http.get(CommonService.buildUrl('location'));
            }
        }
    })
    .factory('MenuService', function ($q, $http, $timeout, CommonService) {
        return {
            all: function () {
                return $http.get(CommonService.buildUrl('menus'));
            },
            detail: function (menuId) {
                return $http.get(CommonService.buildUrl('menu/' + menuId));
            }
        };
    })
    .factory('PickTimeService', function ($q, $http, $timeout, CommonService) {
        return {
            all: function () {
                return $http.get(CommonService.buildUrl('pickTime'));
            }
        };
    })
    .factory('OrderService', function ($q, $http, $timeout, CommonService) {
        return {
            all: function () {
                return $http.get(CommonService.buildUrl('orders'));
            },
            detail: function (orderId) {
                return $http.get(CommonService.buildUrl('detail/' + orderId));
            }
        };
    });