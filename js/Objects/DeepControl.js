/// <reference group="Dedicated Worker" />

function DeepControl() {

    var heightInAltitude = 120;
    var altitude1 = 0;
    var altitude2 = heightInAltitude;

    this.RoofImage = new Image();
    this.RoofPosition = new Vector2(0, 0);
    this.RoofAltitute = 0;
    this.RoofSize = new Size(0, 0);

    var altitudePlusHeight1 = 0;
    var altitudePlusHeight2 = 0;
    var altitudePlusHeightReal1 = 0;
    var altitudePlusHeightReal2 = 0;

    this.resize = function () {
        //heightInAltitude = GetAltitudeByRealY(this.RoofImage.height);
    }

    this.update = function () {
        //this.RoofPosition.Y = (GetAltitudeY(this.RoofAltitute) - this.RoofSize.Height) + CameraSpecialPosition.Y;

        // Controle das imagens que vão para cima

        this.RoofPosition.X = ((document.documentElement.offsetWidth / 2) - (this.RoofSize.Width / 2)) + CameraSpecialPosition.X;

        if (altitude1 + heightInAltitude + (CameraAltitudeReal * 0.5) <= CameraAltitudeReal - 100) {
            altitude1 = altitude2 + heightInAltitude;
        } else if (altitude2 + heightInAltitude + (CameraAltitudeReal * 0.5) <= CameraAltitudeReal - 100) {
            altitude2 = altitude1 + heightInAltitude;

            // Controle das imagens que vão para baixo

        } else if (altitude1 + (CameraAltitudeReal * 0.5) > CameraAltitudeReal - 100 && altitude2 + (CameraAltitudeReal * 0.5) > CameraAltitudeReal - 100) {
            if (altitude1 < altitude2)
                altitude2 = altitude1 - heightInAltitude;
            else
                altitude1 = altitude2 - heightInAltitude;
        }

        //if (altitudePlusHeight1 != altitude1 + heightInAltitude) {
        //    altitudePlusHeight1 = altitude1 + heightInAltitude;
        //    altitudePlusHeightReal1 = GetAltitudeY(altitudePlusHeight1);
        //}
        //if (altitudePlusHeight2 != altitude2 + heightInAltitude) {
        //    altitudePlusHeight2 = altitude2 + heightInAltitude;
        //    altitudePlusHeightReal2 = GetAltitudeY(altitudePlusHeight2);
        //}

        //var altitudePlusHeight2 = altitude2 + heightInAltitude;
        //var altitudePlusHeightReal1 = 0;
        //var altitudePlusHeightReal2 = 0;

        //else if (altitude2 - heightInAltitude >= CameraAltitudeVirtual - 30) {
        //    altitude2 = altitude1 - heightInAltitude;
        //}

    };
    this.draw = function (_ctx) {
        _ctx.drawImage(this.RoofImage, this.RoofPosition.X, GetAltitudeY((altitude1 + heightInAltitude) + (CameraAltitudeReal * 0.5)), this.RoofSize.Width, this.RoofSize.Height + 1);
        _ctx.drawImage(this.RoofImage, this.RoofPosition.X, GetAltitudeY((altitude2 + heightInAltitude) + (CameraAltitudeReal * 0.5)), this.RoofSize.Width, this.RoofSize.Height + 1);
    };
}