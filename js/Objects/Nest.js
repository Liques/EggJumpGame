/// <reference group="Dedicated Worker" />


function Nest(egg, _type, _altitude,  _altitudeSpeed, _latitudeSpeed, _firstDirection, nestLanding, stretchSound) {

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
    var rotationAnim = 0;

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
    this.InclinationRadians = 0;

    // Construtor
    //realSpeed = this.Speed;
    this.LatitudeSpeed = _latitudeSpeed;
    //latitudeForce = this.LatitudeSpeed;
    marginLeft = _latitudeSpeed / 5;
    marginRight = 95 - latitudeNestWidth - (_latitudeSpeed / 5);
    newLatitudeForce = _latitudeSpeed;

    latitudeForce = _latitudeSpeed * _firstDirection;

    this.Latitude = (Math.random() * marginRight);

    //if (_latitude < marginLeft)
    //    this.Latitude = marginLeft;
    //else if (_latitude > marginRight)
    //    this.Latitude = marginRight;
    //else
    //    this.Latitude = _latitude;

    var treste = "";

    this.Pull = function (_startAltitude, _currentAltitude, _startLatitude, _currentLatitude, _gameDashboardSize) {

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

        var deltaX = _currentLatitude - _startLatitude;

        var percentageInDashboard = deltaX * 100 / _gameDashboardSize.Width;

        var _newInclinationDegrees = percentageInDashboard * -1;//Math.atan2(_startAltitude, deltaX) * (Math.PI / 180) * 1000;
        
        //treste = percentageInDashboard;// _currentAltitude + "-" + _startAltitude + "=" + deltaY;

        var limitDegrees = 10;

        //var inclinationDegrees = (_newInclinationDegrees >= limitDegrees * -1 && _newInclinationDegrees <= limitDegrees) ? _newInclinationDegrees : false;

        var leftover = 0;

        if (_newInclinationDegrees >= limitDegrees) {
            leftover = _newInclinationDegrees - limitDegrees;
            _newInclinationDegrees = limitDegrees + (leftover * 0.1);
        } else if (_newInclinationDegrees <= limitDegrees * -1) {
            leftover = _newInclinationDegrees + limitDegrees;
            _newInclinationDegrees = (limitDegrees * -1) - (leftover * -0.1);
        }

        this.ChangeInclination(_newInclinationDegrees);

        egg.face.ChangeFace('suspense');

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

        egg.face.ChangeFace('sad');
    }
    this.Recieved = function () {
        isAnimationHit = true;
        egg.face.ChangeFace('normal');
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

            var _positionFrontY;
            var _positionBackY;
            var _heightFront;
            var _heightBack;

            switch (_order) {
                case 0:
                    if (!isAnimationHit) {

                        _positionBackY = GetAltitudeY(this.Altitude);
                        _heightBack = this.Size.Height;
                    }
                    else {
                        _positionBackY = realAltitudeHitAnimationBack;
                        _heightBack = this.Size.Height;
                    }

                    _ctx.translate(this.Position.X + this.Size.Width / 2, _positionBackY + _heightBack / 2);
                    _ctx.rotate(this.InclinationRadians);
                    _ctx.drawImage(this.ImgNestBack, -this.Size.Width / 2, -_heightBack / 2, this.Size.Width, _heightBack);

                    break;
                case 1:

                    _positionFrontY = GetAltitudeY(this.Altitude);

                    if (!isAnimationHit) {    
                        _heightFront = this.Size.Height;;
                    }
                    else {
                        _heightFront = this.Size.Height - newFrontHeight;
                    }

                    _ctx.translate(this.Position.X + this.Size.Width / 2, _positionFrontY + _heightFront / 2);
                    _ctx.rotate(this.InclinationRadians);
                    _ctx.drawImage(this.ImgNestFront, -this.Size.Width / 2, -_heightFront / 2, this.Size.Width, _heightFront);

                    break;
            }

            _ctx.rotate(0);
            _ctx.restore();

            _ctx.fillStyle = "black";
            _ctx.font = gameDashboardSize.Height * 0.04 + "px Segoe UI";
            _ctx.fillText(treste,100,100);

            // código que imprime na tela qual é a area de coliso
            //_ctx.fillStyle = "black";
            //_ctx.fillRect(this.PositionCollision.X, this.PositionCollision.Y, this.SizeCollision.Width, this.SizeCollision.Height);
        }
    }

    

    this.update = function () {

        

        if (egg.CurrentLandingPlace.Place != this) {

            rotationAnim += 0.05;
            this.ChangeInclination(Math.sin(rotationAnim) * 22);
        } 

        

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

    this.ChangeInclination = function (_newInclinationDegrees) {

        
        this.InclinationRadians = _newInclinationDegrees * (Math.PI / 180);

    }

}
