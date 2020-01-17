// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    var app = WinJS.Application;

    //var displayProperties = Windows.Graphics.Display.DisplayProperties;
   

   



    // App bar initialization.
    document.addEventListener("DOMContentLoaded", function () {
        //var appView = Windows.UI.ViewManagement.ApplicationView;
        //Windows.UI.ViewManagement.ApplicationView.getForCurrentView().addEventListener("viewstatechanged", onViewStateChanged);

        window.addEventListener("resize", resize);

        WinJS.UI.processAll();
    }, false);

    function onViewStateChanged() {
        var viewStates = Windows.UI.ViewManagement.ApplicationViewState;
        var newViewState = Windows.UI.ViewManagement.ApplicationView.value;

        if (newViewState === viewStates.snapped) {
            isPaused = true;
            isSnnaped = true;

        } else {
            isSnnaped = false;
        }

        //resize();
        
    }

    function appBarBtMenu() {
        //ChangeCameraPosition(CameraAltitudeVirtual - 130, true);
        menuScreen.showMenu = true;
        isPaused = false;
        currentScreen = 0;
        gameOverScreen.hide();
    }

    app.onactivated = function (eventObject) {
        if (eventObject.detail.kind === Windows.ApplicationModel.Activation.ActivationKind.launch) {
            if (eventObject.detail.previousExecutionState !== Windows.ApplicationModel.Activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize 
                // your application here.
                
                Game();
            } else {
                // TODO: This application has been reactivated from suspension. 
                // Restore application state here.
                fromSuspend = true;
                Game();
            }
            WinJS.UI.processAll();
        }
    };

    app.oncheckpoint = function (eventObject) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the 
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // eventObject.setPromise().

        var applicationData = Windows.Storage.ApplicationData.current;
        
        var eggSeriatized = JSON.stringify(egg);
        applicationData.localSettings.values["egg"] = eggSeriatized;
        var listLandingPlacesSerializedArray = new Array();

        for (var i = 0; i < listLandingPlaces.length; i++) {
            listLandingPlacesSerializedArray[i] = listLandingPlaces[i];

            if (listLandingPlaces[i].Place.Altitude > CameraAltitudeVirtual + 110 || i >= 5) {
                break;
            }
        }
        var listLandingPlacesSerialided = JSON.stringify(listLandingPlacesSerializedArray);
        applicationData.localSettings.values["listLandingPlaces"] = listLandingPlacesSerialided;
        applicationData.localSettings.values["firstAltitude"] = firstAltitude;
        applicationData.localSettings.values["userPoints"] = userPoints;
        applicationData.localSettings.values["currentScreen"] = currentScreen;

    };

    

    var w8_Mode = 1;
    var canvas;// = document.getElementById('canvasGame');
    var ctx; // = canvas.getContext('2d');
    var attemptFPS = 0;
    var loaded = 0;

    var deepControl = new DeepControl();

    var CameraAltitudeReal = 0; // A altitude real da camera fica na verdade bem no topo do jogo... OBS.: Use o ChangePositon para mudar a posição
    var CameraAltitudeVirtual = 0; // ... por isso a necessidade do virtual que fica no chão. OBS.: Use o ChangePositon para mudar a posição
    var newCameraAltitude = 0; // OBS.: Use o ChangePositon para mudar a posição
    var CameraSpecialPosition = new Vector2(0, 0);
    var isCameraAnimating = 0;
    var firstAltitude = 0;

    var gameDashboardPosition = new Vector2(0, 0);
    var gameDashboardSize = new Size(0, 0);
    var gameDashboarMarginSide;

    var IsHolding = false;
    var IsHoldingStartAltitude = 0;
    var IsHoldingCurrentAltitude = 0;

    var nextAltitude = 31; // altitude do primeiro nest

    var listLandingPlaces = new Array();

    var _storeNest1 = new Nest(0, 0); // Nest que vai guardar algumas imagens e propriedades padrões

    var forceResize = false;

    var egg = new Egg();
    var eggDefault = new Egg();

    var currentScreen = 0;// 0 = Menu, 1 Gameplay, 3 Final Screen

    var menuScreen = new MenuScreen();
    var gameOverScreen = new GameoverScreen();

    var isPaused = false;
    var isPausedOpacity = 0;

    var userPoints = 0;
    var userPointsScreen = 0; // Valor que é mostrado na tela
    var isSnnaped = false;

    var fromSuspend = false; // se entrar no estado durmant...

    var soundBump = new Audio("sounds/bump.wav");
    var nestLanding = new Audio("sounds/land.wav");
    var stretchSound = new Audio("sounds/stretch.wav");

    function Game() {

        canvas = document.getElementById('canvasGame');
        ctx = canvas.getContext('2d');

        var imgExemplo = new Image();

        var tempImgRoof = new Image(),
        tempImgNestNormalFront = new Image(),
        tempImgNestNormalBack = new Image(),
        tempImgEgg = new Image(),
        tempTest = new Image(),
        tempMenuLogoImage = new Image(),
        tempTbPlay = new Image(),
        tempBtPlayImage = new Image(),
        tempBrokenEggImage = new Image();

        var loader = new PxLoader(),
        tempImgRoof = loader.addImage('images/fundomata.jpg'),
        tempImgNestNormalFront = loader.addImage('images/nestFrontFull.png'),
        tempImgNestNormalBack = loader.addImage('images/nestBackFull.png'),
        tempImgEgg = loader.addImage('images/eggFull2.png'),
        tempMenuLogoImage = loader.addImage('images/logoFinal.png'),
        tempTbPlay = loader.addImage('images/btPlay.png'),
        tempBtPlayImage = loader.addImage('images/btPlayAgain.png'),
        tempBrokenEggImage = loader.addImage('images/ovoQuebrado.png');

        loader.addCompletionListener(function () {

            loaded = 1;
            deepControl.RoofImage = tempImgRoof;
            deepControl.RoofImage.width = 2100;
            deepControl.RoofImage.height = 1200;
            deepControl.RoofSize = new Size(deepControl.RoofImage.width, deepControl.RoofImage.height);

            tempImgNestNormalFront.width *= 0.7;
            tempImgNestNormalFront.height *= 0.7;
            tempImgEgg.width *= 0.4;
            tempImgEgg.height *= 0.4;

            _storeNest1.ImgNestFront = tempImgNestNormalFront;
            _storeNest1.ImgNestBack = tempImgNestNormalBack;

            menuScreen.menuLogoImage = tempMenuLogoImage;
            menuScreen.btPlayImage = tempTbPlay;
            gameOverScreen.btPlayAgainImage = tempBtPlayImage;
            gameOverScreen.figEggDestroiedImage = tempBrokenEggImage;

            eggDefault.ImgEgg = tempImgEgg;
            eggDefault.Size = new Size(eggDefault.ImgEgg.width, eggDefault.ImgEgg.height);

            

            // deixe por ultimo
            forceResize = true;

            // suspend
            if (fromSuspend) {

                var applicationData = Windows.Storage.ApplicationData.current;

                userPoints = applicationData.localSettings.values["userPoints"];
                userPointsScreen = userPoints;

                egg = new Egg();
                listLandingPlaces = new Array();

                currentScreen = applicationData.localSettings.values["currentScreen"];

                var listLandingPlacesRescued = JSON.parse(applicationData.localSettings.values["listLandingPlaces"]);

                firstAltitude = 0;
                nextAltitude = 0;

                switch (currentScreen) {

                    case 0:// menu
                        // nao fazer nada
                        break;

                    case 1: // gameplay
                        //continueGame(listLandingPlacesRescued[0].Place.Altitude, listLandingPlacesRescued[listLandingPlacesRescued.length - 1].Place.Altitude);

                        currentScreen = 1;
                        var eggRescued = JSON.parse(applicationData.localSettings.values["egg"]);
                        egg.Altitude = eggRescued.Altitude;
                        egg.Latitude = eggRescued.Latitude;

                        for (var i = 0; i < listLandingPlacesRescued.length; i++) {
                            listLandingPlaces[i] = new LandingPlace(1, listLandingPlacesRescued[i].Place.Altitude, listLandingPlacesRescued[i].Place.Latitude, 0, listLandingPlacesRescued[i].Place.LatitudeSpeed, listLandingPlacesRescued[i].Place.CurrentDirection);
                            listLandingPlaces[i].Place.ImgNestFront = _storeNest1.ImgNestFront;
                            listLandingPlaces[i].Place.ImgNestBack = _storeNest1.ImgNestBack;

                            var placeAltitude = Math.round(listLandingPlacesRescued[i].Place.Altitude + 1);
                            var eggAltitude = Math.round(egg.Altitude);

                            if (placeAltitude == eggAltitude)
                                egg.CurrentLandingPlace = listLandingPlaces[i];


                        }

                        egg.ImgEgg = eggDefault.ImgEgg;
                        egg.Size = eggDefault.Size;

                        firstAltitude = applicationData.localSettings.values["firstAltitude"];
                        nextAltitude = listLandingPlacesRescued[listLandingPlacesRescued.length - 1].Place.Altitude;

                        menuScreen.showMenu = false;


                        ChangeCameraPosition(egg.CurrentLandingPlace.Place.Altitude - 26, false);


                        break;
                    case 2: // lost screen

                        gameOverScreen.highestPoints = applicationData.localSettings.values["highScore"];

                        if (gameOverScreen.highestPoints == undefined)
                            gameOverScreen.highestPoints = 0;

                        gameOverScreen.points = userPoints;

                        menuScreen.showMenu = false;
                        gameOverScreen.show();
                        gameOverScreen.screenOpacity = 1;

                        ChangeCameraPosition(firstAltitude, false);

                        break;
                }
            

            }

        });

        canvas.addEventListener('mousedown', function (e) {
            if (currentScreen == 1) {
                if (e.layerY > egg.CurrentLandingPlace.Place.Position.Y && e.layerY < egg.CurrentLandingPlace.Place.Position.Y + egg.CurrentLandingPlace.Place.Size.Height) {
                    IsHolding = true;
                    IsHoldingStartAltitude = GetAltitudeByRealY(e.layerY);
                }
            }
        }, false);

        canvas.addEventListener('mousemove', function (e) {
            if (currentScreen == 1) {
                if (IsHolding) {
                    IsHoldingCurrentAltitude = GetAltitudeByRealY(e.layerY);
                    egg.CurrentLandingPlace.Place.Pull(IsHoldingStartAltitude, IsHoldingCurrentAltitude);
                }
            }
        }, false);

        canvas.addEventListener('mouseup', function (e) {
            if (currentScreen == 1) {
                IsHolding = false;
                egg.CurrentLandingPlace.Place.Release();
            }
        }, false);

        canvas.addEventListener('click', function (e) {
            
            
            if (isPaused && !isSnnaped) {
                isPaused = false;
            } else if (menuScreen.showMenu) {

                newGame();
                
                currentScreen = 1;
                
            } else if (gameOverScreen.showScreen) {
                newGame();
                gameOverScreen.hide();
                currentScreen = 1;
            }

            

        }, false);

        

        document.onkeyup = function (e) {
            if (e.keyCode == 32) { // espaço

                

            }
            
        };

       


        loader.start();

        // Controle de FPS e DeltaTime
        lastTime = new Date();
        setInterval(function () {
            var valorFPS = Math.round(1000 / (1000 * deltaTime))
            fpsValue = valorFPS + " fps";
           
            if (valorFPS < 55) {
                attemptFPS++;

                if (attemptFPS > 5) {
                    //fpsStandard = 30;// Desabilitado por enquanto o controle de 30 fps
                }
            } else {
                attemptFPS = 0;
            }


        }, 500);
        
        update();//StartFPS();

        //#W8
        currentAppBar.addEventListener("beforehide", function (eventHandles) { isPaused = false; });
        currentAppBar.addEventListener("beforeshow", function (eventHandles) { if (currentScreen == 1) { isPaused = true; }});
        cmdMenu.addEventListener("click", appBarBtMenu, false);

    }

    

    var triggerBugFPS = false;

    function newGame() {
        listLandingPlaces = new Array();
        egg = new Egg();
        egg.ImgEgg = eggDefault.ImgEgg;
        egg.Size = eggDefault.Size;

        firstAltitude = CameraAltitudeReal + 20;

        menuScreen.showMenu = false;
        GenerateNests(firstAltitude, true);

        ChangeCameraPosition(firstAltitude - 26, true);

        egg.CurrentLandingPlace = listLandingPlaces[0]; // só para testes
    }

    function continueGame(_firstAltitude, _nextAltitude) {
        listLandingPlaces = new Array();
        egg = new Egg();
        egg.ImgEgg = eggDefault.ImgEgg;
        egg.Size = eggDefault.Size;

        firstAltitude = _firstAltitude + 20;
        nextAltitude = _nextAltitude;

        menuScreen.showMenu = false;

        ChangeCameraPosition(firstAltitude - 26, true);

        egg.CurrentLandingPlace = listLandingPlaces[0]; // só para testes
    }

    function update() {

        if (triggerBugFPS == false)
            triggerBugFPS = true;
        else
            triggerBugFPS = false;

        if (triggerBugFPS) {

            if (forceResize) {
                resize();
                forceResize = false;
            }

            // Controle de FPS e DeltaTime
            var newTime = new Date();
            var newDeltaTime = (newTime - lastTime) / 1000;
            lastTime = newTime;
            deltaTime = newDeltaTime;

            // Se o jogo ficar pausado (de alguma forma) por mais de 300 milésimos, levar em consideração o último deltaTime.
            if (newDeltaTime > 0.3) {
                deltaTime = 60 / 1000;
            }

            if (loaded) {
                if (!isPaused) {

                    if (CameraAltitudeReal + 110 > nextAltitude && !menuScreen.showMenu) {
                        GenerateNests(nextAltitude, false);
                    }


                    if (newCameraAltitude != CameraAltitudeReal) {
                        var distance = newCameraAltitude - CameraAltitudeReal;
                        distance *= 0.04;
                        CameraAltitudeReal = CameraAltitudeReal + distance;
                        isCameraAnimating = 1;
                    } else {
                        isCameraAnimating = 0;
                    }

                    deepControl.update();

                    menuScreen.update();

                    switch (currentScreen) {

                        case 0: // Menu inicial

                            break;

                        case 1:// Gameplay

                            egg.update();

                            for (var i = 0; i < listLandingPlaces.length; i++) {
                                if (listLandingPlaces[i].Place.Altitude < CameraAltitudeReal + 25) {
                                    listLandingPlaces[i].update();

                                    if (listLandingPlaces[i].IsToDelete) {
                                        listLandingPlaces.splice(i, 1);
                                    }
                                }
                            }

                            break;
                    }

                    if (userPoints != userPointsScreen) {
                        var distance = userPoints - userPointsScreen;
                        distance *= 0.1;
                        userPointsScreen += distance;
                    }

                    gameOverScreen.update();

                } else {
                    resize();
                }

                if (isPaused && isPausedOpacity < 1)
                    isPausedOpacity += 0.05;
                else if (!isPaused && isPausedOpacity > 0)
                    isPausedOpacity -= 0.05;

                //Deixar sempre no final
                draw();
            }

            

        }
        
        setTimeout(update, 1000 / fpsStandard);


    }

    

    function draw() {

        

        ctx.fillStyle = "#a2c9ea";
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, document.documentElement.offsetWidth, document.documentElement.offsetHeight);

        deepControl.draw(ctx);
        /*
        ctx.save();
        ctx.globalAlpha = 0.1;
        ctx.fillStyle = "black";
        ctx.fillRect(gameDashboardPosition.X, gameDashboardPosition.Y, gameDashboardSize.Width, gameDashboardSize.Height);
        ctx.restore();
        */
        if (currentScreen == 1) {
            for (var i = 0; i < listLandingPlaces.length; i++) {
                listLandingPlaces[i].Place.draw(ctx, 0);
            }
            egg.draw(ctx, 0);
            for (var i = 0; i < listLandingPlaces.length; i++) {
                listLandingPlaces[i].Place.draw(ctx, 1);
            }
            egg.draw(ctx, 1);
        }

        ctx.save();
        if (currentScreen == 1) {
            ctx.globalAlpha = 0.75;

            if (menuScreen.showMenuOpacity > 0) {
                ctx.globalAlpha = (1 - menuScreen.showMenuOpacity) * 0.75;
            }

            if (gameOverScreen.screenOpacity > 0) {
            
                ctx.globalAlpha = (1 - gameOverScreen.screenOpacity) * 0.75;
            }
        
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, document.documentElement.offsetWidth, gameDashboardSize.Height * 0.05);

            ctx.restore();

        
            ctx.save();

            if (menuScreen.showMenuOpacity > 0) {
                ctx.globalAlpha = 1 - menuScreen.showMenuOpacity;
            }

            if (gameOverScreen.screenOpacity > 0) {

                ctx.globalAlpha = (1 - gameOverScreen.screenOpacity);
            }

            ctx.fillStyle = "black";
            ctx.font = gameDashboardSize.Height * 0.04 + "px Segoe UI";

            ctx.fillText("Pontos: " + Math.round(userPointsScreen), gameDashboardPosition.X, gameDashboardSize.Height * 0.04);
            ctx.restore();
        }

        

        menuScreen.draw(ctx);
        gameOverScreen.draw(ctx);

        if (isPausedOpacity > 0) {
            ctx.save();
            ctx.globalAlpha = isPausedOpacity * 0.7;
            ctx.fillRect(0, 0, document.documentElement.offsetWidth, document.documentElement.offsetHeight);

            var pauseText;
            
            ctx.restore();
            ctx.save();
            ctx.fillStyle = "white";
            ctx.globalAlpha = isPausedOpacity;
            ctx.font = document.documentElement.offsetHeight * 0.09 + "px Segoe UI";

                pauseText = new Vector2((document.documentElement.offsetWidth / 2) - (ctx.measureText("Paused").width / 2), document.documentElement.offsetHeight * 0.55);
            

            ctx.fillText("Paused", pauseText.X, pauseText.Y);
            ctx.restore();
        }
        // Deixe sempre embaixo o seguinte código de draw
        /*
        ctx.fillStyle = "black";
        ctx.font = "30px Segoe UI";
        ctx.fillText(fpsValue, 10, document.documentElement.offsetHeight);
        */
    }

    function GenerateNests(_staringAltitude, _firstGen) {

        var numberExistingLandingPlaces = 0;
        var nextMustHighSpeed = false;
        var maxDistanceBetween = 0;
        var minDistanceBetween = 0;

        if (_staringAltitude - firstAltitude < 300) {
            maxDistanceBetween = 25;
        }
        else if (_staringAltitude - firstAltitude < 500) {
            maxDistanceBetween = 35;
        }
        else {
            maxDistanceBetween = 40;
        }

        if (_staringAltitude - firstAltitude < 300) {
            minDistanceBetween = 15;
        }
        else if (_staringAltitude - firstAltitude < 500) {
            minDistanceBetween = 25;
        }
        else {
            minDistanceBetween = 35;
        }

        if (listLandingPlaces != null) {
            numberExistingLandingPlaces = listLandingPlaces.length;
        }

        for (var i = numberExistingLandingPlaces; i < numberExistingLandingPlaces + 10; i++) {

            var newNestLatitude = Math.random() * 100;
            var newNestSpeed = Math.random() * 20;
            var newNestFirstDirection = Math.random();


            if (newNestFirstDirection > 0.5)
                newNestFirstDirection = -1;
            else
                newNestFirstDirection = 1;

            var altitudeNotReady = true;
            while (altitudeNotReady) {
                
                var newNestAltitude = Math.random() * maxDistanceBetween;
                if (newNestAltitude >= minDistanceBetween) {
                    newNestAltitude += nextAltitude;

                    altitudeNotReady = false;

                    
                }

                

            }

            if (i == 0 && _firstGen) {
                    newNestAltitude = _staringAltitude;
                    _firstGen = false;
                
            }

            if (_staringAltitude == 0 && i== 0) {
                
                //newNestSpeed = 5;
            }

            if (nextMustHighSpeed) {
                newNestSpeed += 10;
                nextMustHighSpeed = false;

                if (newNestSpeed > 20)
                    newNestSpeed = 20;
            } else if (newNestSpeed < 3) {
                nextMustHighSpeed = true;
            }

            nextAltitude = newNestAltitude;

            listLandingPlaces[i] = new LandingPlace(1, newNestAltitude, newNestLatitude, 0, newNestSpeed, newNestFirstDirection);
           
            listLandingPlaces[i].Place.ImgNestFront = _storeNest1.ImgNestFront;
            listLandingPlaces[i].Place.ImgNestBack = _storeNest1.ImgNestBack;
           
        }

        forceResize = true;
    }

    function GetAltitudeY(_altitude) {
        /// <summary>Converte a altitude real do objeto a partir da camera.</summary>
        /// <returns type="Number">Valor real da altura.</returns>
        var currentConvertedCameraAltitude = CameraAltitudeReal * document.documentElement.offsetHeight / 100;
        var currentConvertedObjectAltitude = _altitude * document.documentElement.offsetHeight / 100;
        return currentConvertedCameraAltitude - currentConvertedObjectAltitude;
    }

    function GetLatitude(_latitude) {
        /// <summary>Converte a altitude real do objeto a partir da camera.</summary>
        /// <returns type="Number">Valor da latitude de 0 a 100.</returns>
        return gameDashboardPosition.X + (_latitude * (gameDashboardSize.Width / 100));
    }

    function GetAltitudeByRealY(_altitude) {
        /// <summary>Converte a altitude real do objeto a partir da camera.</summary>
        /// <returns type="Number">Valor real da altura.</returns>
        //var currentConvertedCameraAltitude = CameraAltitudeReal * 100 / document.documentElement.offsetHeight;
        var currentConvertedObjectAltitude = _altitude * 100 / document.documentElement.offsetHeight;
        //return currentConvertedCameraAltitude - currentConvertedObjectAltitude;

        return (CameraAltitudeVirtual - currentConvertedObjectAltitude) + 100;
    }


    function ChangeCameraPosition(_newAltitude, animation) {
        /// <summary>Função feita para mudar a posição da camera. Algo de nota é que a camera por padrao é posicionada no meio da tela.</summary>
        /// <param name="_newAltitude" type="Number">Nova altura que vai ficar a altitude.</param>
        /// <param name="_newAltitude" type="Bool">Se deve ter animação ou não.</param>


        if (animation)
            newCameraAltitude = _newAltitude + 100; // Por ficar no meio da tela, vem do +50.
        else {
            newCameraAltitude = _newAltitude + 100;
            CameraAltitudeReal = _newAltitude + 100;
        }

        CameraAltitudeVirtual = _newAltitude;

    }

    function resize() {
        if (ctx != null) {
            if (!w8_Mode) {
                ctx.document.documentElement.offsetWidth = window.innerWidth;
                ctx.document.documentElement.offsetHeight = window.innerHeight;
            } else {
                //var resolutionScale = Windows.Graphics.Display.DisplayProperties.resolutionScale;
                var _body = document.getElementsByTagName('body');
                
                var height = screen.height; //_body[0].offsetHeight;
                
                var width = screen.width;//_body[0].offsetWidth;
                //$('#resolution').text('Height: ' + height + ' Width: ' + width + ' ResolutionScale: ' + resolutionScale);

                ctx.canvas.width = width;//window.innerWidth;
                ctx.canvas.height = height;//window.innerHeight;

                onViewStateChanged();
            }
            deepControl.RoofSize.Height = GetResolutionHeight(deepControl.RoofImage.height);
            deepControl.RoofSize.Width = GetResolutionWidth(deepControl.RoofImage.width, deepControl.RoofImage.height, deepControl.RoofSize.Height);
            deepControl.resize();

            gameDashboardSize.Height = document.documentElement.offsetHeight;
            gameDashboardSize.Width = GetResolutionWidth(665, 1200, gameDashboardSize.Height);
            gameDashboardPosition.X = (document.documentElement.offsetWidth / 2) - (gameDashboardSize.Width / 2);
            gameDashboarMarginSide = gameDashboardPosition.X;

            for (var i = 0; i < listLandingPlaces.length; i++) {
                if (listLandingPlaces[i].ID == 1) {
                    listLandingPlaces[i].Place.Size.Height = GetResolutionHeight(listLandingPlaces[i].Place.ImgNestFront.height);
                    listLandingPlaces[i].Place.Size.Width = GetResolutionWidth(listLandingPlaces[i].Place.ImgNestFront.width, listLandingPlaces[i].Place.ImgNestFront.height, listLandingPlaces[i].Place.Size.Height);
                }
            }

            egg.Size.Height = GetResolutionHeight(egg.ImgEgg.height);
            egg.Size.Width = GetResolutionWidth(egg.ImgEgg.width, egg.ImgEgg.height, egg.Size.Height);

            menuScreen.resize(canvas);
            gameOverScreen.resize(ctx);
            
        }
    }

