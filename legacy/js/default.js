
document.addEventListener("DOMContentLoaded", function () {
    
    window.addEventListener("resize", resize);

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

}

document.addEventListener("DOMContentLoaded", function (event) {
    Game();
});

var canvas;
var ctx; 
var attemptFPS = 0;
var loaded = 0;

var deepControl = new DeepControl();

var IsHolding = false;
var IsHoldingStartAltitude = 0;
var IsHoldingCurrentAltitude = 0;
var IsHoldingStartLatitude = 0;
var IsHoldingCurrentLatitude = 0;

var nextAltitude = 31;

var listLandingPlaces = new Array();

var _storeNest1 = new Nest(0, 0); // Nest que vai guardar algumas imagens e propriedades padrões

var forceResize = false;

//var soundBump = new Audio("sounds/bump.wav");
var nestLanding = new Audio("sounds/land.wav");
var stretchSound = new Audio("sounds/stretch.wav");

var egg = new Egg();
egg.soundBump = new Audio("sounds/bump.wav");
var eggDefault = new Egg();

var currentScreen = 0;// 0 = Menu, 1 Gameplay, 3 Final Screen

var menuScreen = new MenuScreen();
var gameOverScreen = new GameoverScreen();

var isPaused = false;
var isPausedOpacity = 0;

var userPointsScreen = 0; // Valor que é mostrado na tela
var isSnnaped = false;

var fromSuspend = false; // se entrar no estado durmant...

var directionDots;
var userInfo = new UserInfo();
var wind;
var flakeControl;

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
        tempBrokenEggImage = new Image(),
        tempoPonto = new Image();

    var loader = new PxLoader(),
        tempImgRoof = loader.addImage('images/fundomata.jpg'),
        tempImgNestNormalFront = loader.addImage('images/nestFrontFull.png'),
        tempImgNestNormalBack = loader.addImage('images/nestBackFull.png'),
        tempImgEgg = loader.addImage('images/eggFull.png'),
        tempMenuLogoImage = loader.addImage('images/logoFinal.png'),
        tempTbPlay = loader.addImage('images/btPlay.png'),
        tempBtPlayImage = loader.addImage('images/btPlayAgain.png'),
        tempBrokenEggImage = loader.addImage('images/ovoQuebrado.png'),
        tempPonto = loader.addImage('images/ponto.png');

    wind = new Wind(gameDashboardPosition, gameDashboardSize);
    flakeControl = new FlakeControl(gameDashboardPosition, gameDashboardSize, wind);

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

        directionDots = new DirectionDots(tempPonto, wind);

        // deixe por ultimo
        forceResize = true;

        // suspend:
        if (fromSuspend) {

            var applicationData = Windows.Storage.ApplicationData.current;

            userInfo.Points = applicationData.localSettings.values["userPoints"];
            userPointsScreen = userInfo.Points;

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
                        listLandingPlaces[i] = new LandingPlace(egg, 1, listLandingPlacesRescued[i].Place.Altitude, listLandingPlacesRescued[i].Place.Latitude, 0, listLandingPlacesRescued[i].Place.LatitudeSpeed, listLandingPlacesRescued[i].Place.CurrentDirection, nestLanding, stretchSound);
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

                    wind.Speed = applicationData.localSettings.values["wind"];
                    wind.RealSpeed = wind.Speed;


                    ChangeCameraPosition(egg.CurrentLandingPlace.Place.Altitude - 26, false);


                    break;
                case 2: // lost screen

                    gameOverScreen.highestPoints = applicationData.localSettings.values["highScore"];

                    if (gameOverScreen.highestPoints == undefined)
                        gameOverScreen.highestPoints = 0;

                    gameOverScreen.points = userInfo.Points;

                    menuScreen.showMenu = false;
                    gameOverScreen.show();
                    gameOverScreen.screenOpacity = 1;

                    ChangeCameraPosition(firstAltitude, false);

                    break;
            }


        }

    });

    canvas.addEventListener('mousedown', mousedown, false);

    function mousedown(e){
        if (currentScreen == 1) {
            if (e.layerY > egg.CurrentLandingPlace.Place.Position.Y && e.layerY < egg.CurrentLandingPlace.Place.Position.Y + egg.CurrentLandingPlace.Place.Size.Height) {
                IsHolding = true;
                IsHoldingStartAltitude = GetAltitudeByRealY(e.layerY);
                IsHoldingCurrentLatitude = e.layerX;
                directionDots.start(egg.CurrentLandingPlace.Place.Altitude, egg.CurrentLandingPlace);
            }
        }
    }

    canvas.addEventListener('mousemove', mousemove, false);

    function mousemove(e){
        if (currentScreen == 1) {
            if (IsHolding) {
                IsHoldingCurrentAltitude = GetAltitudeByRealY(e.layerY);
                egg.CurrentLandingPlace.Place.Pull(IsHoldingStartAltitude, IsHoldingCurrentAltitude, IsHoldingCurrentLatitude, e.layerX, gameDashboardSize);
                directionDots.change(egg.CurrentLandingPlace, egg.CurrentLandingPlace.Place.Altitude, egg.CurrentLandingPlace.Place.InclinationRadians);
            }
        }
    }

    canvas.addEventListener('mouseup', mouseup, false);

    function mouseup() {
        if (currentScreen == 1) {
            IsHolding = false;
            egg.CurrentLandingPlace.Place.Release();
            directionDots.release();
        }
    }

    canvas.addEventListener('click', click, false);

    canvas.addEventListener("touchstart", mousedown, false);
    canvas.addEventListener("touchmove", mousemove, false);
    canvas.addEventListener("touchend", mouseup, false);
    //canvas.addEventListener("touchcancel", touchCancel, false)

    function click(e){

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

    }


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

}



