angular.module('starter', ['ionic', 'starter.controllers', 'starter.factories', 'ngCordova', 'ngStorage', 'jsonFormatter', 'ion-autocomplete'])

.constant('API', {
  url: 'http://104.199.119.242/',
  quantidade: 10,
  quantidadeSemPaginacao: 100,
  timeout: 30*1000,
  debug: false,
  versao: '1.4'
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider) {
  $ionicConfigProvider.backButton.text('');
  $ionicConfigProvider.backButton.previousTitleText(false);

  $httpProvider.interceptors.push('authInterceptor');

  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.principal', {
    url: '/principal',
    views: {
      'menuContent': {
        templateUrl: 'templates/principal.html',
        controller: 'PrincipalCtrl'
      }
    }
  })

  .state('app.consulta-rapida-de-touros', {
    url: '/consulta-rapida-de-touros',
    views: {
      'menuContent': {
        templateUrl: 'templates/consulta-rapida-de-touros.html',
        controller: 'ConsultaRapidaCtrl'
      }
    }
  })

  .state('app.consulta-rapida-de-touros-listagem', {
    url: '/consulta-rapida-de-touros/:indicePesquisa',
    views: {
      'menuContent': {
        templateUrl: 'templates/listagem-animais.html',
        controller: 'ConsultaRapidaListagemCtrl'
      }
    }
  })

  .state('app.consulta-avancada-de-touros', {
    url: '/consulta-avancada-de-touros/:indiceTela',
    views: {
      'menuContent': {
        templateUrl: 'templates/consulta-avancada-de-touros.html',
        controller: 'ConsultaAvancadaCtrl'
      }
    }
  })

  .state('app.consulta-avancada-de-touros-listagem', {
    url: '/consulta-avancada-de-touros/listagem',
    views: {
      'menuContent': {
        templateUrl: 'templates/listagem-animais.html',
        controller: 'ConsultaAvancadaListagemCtrl'
      }
    }
  })

  .state('app.consulta-por-nome', {
    url: '/consulta-por-nome',
    views: {
      'menuContent': {
        templateUrl: 'templates/consulta-por-nome.html',
        controller: 'ConsultaPorNomeCtrl'
      }
    }
  })

  .state('app.consulta-por-nome-listagem', {
    url: '/consulta-por-nome/',
    views: {
      'menuContent': {
        templateUrl: 'templates/listagem-animais.html',
        controller: 'ConsultaPorNomeListagemCtrl'
      }
    }
  })

  .state('app.consulta-publica-por-nome', {
      url: '/consulta-publica-por-nome',
      views: {
          'menuContent': {
              templateUrl: 'templates/consulta-por-nome.html',
              controller: 'ConsultaPublicaPorNomeCtrl'
          }
      }
  })

  .state('app.visualizar-animal', {
    url: '/visualizar-animal/:cga',
    views: {
      'menuContent': {
        templateUrl: 'templates/visualizar-animal.html',
        controller: 'VisualizarAnimalCtrl'
      }
    }
  })

  .state('app.animais-salvos-listagem', {
    url: '/animais-salvos',
    views: {
      'menuContent': {
        templateUrl: 'templates/listagem-animais.html',
        controller: 'AnimaisSalvosListagemCtrl'
      }
    }
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
