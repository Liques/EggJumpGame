/// <reference group="Dedicated Worker" />

function DirectionDots(imgDot, _wind) {
    this.ImgDot = imgDot;
    this.CurrentLandingPlace = null;
    this.StartingAltitude = 0;

    var lastVerticalForce;
    var lastHorizontalForce;

    var currentAlpha = 0;

    var wind = _wind;

    this.listDots = new Array();
    var showingDots = false;

    this.currentLandingPlace;
    this.currentAltitude = 0;;

    function Dot(_latitude, _altitude, imgDot) {
        this.ImgDot = imgDot;
        this.Latitude = _latitude;
        this.Altitude = _altitude;
        this.Alpha = 1;
    }

    this.listDots[0] = new Dot(25, 150, this.ImgDot);

    this.start = function (_startAltitude, _currentLandingPlace) {
        this.currentLandingPlace = _currentLandingPlace;
        this.StartingAltitude = _startAltitude;
        showingDots = true;
    }

    this.release = function () {
        this.listDots = new Array();
        showingDots = false;
        currentAlpha = 0;
    }

    this.change = function (_currentLandingPlace, _currentAltitude, _horizontalForce) {

        this.currentLandingPlace = _currentLandingPlace;
        this.currentAltitude = _currentAltitude;

        this.showDots();

        

    }

    this.showDots = function() {
        var verticalForce = this.StartingAltitude - this.currentAltitude;
        this.listDots = new Array();

        var numDotz = verticalForce;

        var currentAltitude = this.currentLandingPlace.Place.Altitude;

        var forceUp = 0;
        var forceSide = 0;
        var horizontalSpeed = this.currentLandingPlace.Place.InclinationRadians;

        for (var i = 1; i < numDotz; i++) {
            forceUp += verticalForce;
            verticalForce -= 0.8;
            var realForceSide = (forceSide * 20);

            horizontalSpeed += (wind.RealSpeed * 0.007);
            var currentLatitude = ((this.currentLandingPlace.Place.Latitude + realForceSide) + 14) - (horizontalSpeed * -10);
            //currentLatitude += forceSide;
            //currentLatitude += (wind.RealSpeed * i);
           
            this.listDots[i] = new Dot(currentLatitude, currentAltitude + forceUp, this.ImgDot);

            forceSide = horizontalSpeed * i;


            // tamanho e transparencia

            var size = 1;
            var distance = this.listDots[i].Altitude - currentAltitude;
            var percentage = distance * 100 / 40;

            percentage *= 0.01;
            if (percentage > 1)
                percentage = 1;

            size = 1 - percentage;
            
            //questão de resize

            this.listDots[i].X = GetLatitude(this.listDots[i].Latitude);
            this.listDots[i].Y = GetAltitudeY(this.listDots[i].Altitude);
            //this.Width = GetResolutionWidth(
            this.listDots[i].Height = GetResolutionHeight(this.listDots[i].ImgDot.height * size);// * size;
            this.listDots[i].Width = GetResolutionWidth(this.listDots[i].ImgDot.width * size, this.listDots[i].ImgDot.height * size, this.listDots[i].Height);// * 0.5;// * size;
        }
    }

    this.update = function () {
        if (showingDots && currentAlpha < 1) {
            currentAlpha += 0.07;
        }
        
        if (showingDots) {
            this.showDots();
        }
    }
    
    this.draw = function (_ctx) {
        for (var i = 1; i < this.listDots.length; i++) {
            _ctx.globalAlpha = currentAlpha;
            _ctx.drawImage(this.listDots[i].ImgDot, this.listDots[i].X, this.listDots[i].Y, this.listDots[i].Width, this.listDots[i].Height);
            _ctx.globalAlpha = 1;
        }
    }

}