/// <reference group="Dedicated Worker" />

function Wind(dashboardPosition, dashboardSize) {
    this.Speed = 3;
    this.RealSpeed = 3;

    this.dashboardPosition = dashboardPosition;
    this.dashboardSize = dashboardSize;

    var triangles = new Array();

    var circleRotation = Math.PI / 2;
    var circleSliceSize = Math.PI / 0.3;
    var circleSize = 0;
    var circleCenter = new Vector2();

    this.update = function () {

        if (this.Speed != this.RealSpeed) {
          
            var distance = this.Speed - this.RealSpeed;
                distance *= 0.04;
                this.RealSpeed = this.RealSpeed + distance;
           
        }

        circleRotation += this.RealSpeed * 0.1;
    }
    
    this.draw = function (_ctx) {
        _ctx.fillText("Wind:", this.dashboardPosition.X + (this.dashboardSize.Width * 0.45), this.dashboardSize.Height * 0.04);
        _ctx.save();
        for (var i = 0; i < triangles.length; i++) {
            
            _ctx.beginPath();
            var opacity = 0.25;
            if (triangles[i][3] == true) {
                opacity = 1;
                
            }
            _ctx.strokeStyle = 'rgba(255,140,0, ' + opacity + ')';
            _ctx.fillStyle = 'rgba(255,255,100,' + opacity + ')';
            _ctx.moveTo(triangles[i][0].X, triangles[i][0].Y);
            _ctx.lineTo(triangles[i][1].X, triangles[i][1].Y);
            _ctx.lineTo(triangles[i][2].X, triangles[i][2].Y);
            _ctx.lineTo(triangles[i][0].X, triangles[i][0].Y);
            _ctx.fill();
            _ctx.stroke();
            _ctx.closePath();
        }

        
        _ctx.beginPath();
        _ctx.fillStyle = 'white';
        _ctx.arc(circleCenter.X, circleCenter.Y, circleSize, 0, Math.PI * 2, true);
        _ctx.fill();
        _ctx.closePath();

        _ctx.beginPath();
        _ctx.fillStyle = 'rgb(255,140,0)';
        _ctx.arc(circleCenter.X, circleCenter.Y, circleSize, circleRotation, circleRotation + Math.PI, true);
        _ctx.fill();
        _ctx.closePath();

        _ctx.restore();
        
    }

    this.change = function (_currentAltitude) {
        if (_currentAltitude >= 200 && Math.random() * 3 > 2) {
            this.Speed = Math.random() * 3.9999;
            this.Speed = Math.floor(this.Speed);
            this.Speed *= (Math.random() * 2 < 1) ? -1 : 1;
            this.resize();
        }
    }

    this.resize = function () {

        var _positionX = this.dashboardPosition.X + (this.dashboardSize.Width * 0.65);
        var _positionY = (this.dashboardSize.Height * 0.013);
        var _size = this.dashboardSize.Height * 0.025;

        for (var i = 0; i < 6; i++) {
            triangles[i] = new Array();

            
            var _newpositionX = _positionX + (i * _size);

            if (i < 3) {
                triangles[i][0] = new Vector2(_newpositionX, _positionY + (_size / 2));
                triangles[i][1] = new Vector2(_newpositionX + _size, _positionY);
                triangles[i][2] = new Vector2(_newpositionX + _size, _positionY + _size);
            } else {
                _newpositionX += _size * 1.5;
                triangles[i][0] = new Vector2(_newpositionX + _size, _positionY + (_size / 2));
                triangles[i][1] = new Vector2(_newpositionX, _positionY);
                triangles[i][2] = new Vector2(_newpositionX, _positionY + _size);
            }

            triangles[i][3] = false; // Se o triangulo está ativo, por default não.

        }

        if (this.Speed < 0) {
            for (var i = 0; i > this.Speed; i--) {
                triangles[i + 2][3] = true;
            }
        } else if (this.Speed > 0) {
            for (var i = 3; i < this.Speed + 3; i++) {
                triangles[i][3] = true;
            }
        }

        circleCenter = new Vector2(_positionX + (_size * 3.75), (this.dashboardSize.Height * 0.025));
        circleSize = (this.dashboardSize.Height * 0.0175);
    }

    this.resize();
}