/****************************** Screens ********************************/
    function MenuScreen() {
        this.menuLogoImage = new Image();
        this.showMenuOpacity = 0;
        this.showMenu = true;
        this.menuLogoPosition = new Vector2(0, 0);
        this.menuLogoSize = new Size(1, 1);

        this.btPlayImage = new Image();
        this.menuBtPlayPosition = new Vector2(0, 0);
        this.menuBtPlaySize = new Size(1, 1);
        

        this.resize = function (_canvas) {
            this.menuLogoSize.height = GetResolutionHeight(this.menuLogoImage.height);
            this.menuLogoSize.width = GetResolutionWidth(this.menuLogoImage.width, this.menuLogoImage.height, this.menuLogoSize.height);
            this.menuLogoPosition.X = (document.documentElement.offsetWidth / 2) - (this.menuLogoSize.width / 2);
            this.menuLogoPosition.Y = document.documentElement.offsetHeight * 0.05;

            this.menuBtPlaySize.height = GetResolutionHeight(this.btPlayImage.height);
            this.menuBtPlaySize.width = GetResolutionWidth(this.btPlayImage.width, this.btPlayImage.height, this.menuBtPlaySize.height);
            this.menuBtPlayPosition.X = (document.documentElement.offsetWidth / 2) - (this.menuBtPlaySize.width / 2);
            this.menuBtPlayPosition.Y = document.documentElement.offsetHeight * 0.68;
        }

        this.update = function () {
            if (!this.showMenu && this.showMenuOpacity > 0) {
                this.showMenuOpacity *= 0.9;
                if (this.showMenuOpacity < 0) {
                    this.showMenuOpacity = 0;
                }

            } else if (this.showMenu && this.showMenuOpacity < 1) {
                this.showMenuOpacity += 0.05;
                if (this.showMenuOpacity > 1) {
                    this.showMenuOpacity = 1;
                }

            }
            if (this.showMenu) {

                ChangeCameraPosition(CameraAltitudeVirtual + (10 * deltaTime), false);
            }
        }

        this.draw = function (_ctx) {
            if (this.showMenuOpacity > 0) {
                //var currentMenuHeight = GetResolutionHeight(menuImage.height);
                //var currentMenuWidth = GetResolutionWidth(menuImage.width,
                _ctx.save();
                _ctx.globalAlpha = this.showMenuOpacity;
                _ctx.drawImage(this.menuLogoImage, this.menuLogoPosition.X, this.menuLogoPosition.Y, this.menuLogoSize.width, this.menuLogoSize.height);
                _ctx.drawImage(this.btPlayImage, this.menuBtPlayPosition.X, this.menuBtPlayPosition.Y, this.menuBtPlaySize.width, this.menuBtPlaySize.height);

                _ctx.restore();
            }

        }
    }

    function GameoverScreen() {
        this.btPlayAgainImage = new Image();
        this.btPlayAgainPosition = new Vector2(0, 0);
        this.btPlayAgainSize = new Size(1, 1);

        this.figEggDestroiedImage = new Image();
        this.figEggDestroiedPosition = new Vector2();
        this.figEggDestroiedSize = new Size();

        this.points = 0;
        this.highestPoints = 0;

        this.screenOpacity = 0;
        var newScreenOpacity = 0;
        this.showScreen = false;

        var gameOverTextPosition = new Vector2(0, 0),
        label1 = new Vector2(0, 0),
        label2 = new Vector2(0, 0),
        label3 = new Vector2(0, 0),
        label4 = new Vector2(0, 0);

        this.draw = function (_ctx) {

            if (this.screenOpacity > 0) {
                _ctx.save()

                _ctx.globalAlpha = this.screenOpacity;

                _ctx.fillStyle = "white";
                _ctx.font = gameDashboardSize.Height * 0.1 + "px Segoe UI";
                _ctx.fillText("Game Over", gameOverTextPosition.X, gameOverTextPosition.Y);

                _ctx.font = gameDashboardSize.Height * 0.028 + "px Segoe UI";
                _ctx.fillText("Your score:", label1.X, label1.Y);
                _ctx.fillText("Your highest score:", label3.X, label3.Y);

                _ctx.font = gameDashboardSize.Height * 0.055 + "px Segoe UI";
                _ctx.fillText(this.points + " Points", label2.X, label2.Y);

                _ctx.font = gameDashboardSize.Height * 0.055 + "px Segoe UI";
                _ctx.fillText(this.highestPoints + " Points", label4.X, label4.Y);

                _ctx.drawImage(this.btPlayAgainImage, this.btPlayAgainPosition.X, this.btPlayAgainPosition.Y, this.btPlayAgainSize.Width, this.btPlayAgainSize.Height);
                _ctx.drawImage(this.figEggDestroiedImage, this.figEggDestroiedPosition.X, this.figEggDestroiedPosition.Y, this.figEggDestroiedSize.Width, this.figEggDestroiedSize.Height);

                _ctx.restore();
            }

        }

        this.update = function () {

            if (newScreenOpacity != this.screenOpacity) {
                var distance = newScreenOpacity - this.screenOpacity;
                distance *= 0.1;
                this.screenOpacity = this.screenOpacity + distance;
            }

            if (this.screenOpacity >= 0.9 && this.showScreen) {
                currentScreen = 2;
            }

        }

        this.resize = function (_ctx) {
            _ctx.save();

            _ctx.font = gameDashboardSize.Height * 0.1 + "px Segoe UI";
            gameOverTextPosition.X = (document.documentElement.offsetWidth / 2) - (_ctx.measureText("Game Over").width / 2);
            gameOverTextPosition.Y = document.documentElement.offsetHeight * 0.12;

            _ctx.font = gameDashboardSize.Height * 0.028 + "px Segoe UI";
            label1.X = gameDashboardPosition.X + (gameDashboardSize.Width * 0.15);
            label1.Y = gameDashboardSize.Height * 0.2;
            label3.X = gameDashboardPosition.X + (gameDashboardSize.Width * 0.15);
            label3.Y = gameDashboardSize.Height * 0.38;

            _ctx.font = gameDashboardSize.Height * 0.05 + "px Segoe UI";
            label2.X = gameDashboardPosition.X + (gameDashboardSize.Width * 0.15);
            label2.Y = gameDashboardSize.Height * 0.275;
            label4.X = gameDashboardPosition.X + (gameDashboardSize.Width * 0.15);
            label4.Y = gameDashboardSize.Height * 0.46;

            this.btPlayAgainSize.Height = GetResolutionHeight(this.btPlayAgainImage.height);
            this.btPlayAgainSize.Width = GetResolutionWidth(this.btPlayAgainImage.width, this.btPlayAgainImage.height, this.btPlayAgainSize.Height);
            this.btPlayAgainPosition.X = (document.documentElement.offsetWidth / 2) - (this.btPlayAgainSize.Width / 2);
            this.btPlayAgainPosition.Y = document.documentElement.offsetHeight * 0.52;

            this.figEggDestroiedSize.Height = GetResolutionHeight(this.figEggDestroiedImage.height);
            this.figEggDestroiedSize.Width = GetResolutionWidth(this.figEggDestroiedImage.width, this.figEggDestroiedImage.height, this.figEggDestroiedSize.Height);
            this.figEggDestroiedPosition.X = (document.documentElement.offsetWidth / 2) - (this.figEggDestroiedSize.Width / 2);
            this.figEggDestroiedPosition.Y = document.documentElement.offsetHeight * 0.68;

            _ctx.restore();
        }

        this.show = function () {
            this.showScreen = true;
            newScreenOpacity = 1;
        }
        this.hide = function () {
            newScreenOpacity = 0;
            this.showScreen = false;
        }
    }

