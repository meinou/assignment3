(function () {
    'use strict';

    angular.module('Assignment3',[])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
    .directive('foundItems', FoundItemsDirective);

   function FoundItemsDirective() {
       var ddo = {
           templateUrl: 'foundItems.html',
           scope: {
               items: '<',
               title: '@title',
               onRemove: '&',
               displayNothing: '<'
           },
           controller: NarrowItDownDirectiveController,
           controllerAs: 'narrow',
           bindToController: true
       };
       return ddo;
   }

   function NarrowItDownDirectiveController() {
       var narrow = this;

       narrow.isEmpty = function () {
           return narrow.displayNothing;
       }
   }

        NarrowItDownController.$inject=['MenuSearchService'];
        function NarrowItDownController (MenuSearchService) {
            var narrow = this;

            narrow.displayNothing = false;
            narrow.items = [];

            narrow.title = "Your list:";
            
            narrow.findItems = function (searchTerm) {
                var promise = MenuSearchService.GetMatchedMenuItems(searchTerm);

                promise.then(function (response) {

                narrow.items = response;
                narrow.displayNothing = (searchTerm !=="" && narrow.items.length === 0 
                                            || searchTerm === "" || searchTerm === " ");
                console.log(narrow.items);
                })
                .catch(function (error) {
                    console.log('error', error);
                })
            };

            narrow.removeItem = function (itemIndex) {
               narrow.items.splice(itemIndex, 1);
            }
        }


        MenuSearchService.$inject = ['$http', 'ApiBasePath'];
        function MenuSearchService ($http, ApiBasePath) {
            var service = this;

        //    var foundItems = [];  

            service.GetMatchedMenuItems = function (searchTerm) {
            return $http({
                url: (ApiBasePath + "/menu_items.json")
            }).then(function (result) {                 // process result and only keep items that match
                 var foundItems = [];  
                for (var i = 0; i < result.data.menu_items.length; i++) {
                      if (result.data.menu_items[i].name.toLowerCase().indexOf(searchTerm) !== -1) {
                             foundItems.push(result.data.menu_items[i]);
                      }
                 }
                 return foundItems;                      // return processed items
             });
        };  
    }

})();