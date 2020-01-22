/// <reference group="Dedicated Worker" />

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

    this.soundBump = new Audio("sounds/bump.wav");
    this.nestLanding = new Audio("sounds/land.wav");

    function Face() {
        this.EyebrowLeft = new Array(4);
        this.EyebrowRight = new Array(4);
        this.EyeLeft = new Array(2);
        this.EyeRight = new Array(2);

        this.EyebrowLeftReal = [0,0,0,0];
        this.EyebrowRightReal = [0, 0, 0, 0];
        this.EyeLeftReal = [0, 0];
        this.EyeRightReal = [0, 0];

        var firstTime = true;

        /*
        this.EyebrowLeftReal = this.EyebrowLeft;
        this.EyebrowRightReal = this.EyebrowRight;
        this.EyeLeftReal = this.EyeLeft;
        this.EyeRightReal = this.EyeRight;
        */

        this.ChangeFace = function (_face) {

            switch (_face) {
                case 'normal':

                    this.EyebrowLeft[0] = -0.6; // X
                    this.EyebrowLeft[1] = -0.6; // Y
                    this.EyebrowLeft[2] = -0.1; // X
                    this.EyebrowLeft[3] = -0.4; // Y

                    this.EyebrowRight[0] = 0.6;
                    this.EyebrowRight[1] = -0.6;
                    this.EyebrowRight[2] = 0.1;
                    this.EyebrowRight[3] = -0.4;

                    this.EyeLeft[0] = -0.3;
                    this.EyeLeft[1] = -0.1;

                    this.EyeRight[0] = 0.3;
                    this.EyeRight[1] = -0.1;

                    break;

                case 'suspense':

                    this.EyebrowLeft[0] = -0.6;
                    this.EyebrowLeft[1] = -0.6;
                    this.EyebrowLeft[2] = -0.1;
                    this.EyebrowLeft[3] = -0.63;

                    this.EyebrowRight[0] = 0.6;
                    this.EyebrowRight[1] = -0.6;
                    this.EyebrowRight[2] = 0.1;
                    this.EyebrowRight[3] = -0.63;

                   

                    this.EyeLeft[0] = -0.3;
                    this.EyeLeft[1] = -0.2;

                    this.EyeRight[0] = 0.3;
                    this.EyeRight[1] = -0.2;

                    break;

                case 'sad':

                    this.EyebrowLeft[0] = -0.6;
                    this.EyebrowLeft[1] = -0.6;
                    this.EyebrowLeft[2] = -0.1;
                    this.EyebrowLeft[3] = -0.7;

                    this.EyebrowRight[0] = 0.6;
                    this.EyebrowRight[1] = -0.6;
                    this.EyebrowRight[2] = 0.1;
                    this.EyebrowRight[3] = -0.7;

                    this.EyeLeft[0] = -0.2;
                    this.EyeLeft[1] = -0.2;

                    this.EyeRight[0] = 0.2;
                    this.EyeRight[1] = -0.2;

                    break;

            }

        }

        this.update = function () {

            var speed = 0.08;

            if (firstTime) {
                speed = 1;
                firstTime = false;
            }

            if (this.EyebrowLeft[0] != this.EyebrowLeftReal[0] || this.EyebrowLeft[3] != this.EyebrowLeftReal[3] ||
                this.EyeLeft[0] != this.EyeLeftReal[0] || this.EyeLeft[3] != this.EyeLeftReal[3]) {

                AnimationEffect(this.EyebrowLeft, this.EyebrowLeftReal, speed);
                AnimationEffect(this.EyebrowRight, this.EyebrowRightReal, speed);
                AnimationEffect(this.EyeLeft, this.EyeLeftReal, speed);
                AnimationEffect(this.EyeRight, this.EyeRightReal, speed);
            }
        }

        function AnimationEffect(_array, _realArray, _speed) {
            for (var i = 0; i < _array.length; i++) {
                var distance = _array[i] - _realArray[i];
                distance *= _speed;
                _realArray[i] = _realArray[i] + distance;
            }
        }

        this.ChangeFace('normal');

    }

    this.face = new Face();

    this.Jump = function (_altitudeSpeed) {
        if (!this.IsJumping) {
            forceAltitude = _altitudeSpeed;
            forceLatitude = this.CurrentLandingPlace.Place.InclinationRadians * 10;
            
            this.IsJumping = true;
            this.RotationForce = this.CurrentLandingPlace.Place.InclinationRadians; //this.CurrentLandingPlace.Place.LatitudeForce * 0.008;

            this.soundBump.play();
        }
    }

    this.ChangePosition = function (_latitude, _altitude, _animated) {
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

    this.update = function (userInfo, gameOverScreen, listLandingPlaces, wind) {

        this.Position.X = GetLatitude(this.Latitude);
        this.Position.Y = GetAltitudeY(this.Altitude);



        if (this.IsJumping) {

            var newForceAltitude = forceAltitude * deltaTime;

            this.Altitude += newForceAltitude;
            this.Latitude += forceLatitude;
            forceLatitude += wind.RealSpeed * 0.04;
            //this.Latitude += wind.RealSpeed * 0.5;
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

                        wind.change(userInfo.Points);

                        var latitudeDistance = this.Latitude - (listLandingPlaces[i].Place.Latitude + listLandingPlaces[i].CenterLatitude);
                        var _newRotationForce = latitudeDistance * 0.03;

                        this.RotationForce = _newRotationForce * -1;

                        listLandingPlaces[i].Place.Recieved();

                        this.ChangePosition(listLandingPlaces[i].Place.Latitude + listLandingPlaces[i].CenterLatitude, listLandingPlaces[i].Place.Altitude, true);
                        ChangeCameraPosition(listLandingPlaces[i].Place.Altitude - 26, true);
                        userInfo.Points = Math.round(listLandingPlaces[i].Place.Altitude - firstAltitude);
                        rotationReaction = true;

                        this.nestLanding.play();

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
                gameOverScreen.points = userInfo.Points;


                var applicationData = Windows.Storage.ApplicationData.current;

                var recordScore;
                recordScore = applicationData.localSettings.values["highScore"];
                recordScore = parseInt(recordScore);
                gameOverScreen.highestPoints = recordScore;

                if (recordScore == undefined || isNaN(recordScore)) {
                    recordScore = 0;
                }

                if (userInfo.Points > recordScore) {
                    applicationData.localSettings.values["highScore"] = userInfo.Points;
                    gameOverScreen.highestPoints = userInfo.Points;
                }

                gameOverScreen.show();

                userInfo.Points = 0;
            }
        }

        lastAltitude = this.Altitude

        this.Rotation += this.RotationForce;

        this.face.update();


    }

    this.draw = function (_ctx, _order) {
        if (currentOrder == _order && this.CurrentLandingPlace != null) {

            var _eggHalfWidth = this.Size.Width / 2;
            var _eggHalfHeight = this.Size.Height / 2;
            _ctx.save();
            _ctx.translate(this.Position.X + _eggHalfWidth, this.Position.Y + _eggHalfHeight);
            _ctx.rotate(this.Rotation + this.CurrentLandingPlace.Place.InclinationRadians);
            _ctx.drawImage(this.ImgEgg, -_eggHalfWidth, -_eggHalfHeight, this.Size.Width, this.Size.Height);

            _ctx.strokeStyle = 'black';
            _ctx.fillStyle = 'black';
            _ctx.lineWidth = _eggHalfWidth / 5;//8;
            var eyeRadius = _eggHalfWidth / 4.5;//8;

            // sombracelha esquerda
            _ctx.beginPath();
            _ctx.moveTo(_eggHalfWidth * this.face.EyebrowLeftReal[0], _eggHalfHeight * this.face.EyebrowLeftReal[1]);
            _ctx.lineTo(_eggHalfWidth * this.face.EyebrowLeftReal[2], _eggHalfHeight * this.face.EyebrowLeftReal[3]);
            _ctx.stroke();
            _ctx.closePath();

            // sobrancelha direita
            _ctx.beginPath();
            _ctx.moveTo(_eggHalfWidth * this.face.EyebrowRightReal[0], _eggHalfHeight * this.face.EyebrowRightReal[1]);
            _ctx.lineTo(_eggHalfWidth * this.face.EyebrowRightReal[2], _eggHalfHeight * this.face.EyebrowRightReal[3]);
            _ctx.stroke();
            _ctx.closePath();
            
            // olho esquerdo
            _ctx.beginPath();
            _ctx.arc(_eggHalfWidth * this.face.EyeLeftReal[0], _eggHalfHeight * this.face.EyeLeftReal[1], eyeRadius, 0, Math.PI * 2, false);
            _ctx.fill();
            _ctx.closePath();

            // olho direito
            _ctx.beginPath();
            _ctx.arc(_eggHalfWidth * this.face.EyeRight[0], _eggHalfHeight * this.face.EyeRightReal[1], eyeRadius, 0, Math.PI * 2, false);
            _ctx.fill();
            _ctx.closePath();
            
            _ctx.restore();

        }
    }
}

