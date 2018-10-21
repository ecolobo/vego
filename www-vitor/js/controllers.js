angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $state, $localStorage, $ionicPopup, $ionicHistory, Usuario) {
	$scope.voltar = function() {
		$ionicHistory.goBack(); 
	}

  $scope.efetuarLogout = function() {

    $ionicPopup.confirm({
      title: 'Confirme sua ação',
      template: 'Você tem certeza que deseja sair?',
      buttons: [ 
        { 
          text: 'Cancelar',
          type: 'button-default',
          onTap: function(e) {
            return false;
          }
        }, 
        { 
          text: 'OK', 
          type: 'button-positive',
          onTap: function(e) {
            return true;
          }
        } 
      ]
    }).then(function(res) {
      if(res) {
        Usuario.logout().then(function(response) {
          $scope.cadastroAncp = $localStorage.cadastroAncp;
          $state.go("login");
        }, function(response) {
          $ionicPopup.alert({
            title: 'Atenção',
            template: 'Ocorreu algum erro ao efetuar a requisição.'
          });      
        });
      }
    });
  }

  $scope.$on('$ionicView.enter', function() {
    $scope.cadastroAncp = $localStorage.cadastroAncp;
  });
})

.controller('LoginCtrl', function($scope, $state, $ionicHistory, $ionicLoading, $ionicModal, $ionicPopup, Usuario) {
  if(Usuario.estaLogado()) {
    $ionicHistory.nextViewOptions({ historyRoot: true });
    $state.go("app.principal");
  }

  $scope.dadosLogin = {
    username: '',
    password: ''
  };

  $scope.efetuarLogin = function(formLogin, dadosLogin) {
    if(formLogin.$valid) {
      $ionicLoading.show({ animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: '0' });
      Usuario.logar(dadosLogin).then(function(response){
        $ionicLoading.hide();
        if(response.hasOwnProperty("token")  && response.token != "") {
          $scope.dadosLogin = { username: '', password: '' };
          $ionicHistory.nextViewOptions({ historyRoot: true });
          $state.go("app.principal");
        } else {
          $ionicPopup.alert({
            title: 'Atenção',
            template: 'Usuário e/ou senha incorretos!'
          });
        }
      }, function(response){
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: 'Atenção',
          template: 'Ocorreu algum erro ao efetuar a requisição.'
        });
      });
    } else {
      $ionicPopup.alert({
        title: 'Atenção',
        template: 'Por favor preencha os campos com os seus dados!'
      });
    }
  };

  $ionicModal.fromTemplateUrl('templates/modal-cadastro.html', {
    id: 'cadastro',
    scope: $scope,
    animation: 'slide-in-up',
  }).then(function(modal) {
    $scope.modalCadastro = modal;

    $scope.dadosCadastro = {
      username: '',
      email: '',
      password: '',
      confirm: ''
    };

    $scope.cadastrarUsuario = function(formCadastro, dadosCadastro) {
      if(formCadastro.$valid) {
        $ionicLoading.show({ animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: '0' });
        Usuario.cadastrar(dadosCadastro).then(function(response){
          if(response.indexOf('Seja bem vindo! Você está logado como') > -1) {
            mensagemCadastro = "Cadastro realizado com sucesso! Utilizei seu usuário e senha para efetuar o login.";
          } else {
            mensagemCadastro = "Ocorreu um erro ao realizar o cadastro! Por favor, tente novamente.";
          }

          $ionicLoading.hide();
          $ionicPopup.alert({
            title: 'Sucesso',
            template: mensagemCadastro
          }).then(function() {
            $scope.modalCadastro.hide();
            // $window.location.reload(true);
          });
        }, function(response){
          $ionicLoading.hide();
          $ionicPopup.alert({
            title: 'Atenção',
            template: 'Ocorreu algum erro ao efetuar a requisição.'
          });
        });
      } else {
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: 'Atenção',
          template: 'Por favor preencha os campos com os seus dados!'
        });      
      }
    }

    $scope.cadastreSe = function() {
      $scope.modalCadastro.show(); 
    }
  });

  $scope.esqueceuSuaSenha = function() {
    $scope.data = {};

    var myPopup = $ionicPopup.show({
      template: '<input type="email" ng-model="data.email">',
      title: 'Informe o seu e-mail',
      subTitle: 'Por favor informe o seu e-mail de cadastro para receber sua senha',
      scope: $scope,
      buttons: [
        { text: 'Cancelar' },
        {
          text: '<b>Enviar</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data.email) {
              e.preventDefault();
            } else {
              Usuario.esqueceuSuaSenha($scope.data.email).then(function(response) {
                $ionicPopup.alert({
                  title: 'Sucesso',
                  template: response
                });
              }, function(response) {
                $ionicPopup.alert({
                  title: 'Atenção',
                  template: 'Ocorreu algum erro ao efetuar a requisição.'
                });
              });

              return $scope.data.email;
            }
          }
        }
      ]
    });
   };
})

