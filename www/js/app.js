// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ebApp', ['ionic', 'angular-growl', 'ebApp.services', 'ebApp.controllers'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

        $stateProvider

            .state(
            'sendOrder', {
                url: '/sendOrder',
                templateUrl: 'templates/send-order.html',
                controller: 'SendOrderCtrl'
            })
            .state(
            'chooseLocation', {
                url: '/chooseLocation',
                templateUrl: 'templates/choose-location.html',
                controller: 'ChooseLocationCtrl'
            })
            .state(
            'pickTime', {
                url: '/pickTime',
                templateUrl: 'templates/pick-time.html',
                controller: 'PickTimeCtrl'
            })
            .state(
            'confirmOrder', {
                url: '/confirmOrder',
                templateUrl: 'templates/confirm-order.html',
                controller: 'ConfirmOrderCtrl'
            })
            .state(
            'payOrder', {
                url: '/payOrder',
                templateUrl: 'templates/pay-order.html',
                controller: 'PayOrderCtrl'
            })
            .state(
            'myOrder', {
                url: '/myOrder',
                cache: false,
                templateUrl: 'templates/my-order.html',
                controller: 'MyOrderCtrl'
            })
            .state(
            'orderDetail', {
                url: '/orderDetail/:orderId',
                cache: false,
                templateUrl: 'templates/order-detail.html',
                controller: 'OrderDetailCtrl'
            })
            .state(
            'menuDetail', {
                url: '/menuDetail/:menuId',
                templateUrl: 'templates/menu-detail.html',
                controller: 'MenuDetailCtrl'
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/sendOrder');


        $ionicConfigProvider.views.maxCache(20);
        $ionicConfigProvider.views.forwardCache(true);
        $ionicConfigProvider.navBar.alignTitle('center');
        $ionicConfigProvider.templates.maxPrefetch(0);

        //$ionicConfigProvider.tabs.style('ios'); //even if you're on android
        //$ionicConfigProvider.tabs.position('ios'); //even if you're on android

    });

