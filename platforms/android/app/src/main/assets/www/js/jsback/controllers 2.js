angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $state, $localStorage, $ionicPopup, $ionicHistory, Usuario) {
	$scope.voltar = function() {
		$ionicHistory.goBack();
	}

  $scope.efetuarLogout = function() {

    $ionicPopup.confirm({
      title: 'ATENÇÃO',
      template: 'Você tem certeza que deseja sair?',
      buttons: [
        {
          text: 'Voltar!',
          type: 'button-default',
          onTap: function(e) {
            return false;
          }
        },
        {
          text: 'SIM!',
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
            title: 'ATENÇÃO',
            template: 'Ocorreu um erro ao efetuar a requisição.'
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
            title: 'ATENÇÃO',
            template: 'Usuário e/ou senha incorretos!'
          });
        }
      }, function(response){
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: 'ATENÇÃO',
          template: 'Ocorreu um erro ao efetuar a requisição.'
        });
      });
          //Usuario.veganatorsconsultaexistencia(dadosLogin);//DL inseriu ao lado
    } else {
      $ionicPopup.alert({
        title: 'ATENÇÃO',
        template: 'Por favor preencha os campos com os seus dados!'
      });
    }
  };

  $ionicModal.fromTemplateUrl( 'templates/modal-cadastro.html', {
    id: 'cadastro',
    scope: $scope,
    animation: 'slide-in-up',
  }).then(function(modal) {
    $scope.modalCadastro = modal;

    $scope.cadastreSe = function() {
      $scope.modalCadastro.show();
    }

    $scope.dadosCadastro = {
      username: '',
      email: '',
      password: '',
      confirm: '',
      cadastro_ancp: 1
    };

    $scope.cadastrarUsuario = function(formCadastro, dadosCadastro) {
      if(formCadastro.$valid) {
        $ionicLoading.show({ animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: '0' });
        Usuario.cadastrar(dadosCadastro).then(function(response){
          console.log(response);
          if(response.indexOf('ok') > -1) {
            mensagemCadastro = "Cadastro realizado com sucesso! Utilize seu usuário e senha para efetuar o login.";
          } else {
            mensagemCadastro = "Ocorreu um erro ao realizar o cadastro! Por favor, tente novamente.";
          }

          $ionicLoading.hide();
          $ionicPopup.alert({
            title: 'Sucesso',
            template: mensagemCadastro
          }).then(function() {
            $scope.modalCadastro.hide();
            $scope.dadosCadastro = { username: '', email: '', password: '', confirm: '', cadastro_ancp: 0 };
            // $window.location.reload(true);
          });
        }, function(response){
           $ionicLoading.hide();
          $ionicPopup.alert({
            title: 'ATENÇÃO',
            template: 'Ocorreu algum erro ao efetuar a requisição.'
          });
        });
      } else {
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: 'ATENÇÃO',
          template: 'Por favor preencha os campos com os seus dados!'
        });
      }
    }
  }
  );

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

.controller( 'PrincipalCtrl', function($scope, $ionicSideMenuDelegate, $localStorage) {
  $ionicSideMenuDelegate.canDragContent(false);

  $scope.$on('$ionicView.enter', function() {
    $scope.cadastroAncp = $localStorage.cadastroAncp;
    $scope.nome = $localStorage.username;
  });
})