.controller('PrincipalCtrl', function($scope, $ionicSideMenuDelegate, $localStorage) {
  $ionicSideMenuDelegate.canDragContent(false);

  $scope.$on('$ionicView.enter', function() {
    $scope.cadastroAncp = $localStorage.cadastroAncp;
    $scope.nome = $localStorage.username;
  });
})

.controller('ConsultaRapidaCtrl', function($scope, $rootScope, API, Usuario) {

  $rootScope.pesquisaRapida = [
    { 'nome':'MGTe',   'icone':'img/icones/icone-mgte.png',   'wIcone':100, 'url':API.url+'api/v1/mgt3',     'tabelaValor':'AnimalAGCriador',  'campoValor':'mgt',     'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'amgt',    'tabelaTop':'AnimalAGCriador',  'campoTop':'mgttop' },
    { 'nome':'DIPP',   'icone':'img/icones/icone-dipp.png',   'wIcone':100, 'url':API.url+'api/v1/ddippm',   'tabelaValor':'AnimalAGCriador',  'campoValor':'ddipp',   'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'adipp',   'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddipp' },
    { 'nome':'D3P',    'icone':'img/icones/icone-d3p.png',    'wIcone':100, 'url':API.url+'api/v1/ddpp30m',  'tabelaValor':'AnimalAGCriador',  'campoValor':'ddpp30',  'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'adpp30',  'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddpp30' },
    { 'nome':'MP120',  'icone':'img/icones/icone-mp120.png',  'wIcone':100, 'url':API.url+'api/v1/dmpp120m', 'tabelaValor':'AnimalAGCriador',  'campoValor':'dmpp120', 'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'ampp120', 'tabelaTop':'AnimalAGCriador4', 'campoTop':'dmpp120' },
    { 'nome':'MP210',  'icone':'img/icones/icone-mp210.png',  'wIcone':100, 'url':API.url+'api/v1/ddpp240m', 'tabelaValor':'AnimalAGCriador',  'campoValor':'dmpp240', 'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'ampp240', 'tabelaTop':'AnimalAGCriador4', 'campoTop':'dmpp240' },
    { 'nome':'DP120',  'icone':'img/icones/icone-dp120.png',  'wIcone':100, 'url':API.url+'api/v1/ddpp120',  'tabelaValor':'AnimalAGCriador',  'campoValor':'ddpp120', 'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'adpp120', 'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddpp120' },
    { 'nome':'DP210',  'icone':'img/icones/icone-dp210.png',  'wIcone':100, 'url':API.url+'api/v1/ddpp240m', 'tabelaValor':'AnimalAGCriador',  'campoValor':'ddpp240', 'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'adpp240', 'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddpp240' },
    { 'nome':'DP365',  'icone':'img/icones/icone-dp365.png',  'wIcone':100, 'url':API.url+'api/v1/ddpp365',  'tabelaValor':'AnimalAGCriador',  'campoValor':'ddpp365', 'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'adpp365', 'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddpp365' },
    { 'nome':'DP450',  'icone':'img/icones/icone-dp450.png',  'wIcone':100, 'url':API.url+'api/v1/ddpp455m', 'tabelaValor':'AnimalAGCriador',  'campoValor':'ddpp455', 'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'adpp455', 'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddpp455' },
    { 'nome':'DSTAY',  'icone':'img/icones/icone-dstay.png',  'wIcone':100, 'url':API.url+'api/v1/ddstaym',  'tabelaValor':'AnimalAGCriador',  'campoValor':'ddstay',  'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'adstay',  'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddstay' },
    { 'nome':'DPE365', 'icone':'img/icones/icone-dpe365.png', 'wIcone':100, 'url':API.url+'api/v1/ddpe365m', 'tabelaValor':'AnimalAGCriador',  'campoValor':'ddpe365', 'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'adpe365', 'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddpe365' },
    { 'nome':'DPE450', 'icone':'img/icones/icone-dpe450.png', 'wIcone':100, 'url':API.url+'api/v1/ddpe455m', 'tabelaValor':'AnimalAGCriador',  'campoValor':'ddpe455', 'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'adpe455', 'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddpe455' },
    { 'nome':'DAOL',   'icone':'img/icones/icone-daol.png',   'wIcone':100, 'url':API.url+'api/v1/ddaolm',   'tabelaValor':'AnimalAGCriador',  'campoValor':'ddaol',   'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'adaol',   'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddaol' },
    { 'nome':'DACAB',  'icone':'img/icones/icone-dacab.png',  'wIcone':100, 'url':API.url+'api/v1/acab',     'tabelaValor':'AnimalAGCriador',  'campoValor':'ddp8',    'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'adp8',    'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddp8' },
    { 'nome':'DMAR',   'icone':'img/icones/icone-dmar.png',   'wIcone':100, 'url':API.url+'api/v1/ddmarm',   'tabelaValor':'AnimalAGCriador',  'campoValor':'ddmar',   'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'admar',   'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddmar' },
    { 'nome':'DMAC',   'icone':'img/icones/icone-dmac.png',   'wIcone':100, 'url':API.url+'api/v1/mac',      'tabelaValor':'AnimalAGCriador5', 'campoValor':'ddmac',   'tabelaAcuracia':'AnimalAGCriador5', 'campoAcuracia':'admac',   'tabelaTop':'AnimalAGCriador5', 'campoTop':'tdmac' },
    { 'nome':'DPCQ',   'icone':'img/icones/icone-dpcq.png',   'wIcone':70,  'url':API.url+'api/v1/ddpcqm',   'tabelaValor':'AnimalAGCriador',  'campoValor':'ddpcq',   'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'adpcq',   'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddpcq' },
    { 'nome':'DPPC',   'icone':'img/icones/icone-dppc.png',   'wIcone':70,  'url':API.url+'api/v1/ddppc',    'tabelaValor':'AnimalAGCriador',  'campoValor':'ddppc',   'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'adppc',   'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddppc' },
    { 'nome':'DCAR',   'icone':'img/icones/icone-dcar.png',   'wIcone':100, 'url':API.url+'api/v1/car',      'tabelaValor':'AnimalAGCriador5', 'campoValor':'ddcar',   'tabelaAcuracia':'AnimalAGCriador5', 'campoAcuracia':'adcar',   'tabelaTop':'AnimalAGCriador5', 'campoTop':'tdcar' },
    { 'nome':'DIMS',   'icone':'img/icones/icone-dims.png',   'wIcone':100, 'url':API.url+'api/v1/ims',      'tabelaValor':'AnimalAGCriador5', 'campoValor':'ddims',   'tabelaAcuracia':'AnimalAGCriador5', 'campoAcuracia':'adims',   'tabelaTop':'AnimalAGCriador5', 'campoTop':'tdims' },
    { 'nome':'DPG',    'icone':'img/icones/icone-dpg.png',    'wIcone':100, 'url':API.url+'api/v1/dpg',      'tabelaValor':'AnimalAGCriador',  'campoValor':'ddpg',    'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'adpg',    'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddpg' },
    { 'nome':'DPAC',   'icone':'img/icones/icone-dpac.png',   'wIcone':70,  'url':API.url+'api/v1/dpac',     'tabelaValor':'AnimalAGCriador',  'campoValor':'ddpac',   'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'adpac',   'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddpac' },
    { 'nome':'DPAV',   'icone':'img/icones/icone-dpav.png',   'wIcone':100, 'url':API.url+'api/v1/dpav',     'tabelaValor':'AnimalAGCriador',  'campoValor':'ddpav',   'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'adpav',   'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddpav' },
    { 'nome':'DDES',   'icone':'img/icones/icone-ddes.png',   'wIcone':100, 'url':API.url+'api/v1/ddes',     'tabelaValor':'AnimalAGCriador',  'campoValor':'ddes',    'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'ades',    'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddes' },
    { 'nome':'DDPS',   'icone':'img/icones/icone-ddps.png',   'wIcone':100, 'url':API.url+'api/v1/ddps',     'tabelaValor':'AnimalAGCriador',  'campoValor':'ddps',    'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'adps',    'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddps' },
    { 'nome':'DDMS',   'icone':'img/icones/icone-ddms.png',   'wIcone':100, 'url':API.url+'api/v1/ddms',     'tabelaValor':'AnimalAGCriador',  'campoValor':'ddms',    'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'adms',    'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddms' }
  ];

  $scope.$on('$ionicView.enter', function() {
    $rootScope.animais        = [];
    $rootScope.nomeDep        = "";
    $rootScope.tblValorDep    = "";
    $rootScope.cmpValorDep    = "";
    $rootScope.tblAcuraciaDep = "";
    $rootScope.cmpAcuraciaDep = "";
    $rootScope.tblTopDep      = "";
    $rootScope.cmpTopDep      = ""; 
    $rootScope.consultaAvancada = false;
  });

})

.controller('ConsultaRapidaListagemCtrl', function($scope, $rootScope, $state, $stateParams, $http, $ionicLoading, $localStorage, API, Usuario) {

  if(typeof $rootScope.pesquisaRapida[$stateParams.indicePesquisa].url != "undefined") {
    $scope.carregado = false;

    $rootScope.nomeDep        = $scope.pesquisaRapida[$stateParams.indicePesquisa].nome;
    $rootScope.tblValorDep    = $scope.pesquisaRapida[$stateParams.indicePesquisa].tabelaValor;
    $rootScope.cmpValorDep    = $scope.pesquisaRapida[$stateParams.indicePesquisa].campoValor;
    $rootScope.tblAcuraciaDep = $scope.pesquisaRapida[$stateParams.indicePesquisa].tabelaAcuracia;
    $rootScope.cmpAcuraciaDep = $scope.pesquisaRapida[$stateParams.indicePesquisa].campoAcuracia;
    $rootScope.tblTopDep      = $scope.pesquisaRapida[$stateParams.indicePesquisa].tabelaTop;
    $rootScope.cmpTopDep      = $scope.pesquisaRapida[$stateParams.indicePesquisa].campoTop;

    $ionicLoading.show({ animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: '0' });
    $http.post($scope.pesquisaRapida[$stateParams.indicePesquisa].url, { username:$localStorage.username, quantidade: API.quantidade, tMGT: '100' }).then(function(sucesso){
      $ionicLoading.hide();
      $rootScope.animais = sucesso.data.doc;

      $scope.carregado = true;
    }, function(erro) {
      if(erro.data.status == 400 && erro.data.message == "Token expirou!") {
        Usuario.logout();
        $state.go("login");
      }
      console.log('Erro', erro);
    });
  } else {
    $state.go("app.principal");
  }

  $scope.verificaDataNascimento = function(dtNasc) {
    if(dtNasc == '0000-00-00') {
      return '-';
    } else {
      data = dtNasc.split('-');
      return data[2]+'/'+data[1]+'/'+data[0];
    }
  }

})

.controller('ConsultaAvancadaCtrl', function($scope, $rootScope, $state, $stateParams, $localStorage, $ionicLoading, $http, API) {
  if($stateParams.indiceTela == 'consulta-avancada') {
    $scope.tituloTela = 'Pesquisa Detalhada';
    urlConsultaApi = API.url+'api/v1/mgte';

    $scope.sexos = [
      { 'valor': 1, 'nome': 'Macho' },
      { 'valor': 2, 'nome': 'Fêmea' },
    ];

    $scope.consultaPublica = false;
  } else if($stateParams.indiceTela == 'consulta-publica') {
    $scope.tituloTela = 'Consulta Pública de Touros';
    urlConsultaApi = API.url+'api/v1/cpt';

    $scope.sexos = [
      { 'valor': 1, 'nome': 'Macho' }
    ];

    $scope.consultaPublica = true;
  }  

  $scope.valoresFiltros = {
    'topmgt': 5,       'amgt': 0,    
    'topddpg': 100,    'adpg': 0,    
    'topddipp': 100,   'adipp': 0,   
    'topddpp30': 100,  'adpp30': 0,    
    'topddstay': 100,  'adstay': 0,  
    'topddpac': 100,   'adpac': 0, 
    'topddpe365': 100, 'adpe365': 0,  
    'topddpe455': 100, 'adpe455': 0,
    'topdmpp120': 100, 'ampp120': 0, 
    'topdmpp240': 100, 'ampp240': 0, 
    'topddpn': 100,    'adpn': 0, 
    'topddpp120': 100, 'adpp120': 0, 
    'topddpp240': 100, 'adpp240': 0,
    'topddpp365': 100, 'adpp365': 0,
    'topddpp455': 100, 'adpp455': 0, 
    'topddpav': 100,   'adpav': 0,  
    'topddaol': 100,   'adaol': 0,
    'topddp8': 100,    'adp8': 0,
    'topddmar': 100,   'admar': 0,
    'topddmac': 100,   'admac': 0,
    'topddpcq': 100,   'adpcq': 0,
    'topddppc': 100,   'adppc': 0,
    'topddcar': 100,   'adcar': 0,
    'topddims': 100,   'adims': 0,      
    'raca': 1,         'sexo': 1,

    'topdmtp120':100, 'amtp120':0.0, 
    'topdmtp240':100, 'amtp240':0.0, 
    'topdded':100, 'aded':0.0, 
    'topddpd':100, 'adpd':0.0, 
    'topddmd':100, 'admd':0.0, 
    'topddes':100, 'ades':0.0, 
    'topddps':100, 'adps':0.0, 
    'topddms':100, 'adms':0.0, 
    'topddalt':100, 'adalt':0.0,
  };

  $scope.filtros = [
    { 'nome': 'MGTe',  'acuracia': 'amgt',    'top': 'topmgt',     'visivel': false },
    { 'nome': 'PG',    'acuracia': 'adpg',    'top': 'topddpg',    'visivel': false },
    { 'nome': 'IPP',   'acuracia': 'adipp',   'top': 'topddipp',   'visivel': false },
    { 'nome': '3P',    'acuracia': 'ad3p',    'top': 'topddpp30',  'visivel': false },
    { 'nome': 'STAY',  'acuracia': 'adstay',  'top': 'topddstay',  'visivel': false },
    { 'nome': 'DPAC',  'acuracia': 'adpac',   'top': 'topddpac',   'visivel': false },
    { 'nome': 'PE365', 'acuracia': 'adpe365', 'top': 'topddpe365', 'visivel': false },
    { 'nome': 'PE450', 'acuracia': 'adpe450', 'top': 'topddpe450', 'visivel': false },
    { 'nome': 'MP120', 'acuracia': 'ampp120', 'top': 'topdmpp120', 'visivel': false },
    { 'nome': 'MP210', 'acuracia': 'ampp240', 'top': 'topdmpp240', 'visivel': false },
    { 'nome': 'PN',    'acuracia': 'adpn',    'top': 'topddpn',    'visivel': false },
    { 'nome': 'P120',  'acuracia': 'adpp120', 'top': 'topddpp120', 'visivel': false },
    { 'nome': 'P210',  'acuracia': 'adpp240', 'top': 'topddpp240', 'visivel': false },
    { 'nome': 'P365',  'acuracia': 'adpp365', 'top': 'topddpp365', 'visivel': false },
    { 'nome': 'P450',  'acuracia': 'adpe455', 'top': 'topddpp455', 'visivel': false },
    { 'nome': 'PAV',   'acuracia': 'adpav',   'top': 'topddpav',   'visivel': false },
    { 'nome': 'AOL',   'acuracia': 'adaol',   'top': 'topddaol',   'visivel': false },
    { 'nome': 'ACAB',  'acuracia': 'adp8',    'top': 'topddp8',    'visivel': false },
    { 'nome': 'MAR',   'acuracia': 'admar',   'top': 'topddmar',   'visivel': false },
    { 'nome': 'MAC',   'acuracia': 'admac',   'top': 'topddmac',   'visivel': false },
    { 'nome': 'PCQ',   'acuracia': 'adpcq',   'top': 'topddpcq',   'visivel': false },
    { 'nome': 'PPC',   'acuracia': 'adppc',   'top': 'topddppc',   'visivel': false },
    { 'nome': 'CAR',   'acuracia': 'adcar',   'top': 'topddcar',   'visivel': false },
    { 'nome': 'IMS',   'acuracia': 'adims',   'top': 'topddims',   'visivel': false }
  ];

  $scope.valoresTop = [
    { 'valor': 0.1, 'nome': '0.1%' },
    { 'valor': 0.5, 'nome': '0.5%' },
    { 'valor': 1, 'nome': '1%' },
    { 'valor': 2, 'nome': '2%' },
    { 'valor': 3, 'nome': '3%' },
    { 'valor': 4, 'nome': '4%' },
    { 'valor': 5, 'nome': '5%' },
    { 'valor': 10, 'nome': '10%' },
    { 'valor': 15, 'nome': '15%' },
    { 'valor': 20, 'nome': '20%' },
    { 'valor': 25, 'nome': '25%' },
    { 'valor': 30, 'nome': '30%' },
    { 'valor': 40, 'nome': '40%' },
    { 'valor': 50, 'nome': '50%' },
    { 'valor': 60, 'nome': '60%' },
    { 'valor': 70, 'nome': '70%' },
    { 'valor': 80, 'nome': '80%' },
    { 'valor': 90, 'nome': '90%' },
    { 'valor': 100, 'nome': '100%' }
  ];

  $scope.racas = [
    { 'valor': 1, 'nome': 'Nelore' },
    { 'valor': 2, 'nome': 'Guzerá' },
    { 'valor': 4, 'nome': 'Brahman' },
    { 'valor': 8, 'nome': 'Tabapuã' },
  ];

  $scope.mostrarFiltro = function(index) {
    $scope.filtros[index].visivel = !$scope.filtros[index].visivel;
  }

  $scope.pesquisar = function() {
    $ionicLoading.show({ animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: '0' });

    angular.forEach($scope.valoresFiltros, function(filtro, indice){
      if(indice.indexOf('a') == 0) {
        $scope.valoresFiltros[indice] = parseFloat(filtro);
      }
    });
    
    dadosBusca = angular.extend({ username:$localStorage.username, quantidade: API.quantidade }, $scope.valoresFiltros);
    $http.post(urlConsultaApi, dadosBusca).then(function(sucesso){
      $ionicLoading.hide();
      $rootScope.animais = sucesso.data.doc;
      // $rootScope.tipoRetorno = 'text';
      $state.go("app.consulta-avancada-de-touros-listagem");
    }, function(erro) {
      // if(erro.data.status == 400 && erro.data.message == "Token expirou!") {
      //   Usuario.logout();
      //   $state.go("login");
      // }
      console.log('Erro', erro);
    });
  };

  $scope.colocaValorFiltro = function(filtro) {
    ordemFiltro = 18;
    $scope.valoresFiltros[filtro.top] = $scope.valoresTop[ordemFiltro].valor;
  }

  $scope.$on('$ionicView.enter', function() {
    $rootScope.animais = [];
    $rootScope.consultaAvancada = false;
  });
})

.controller('ConsultaAvancadaListagemCtrl', function($scope, $rootScope) {
  $scope.nomeDep        = 'MGTe';
  $scope.tblValorDep    = 'AnimalAGCriador';
  $scope.cmpValorDep    = 'mgt';
  $scope.tblAcuraciaDep = 'AnimalAGCriador';
  $scope.cmpAcuraciaDep = 'amgt';
  $scope.tblTopDep      = 'AnimalAGCriador';
  $scope.cmpTopDep      = 'mgttop';

  $scope.carregado = true;
  $rootScope.consultaAvancada = true;
  // $scope.retorno = 'texto';
  // $scope.animais = $rootScope.animais;

  $scope.verificaDataNascimento = function(dtNasc) {
    if(dtNasc == '0000-00-00') {
      return '-';
    } else {
      data = dtNasc.split('-');
      return data[2]+'/'+data[1]+'/'+data[0];
    }
  };
})

.controller('ConsultaPorNomeCtrl', function($scope, $rootScope, $state, $stateParams, $localStorage, $ionicLoading, $http, API) {
  $scope.camposPesquisa = { animal_codigo: "" };

  $scope.pesquisar = function() {
    $ionicLoading.show({ animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: '0' });
    
    $http.post(API.url+'api/v1/animal', { username: $localStorage.username, animal_codigo: $scope.camposPesquisa.animal_codigo, quantidade: API.quantidade }).then(function(sucesso){
      $ionicLoading.hide();
      $rootScope.animais = sucesso.data.doc;
      $rootScope.consultaAvancada = true;
      // $rootScope.tipoRetorno = 'text';
      $state.go("app.consulta-por-nome-listagem");
    }, function(erro) {
      // if(erro.data.status == 400 && erro.data.message == "Token expirou!") {
      //   Usuario.logout();
      //   $state.go("login");
      // }
      console.log('Erro', erro);
    });
  };


  $scope.$on('$ionicView.enter', function() {
    $rootScope.animais = [];
    $rootScope.consultaAvancada = false;
  });
})

.controller('ConsultaPorNomeListagemCtrl', function($scope, $rootScope) {
  $scope.nomeDep        = 'MGTe';
  $scope.tblValorDep    = 'AnimalAGCriador';
  $scope.cmpValorDep    = 'mgt';
  $scope.tblAcuraciaDep = 'AnimalAGCriador';
  $scope.cmpAcuraciaDep = 'amgt';
  $scope.tblTopDep      = 'AnimalAGCriador';
  $scope.cmpTopDep      = 'mgttop';

  $scope.carregado = true;
  // $scope.retorno = 'texto';
  // $scope.animais = $rootScope.animais;

  $scope.verificaDataNascimento = function(dtNasc) {
    if(dtNasc == '0000-00-00') {
      return '-';
    } else {
      data = dtNasc.split('-');
      return data[2]+'/'+data[1]+'/'+data[0];
    }
  };
})

.controller('VisualizarAnimalCtrl', function($scope, $rootScope, $state, $stateParams, $http, $localStorage, $ionicLoading, $ionicScrollDelegate, API) {
  $ionicLoading.show();
  $ionicScrollDelegate.$getByHandle('arvore-genealogica').scrollTo(250, 0);

  if(typeof($rootScope.nomeDep) == 'undefined') { $scope.nomeDep = ""; }
  if(typeof($rootScope.tblValorDep) == 'undefined') { $scope.tblValorDep = ""; }
  if(typeof($rootScope.cmpValorDep) == 'undefined') { $scope.cmpValorDep = ""; }
  if(typeof($rootScope.tblAcuraciaDep) == 'undefined') { $scope.tblAcuraciaDep = ""; }
  if(typeof($rootScope.cmpAcuraciaDep) == 'undefined') { $scope.cmpAcuraciaDep = ""; }
  if(typeof($rootScope.tblTopDep) == 'undefined') { $scope.tblTopDep = ""; }
  if(typeof($rootScope.cmpTopDep) == 'undefined') { $scope.cmpTopDep = ""; }

  encontrado = false;
  // angular.forEach($rootScope.animais, function(c, v) {
  //   if(c.cga == $stateParams.cga) {
  //     encontrado = true;
  //     $scope.animal = c;
  //     console.log(c);

  //     $http.post(API.url+'api/v1/gen9a', { username: $localStorage.username, cgaanimal: $scope.animal.cga }).then(function(sucesso){
  //       $ionicLoading.hide();
        
  //       $scope.arvoreGenealogica = $scope.montarArvoreGenealogica(sucesso.data);
  //     }, function(erro) {
  //       // if(erro.data.status == 400 && erro.data.message == "Token expirou!") {
  //       //   Usuario.logout();
  //       //   $state.go("login");
  //       // }
  //       console.log('Erro', erro);
  //     });
  //   }
  // });	

  if(!encontrado) {
    encontrado = true;
    $http.post(API.url+'api/v1/cga', { username: $localStorage.username, cgaanimal: parseInt($stateParams.cga), quantidade: API.quantidade }).then(function(sucesso){
      $ionicLoading.hide();

      $scope.animal = sucesso.data.doc[0];
      console.log($scope.animal);

      $http.post(API.url+'api/v1/gen9a', { username: $localStorage.username, cgaanimal: $scope.animal.cga }).then(function(sucesso){
        $ionicLoading.hide();
        
        $scope.arvoreGenealogica = $scope.montarArvoreGenealogica(sucesso.data);
      }, function(erro) {
        // if(erro.data.status == 400 && erro.data.message == "Token expirou!") {
        //   Usuario.logout();
        //   $state.go("login");
        // }
        console.log('Erro', erro);
      });
    }, function(erro) {
      // if(erro.data.status == 400 && erro.data.message == "Token expirou!") {
      //   Usuario.logout();
      //   $state.go("login");
      // }
      console.log('Erro', erro);
    });
  }

  if(!encontrado) {
    $state.go('app.principal');
  }

  $scope.montarArvoreGenealogica = function(arvoreGenealogica) {
    novaArvoreGenealogica = arvoreGenealogica[0];

    arvoreGenealogica.shift();
    angular.forEach(arvoreGenealogica, function(c, v) {
      if(novaArvoreGenealogica.pai_cga == c.cga) {
        novaArvoreGenealogica.pai = c;
      }

      if(novaArvoreGenealogica.mae_cga == c.cga) {
        novaArvoreGenealogica.mae = c;
      }
    });

    angular.forEach(arvoreGenealogica, function(c, v) {
      if(novaArvoreGenealogica.pai.pai_cga == c.cga) {
        novaArvoreGenealogica.pai.pai = c;
      }

      if(novaArvoreGenealogica.pai.mae_cga == c.cga) {
        novaArvoreGenealogica.pai.mae = c;
      }

      if(novaArvoreGenealogica.mae.pai_cga == c.cga) {
        novaArvoreGenealogica.mae.pai = c;
      }

      if(novaArvoreGenealogica.mae.mae_cga == c.cga) {
        novaArvoreGenealogica.mae.mae = c;
      }
    });

    return novaArvoreGenealogica;
  };

  $scope.irParaAnimal = function(cga) {
    console.log(cga);
    $state.go('app.visualizar-animal', { cga: cga });
  }

  $scope.verificaDataNascimento = function(dtNasc) {
    if(dtNasc == '0000-00-00') {
      return '-';
    } else {
      data = dtNasc.split('-');
      return data[2]+'/'+data[1]+'/'+data[0];
    }
  };

  $scope.verificaSexoAnimal = function(sexo) {
    if(sexo == 1) {
      return 'Macho';
    } else if(sexo == 2) {
      return 'Fêmea';
    } else {
      return sexo;
    }
  };
});