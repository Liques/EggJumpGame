/// <reference path="architecture.js" />

// Variáveis globais
var canvas;// = document.getElementById('canvasGame');
var ctx; // = canvas.getContext('2d');

var loaded = 0;

var deepControl = new DeepControl();

var CameraAltitudeReal = 0; // A altitude real da camera fica na verdade bem no topo do jogo... OBS.: Use o ChangePositon para mudar a posição
var CameraAltitudeVirtual = 0; // ... por isso a necessidade do virtual que fica no chão. OBS.: Use o ChangePositon para mudar a posição
var newCameraAltitude = 0; // OBS.: Use o ChangePositon para mudar a posição
var CameraSpecialPosition = new Vector2(0, 0);
var isCameraAnimating = 0;

var gameDashboardPosition = new Vector2(0, 0);
var gameDashboardSize = new Size(0, 0);
var gameDashboarMarginSide;

var IsHolding = false;
var IsHoldingStartAltitude = 0;
var IsHoldingCurrentAltitude = 0;

var nest = new Nest(50, 0);
var egg = new Egg();

function Game() {

    canvas = document.getElementById('canvasGame');
    ctx = canvas.getContext('2d');

    var imgExemplo = new Image();

    var tempImgRoof = new Image(),
        tempImgNestNormalFront = new Image(),
        tempImgNestNormalBack = new Image(),
        tempImgEgg = new Image(),
        tempTest = new Image();
    
    var loader = new PxLoader(),
        tempImgRoof = loader.addImage('images/chao.jpg'),
        tempImgNestNormalFront = loader.addImage('images/nestFrontFull.png'),
        tempImgNestNormalBack = loader.addImage('images/nestBackFull.png'),
        tempImgEgg = loader.addImage('images/eggFull.png');

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

        nest.ImgNestFront = tempImgNestNormalFront;
        nest.ImgNestBack = tempImgNestNormalBack;

        egg.ImgEgg = tempImgEgg;
        egg.EggSize = new Size(egg.ImgEgg.width, egg.ImgEgg.height);

        egg.CurrentNest = nest; // só para testes

        ChangeCameraPosition(0, false);

        // deixe por ultimo
        resize();

    });

    canvas.addEventListener('mousedown', function (e) {

        if (e.layerY > nest.GetPosition().Y && e.layerY < nest.GetPosition().Y + nest.NestSize.Height) {
            IsHolding = true;
            IsHoldingStartAltitude = GetAltitudeByRealY(e.layerY);
            //ChangeCameraPosition(CameraAltitudeVirtual + 10, true);
        }
    }, false);

    canvas.addEventListener('mousemove', function (e) {
        if (IsHolding) {
            IsHoldingCurrentAltitude = GetAltitudeByRealY(e.layerY);
            nest.Pull(IsHoldingStartAltitude, IsHoldingCurrentAltitude);
        }
    }, false);

    canvas.addEventListener('mouseup', function (e) {
        IsHolding = false;
        nest.Release();
    }, false);

    loader.start(); 

    StartFPS();
    
    // Controle de FPS e DeltaTime
    lastTime = new Date();
    fpsOut = document.getElementById('fps');
    setInterval(function () {
        fpsValue = Math.round(1000 / (1000 * deltaTime)) + " fps";


    }, 500);

    
    
}

function update() {

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

        if (newCameraAltitude != CameraAltitudeReal) {
            var distance = newCameraAltitude - CameraAltitudeReal;
            distance *= (2 * deltaTime);
            CameraAltitudeReal = CameraAltitudeReal + distance;
            isCameraAnimating = 1;
        } else {
            isCameraAnimating = 0;
        }

        deepControl.update();
        egg.update();
        nest.update();

        //Deixar sempre no final
        draw();
    }
}

function draw() {

    ctx.fillStyle = "#a2c9ea";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    deepControl.draw(ctx);

    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = "black";
    ctx.fillRect(gameDashboardPosition.X, gameDashboardPosition.Y, gameDashboardSize.Width, gameDashboardSize.Height);

//    ctx.restore();
//    ctx.fillStyle = "black";
//    ctx.fillRect(gameDashboarMarginSide, 100, 50, 50);
//    ctx.save();

    ctx.restore();
    nest.draw(ctx, 0);
    egg.draw(ctx,0);
    nest.draw(ctx, 1);
    egg.draw(ctx, 1);

    // Deixe sempre embaixo o seguinte código de draw
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText(fpsValue, 10, 30);
}

