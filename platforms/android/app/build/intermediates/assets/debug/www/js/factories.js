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

    //criar variavel local com os dados do veganator
    veganatorsconsultaexistencia: function(dadosVeganator) {

      var deferred = $q.defer();

      return $q(function(resolve, reject) {
        $http.post(API.url+'api/v1/veganator_existente', dadosVeganator).success(function(data, status) {
            $localStorage2.dados = data;
            $localStorage2.logado = true;
            $localStorage2.token = data.token;
            $localStorage2.cadastroAncp = (data.user.cadastro_ancp == 1)?true:false;
            $localStorage2.username = dadosVeganator.username;
            $localStorage2.animaisSalvos = [];
            $localStorage2.email = dadosVeganator.email;
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
} )

//DL inseriu abaixo em 9 de setembro de 2018
.factory('Veganatorss', function($rootScope, $localStorage, $http, $v, $timeout, API) {
  return {

    veganatorsconsultaexistencia: function(dadosVeganator) {
      var deferredv = $v.defer();

      return $v(function(resolve, reject) {
        $http.post(API.url+'api/v1/veganator_existente', dadosVeganator).success(function(data, status) {
          if(data.hasOwnProperty('token')) {
            $localStorage.dados = data;
            //$localStorage.logado = true;
            //$localStorage.token = data.token;
            //$localStorage.cadastroAncp = (data.user.cadastro_ancp == 1)?true:false;
            //$localStorage.username = dadosLogin.username;
            $localStorage.veganator = dadosVeganator.doc.whatsapp,//aqui
            //$localStorage.animaisSalvos = [];
            //$localStorage.email = dadosLogin.email;
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

      ehVeganator: function() {
      return $localStorage.dadosVeganator;
    }

  }
} )
//DL inseriu acima em 9 de setembro de 2018

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
} );
