namespace app{
  angular.module('app').config(($stateProvider: ng.ui.IStateProvider) => {
    $stateProvider
    .state('login',{
      url: '/login',
      controller: 'LoginController as vm',
      templateUrl: '/client/app/auth/login/login.html'
    })
    .state('register',{
      url: '/register',
      controller: 'RegisterController as vm',
      templateUrl: '/client/app/auth/register/register.html'
    })
  })
}
