/// <reference group="Dedicated Worker" />

function LandingPlace(egg, _placeType, _altitude, _altitudeSpeed, _latitudeSpeed, _firstDirection, nestLanding, stretchSound) {
    
    var rotationLatitudeDifferenceDividendo = 0

    this.ID = 0;
    this.Place = null;

    this.ID = _placeType;
    this.CenterLatitude = 0; // Local de diferença exato onde o ovo vai pousar
    this.CenterAltitude = 0; // Local de diferença exato onde o ovo vai pousar
    var centerLatitude = 0; // Local de diferença exato onde o ovo vai pousar
    var centerAltitude = 0; // Local de diferença exato onde o ovo vai pousar
    this.CenterLatitudeRotationDifference = 
    this.IsToDelete = false;
    this.IsToLand = true;

    switch (_placeType) {
        case 1: // Ovo normal
            this.Place = new Nest(egg, 1, _altitude, _altitudeSpeed, _latitudeSpeed, _firstDirection, nestLanding, stretchSound);
            this.CenterLatitude = centerLatitude = 12;
            this.CenterAltitude = 1;
            rotationLatitudeDifferenceDividendo = 15;
            break;
    }

    this.Intersects = function (_positon, _size) {
        var _landPosition = this.Place.PositionCollision;
        var _landSize = this.Place.SizeCollision;

        return CollisionDetect(_positon.X, _positon.Y, _size.Height, _size.Width,
                                    _landPosition.X, _landPosition.Y, _landSize.Height, _landSize.Width);
    }

    this.update = function () {

        this.Place.update();

        this.CenterLatitude = centerLatitude + this.CenterLatitudeRotationDifference();

        if (this.Place.Altitude < (CameraAltitudeReal - 100)) {
            this.IsToDelete = true;
        }


    }

    this.CenterLatitudeRotationDifference = function() {
        if (this.Place != undefined) {
            var degrees = this.Place.InclinationRadians * 180 / Math.PI;
            return degrees / rotationLatitudeDifferenceDividendo;
        }
    }



    // por causa de bug, não foi possível adicionar os membros filhos.
    // Todo objeto Place tem que ter as seguintes propriedades e métodos: Size, Position, AltitudeForce, Draw, Update, PositionCollision, SizeCollision

}