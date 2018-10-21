angular.module('starter.factories', [])

.factory('Usuario', function($rootScope, $localStorage, $http, $q, $timeout, API) {
  return {
    logar: function(dadosLogin) {
      var deferred = $q.defer();

      return $q(function(resolve, reject) {
        $http.post(API.url+'vegan-token3', dadosLogin).success(function(data, status) {
          if(data.hasOwnProperty('token')) {
            $localStorage.dados = data;
            $localStorage.logado = true;
            $localStorage.token = data.token;
            $localStorage.cadastroAncp = (data.user.cadastro_ancp == 1)?true:false;
            $localStorage.username = dadosLogin.username;
            $localStorage.animaisSalvos = [];
            $localStorage.email = dadosLogin.email;
            resolve(data);
          } else {
            resolve(data);
          }
        }, function(data, status) {
          reject('Ocorreu um erro. Tente novamente.');
          reject(data);
        });

        $timeout(function() {
          reject('O tempo máximo de execução foi atingido. Por favor, tente novamente.');
        }, API.timeout);
      });
    },

    logout: function() {
      var deferred = $q.defer();

      return $q(function(resolve, reject) {
        delete $localStorage.dados;
        delete $localStorage.logado;
        delete $localStorage.cadastroAncp;
        delete $localStorage.token;
        delete $localStorage.username;
        delete $localStorage.animaisSalvos;

        $rootScope.cadastroAncp = false;
        resolve(true);

        $timeout(function() {
          reject('O tempo máximo de execução foi atingido. Por favor, tente novamente.');
        }, API.timeout);
      });
    },

    estaLogado: function() {
      return $localStorage.logado;
    },

    esqueceuSuaSenha: function(email) {
      var deferred = $q.defer();

      return $q(function(resolve, reject) {
        $http.post(API.url+'forgot2', { email: email }).success(function(data, status) {
          resolve(data);
        }, function(data, status) {
          reject('Ocorreu um erro. Tente novamente.');
        });

        $timeout(function() {
          reject('O tempo máximo de execução foi atingido. Por favor, tente novamente.');
        }, API.timeout);
      });
    },

    cadastrar: function(dadosCadastro) {
      var deferred = $q.defer();

      return $q(function(resolve, reject) {
        $http.post(API.url+'signup', dadosCadastro).success(function(data, status) {
          resolve(data);
        }, function(data, status) {
          reject('Ocorreu um erro. Tente novamente.');
          reject(data);
        });

        $timeout(function() {
          reject('O tempo máximo de execução foi atingido. Por favor, tente novamente.');
        }, API.timeout);
      });
    },

    cadastraproduto: function(dadosCadastro) {
      var deferred = $q.defer();

      return $q(function(resolve, reject) {
        $http.post(API.url+'api/v1/cadastra_produto', dadosCadastro).success(function(data, status) {
          resolve(data);
        }, function(data, status) {
          reject('Ocorreu um erro. Tente novamente.');
          reject(data);
        });

        $timeout(function() {
          reject('O tempo máximo de execução foi atingido. Por favor, tente novamente.');
        }, API.timeout);
      });
    },

    cadastraveganators: function(dadosCadastroMe) {
      var deferred = $q.defer();

      return $q(function(resolve, reject) {
        $http.post(API.url+'api/v1/veganators_cadastrados', dadosCadastroMe).success(function(data, status) {
      //$localStorage.cadastroVeganators = (data.user._anc == 0)?true:false;
          resolve(data);
        }, function(data, status) {
          reject('Ocorreu um erro. Tente novamente.');
          reject(data);
        });

        $timeout(function() {
          reject('O tempo máximo de execução foi atingido. Por favor, tente novamente.');
        }, API.timeout);
      });
    },

    cadastraLista: function(dadosCadastroLista) {
      var deferred = $q.defer();

      return $q(function(resolve, reject) {
        $http.post(API.url+'api/v1/cadastra_lista', dadosCadastroLista).success(function(data, status) {
      //$localStorage.cadastroVeganators = (data.user._anc == 0)?true:false;
          resolve(data);
        }, function(data, status) {
          reject('Ocorreu um erro. Tente novamente.');
          reject(data);
        });

        $timeout(function() {
          reject('O tempo máximo de execução foi atingido. Por favor, tente novamente.');
        }, API.timeout);
      });
    },

    veganatorsconsultaexistencia: function(dadosCadastro) {
      var deferred = $q.defer();

      return $q(function(resolve, reject) {
        $http.post(API.url+'api/v1/veganators_consulta_existencia', dadosLogin).success(function(data, status) {
      $localStorage.veganatorsconsultaexistencia = (data.doc.__v == 0)?true:false;
      //console.log($localStorage.veganatorsconsultaexistencia);
          resolve(data);
        }, function(data, status) {
          reject('Ocorreu um erro. Tente novamente.');
          reject(data);
        });

        $timeout(function() {
          reject('O tempo máximo de execução foi atingido. Por favor, tente novamente.');
        }, API.timeout);
      });
    }

  }
})

.factory('authInterceptor', function($localStorage, $location, $q, $window) {
  return {
    request: function(config) {
      config.headers = config.headers || {};

      if(typeof $localStorage.token != "undefined") {
        config.headers['Content-Type'] = "application/json";
        config.headers['x-access-token'] = $localStorage.token;
      }

      return config;
    }
  };
});