function GetAltitudeY(_altitude) {
    /// <summary>Converte a altitude real do objeto a partir da camera.</summary>
    /// <returns type="Number">Valor real da altura.</returns>
    var currentConvertedCameraAltitude = CameraAltitudeReal * canvas.height / 100;
    var currentConvertedObjectAltitude = _altitude * canvas.height / 100;
    return currentConvertedCameraAltitude - currentConvertedObjectAltitude;
}

function GetLatitude(_latitude) {
    /// <summary>Converte a altitude real do objeto a partir da camera.</summary>
    /// <returns type="Number">Valor da latitude de 0 a 100.</returns>
    return gameDashboardPosition.X + (_latitude *(gameDashboardSize.Width / 100));
}

function GetAltitudeByRealY(_altitude) {
    /// <summary>Converte a altitude real do objeto a partir da camera.</summary>
    /// <returns type="Number">Valor real da altura.</returns>
    //var currentConvertedCameraAltitude = CameraAltitudeReal * 100 / canvas.height;
    var currentConvertedObjectAltitude = _altitude * 100 / canvas.height;
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

    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    deepControl.RoofSize.Height = GetResolutionHeight(deepControl.RoofImage.height);
    deepControl.RoofSize.Width = GetResolutionWidth(deepControl.RoofImage.width, deepControl.RoofImage.height, deepControl.RoofSize.Height);
    

    gameDashboardSize.Height = canvas.height;
    gameDashboardSize.Width = GetResolutionWidth(800, 1200, gameDashboardSize.Height);
    gameDashboardPosition.X = (canvas.width / 2) - (gameDashboardSize.Width / 2);
    gameDashboarMarginSide = gameDashboardPosition.X;

    nest.NestSize.Height = GetResolutionHeight(nest.ImgNestFront.height);
    nest.NestSize.Width = GetResolutionWidth(nest.ImgNestFront.width, nest.ImgNestFront.height, nest.NestSize.Height);


    egg.EggSize.Height = GetResolutionHeight(egg.ImgEgg.height);
    egg.EggSize.Width = GetResolutionWidth(egg.ImgEgg.width, egg.ImgEgg.height, egg.EggSize.Height);
}


/****************************** Objetos ********************************/
function Egg() {
    var forceAltitude = 0;
    var forceLatitude = 0;
    var currentOrder; // Ordem de draw na tela

    this.ImgEgg = new Image();
    this.Altitude = 50;
    this.Latitude = 0;
    this.EggSize = new Size(50, 50);
    this.CurrentNest = null;
    this.IsJumping = false;

    this.Jump = function (_altitudeSpeed) {
        forceAltitude = _altitudeSpeed;
        this.IsJumping = true;
    }

    this.update = function () {
        if (!this.IsJumping) {
            this.Altitude = this.CurrentNest.Altitude + 2;
            this.Latitude = this.CurrentNest.Latitude + 10;
            currentOrder = 0
        } else {

            this.Altitude += forceAltitude * deltaTime;
            forceAltitude -= 98 * deltaTime;

            currentOrder = 1;
        }
    }

    this.draw = function (_ctx, _order) {
        if (currentOrder == _order)
            _ctx.drawImage(this.ImgEgg, GetLatitude(this.Latitude), GetAltitudeY(this.Altitude), this.EggSize.Width, this.EggSize.Height);
    }
}


