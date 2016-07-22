namespace app{
  angular.module('app', ['ngResource', 'ui.router', 'ui.bootstrap'])
  .config((
    $urlRouterProvider: ng.ui.IUrlRouterProvider,$httpProvider:ng.IHttpProvider,
    $locationProvider: ng.ILocationProvider) => {
      $urlRouterProvider.otherwise('/');
      $locationProvider.html5Mode(true);
      $httpProvider.interceptors.push('AuthInterceptor');
    })
}