var triggerBugFPS = false;

function newGame() {
    listLandingPlaces = new Array();
    egg = new Egg();
    egg.ImgEgg = eggDefault.ImgEgg;
    egg.Size = eggDefault.Size;

    firstAltitude = CameraAltitudeReal + 20;

    menuScreen.showMenu = false;
    wind.Speed = 0;

    var soundBump = new Audio("sounds/bump.wav");
    var nestLanding = new Audio("sounds/land.wav");
    var stretchSound = new Audio("sounds/stretch.wav");

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

    requestAnimationFrame(update);

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

                wind.update();
                flakeControl.update();

                deepControl.update();

                menuScreen.update();

                switch (currentScreen) {

                    case 0: // Menu inicial

                        break;

                    case 1:// Gameplay

                        egg.update(userInfo, gameOverScreen, listLandingPlaces, wind);

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

                if (userInfo.Points != userPointsScreen) {
                    var distance = userInfo.Points - userPointsScreen;
                    distance *= 0.1;
                    userPointsScreen += distance;
                }

                directionDots.update();

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

    //setTimeout(update, 1000 / fpsStandard);


}



function draw() {



    ctx.fillStyle = "#a2c9ea";
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, document.documentElement.offsetWidth, document.documentElement.offsetHeight);

    deepControl.draw(ctx);

    // Código onde mostra o campo do jogo
    //ctx.save();
    //ctx.globalAlpha = 0.1;
    //ctx.fillStyle = "black";
    //ctx.fillRect(gameDashboardPosition.X, gameDashboardPosition.Y, gameDashboardSize.Width, gameDashboardSize.Height);
    //ctx.restore();


    flakeControl.draw(ctx);


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

        ctx.fillText("Points: " + Math.round(userPointsScreen), gameDashboardPosition.X, gameDashboardSize.Height * 0.04);


        wind.draw(ctx);

        ctx.restore();
    }

    directionDots.draw(ctx);

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
    var speedLimite = 0;

    if (_staringAltitude - firstAltitude < 700) {
        speedLimite = 0;
    }
    else if (_staringAltitude - firstAltitude < 1200) {
        speedLimite = 5;
    }
    else {
        speedLimite = 15; // a velocidade máxima de um nest é 20
    }

    if (_staringAltitude - firstAltitude < 300) {
        minDistanceBetween = 10;
        maxDistanceBetween = 15;
    }
    else if (_staringAltitude - firstAltitude < 500) {
        maxDistanceBetween = 20;
        minDistanceBetween = 15;
    }
    else {
        maxDistanceBetween = 30;
        minDistanceBetween = 20;
    }

    if (listLandingPlaces != null) {
        numberExistingLandingPlaces = listLandingPlaces.length;
    }

    for (var i = numberExistingLandingPlaces; i < numberExistingLandingPlaces + 10; i++) {

        var newNestSpeed = 0;
        if ((Math.random() * 3) > 2) {
            newNestSpeed = Math.random() * speedLimite;
        }
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
        /*
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
                   */
        nextAltitude = newNestAltitude;

        listLandingPlaces[i] = new LandingPlace(egg, 1, newNestAltitude, 0, newNestSpeed, newNestFirstDirection, nestLanding, stretchSound);

        listLandingPlaces[i].Place.ImgNestFront = _storeNest1.ImgNestFront;
        listLandingPlaces[i].Place.ImgNestBack = _storeNest1.ImgNestBack;

    }

    forceResize = true;
}



function resize() {

    if (ctx != null) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

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