function Nest(_altitude, _latitude, _altitudeSpeed, _latitudeSpeed, _kind, _marginLeft, _marginRight, _marginTop, _marginBottom) {
   
    var realPosition = new Vector2(0, 0);
    var marginLeft = 0;
    var marginRight = 0;
    var newAltitudeForce = 0;
    var newLatitudeForce = 20;
    var altitudeForce = 0;
    var latitudeForce = 0;
    var latitudeNestWidth = 29; // Número que é a largura do Nest em "Latitude"
    var isHolding = false;
    var realAltitude = _altitude;
    var plusAltitude = 0;

    this.Position = new Vector2(0, 0);
    this.NestSize = new Size(100, 100);    
    this.Kind = _kind;
    this.ImgNestFront = new Image();
    this.ImgNestBack = new Image();
    this.RelativePosition = new Vector2(0, 0);
    this.Altitude = 50;
    this.AltitudeStandard = this.Altitude; // Necessário para que a camera saiba onde deve focalizar
    this.Latitude = 0;
    this.IsMoving = true;
    this.LatitudeSpeed = 20; // É muito fácil confundir latitude de altitude, cuidado!
    this.AltitudeSpeed = 0;
    

    // Construtor
    realSpeed = this.Speed;
    latitudeForce = this.LatitudeSpeed;
    marginLeft = 5;
    marginRight = 95 - latitudeNestWidth;

    this.SetPosition = function (_vectorPosition) {
    }
    this.GetPosition = function () {
        return realPosition;
    }
    this.Pull = function (_startAltitude, _currentAltitude) {
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
        if (egg.CurrentNest == this) {
            if (plusAltitude < -5)
                plusAltitude = -5;

            if (plusAltitude < -1) {
                egg.Jump(plusAltitude * -20); //egg.Jump((plusAltitude -1) * 8.5);
            }
        }
    }
    this.draw = function (_ctx, _order) {
        switch (_order) {
            case 0:
                _ctx.drawImage(this.ImgNestBack, realPosition.X, realPosition.Y, this.NestSize.Width, this.NestSize.Height);
                break;
            case 1:
                _ctx.drawImage(this.ImgNestFront, realPosition.X, realPosition.Y, this.NestSize.Width, this.NestSize.Height);
                break;
        }

    }
    this.update = function () {

        this.Altitude = realAltitude + plusAltitude;

        //position.Y =  // O mais 12 é para que a base de altitute do ninho seja bem abaixo dela
        var _x = this.Position.X + CameraSpecialPosition.X;
        var _y = GetAltitudeY(this.Altitude) + CameraSpecialPosition.Y;
        realPosition = new Vector2(_x, _y);

        if (plusAltitude != 0 && !isHolding) {
            plusAltitude *= 0.5;

        }

        
        if (this.IsMoving) {

            if (this.Latitude >= marginRight && newLatitudeForce > 0 ||
                this.Latitude <= marginLeft && newLatitudeForce < 0) {
                newLatitudeForce *= -1;
            }

            if (newLatitudeForce != latitudeForce) {
                var distance = newLatitudeForce - latitudeForce;
                distance *= (0.9 * deltaTime);
                latitudeForce = latitudeForce + distance;
            }

            this.Latitude = this.Latitude + (latitudeForce * deltaTime);
            this.Position.X = GetLatitude(this.Latitude); //- GetLatitude(72); ;

        }
    }
}

function DeepControl() {
    this.RoofImage = new Image();
    this.RoofPosition = new Vector2(0,0);
    this.RoofAltitute = 0;
    this.RoofSize = new Size(0, 0);
    this.update = function () {
        this.RoofPosition.Y = (GetAltitudeY(this.RoofAltitute) - this.RoofSize.Height) + CameraSpecialPosition.Y;
        this.RoofPosition.X = ((canvas.width / 2) - (this.RoofSize.Width / 2)) + CameraSpecialPosition.X;
    };
    this.draw = function (_ctx) {
        _ctx.drawImage(this.RoofImage, this.RoofPosition.X, this.RoofPosition.Y,this.RoofSize.Width,this.RoofSize.Height);
    };
}

/***************************** Architure *******************************/

// Controle de FPS e DeltaTime
var lastTime = 0;
var fps = 0;
var fpsStandard = 60;
var fpsValue = 0;
var deltaTime;

function CollisionDetect(orignX, orignY, destinX, destinY) {
    return CollisionDetect(orignX, orignY, 1, 1,destinX, destinY, 1, 1)
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

function StartFPS() {
    /// <summary>Inicia a contagem de FPS.</summary>
    /// <param name="radius" type="Number">The radius of the circle.</param>
    /// <returns type="Number">Returns a number that represents the area.</returns>

    window.setInterval(update, 1000 / fpsStandard);
}

function Vector2(_x,_y) {
    /// <summary>Posição X e Y.</summary>
    this.X = _x;
    this.Y = _y;
}

function Size(_width,_height) {
    /// <summary>Posição X e Y.</summary>
    this.Width = _width;
    this.Height = _height;
}

function GetResolutionHeight(_height) {
    /// <summary>Retorna um valor de altura a partir de um valor padrao de altura. O 1000 é como se fosse a lente.</summary>
    return (_height / 1000) * canvas.height;
}

function GetResolutionWidth(_width, _oldHeight, _newHeight) {
    /// <summary>Retorna o valor de largura a partir do valor de altura. Ele mantem a resolução da imagem.</summary>
    return (_newHeight / _oldHeight) * _width;
}