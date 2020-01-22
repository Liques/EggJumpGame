var lastTime = 0;
var fps = 0;
var fpsStandard = 60;
var fpsValue = 0;
var deltaTime;

function CollisionDetect(orignX, orignY, destinX, destinY) {
    return CollisionDetect(orignX, orignY, 1, 1, destinX, destinY, 1, 1)
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

function Vector2(_x, _y) {
    /// <summary>Posição X e Y.</summary>
    this.X = _x;
    this.Y = _y;
}

function Size(_width, _height) {
    /// <summary>Posição X e Y.</summary>
    this.Width = _width;
    this.Height = _height;
}

function GetResolutionHeight(_height) {
    /// <summary>Retorna um valor de altura a partir de um valor padrao de altura. O 1000 é como se fosse a lente.</summary>
    return (_height / 1000) * document.documentElement.offsetHeight;
}

function GetResolutionWidth(_width, _oldHeight, _newHeight) {
    /// <summary>Retorna o valor de largura a partir do valor de altura. Ele mantem a resolução da imagem.</summary>
    return (_newHeight / _oldHeight) * _width;
}