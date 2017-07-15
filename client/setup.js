requirejs.config({
  paths: {
    angular: 'http://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.4/angular.min',
    restangular: 'https://cdnjs.cloudflare.com/ajax/libs/restangular/1.6.1/restangular.min',
    lodash: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min'
  },
  shim: {
    angular: {
      exports: 'angular'
    },
    restangular: {
      exports: 'restangular'
    },
    Client: []
  }
});

requirejs(['angular', 'Client', 'restangular', 'lodash'], function(angular, Client, Restangular, the) {
  const app = angular.module('app', ['restangular']);

  app.controller('client', Client.Client);

  app.filter('right', () => {
    return (item = '', width) => the.padEnd(item, width);
  });

  app.filter('left', () => {
    return (item = '', width) => the.padStart(item, width);
  });

  angular.bootstrap(document, ['app']);
});