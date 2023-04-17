/// <reference group="Dedicated Worker" />

function FlakeControl(dashboardPosition, dashboardSize, wind) {

    
    this.Flakes = new Array();

    function Flake(altitude, latitude, deep, speed) {
        this.Altitude = altitude;
        this.Latitude = latitude;
        this.Deep = deep;
        this.Speed = speed;
        this.Y = 0;
        this.X = 0;
    }

    for (var i = 0; i < 150; i++) {
        this.Flakes[i] = newFlake();
        this.Flakes[i].Altitude = (Math.random() * 300) - 50;
    }

    function newFlake() {
        var _latitude = (Math.random() * 700) - 350;
        var _speed = 0.3 + (Math.random() * 0.5);
        var _deep = Math.random() * 0.5;
        var _altitude = CameraAltitudeVirtual * (2 - _deep);
        return new Flake(_altitude, _latitude, _deep, _speed);
    }

    this.update = function () {

        for (var i = 0; i < this.Flakes.length; i++) {
            this.Flakes[i].Altitude -= this.Flakes[i].Speed;
            
            this.Flakes[i].Y = GetAltitudeYWithDeep(this.Flakes[i].Altitude, this.Flakes[i].Deep);
            var normalY = GetAltitudeY(this.Flakes[i].Altitude);
            this.Flakes[i].X = GetLatitude(this.Flakes[i].Latitude);

            if (this.Flakes[i].Y >= (dashboardSize.Height * 1.4)) {
                this.Flakes[i] = newFlake();
            } else if (this.Flakes[i].Y >= -25) {
                this.Flakes[i].Latitude += wind.RealSpeed * 0.5;
            }
        }

    }

    this.draw = function (_ctx) {
        _ctx.fillStyle = 'rgba(255,255,255,0.25)';
        for (var i = 0; i < this.Flakes.length; i++) {
            _ctx.beginPath();
            
            _ctx.arc(this.Flakes[i].X, this.Flakes[i].Y, this.Size * (0.2 + this.Flakes[i].Deep), 0, Math.PI * 2, true);
            _ctx.fill();
            _ctx.closePath();
        }
    }

    this.resize = function() {
        this.Size = dashboardSize.Height * 0.008;
    }

}