/****************************** Objetos ********************************/
    function Egg() {
        var forceAltitude = 0;
        var forceLatitude = 0;
        var currentOrder; // Ordem de draw na tela
        //var isPositionAnimated = false;
        var latitudeAnimation = 0;
        var altitudeAnimation = 0;
        var rotationReaction = false;// controla a animação de reação do ovo, quando cai no ninho
        //var altitudeReaction = 0; // faz o ovo dar um pequeno pulinho quando chega no ninho
        var followCamera = false;
        var followCameraDifference = 0;
        var followCameraStopFollow = 0;
        var lastAltitude;
        

        this.ImgEgg = new Image();
        this.Altitude;
        this.Latitude = 0;        
        this.CurrentLandingPlace = null;
        this.IsJumping = false;
        this.Rotation = 0;
        this.RotationForce = 0;

        this.Position = new Vector2(0, 0);
        this.Size = new Size(50, 50);
        
        this.Jump = function (_altitudeSpeed) {
            if (!this.IsJumping) {
                forceAltitude = _altitudeSpeed;
                this.IsJumping = true;
                this.RotationForce = this.CurrentLandingPlace.Place.LatitudeForce * 0.008;

                soundBump.play();
            }
        }
        
        this.ChangePosition = function(_latitude,_altitude, _animated) {
            if (_animated) {
                latitudeAnimation = this.Latitude - _latitude;
                altitudeAnimation = this.Altitude - _altitude;
                this.Latitude = _latitude;
                this.Altitude = _altitude;
                
                
            } else {
                this.Latitude = _latitude;
                this.Altitude = _altitude;
                //isPositionAnimated = false;
            }
        }

        this.update = function () {

            this.Position.X = GetLatitude(this.Latitude);
            this.Position.Y = GetAltitudeY(this.Altitude);

            

            if (this.IsJumping) {

                var newForceAltitude = forceAltitude * deltaTime;

                this.Altitude += newForceAltitude;
                forceAltitude -= 200 * deltaTime;

                if (forceAltitude < 0) {
                    var sizeCenter = new Size(1, 1);
                    for (var i = 0; i < listLandingPlaces.length; i++) {

                        //Debug.writeln(newForceAltitude);

                        if (listLandingPlaces[i].Intersects(this.Position, this.Size) && // Se intersectar o ninho...
                            //this.Altitude > (listLandingPlaces[i].Place.Altitude -1) &&
                            newForceAltitude < -2.3 && // não deixa o ovo cair no ninho se ele tive muito baixo. Padrao -0.7.
                            (this.Altitude - newForceAltitude) > this.CurrentLandingPlace.Place.Altitude &&
                            listLandingPlaces[i].Place.Altitude > this.CurrentLandingPlace.Place.Altitude) // Não permite voltar ao mesmo ninho ou para os de baixo.
                        {
                                // Então pouso autorizado!

                                this.CurrentLandingPlace = listLandingPlaces[i];
                                this.IsJumping = false;

                                var latitudeDistance = this.Latitude - (listLandingPlaces[i].Place.Latitude + listLandingPlaces[i].CenterLatitude);
                                var _newRotationForce = latitudeDistance * 0.03;

                                this.RotationForce = _newRotationForce * -1;

                                listLandingPlaces[i].Place.Recieved();

                                this.ChangePosition(listLandingPlaces[i].Place.Latitude + listLandingPlaces[i].CenterLatitude, listLandingPlaces[i].Place.Altitude, true);
                                ChangeCameraPosition(listLandingPlaces[i].Place.Altitude - 26, true);
                                userPoints = Math.round(listLandingPlaces[i].Place.Altitude - firstAltitude);
                                rotationReaction = true;

                                nestLanding.play();

                            }
                    }
                }

                // codigo que espera o ovo de afastar do ovo, para aplicar o efeito de profundidade do nest/egg
                if ((this.Altitude - this.CurrentLandingPlace.Place.Altitude) > 5 || forceAltitude < 1) {
                    currentOrder = 1;
                } else {
                    currentOrder = 0;
                }
                
            }

            if (!this.IsJumping) {

                this.Altitude = (this.CurrentLandingPlace.Place.Altitude + this.CurrentLandingPlace.CenterAltitude) + altitudeAnimation;
                this.Latitude = (this.CurrentLandingPlace.Place.Latitude + this.CurrentLandingPlace.CenterLatitude) + latitudeAnimation;
                latitudeAnimation *= 0.0150 / deltaTime; // 0.8
                altitudeAnimation *= 0.0150 / deltaTime; // 0.7;
                this.RotationForce *= 0.8;

                currentOrder = 0
            }

            var distanceCameraLandPosition = 26;

            if (//lastAltitude != this.Altitude &&
                this.Altitude >= (this.CurrentLandingPlace.Place.Altitude - 130) //&&
                //this.Altitude > this.CurrentLandingPlace.Place.Altitude &&
                //this.Altitude - distanceCameraLandPosition >= 0
                //this.Altitude < this.CurrentLandingPlace.Place.Altitude
                ) {
                    ChangeCameraPosition(this.Altitude - distanceCameraLandPosition, true);

                    if (!gameOverScreen.showScreen && this.CurrentLandingPlace.Place.Altitude - this.Altitude > 100) {
                        gameOverScreen.points = userPoints;
                        

                        var applicationData = Windows.Storage.ApplicationData.current;

                        var recordScore;
                        recordScore = applicationData.localSettings.values["highScore"];
                        recordScore = parseInt(recordScore);
                        gameOverScreen.highestPoints = recordScore;

                        if (recordScore == undefined || isNaN(recordScore)) {
                            recordScore = 0;
                        }
                        
                        if (userPoints > recordScore) {
                            /*var state = {
                                //user: 'Lucas',
                                score: userPoints,
                                //date: new Date().toLocaleString()
                            };
                            WinJS.Application.local.writeText("recordedHighestPoints", JSON.stringify(state));//*/
                            applicationData.localSettings.values["highScore"] = userPoints;
                            gameOverScreen.highestPoints = userPoints;
                        }

                        gameOverScreen.show();

                        userPoints = 0;
                    }
                } 

            lastAltitude = this.Altitude

            this.Rotation += this.RotationForce;


        }

        this.draw = function (_ctx, _order) {
            if (currentOrder == _order && this.CurrentLandingPlace != null) {
                
                var _eggHalfWidth = this.Size.Width / 2;
                var _eggHalfHeight = this.Size.Height / 2;
                _ctx.save();;
                _ctx.translate(this.Position.X + _eggHalfWidth, this.Position.Y + _eggHalfHeight);
                _ctx.rotate(this.Rotation);
                _ctx.drawImage(this.ImgEgg, -_eggHalfWidth, -_eggHalfHeight, this.Size.Width, this.Size.Height);
                _ctx.restore();

            }
        }
    }


    function Nest(_type, _altitude, _latitude, _altitudeSpeed, _latitudeSpeed, _firstDirection, _marginLeft, _marginRight, _marginTop, _marginBottom) {

        var marginLeft = 0;
        var marginRight = 0;
        var newAltitudeForce = 0;
        var newLatitudeForce = 0;
        var altitudeForce = 0;
        var latitudeForce = 0;
        var latitudeNestWidth = 29; // Número que é a largura do Nest em "Latitude"
        var isHolding = false;
        var realAltitude = _altitude;
        var plusAltitude = 0;
        var animationHit = 0;//Animação quando um ovo bate no ninho
        var animationHitAltitude = 0;
        var isAnimationHit = false;

        this.Position = new Vector2(0, 0);
        this.Size = new Size(100, 100);
        this.PositionCollision = new Vector2(0, 0);
        this.SizeCollision = new Size(100, 100);
        this.Type = _type;
        this.ImgNestFront = new Image();
        this.ImgNestBack = new Image();
        this.RelativePosition = new Vector2(0, 0);
        this.Altitude = _altitude;
        this.AltitudeStandard = this.Altitude; // Necessário para que a camera saiba onde deve focalizar
        this.Latitude = 0;
        this.IsMoving = true;
        this.LatitudeSpeed = 20; // É muito fácil confundir latitude de altitude, cuidado!
        this.AltitudeSpeed = 0;
        this.LatitudeForce = 0;
        this.CurrentDirection = _firstDirection;

        // Construtor
        //realSpeed = this.Speed;
        this.LatitudeSpeed = _latitudeSpeed;
        //latitudeForce = this.LatitudeSpeed;
        marginLeft = _latitudeSpeed / 5;
        marginRight = 90 - latitudeNestWidth;
        newLatitudeForce = _latitudeSpeed;

        latitudeForce = _latitudeSpeed * _firstDirection;

        if (_latitude < marginLeft)
            this.Latitude = marginLeft;
        else if (_latitude > marginRight)
            this.Latitude = marginRight;
        else
            this.Latitude = _latitude;

        this.Pull = function (_startAltitude, _currentAltitude) {

            if (!isHolding) {
                stretchSound.play();
            }

            isHolding = true;
            var newPlusAltitude = _currentAltitude - _startAltitude;

            if (newPlusAltitude < 0) {
                if (newPlusAltitude > -5)
                    plusAltitude = newPlusAltitude;
                else {
                    var plusAltitudeExc = newPlusAltitude + 5;
                    plusAltitude = -5 + (plusAltitudeExc * 0.1);
                }

            }
        }
        this.Release = function () {
            isHolding = false;
            if (egg.CurrentLandingPlace.Place == this) {
                if (plusAltitude < -5)
                    plusAltitude = -5;

                if (plusAltitude < -1) {
                    egg.Jump(plusAltitude * -30); //egg.Jump((plusAltitude -1) * 8.5);
                }
            }
        }
        this.Recieved = function () {
            isAnimationHit = true;
        }
        this.draw = function (_ctx, _order) {
            if (this.Altitude < CameraAltitudeReal + 25) {
                _ctx.save();

                
                
                var realAltitudeHitAnimationFront = 0;
                var realAltitudeHitAnimationBack = 0;

                var newFrontHeight = 0;

                if (isAnimationHit) {
                    realAltitudeHitAnimationFront = GetAltitudeY(this.Altitude - animationHitAltitude);
                    realAltitudeHitAnimationBack = GetAltitudeY(this.Altitude + animationHitAltitude);

                    newFrontHeight = (realAltitudeHitAnimationFront - this.Position.Y) * 0.5;
                }

                //_ctx.drawImage(this.ImgNestBack, this.Position.X, GetAltitudeY(this.Altitude), this.Size.Width, this.Size.Height);

                
                switch (_order) {
                    case 0:
                        if (!isAnimationHit)
                            _ctx.drawImage(this.ImgNestBack, this.Position.X, GetAltitudeY(this.Altitude), this.Size.Width, this.Size.Height);
                        else
                            _ctx.drawImage(this.ImgNestBack, this.Position.X, realAltitudeHitAnimationBack, this.Size.Width, this.Size.Height);

                        break;
                    case 1:
                        if (!isAnimationHit)
                            _ctx.drawImage(this.ImgNestFront, this.Position.X, GetAltitudeY(this.Altitude), this.Size.Width, this.Size.Height);
                        else
                            _ctx.drawImage(this.ImgNestFront, this.Position.X, realAltitudeHitAnimationFront, this.Size.Width, this.Size.Height - newFrontHeight);

                        // _ctx.drawImage(t, this.Position.X, realAltitudeHitAnimationBack, this.Size.Width, this.Size.Height);
                        break;
                }
                
                _ctx.restore();


                // código que imprime na tela qual é a area de coliso
                //_ctx.fillStyle = "black";
                //_ctx.fillRect(this.PositionCollision.X, this.PositionCollision.Y, this.SizeCollision.Width, this.SizeCollision.Height);
            } 
        }

        this.update = function () {

                this.Altitude = realAltitude + plusAltitude;

                //position.Y =  // O mais 12 é para que a base de altitute do ninho seja bem abaixo dela
                

                if (plusAltitude != 0 && !isHolding) {
                    plusAltitude *= 0.5;

                }


                if (this.IsMoving) {

                    if (this.Latitude >= marginRight && newLatitudeForce > 0 ||
                this.Latitude <= marginLeft && newLatitudeForce < 0) {
                    newLatitudeForce *= -1;

                    if (newLatitudeForce < 0)
                        this.CurrentDirection = -1;
                    else
                        this.CurrentDirection = 1;

                }

                    if (newLatitudeForce != latitudeForce) {
                        var distance = newLatitudeForce - latitudeForce;
                        distance *= 0.1;// (0.9 * deltaTime);
                        latitudeForce = latitudeForce + distance;
                    }

                    this.Latitude = this.Latitude + (latitudeForce * deltaTime);
                    this.Position.X = GetLatitude(this.Latitude); //- GetLatitude(72); ;

                    this.LatitudeForce = latitudeForce;

                }

                if (isAnimationHit) {
                    animationHit += 12 * deltaTime;
                    animationHitAltitude = Math.sin(animationHit);
                    animationHitAltitude *= 0.5;

                    if (animationHit >= Math.PI) {
                        isAnimationHit = false;
                        animationHitAltitude = 0;
                        animationHit = 0;
                    }
                }

                var _x = this.Position.X + CameraSpecialPosition.X;
                var _y = GetAltitudeY(this.Altitude);// + CameraSpecialPosition.Y;
                this.Position = new Vector2(_x, _y);

                // código que mostra qual é a area de coliso
                this.PositionCollision = new Vector2(this.Position.X + (this.Size.Width * 0.32), this.Position.Y + (this.Size.Height * 0.2));
                this.SizeCollision = new Size(this.Size.Width * 0.35, this.Size.Height * 0.1);
            }
        
    }

    function DeepControl() {
        
        var heightInAltitude = 120;
        var altitude1 = 0;
        var altitude2 = heightInAltitude;
        
        this.RoofImage = new Image();
        this.RoofPosition = new Vector2(0, 0);
        this.RoofAltitute = 0;
        this.RoofSize = new Size(0, 0);

        this.resize = function () {
            //heightInAltitude = GetAltitudeByRealY(this.RoofImage.height);
        }

        this.update = function () {
            //this.RoofPosition.Y = (GetAltitudeY(this.RoofAltitute) - this.RoofSize.Height) + CameraSpecialPosition.Y;

            // Controle das imagens que vão para cima

            this.RoofPosition.X = ((document.documentElement.offsetWidth / 2) - (this.RoofSize.Width / 2)) + CameraSpecialPosition.X;

            if (altitude1 + heightInAltitude <= CameraAltitudeReal - 100) {
                altitude1 = altitude2 + heightInAltitude;
            } else if (altitude2 + heightInAltitude <= CameraAltitudeReal - 100) {
                altitude2 = altitude1 + heightInAltitude;
             
                // Controle das imagens que vão para baixo
               
            } else if (altitude1 > CameraAltitudeReal - 100 && altitude2 > CameraAltitudeReal - 100) {
                if(altitude1 < altitude2)
                    altitude2 = altitude1 - heightInAltitude;
                else
                    altitude1 = altitude2 - heightInAltitude;
            }
            
            //else if (altitude2 - heightInAltitude >= CameraAltitudeVirtual - 30) {
            //    altitude2 = altitude1 - heightInAltitude;
            //}

        };
        this.draw = function (_ctx) {
            _ctx.drawImage(this.RoofImage, this.RoofPosition.X, GetAltitudeY(altitude1 + heightInAltitude), this.RoofSize.Width, this.RoofSize.Height + 1);
            _ctx.drawImage(this.RoofImage, this.RoofPosition.X, GetAltitudeY(altitude2 + heightInAltitude), this.RoofSize.Width, this.RoofSize.Height + 1);
        };
    }

    function LandingPlace(_placeType, _altitude, _latitude, _altitudeSpeed, _latitudeSpeed,_firstDirection) {
        this.ID = 0;
        this.Place = null;

        this.ID = _placeType;
        this.CenterLatitude = 0; // Local de diferença exato onde o ovo vai pousar
        this.CenterAltitude = 0; // Local de diferença exato onde o ovo vai pousar
        this.IsToDelete = false;
        this.IsToLand = true;
        
        switch (_placeType) {
            case 1: // Ovo normal
                this.Place = new Nest(1, _altitude, _latitude, _altitudeSpeed, _latitudeSpeed, _firstDirection);
                this.CenterLatitude = 12;
                this.CenterAltitude = 1;
                break;
        }

        this.Intersects = function(_positon,_size) {
            var _landPosition = this.Place.PositionCollision;
            var _landSize = this.Place.SizeCollision;
            
            return CollisionDetect(_positon.X,_positon.Y,_size.Height,_size.Width,
                                        _landPosition.X,_landPosition.Y,_landSize.Height,_landSize.Width);
        }

        this.update = function () {

            this.Place.update();

            if (this.Place.Altitude < (CameraAltitudeReal - 100)) {
                this.IsToDelete = true;
            }

            
        }

        
      
        // por causa de bug, não foi possível adicionar os membros filhos.
        // Todo objeto Place tem que ter as seguintes propriedades e métodos: Size, Position, AltitudeForce, Draw, Update, PositionCollision, SizeCollision
        
    }

    /***************************** Architure *******************************/

    // Controle de FPS e DeltaTime
    var lastTime = 0;
    var fps = 0;
    var fpsStandard = 60;
    var fpsValue = 0;
    var deltaTime;

    function CollisionDetect(orignX, orignY, destinX, destinY) {
        return CollisionDetect(orignX, orignY, 1, 1, destinX, destinY, 1, 1)
    }

    function CollisionDetect(orignX, orignY, orignHeight, orignWidth,
                    destinX, destinY, destinHeight, destinWidth) {

        var left1 = orignX, left2 = destinX,
        right1 = orignX + orignWidth, right2 = destinX + destinWidth,
        top1 = orignY, top2 = destinY,
        bottom1 = orignY + orignHeight, bottom2 = destinY + destinHeight;

        if (bottom1 < top2) return (0);
        if (top1 > bottom2) return (0);

        if (right1 < left2) return (0);
        if (left1 > right2) return (0);

        return 1;


    }

    function Vector2(_x, _y) {
        /// <summary>Posição X e Y.</summary>
        this.X = _x;
        this.Y = _y;
    }

    function Size(_width, _height) {
        /// <summary>Posição X e Y.</summary>
        this.Width = _width;
        this.Height = _height;
    }

    function GetResolutionHeight(_height) {
        /// <summary>Retorna um valor de altura a partir de um valor padrao de altura. O 1000 é como se fosse a lente.</summary>
        return (_height / 1000) * document.documentElement.offsetHeight;
    }

    function GetResolutionWidth(_width, _oldHeight, _newHeight) {
        /// <summary>Retorna o valor de largura a partir do valor de altura. Ele mantem a resolução da imagem.</summary>
        return (_newHeight / _oldHeight) * _width;
    }

    

    app.start();
})();
