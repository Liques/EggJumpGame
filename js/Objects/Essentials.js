/// <reference group="Dedicated Worker" />


var CameraAltitudeReal = 0; // A altitude real da camera fica na verdade bem no topo do jogo... OBS.: Use o ChangePositon para mudar a posição
var CameraAltitudeVirtual = 0; // ... por isso a necessidade do virtual que fica no chão. OBS.: Use o ChangePositon para mudar a posição
var newCameraAltitude = 0; // OBS.: Use o ChangePositon para mudar a posição
var CameraSpecialPosition = new Vector2(0, 0);
var isCameraAnimating = 0;
var firstAltitude = 0;

var gameDashboardPosition = new Vector2(0, 0);
var gameDashboardSize = new Size(0, 0);
var gameDashboarMarginSide;


function GetAltitudeY(_altitude) {
    /// <summary>Converte a altitude real do objeto a partir da camera.</summary>
    /// <returns type="Number">Valor real da altura.</returns>
    var currentConvertedCameraAltitude = CameraAltitudeReal * document.documentElement.offsetHeight / 100;
    var currentConvertedObjectAltitude = _altitude * document.documentElement.offsetHeight / 100;
    return currentConvertedCameraAltitude - currentConvertedObjectAltitude;
}

function GetAltitudeYWithDeep(_altitude, _deep) {
    /// <summary>Converte a altitude real do objeto a partir da camera.</summary>
    /// <returns type="Number">Valor real da altura.</returns>
    var currentConvertedCameraAltitude = (CameraAltitudeReal * document.documentElement.offsetHeight) * (0.005 + (_deep * 0.005));
    var currentConvertedObjectAltitude = (_altitude * document.documentElement.offsetHeight) * (0.005 + (_deep * 0.005));
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