.controller('ConsultaRapidaCtrl', function($scope, $rootScope, API, Usuario) {

  $rootScope.pesquisaRapida = [
    { 'nome':'MGTe',   'icone':'img/icones/icone-mgte.png',   'wIcone':100, 'url':API.url+'api/v1/mgt3skip',     'tabelaValor':'AnimalAGCriador',  'campoValor':'mgt',     'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'amgt',    'tabelaTop':'AnimalAGCriador4', 'campoTop':'mgt',     'pesquisa':true, 'urlPesquisa':API.url+'api/v1/mgt3fss' },
    { 'nome':'DIPP',   'icone':'img/icones/icone-dipp.png',   'wIcone':100, 'url':API.url+'api/v1/ddippmskip',   'tabelaValor':'AnimalAGCriador',  'campoValor':'ddipp',   'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'adipp',   'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddipp',   'pesquisa':true, 'urlPesquisa':API.url+'api/v1/ddippmfss' },
    { 'nome':'D3P',    'icone':'img/icones/icone-d3p.png',    'wIcone':100, 'url':API.url+'api/v1/ddpp30mskip',  'tabelaValor':'AnimalAGCriador',  'campoValor':'ddpp30',  'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'adpp30',  'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddpp30' , 'pesquisa':true, 'urlPesquisa':API.url+'api/v1/ddpp30mfss' },
    { 'nome':'MP120',  'icone':'img/icones/icone-mp120.png',  'wIcone':100, 'url':API.url+'api/v1/dmpp120mskip', 'tabelaValor':'AnimalAGCriador',  'campoValor':'dmpp120', 'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'ampp120', 'tabelaTop':'AnimalAGCriador4', 'campoTop':'dmpp120', 'pesquisa':true, 'urlPesquisa':API.url+'api/v1/dmpp120mfss' },
    { 'nome':'MP210',  'icone':'img/icones/icone-mp210.png',  'wIcone':100, 'url':API.url+'api/v1/dmpp240mskip', 'tabelaValor':'AnimalAGCriador',  'campoValor':'dmpp240', 'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'ampp240', 'tabelaTop':'AnimalAGCriador4', 'campoTop':'dmpp240', 'pesquisa':true, 'urlPesquisa':API.url+'api/v1/dmpp240mfss' },
    { 'nome':'DP120',  'icone':'img/icones/icone-dp120.png',  'wIcone':100, 'url':API.url+'api/v1/ddpp120skip',  'tabelaValor':'AnimalAGCriador',  'campoValor':'ddpp120', 'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'adpp120', 'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddpp120', 'pesquisa':true, 'urlPesquisa':API.url+'api/v1/ddpp120fss' },
    { 'nome':'DP210',  'icone':'img/icones/icone-dp210.png',  'wIcone':100, 'url':API.url+'api/v1/ddpp240mskip', 'tabelaValor':'AnimalAGCriador',  'campoValor':'ddpp240', 'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'adpp240', 'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddpp240', 'pesquisa':true, 'urlPesquisa':API.url+'api/v1/ddpp240mfss' },
    { 'nome':'DP365',  'icone':'img/icones/icone-dp365.png',  'wIcone':100, 'url':API.url+'api/v1/ddpp365skip',  'tabelaValor':'AnimalAGCriador',  'campoValor':'ddpp365', 'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'adpp365', 'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddpp365', 'pesquisa':true, 'urlPesquisa':API.url+'api/v1/ddpp365fss' },
    { 'nome':'DP450',  'icone':'img/icones/icone-dp450.png',  'wIcone':100, 'url':API.url+'api/v1/ddpp455mskip', 'tabelaValor':'AnimalAGCriador',  'campoValor':'ddpp455', 'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'adpp455', 'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddpp455', 'pesquisa':true, 'urlPesquisa':API.url+'api/v1/ddpp455mfss' },
    { 'nome':'DSTAY',  'icone':'img/icones/icone-dstay.png',  'wIcone':100, 'url':API.url+'api/v1/ddstaymskip',  'tabelaValor':'AnimalAGCriador',  'campoValor':'ddstay',  'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'adstay',  'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddstay' , 'pesquisa':true, 'urlPesquisa':API.url+'api/v1/ddstaymfss' },
    { 'nome':'DPE365', 'icone':'img/icones/icone-dpe365.png', 'wIcone':100, 'url':API.url+'api/v1/ddpe365mskip', 'tabelaValor':'AnimalAGCriador',  'campoValor':'ddpe365', 'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'adpe365', 'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddpe365', 'pesquisa':true, 'urlPesquisa':API.url+'api/v1/ddpe365mfss' },
    { 'nome':'DPE450', 'icone':'img/icones/icone-dpe450.png', 'wIcone':100, 'url':API.url+'api/v1/ddpe455mskip', 'tabelaValor':'AnimalAGCriador',  'campoValor':'ddpe455', 'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'adpe455', 'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddpe455', 'pesquisa':true, 'urlPesquisa':API.url+'api/v1/ddpe455mfss' },
    { 'nome':'DAOL',   'icone':'img/icones/icone-daol.png',   'wIcone':100, 'url':API.url+'api/v1/ddaolmskip',   'tabelaValor':'AnimalAGCriador',  'campoValor':'ddaol',   'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'adaol',   'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddaol',   'pesquisa':true, 'urlPesquisa':API.url+'api/v1/ddaolmfss' },
    { 'nome':'DACAB',  'icone':'img/icones/icone-dacab.png',  'wIcone':100, 'url':API.url+'api/v1/acabskip',     'tabelaValor':'AnimalAGCriador',  'campoValor':'ddp8',    'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'adp8',    'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddp8' ,   'pesquisa':true, 'urlPesquisa':API.url+'api/v1/acabfss' },
    { 'nome':'DMAR',   'icone':'img/icones/icone-dmar.png',   'wIcone':100, 'url':API.url+'api/v1/ddmarmskip',   'tabelaValor':'AnimalAGCriador',  'campoValor':'ddmar',   'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'admar',   'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddmar',   'pesquisa':true, 'urlPesquisa':API.url+'api/v1/ddmarmfss' },
    { 'nome':'DMAC',   'icone':'img/icones/icone-dmac.png',   'wIcone':100, 'url':API.url+'api/v1/macskip',      'tabelaValor':'AnimalAGCriador',  'campoValor':'ddmac',   'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'admac',   'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddmac',   'pesquisa':true, 'urlPesquisa':API.url+'api/v1/macfss' },
    { 'nome':'DPCQ',   'icone':'img/icones/icone-dpcq.png',   'wIcone':70,  'url':API.url+'api/v1/ddpcqmskip',   'tabelaValor':'AnimalAGCriador',  'campoValor':'ddpcq',   'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'adpcq',   'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddpcq',   'pesquisa':true, 'urlPesquisa':API.url+'api/v1/ddpcqmfss' },
    { 'nome':'DPPC',   'icone':'img/icones/icone-dppc.png',   'wIcone':70,  'url':API.url+'api/v1/ddppcskip',    'tabelaValor':'AnimalAGCriador',  'campoValor':'ddppc',   'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'adppc',   'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddppc',   'pesquisa':true, 'urlPesquisa':API.url+'api/v1/ddppcfss' },
    { 'nome':'DCAR',   'icone':'img/icones/icone-dcar.png',   'wIcone':100, 'url':API.url+'api/v1/carskip',      'tabelaValor':'AnimalAGCriador',  'campoValor':'ddcar',   'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'adcar',   'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddcar',   'pesquisa':true, 'urlPesquisa':API.url+'api/v1/carfss' },
    { 'nome':'DIMS',   'icone':'img/icones/icone-dims.png',   'wIcone':100, 'url':API.url+'api/v1/imsskip',      'tabelaValor':'AnimalAGCriador',  'campoValor':'ddims',   'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'adims',   'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddims',   'pesquisa':true, 'urlPesquisa':API.url+'api/v1/imsfss' },
    { 'nome':'DPG',    'icone':'img/icones/icone-dpg.png',    'wIcone':100, 'url':API.url+'api/v1/dpgskip',      'tabelaValor':'AnimalAGCriador',  'campoValor':'ddpg',    'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'adpg',    'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddpg' ,   'pesquisa':true, 'urlPesquisa':API.url+'api/v1/dpgfss' },
    { 'nome':'DPAC',   'icone':'img/icones/icone-dpac.png',   'wIcone':70,  'url':API.url+'api/v1/dpacskip',     'tabelaValor':'AnimalAGCriador',  'campoValor':'ddpac',   'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'adpac',   'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddpac',   'pesquisa':true, 'urlPesquisa':API.url+'api/v1/dpacfss' },
    { 'nome':'DPAV',   'icone':'img/icones/icone-dpav.png',   'wIcone':100, 'url':API.url+'api/v1/dpavskip',     'tabelaValor':'AnimalAGCriador',  'campoValor':'ddpav',   'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'adpav',   'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddpav',   'pesquisa':true, 'urlPesquisa':API.url+'api/v1/dpavfss' },
    { 'nome':'DDES',   'icone':'img/icones/icone-ddes.png',   'wIcone':100, 'url':API.url+'api/v1/ddesskip',     'tabelaValor':'AnimalAGCriador',  'campoValor':'ddes',    'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'ades',    'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddes' ,   'pesquisa':true, 'urlPesquisa':API.url+'api/v1/ddesfss' },
    { 'nome':'DDPS',   'icone':'img/icones/icone-ddps.png',   'wIcone':100, 'url':API.url+'api/v1/ddpsskip',     'tabelaValor':'AnimalAGCriador',  'campoValor':'ddps',    'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'adps',    'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddps' ,   'pesquisa':true, 'urlPesquisa':API.url+'api/v1/ddpsfss' },
    { 'nome':'DDMS',   'icone':'img/icones/icone-ddms.png',   'wIcone':100, 'url':API.url+'api/v1/ddmsskip',     'tabelaValor':'AnimalAGCriador',  'campoValor':'ddms',    'tabelaAcuracia':'AnimalAGCriador',  'campoAcuracia':'adms',    'tabelaTop':'AnimalAGCriador4', 'campoTop':'ddms' ,   'pesquisa':true, 'urlPesquisa':API.url+'api/v1/ddmsfss' }
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

.controller('ConsultaRapidaListagemCtrl', function($scope, $rootScope, $state, $stateParams, $http, $ionicLoading, $ionicModal, $ionicPopup, $localStorage, API, Usuario) {
  $scope.tituloTela = "Resultado da Pesquisa 1";

  if(typeof $rootScope.pesquisaRapida[$stateParams.indicePesquisa].url != "undefined") {
    $scope.carregado = false;
    $scope.pagina = 1;

    $rootScope.nomeDep        = $scope.pesquisaRapida[$stateParams.indicePesquisa].nome;
    $rootScope.tblValorDep    = $scope.pesquisaRapida[$stateParams.indicePesquisa].tabelaValor;
    $rootScope.cmpValorDep    = $scope.pesquisaRapida[$stateParams.indicePesquisa].campoValor;
    $rootScope.tblAcuraciaDep = $scope.pesquisaRapida[$stateParams.indicePesquisa].tabelaAcuracia;
    $rootScope.cmpAcuraciaDep = $scope.pesquisaRapida[$stateParams.indicePesquisa].campoAcuracia;
    $rootScope.tblTopDep      = $scope.pesquisaRapida[$stateParams.indicePesquisa].tabelaTop;
    $rootScope.cmpTopDep      = $scope.pesquisaRapida[$stateParams.indicePesquisa].campoTop;

    $rootScope.paginacao      = true;
    $rootScope.pesquisa       = $scope.pesquisaRapida[$stateParams.indicePesquisa].pesquisa;

    $scope.consultaRapidaInicial = function() {
        $scope.urlPesquisa = $scope.pesquisaRapida[$stateParams.indicePesquisa].url;
        $scope.filtrosPesquisaReq = {
            username: $localStorage.username,
            pagina: $scope.pagina,
            quantidade: API.quantidade,
            tMGT: '100'
        };

        $ionicLoading.show({animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: '0'});
        $http.post($scope.urlPesquisa, $scope.filtrosPesquisaReq).then(function (sucesso) {
            $ionicLoading.hide();
            $rootScope.animais = sucesso.data.doc;

            $scope.carregado = true;
        }, function (erro) {
            if (erro.data.status == 400 && erro.data.message == "Token expirou!") {
                Usuario.logout();
                $state.go("login");
            }
            console.log('Erro', erro);
        });
    };
    $scope.consultaRapidaInicial();

    $ionicModal.fromTemplateUrl('templates/modal-filtros-pesquisa.html', {
        id: 'filtros-pesquisa',
        scope: $scope,
        animation: 'slide-in-up',
    }).then(function(modal) {
        $scope.modalFiltrosPesquisa = modal;

        $scope.abrirModalFiltrosPesquisa = function() {
            $scope.modalFiltrosPesquisa.show();
        }

        $http.post(API.url+'api/v1/ufa', { username: $localStorage.username }).then(function(response) {
          $scope.listaFazendas = response.data.doc;
        });

        $scope.listaSexos = [
            { 'valor': '1', 'nome': 'Macho' },
            { 'valor': '2', 'nome': 'Fêmea' }
        ];

        $scope.listaStatus = [
            { 'valor': '0,1,3,5,6,8,9,10,11,12,13,14,15,16,17,18', 'nome': 'Ativo' },
            { 'valor': '2,4,7', 'nome': 'Inativo' }
        ];

        $scope.filtrosPesquisa = {
            fazenda: "",
            status: "0,1,3,5,6,8,9,10,11,12,13,14,15,16,17,18",
            sexo: "1"
        };

        $scope.parseInt = function(n) {
          return parseInt(n);
        };

        $scope.filtrarAnimais = function(formFiltros, filtrosPesquisa) {
            if(formFiltros.$valid) {
                $ionicLoading.show({ animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: '0' });

                $scope.pagina = 1;

                $scope.urlPesquisa = $scope.pesquisaRapida[$stateParams.indicePesquisa].urlPesquisa;
                $scope.filtrosPesquisaReq = {
                    username: $localStorage.username,
                    pagina: $scope.pagina,
                    quantidade: API.quantidade,
                    nfa: $scope.parseInt(filtrosPesquisa.fazenda),
                    sx: $scope.parseInt(filtrosPesquisa.sexo),
                    usa: filtrosPesquisa.status
                };

                $ionicLoading.show({ animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: '0' });
                $http.post($scope.urlPesquisa, $scope.filtrosPesquisaReq).then(function(sucesso){
                    $ionicLoading.hide();
                    $rootScope.animais = sucesso.data.doc;

                    $scope.carregado = true;
                    $scope.modalFiltrosPesquisa.hide();
                }, function(erro) {
                    if(erro.data.status == 400 && erro.data.message == "Token expirou!") {
                        Usuario.logout();
                        $state.go("login");
                    }
                    console.log('Erro', erro);
                });
            } else {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'ATENÇÃO',
                    template: 'Por favor selecione ao menos a fazenda!'
                });
            }
        }

        $scope.eliminarFiltros = function() {
          $scope.filtrosPesquisa = {
              fazenda: "",
              status: "0,1,3,5,6,8,9,10,11,12,13,14,15,16,17,18",
              sexo: "1"
          };
          $scope.modalFiltrosPesquisa.hide();

          $scope.consultaRapidaInicial();
        };
    });

  } else {
    $state.go("app.principal");
  }

  $scope.verificaDataNascimento = function(dtNasc) {
    if(dtNasc == '0000-00-00' || typeof dtNasc == "undefined") {
      return '-';
    } else {
      data = dtNasc.split('-');
      return data[2]+'/'+data[1]+'/'+data[0];
    }
  }

  $scope.carregarMaisAnimais = function() {
      $scope.filtrosPesquisaReq.pagina++;
      $ionicLoading.show({ animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: '0' });
      $http.post($scope.urlPesquisa, $scope.filtrosPesquisaReq).then(function(sucesso){
          $ionicLoading.hide();
          $rootScope.animais = $rootScope.animais.concat(sucesso.data.doc);

          $scope.$broadcast('scroll.infiniteScrollComplete');
      }, function(erro) {
          if(erro.data.status == 400 && erro.data.message == "Token expirou!") {
              Usuario.logout();
              $state.go("login");
          }
          console.log('Erro', erro);
      });

  };
})

.controller('ConsultaAvancadaCtrl', function($scope, $rootScope, $state, $stateParams, $localStorage, $ionicLoading, $http, API) {
  if($stateParams.indiceTela == 'consulta-avancada') {
    $scope.tituloTela = 'Pesquisa Detalhada';
    urlConsultaApi = API.url+'api/v1/mgte';

    $scope.sexos = [
      { 'valor': 1, 'nome': 'Macho' },
      { 'valor': 2, 'nome': 'Fêmea' },
    ];

    $scope.Publica = false;
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
    { 'nome': 'DPG',    'acuracia': 'adpg',    'top': 'topddpg',    'visivel': false },
    { 'nome': 'DIPP',   'acuracia': 'adipp',   'top': 'topddipp',   'visivel': false },
    { 'nome': 'D3P',    'acuracia': 'adpp30',  'top': 'topddpp30',  'visivel': false },
    { 'nome': 'DSTAY',  'acuracia': 'adstay',  'top': 'topddstay',  'visivel': false },
    { 'nome': 'DPAC',  'acuracia': 'adpac',   'top': 'topddpac',   'visivel': false },
    { 'nome': 'DPE365', 'acuracia': 'adpe365', 'top': 'topddpe365', 'visivel': false },
    { 'nome': 'DPE450', 'acuracia': 'adpe455', 'top': 'topddpe450', 'visivel': false },
    { 'nome': 'MP120', 'acuracia': 'ampp120', 'top': 'topdmpp120', 'visivel': false },
    { 'nome': 'MP210', 'acuracia': 'ampp240', 'top': 'topdmpp240', 'visivel': false },
    { 'nome': 'DPN',    'acuracia': 'adpn',    'top': 'topddpn',    'visivel': false },
    { 'nome': 'DP120',  'acuracia': 'adpp120', 'top': 'topddpp120', 'visivel': false },
    { 'nome': 'DP210',  'acuracia': 'adpp240', 'top': 'topddpp240', 'visivel': false },
    { 'nome': 'DP365',  'acuracia': 'adpp365', 'top': 'topddpp365', 'visivel': false },
    { 'nome': 'DP450',  'acuracia': 'adpe455', 'top': 'topddpp455', 'visivel': false },
    { 'nome': 'DPAV',   'acuracia': 'adpav',   'top': 'topddpav',   'visivel': false },
    { 'nome': 'DAOL',   'acuracia': 'adaol',   'top': 'topddaol',   'visivel': false },
    { 'nome': 'DACAB',  'acuracia': 'adp8',    'top': 'topddp8',    'visivel': false },
    { 'nome': 'DMAR',   'acuracia': 'admar',   'top': 'topddmar',   'visivel': false },
    { 'nome': 'DMAC',   'acuracia': 'admac',   'top': 'topddmac',   'visivel': false },
    { 'nome': 'DPCQ',   'acuracia': 'adpcq',   'top': 'topddpcq',   'visivel': false },
    { 'nome': 'DPPC',   'acuracia': 'adppc',   'top': 'topddppc',   'visivel': false },
    { 'nome': 'DCAR',   'acuracia': 'adcar',   'top': 'topddcar',   'visivel': false },
    { 'nome': 'DIMS',   'acuracia': 'adims',   'top': 'topddims',   'visivel': false }
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

    dadosBusca = angular.extend({ username:$localStorage.username, quantidade: API.quantidadeSemPaginacao }, $scope.valoresFiltros);
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
  $scope.tituloTela = "Resultado da Pesquisa 2";

  $scope.nomeDep        = 'MGTe';
  $scope.tblValorDep    = 'AnimalAGCriador';
  $scope.cmpValorDep    = 'mgt';
  $scope.tblAcuraciaDep = 'AnimalAGCriador';
  $scope.cmpAcuraciaDep = 'amgt';
  $scope.tblTopDep      = 'AnimalAGCriador4';
  $scope.cmpTopDep      = 'mgt';

  $scope.carregado = false;
  $rootScope.consultaAvancada = true;
  $rootScope.pesquisa = false;
  // $scope.retorno = 'texto';
  // $scope.animais = $rootScope.animais;

  $scope.verificaDataNascimento = function(dtNasc) {
    if(dtNasc == '0000-00-00' || typeof dtNasc == "undefined") {
      return '-';
    } else {
      data = dtNasc.split('-');
      return data[2]+'/'+data[1]+'/'+data[0];
    }
  };
})

//.controller( 'ConsultaPorNomeCtrl', function($scope, $rootScope, $state, $stateParams, $localStorage, $ionicLoading, $http, API) {
//.controller('LoginCtrl', function($scope, $state, $ionicHistory, $ionicLoading, $ionicModal, $ionicPopup, Usuario) {
.controller( 'ConsultaPorNomeCtrl', function($scope, $state, $rootScope, $state, $ionicHistory, $ionicLoading, $stateParams, $localStorage, $ionicLoading, $http, $ionicModal, $ionicPopup, API, Usuario) {
//aqui

  $scope.camposPesquisa = { animal_codigo: "" };

  $scope.callbackMethod = function (query) {
      if(query.trim().length > 2) {
          $ionicLoading.show({ animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: '0' });
          var nomes = [];
          return $http.post(API.url+'api/v1/listanomes', { username: $localStorage.username, nome: query.trim(), quantidade: API.quantidade }).then(function(sucesso) {
              $ionicLoading.hide();
                 //angular.forEach(sucesso.data.doc, function(animal) {
                 //nomes.push(animal._id.item);
                 //usando abaixo

                 angular.forEach(sucesso.data.resultados.Troll_item, function(animal) {
//                 angular.forEach(sucesso.data.Troll_item, function(animal) {
                 nomes.push(animal._id.item);
                  });

                  angular.forEach(sucesso.data.resultados.Troll_opcao, function(animal) {
                 nomes.push(animal._id.opcao);
                 });

                angular.forEach(sucesso.data.resultados.Ingredientes, function(animal) {
                 nomes.push(animal._id.ingrediente);
                  });

  //               angular.forEach(sucesso.data.resultados.Peta_brasil, function(animal) {
  //               nomes.push(animal.empresa);
  //                });

              nomes.push(query);
              return nomes;
          }, function(erro) {
              console.log('Erro', erro);
          });
      } else {
          return [];
      }
  };

  $scope.pesquisar = function() {
    $ionicLoading.show({ animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: '0' });

    $http.post(API.url+'api/v1/animal', { username: $localStorage.username, animal_codigo: $scope.camposPesquisa.animal_codigo, quantidade: API.quantidade }).then(function(sucesso){
      $ionicLoading.hide();

      $rootScope.animais = sucesso.data.resultados.Troll_item;
      if($rootScope.animais == "") { $rootScope.animais = sucesso.data.resultados.Troll_opcao; };
      if($rootScope.animais == "") { $rootScope.animais = sucesso.data.resultados.Ingredientes; };
      if($rootScope.animais == "") { $rootScope.animais = sucesso.data.resultados.Peta_brasil; };

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

  //dl inicio 27jun2018
    $scope.pesquisar2 = function() {
    $ionicLoading.show({ animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: '0' });

    $http.post(API.url+'api/v1/veganators_lista_produtos', { username: $localStorage.username, animal_codigo: $scope.camposPesquisa.animal_codigo, quantidade: API.quantidade }).then(function(sucesso){
      $ionicLoading.hide();

      $rootScope.animais = sucesso.data.err;

      //$rootScope.animais = sucesso.data.resultados.Troll_item;
      //if($rootScope.animais == "") { $rootScope.animais = sucesso.data.resultados.Troll_opcao; };
      //if($rootScope.animais == "") { $rootScope.animais = sucesso.data.resultados.Ingredientes; };
      //if($rootScope.animais == "") { $rootScope.animais = sucesso.data.resultados.Peta_brasil; };




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
  //dl fim 27 junho 2018
//dl inicio 27jun2018
    $scope.pesquisar3 = function() {
    $ionicLoading.show({ animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: '0' });

    $http.post(API.url+'api/v1/mostra_lista', { username: $localStorage.username, animal_codigo: $scope.camposPesquisa.animal_codigo, quantidade: API.quantidade }).then(function(sucesso){
      $ionicLoading.hide();

      $rootScope.animais = sucesso.data.resultados;
//      $rootScope.animais = sucesso.data;

      $rootScope.consultaAvancada = true;
      // $rootScope.tipoRetorno = 'text';
      $state.go("app.mostra_lista");
    }, function(erro) {
      // if(erro.data.status == 400 && erro.data.message == "Token expirou!") {
      //   Usuario.logout();
      //   $state.go("login");
      // }
      console.log('Erro', erro);
    });
  };
  //dl fim 27 junho 2018

  $scope.$on('$ionicView.enter', function() {
    //$rootScope.animais = [];
    $rootScope.animais.resultados.Troll_item.item = [];
    $rootScope.consultaAvancada = false;
  });


  //dl inicio
  $ionicModal.fromTemplateUrl( 'templates/modal-cadastro-veganators.html', {
    id: 'cadastroMe',
    scope: $scope,
    animation: 'slide-in-left',
  }).then(function(modal) {
    $scope.modalCadastroMe = modal;

    $scope.cadastreMe = function() {
      $scope.modalCadastroMe.show();
    }

    $scope.dadosCadastroMe = {
      produto: '',
      empresa: '',
      whatsapp: '',
      ingrediente: ''
      ,status: 'Pendente'
      , usuario: $localStorage.username
      ,username: $localStorage.username
    };

    $scope.cadastrarUsuarioMe = function(formCadastroMe, dadosCadastroMe) {
      if(formCadastroMe.$valid) {
        $ionicLoading.show({ animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: '0' });
        Usuario.cadastraveganators(dadosCadastroMe).then(function(response){
                 console.log(response);
          if(response.indexOf('inserido') = -1) {
         //if('inserido')  {
            mensagemCadastro = "Cadastro realizado com sucesso! Com a ajuda de nossos VegaNators iremos verificar o produto.";
          } else {
            mensagemCadastro = "Ocorreu um erro ao realizar o cadastro! Por favor, tente novamente.";
          }

          $ionicLoading.hide();
          $ionicPopup.alert({
            title: 'Mensagem...',
            template: mensagemCadastro
          }).then(function() {
            $scope.modalCadastroMe.hide();
            //Usuario.veganatorsconsultaexistencia(dadosLogin);//DL inseriu ao lado
            console.log($localStorage.username, $localStorage.veganatorsconsultaexistencia);
            //$scope.dadosCadastro = { username: '', email: '', password: '', confirm: '' };
           $scope.dadosCadastroMe = { produto: '', empresa: '', whatsapp: '', ingrediente: '', status: 'Pendente', usuario: $localStorage.username};
            // $window.location.reload(true);
          });
        }, function(response){
           $ionicLoading.hide();
          $ionicPopup.alert({
            title: 'ATENÇÃO',
            template: 'Ocorreu algum erro ao efetuar a requisição.'
          });
        }
        );
      } else {
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: 'AxxxxÃO2',
          template: 'xxxxx4!'
        });
      }
    }
  }
  );
  //dl fim

  //dl inicio
  $ionicModal.fromTemplateUrl( 'templates/modal-cadastra-lista.html', {
    id: 'cadastroLista',
    scope: $scope,
    animation: 'slide-in-left',
  }).then(function(modal) {
    $scope.modalCadastroLista = modal;

    $scope.cadastroLista = function() {
      $scope.modalCadastroLista.show();
    }

    $scope.dadosCadastroLista = {
      produto: '',
      empresa: '',
      whatsapp: '',
      ingrediente: ''
      ,status: 'Pendente'
      , usuario: $localStorage.username
      ,username: $localStorage.username
    };

    $scope.cadastrarUsuarioLista = function(formCadastroLista, dadosCadastroLista) {
      if(formCadastroLista.$valid) {
        $ionicLoading.show({ animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: '0' });
        Usuario.cadastraLista(dadosCadastroLista).then(function(response){
                 console.log(response);
          if(response.indexOf('inserido') > -1) {
         //if('inserido')  {
            mensagemCadastro = "Cadastro realizado com sucesso! Com a ajuda de nossos VegaNators iremos verificar o produto.";
          } else {
            mensagemCadastro = "Ocorreu um erro ao realizar o cadastro! Por favor, tente novamente.";
          }

          $ionicLoading.hide();
          $ionicPopup.alert({
            title: 'Sucesso',
            template: mensagemCadastro
          }).then(function() {
            $scope.modalCadastroLista.hide();
            //Usuario.veganatorsconsultaexistencia(dadosLogin);//DL inseriu ao lado
            console.log($localStorage.username, $localStorage.veganatorsconsultaexistencia);
            //$scope.dadosCadastro = { username: '', email: '', password: '', confirm: '' };
           $scope.dadosCadastroMe = { produto: '', empresa: '', whatsapp: '', ingrediente: '', status: 'Pendente', usuario: $localStorage.username};
            // $window.location.reload(true);
          });
        }, function(response){
           $ionicLoading.hide();
          $ionicPopup.alert({
            title: 'ATENÇÃO',
            template: 'Ocorreu algum erro ao efetuar a requisição.'
          });
        }
        );
      } else {
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: 'AxxxxÃO2',
          template: 'xxxxx4!'
        });
      }
    }
  }
  );
  //dl fim


  //dl inicio
  $ionicModal.fromTemplateUrl( 'templates/modal-cadastro-produto.html', {
    id: 'cadastro',
    scope: $scope,
    animation: 'slide-in-up',
  }).then(function(modal) {
    $scope.modalCadastro = modal;

    $scope.cadastreSe = function() {
      $scope.modalCadastro.show();
    }

    $scope.dadosCadastro = {
      produto: '',
      empresa: '',
      tipo: '',
      ingrediente: ''
      ,status: 'Pendente'
      , usuario: $localStorage.username
      ,username: $localStorage.username
    };

    $scope.cadastrarUsuario = function(formCadastro, dadosCadastro) {
      if(formCadastro.$valid) {
        $ionicLoading.show({ animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: '0' });
        Usuario.cadastraproduto(dadosCadastro).then(function(response){
                 console.log(response);
          if(response.indexOf('inserido') > -1) {
         //if('inserido')  {
            mensagemCadastro = "Cadastro realizado com sucesso! Um de nossos VegaNators acionado para verificar o produto.";
          } else {
            mensagemCadastro = "Ocorreu um erro ao realizar o cadastro! Por favor, tente novamente.";
          }

          $ionicLoading.hide();
          $ionicPopup.alert({
            title: 'Sucesso',
            template: mensagemCadastro
          }).then(function() {
            $scope.modalCadastro.hide();
            console.log($localStorage.username);
            //$scope.dadosCadastro = { username: '', email: '', password: '', confirm: '' };
           $scope.dadosCadastro = { produto: '', empresa: '', tipo: '', ingrediente: '', status: 'Pendente', usuario: $localStorage.username};
            // $window.location.reload(true);
          });
        }, function(response){
           $ionicLoading.hide();
          $ionicPopup.alert({
            title: 'ATENÇÃO',
            template: 'Ocorreu algum erro ao efetuar a requisição.'
          });
        });
      } else {
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: 'ATENÇÃO',
          template: 'Por favor preencha os campos com os seus dados!'
        });
      }
    }
  }
  );
  //dl fim
})


//dl inicio
.controller('ConsultaXXXXCtrl', function($scope, $rootScope, $state, $stateParams, $localStorage, $ionicLoading, $http, API) {
})
//dl fim

.controller('ConsultaPublicaPorNomeCtrl', function($scope, $rootScope, $state, $stateParams, $localStorage, $ionicLoading, $http, API) {
    $scope.camposPesquisa = { animal_codigo: "" };

    $scope.callbackMethod = function (query) {
        if(query.trim().length > 2) {
            $ionicLoading.show({ animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: '0' });
            var nomes = [];
            return $http.post(API.url+'api/v1/cptlistanomes', { username: $localStorage.username, nome: query.trim(), quantidade: API.quantidade }).then(function(sucesso) {
                $ionicLoading.hide();
                angular.forEach(sucesso.data.doc, function(animal) {
                    nomes.push(animal.nome);
                });

                nomes.push(query);
                return nomes;
            }, function(erro) {
                console.log('Erro', erro);
            });
        } else {
            return [];
        }
    };

    $scope.pesquisar = function() {
        $ionicLoading.show({ animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: '0' });

        $http.post(API.url+'api/v1/cptprocura', { username: $localStorage.username, animal_codigo: $scope.camposPesquisa.animal_codigo, quantidade: API.quantidadeSemPaginacao }).then(function(sucesso){
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
  //$scope.tituloTela = "Resultado da Pesquisa 3";
  $scope.tituloTela = "Listas consultadas pelo Vego";
  //$scope.tituloTela = $animal.item;
  $scope.nomeDep        = 'MGTe';
  $scope.tblValorDep    = 'AnimalAGCriador';
  $scope.cmpValorDep    = 'mgt';
  $scope.tblAcuraciaDep = 'AnimalAGCriador';
  $scope.cmpAcuraciaDep = 'amgt';
  $scope.tblTopDep      = 'AnimalAGCriador4';
  $scope.cmpTopDep      = 'mgt';

  $scope.carregado = false;
  $scope.pesquisa = false;
  // $scope.retorno = 'texto';
  // $scope.animais = $rootScope.animais;

  $scope.verificaDataNascimento = function(dtNasc) {
    if(dtNasc == '0000-00-00' || typeof dtNasc == "undefined") {
      return '-';
    } else {
      data = dtNasc.split('-');
      return data[2]+'/'+data[1]+'/'+data[0];
    }
  };
})

.controller('VisualizarAnimalCtrl', function($scope, $rootScope, $state, $stateParams, $http, $localStorage, $ionicLoading, $ionicScrollDelegate, $cordovaNetwork, API) {
  $ionicLoading.show();
  $ionicScrollDelegate.$getByHandle('arvore-genealogica').scrollTo(250, 0);

  if(typeof($rootScope.nomeDep) == 'undefined') { $scope.nomeDep = ""; }
  if(typeof($rootScope.tblValorDep) == 'undefined') { $scope.tblValorDep = ""; }
  if(typeof($rootScope.cmpValorDep) == 'undefined') { $scope.cmpValorDep = ""; }
  if(typeof($rootScope.tblAcuraciaDep) == 'undefined') { $scope.tblAcuraciaDep = ""; }
  if(typeof($rootScope.cmpAcuraciaDep) == 'undefined') { $scope.cmpAcuraciaDep = ""; }
  if(typeof($rootScope.tblTopDep) == 'undefined') { $scope.tblTopDep = ""; }
  if(typeof($rootScope.cmpTopDep) == 'undefined') { $scope.cmpTopDep = ""; }

  $scope.offline = false;

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

  // if($cordovaNetwork.isOffline()) {
  //   $ionicLoading.hide();
  //
  //   angular.forEach($localStorage.animaisSalvos, function(v, i) {
  //     if(v.cga == parseInt($stateParams.cga)) {
  //       encontrado = true;
  //
  //       $scope.animal = v;
  //       $scope.arvoreGenealogica = v.arvoreGenealogica;
  //       $scope.infoAval = v.infoAval;
  //     }
  //   });
  //
  //   $scope.offline = true;
  // } else {
    if (!encontrado) {
      encontrado = true;
      $http.post(API.url + 'api/v1/cga', {
        username: $localStorage.username,
        cgaanimal: parseInt($stateParams.cga),
        quantidade: API.quantidade
      }).then(function (sucesso) {
        $ionicLoading.hide();

        $scope.animal = sucesso.data.doc[0];
        // console.log($scope.animal);

        $http.post(API.url + 'api/v1/gen9a', {
          username: $localStorage.username,
          cgaanimal: $scope.animal.cga
        }).then(function (sucesso) {
          $ionicLoading.hide();

          $scope.arvoreGenealogica = $scope.montarArvoreGenealogica(sucesso.data);

          $http.post(API.url + 'api/v1/infoaval').then(function(response) {
            $scope.infoAval = response.data.infoaval;
          })

        }, function (erro) {
          // if(erro.data.status == 400 && erro.data.message == "Token expirou!") {
          //   Usuario.logout();
          //   $state.go("login");
          // }
          console.log('Erro', erro);
        });

        if($scope.verificarAnimalSalvo()) {
          $scope.removerAnimalSalvo();
          $scope.salvarAnimal();
        }
      }, function (erro) {
        // if(erro.data.status == 400 && erro.data.message == "Token expirou!") {
        //   Usuario.logout();
        //   $state.go("login");
        // }
        console.log('Erro', erro);
      });
    }

    $scope.montarArvoreGenealogica = function (arvoreGenealogica) {
      novaArvoreGenealogica = arvoreGenealogica[0];

      arvoreGenealogica.shift();
      angular.forEach(arvoreGenealogica, function (c, v) {
        if (novaArvoreGenealogica.pai_cga == c.cga) {
          novaArvoreGenealogica.pai = c;
        }

        if (novaArvoreGenealogica.mae_cga == c.cga) {
          novaArvoreGenealogica.mae = c;
        }
      });

      angular.forEach(arvoreGenealogica, function (c, v) {
        if (novaArvoreGenealogica.pai.pai_cga == c.cga) {
          novaArvoreGenealogica.pai.pai = c;
        }

        if (novaArvoreGenealogica.pai.mae_cga == c.cga) {
          novaArvoreGenealogica.pai.mae = c;
        }

        if (novaArvoreGenealogica.mae.pai_cga == c.cga) {
          novaArvoreGenealogica.mae.pai = c;
        }

        if (novaArvoreGenealogica.mae.mae_cga == c.cga) {
          novaArvoreGenealogica.mae.mae = c;
        }
      });

      return novaArvoreGenealogica;
    };

    $scope.irParaAnimal = function (cga) {
      console.log(cga);
      $state.go('app.visualizar-animal', {cga: cga});
    };
  // }

  if (!encontrado) {
    $state.go('app.principal');
  }

  $scope.verificaDataNascimento = function(dtNasc) {
    if(dtNasc == '0000-00-00' || typeof dtNasc == "undefined") {
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

  $scope.verificarAnimalSalvo = function() {
    animalSalvo = false;
    angular.forEach($localStorage.animaisSalvos, function(v, i) {
      if(v.cga == $scope.animal.cga)
        animalSalvo = true;
    });

    return animalSalvo;
  };

  $scope.salvarAnimal = function() {
    if(!$scope.verificarAnimalSalvo()) {
      $scope.animal.arvoreGenealogica = $scope.arvoreGenealogica;
      $scope.animal.infoAval = $scope.infoAval;
      $localStorage.animaisSalvos.push($scope.animal);
    }
  };

  $scope.removerAnimalSalvo = function() {
    if($scope.verificarAnimalSalvo()) {
      angular.forEach($localStorage.animaisSalvos, function(v, i) {
        if(v.cga == $scope.animal.cga)
          $localStorage.animaisSalvos.splice(i, 1);
      });
    }
  };
})

.controller('AnimaisSalvosListagemCtrl', function($scope, $rootScope, $localStorage) {
  $scope.tituloTela = "Animais Salvos";

  $scope.nomeDep        = 'MGTe';
  $scope.tblValorDep    = 'AnimalAGCriador';
  $scope.cmpValorDep    = 'mgt';
  $scope.tblAcuraciaDep = 'AnimalAGCriador';
  $scope.cmpAcuraciaDep = 'amgt';
  $scope.tblTopDep      = 'AnimalAGCriador4';
  $scope.cmpTopDep      = 'mgt';

  $rootScope.animais = $localStorage.animaisSalvos;

  $scope.verificaDataNascimento = function(dtNasc) {
    if(dtNasc == '0000-00-00' || typeof dtNasc == "undefined") {
      return '-';
    } else {
      data = dtNasc.split('-');
      return data[2]+'/'+data[1]+'/'+data[0];
    }
  }
});
