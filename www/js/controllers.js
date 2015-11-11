angular.module('ebApp.controllers', ['ebApp.services', 'baiduMap'])
    .controller('SendOrderCtrl', function ($scope, $state, $ionicPopup, $ionicHistory, $ionicSlideBoxDelegate, $ionicScrollDelegate, $ionicViewSwitcher, $ionicLoading, MenuService, ShareState) {
        $ionicHistory.clearHistory();

        $scope.total = 0.00;
        $scope.orders = [];

        var getMenuById = function (menuId) {
            for (var i = 0; i < $scope.singleData.length; i++) {
                var item = $scope.singleData[i];
                if (item.id == menuId) {
                    return item;
                }
            }
            for (var i = 0; i < $scope.packageData.length; i++) {
                var item = $scope.packageData[i];
                if (item.id == menuId) {
                    return item;
                }
            }
        }

        $scope.getTotal = function () {
            $scope.total = 0.00;
            $scope.orders = [];
            for (var i = 0; i < $scope.singleData.length; i++) {
                var item = $scope.singleData[i];
                if (item.selected) {
                    $scope.orders.push(item);
                    $scope.total += item.price * item.count;
                }
            }
            for (var i = 0; i < $scope.packageData.length; i++) {
                var item = $scope.packageData[i];
                if (item.selected) {
                    $scope.orders.push(item);
                    $scope.total += item.price * item.count;
                }
            }
        };

        $scope.addCount = function (menuId) {
            var item = getMenuById(menuId);
            if (item == null)
                return;
            if (item.count < 99) {
                item.count += 1;
                $scope.getTotal();
            }
        };

        $scope.subCount = function (menuId) {
            var item = getMenuById(menuId);
            if (item == null)
                return;

            if (item.count > 1) {
                item.count -= 1;
                $scope.getTotal();
            }

        };

        $scope.activeContent = 'package';
        $scope.setActiveContent = function (activeContent) {
            $scope.activeContent = activeContent;
        };

        $scope.goBack = function () {
            $ionicViewSwitcher.nextDirection('back');
            $ionicHistory.goBack();
        };

        $scope.goOrder = function () {
            $ionicViewSwitcher.nextDirection('forward');
            $state.go("myOrder");
        };

        $scope.goDetail = function (menuId) {
            $ionicViewSwitcher.nextDirection('forward');
            $state.go("menuDetail", {menuId: menuId});
        };

        $scope.goNext = function () {
            if ($scope.total <= 0) {
                $ionicPopup.alert({title: '天天早餐', template: '请选择美味 谢谢～', okText: '确定'});
                return;
            }
            ShareState.orders = $scope.orders;
            ShareState.total = $scope.total;
            $ionicViewSwitcher.nextDirection('forward');
            $state.go("chooseLocation");
        };

        $ionicLoading.show({
            template: '美味加载中...'
        });

        MenuService.all().success(function (data) {
            $ionicLoading.hide();
            if (data.success) {
                $scope.singleData = data.singleData;
                $scope.packageData = data.packageData;
            }
        }).error(function () {
            $ionicLoading.hide();
        });
    })
    .controller('ChooseLocationCtrl', function ($scope, $state, $ionicPopup, $ionicHistory, $ionicSlideBoxDelegate, $ionicScrollDelegate, $ionicViewSwitcher, $ionicLoading, growl, LocationService, ShareState, $timeout) {
        $scope.activeContent = 'map';
        $scope.setActiveContent = function (activeContent) {
            $scope.activeContent = activeContent;
        };

        $scope.goBack = function () {
            $ionicViewSwitcher.nextDirection('back');
            $ionicHistory.goBack();
        };

        $scope.goNext = function () {
            if ($scope.mapOptions.current == null) {
                $ionicPopup.alert({title: '天天早餐', template: '请选择取餐点 谢谢～', okText: '确定'});
                return;
            }
            ShareState.location = $scope.mapOptions.current;
            $ionicViewSwitcher.nextDirection('forward');
            $state.go("pickTime");
        };

        $ionicLoading.show({
            template: '取餐点加载中...'
        });

        $scope.showMap = false;
        $scope.mapOptions = null;
        var topScope = $scope;

        var handler = function (action) {
            var point = action.currentTarget.point;
            for (var i = 0; i < topScope.mapOptions.markers.length; i++) {
                var marker = topScope.mapOptions.markers[i];
                if (marker.latitude == point.lat && marker.longitude == point.lng) {
                    topScope.mapOptions.current = marker;
                    $timeout(function () {
                        topScope.setActiveContent('list');
                        growl.addErrorMessage("取餐点已选定，请确认，点击下一步～", {ttl: 1800});
                    });
                    break;
                }
            }
            ;
        };

        $scope.initMap = function (data) {
            var options = data;
            for (var i = 0; i < options.markers.length; i++) {
                var marker = options.markers[i];
                marker.handler = handler;
                marker.icon = 'img/point.png';
                marker.width = 25;
                marker.height = 30;
            }
            ;
            $scope.mapOptions = data;
            $scope.showMap = true;
        };

        LocationService.all().success(
            function (data) {
                if (data.success) {
                    $scope.initMap(data.data);
                }
                $ionicLoading.hide();
            }).error(function () {
                $ionicLoading.hide();
            });
    })
    .controller('PickTimeCtrl', function ($scope, $state, $ionicPopup, $ionicHistory, $ionicSlideBoxDelegate, $ionicScrollDelegate, $ionicLoading, $ionicViewSwitcher, PickTimeService, ShareState) {
        $scope.goBack = function () {
            $ionicViewSwitcher.nextDirection('back');
            $ionicHistory.goBack();
        };

        $scope.goNext = function () {
            if ($scope.pickTimes == null ||
                $scope.pickTimes.selected == null) {
                $ionicPopup.alert({title: '天天早餐', template: '请选择取餐时间 谢谢～', okText: '确定'});
                return;
            }
            ShareState.pickTime = $scope.pickTimes.selected;
            $ionicViewSwitcher.nextDirection('forward');
            $state.go("confirmOrder");
        };


        $ionicLoading.show({
            template: '取餐时间加载中...'
        });

        PickTimeService.all().success(
            function (data) {
                if (data.success) {
                    $scope.pickTimes = data.data;
                }
                $ionicLoading.hide();
            }).error(function () {
                $ionicLoading.hide();
            });
    })
    .controller('ConfirmOrderCtrl', function ($scope, $state, $ionicPopup, $ionicHistory, $ionicSlideBoxDelegate, $ionicScrollDelegate, $ionicLoading, $ionicViewSwitcher, ShareState) {
        $scope.goBack = function () {
            $ionicViewSwitcher.nextDirection('back');
            $ionicHistory.goBack();
        };

        $scope.goDetail = function (menuId) {
            $ionicViewSwitcher.nextDirection('forward');
            $state.go("menuDetail", {menuId: menuId});
        };

        $scope.goNext = function () {
            $ionicPopup.alert({title: '天天早餐', template: '去支付页面～', okText: '确定'});
        };

        $scope.data = ShareState;
    })
    .controller('MyOrderCtrl', function ($scope, $state, $ionicPopup, $ionicHistory, $ionicSlideBoxDelegate, $ionicScrollDelegate, $ionicLoading, $ionicViewSwitcher, OrderService) {
        $scope.goBack = function () {
            $ionicViewSwitcher.nextDirection('back');
            $state.go("sendOrder");
        };

        $scope.goDetail = function (orderId) {
            $ionicViewSwitcher.nextDirection('forward');
            $state.go("orderDetail", {orderId: orderId});
        };

        $ionicLoading.show({
            template: '订单加载中...'
        });


        OrderService.all().success(
            function (data) {
                if (data.success) {
                    $scope.orders = data.data;
                }
                $ionicLoading.hide();
            }).error(function () {
                $ionicLoading.hide();
            });
    })
    .controller('OrderDetailCtrl', function ($scope, $state, $stateParams, $ionicPopup, $ionicHistory, $ionicSlideBoxDelegate, $ionicScrollDelegate, $ionicLoading, $ionicViewSwitcher, OrderService) {
        $scope.goBack = function () {
            $ionicViewSwitcher.nextDirection('back');
            $state.go("myOrder");
        };

        $scope.goDetail = function (menuId) {
            $ionicViewSwitcher.nextDirection('forward');
            $state.go("menuDetail", {menuId: menuId});
        };


        $ionicLoading.show({
            template: '订单明细加载中...'
        });

        OrderService.detail($stateParams.orderId).success(
            function (data) {
                if (data.success) {
                    $scope.data = data.data;
                }
                $ionicLoading.hide();
            }).error(function () {
                $ionicLoading.hide();
            });
    })
    .controller('MenuDetailCtrl', function ($scope, $state, $stateParams, $ionicPopup, $ionicHistory, $ionicSlideBoxDelegate, $ionicScrollDelegate, $ionicLoading, $ionicViewSwitcher, MenuService) {
        $scope.goBack = function () {
            $ionicViewSwitcher.nextDirection('back');
            $ionicHistory.goBack();
        };

        $ionicLoading.show({
            template: '美味明细加载中...'
        });

        MenuService.detail($stateParams.menuId).success(
            function (data) {
                if (data.success) {
                    $scope.data = data.data;
                }
                $ionicLoading.hide();
            }).error(function () {
                $ionicLoading.hide();
            });
    });
