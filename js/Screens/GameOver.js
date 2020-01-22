function GameoverScreen() {
    this.btPlayAgainImage = new Image();
    this.btPlayAgainPosition = new Vector2(0, 0);
    this.btPlayAgainSize = new Size(1, 1);

    this.figEggDestroiedImage = new Image();
    this.figEggDestroiedPosition = new Vector2();
    this.figEggDestroiedSize = new Size();

    this.points = 0;
    this.highestPoints = 0;

    this.screenOpacity = 0;
    var newScreenOpacity = 0;
    this.showScreen = false;

    var gameOverTextPosition = new Vector2(0, 0),
    label1 = new Vector2(0, 0),
    label2 = new Vector2(0, 0),
    label3 = new Vector2(0, 0),
    label4 = new Vector2(0, 0);

    this.draw = function (_ctx) {

        if (this.screenOpacity > 0) {
            _ctx.save()

            _ctx.globalAlpha = this.screenOpacity;

            _ctx.fillStyle = "white";
            _ctx.font = gameDashboardSize.Height * 0.1 + "px Segoe UI";
            _ctx.fillText("Game Over", gameOverTextPosition.X, gameOverTextPosition.Y);

            _ctx.font = gameDashboardSize.Height * 0.028 + "px Segoe UI";
            _ctx.fillText("Your score:", label1.X, label1.Y);
            _ctx.fillText("Your highest score:", label3.X, label3.Y);

            _ctx.font = gameDashboardSize.Height * 0.055 + "px Segoe UI";
            _ctx.fillText(this.points + " Points", label2.X, label2.Y);

            _ctx.font = gameDashboardSize.Height * 0.055 + "px Segoe UI";
            _ctx.fillText(this.highestPoints + " Points", label4.X, label4.Y);

            _ctx.drawImage(this.btPlayAgainImage, this.btPlayAgainPosition.X, this.btPlayAgainPosition.Y, this.btPlayAgainSize.Width, this.btPlayAgainSize.Height);
            _ctx.drawImage(this.figEggDestroiedImage, this.figEggDestroiedPosition.X, this.figEggDestroiedPosition.Y, this.figEggDestroiedSize.Width, this.figEggDestroiedSize.Height);

            _ctx.restore();
        }

    }

    this.update = function () {

        if (newScreenOpacity != this.screenOpacity) {
            var distance = newScreenOpacity - this.screenOpacity;
            distance *= 0.1;
            this.screenOpacity = this.screenOpacity + distance;
        }

        if (this.screenOpacity >= 0.9 && this.showScreen) {
            currentScreen = 2;
        }

    }

    this.resize = function (_ctx) {
        _ctx.save();

        _ctx.font = gameDashboardSize.Height * 0.1 + "px Segoe UI";
        gameOverTextPosition.X = (document.documentElement.offsetWidth / 2) - (_ctx.measureText("Game Over").width / 2);
        gameOverTextPosition.Y = document.documentElement.offsetHeight * 0.12;

        _ctx.font = gameDashboardSize.Height * 0.028 + "px Segoe UI";
        label1.X = gameDashboardPosition.X + (gameDashboardSize.Width * 0.15);
        label1.Y = gameDashboardSize.Height * 0.2;
        label3.X = gameDashboardPosition.X + (gameDashboardSize.Width * 0.15);
        label3.Y = gameDashboardSize.Height * 0.38;

        _ctx.font = gameDashboardSize.Height * 0.05 + "px Segoe UI";
        label2.X = gameDashboardPosition.X + (gameDashboardSize.Width * 0.15);
        label2.Y = gameDashboardSize.Height * 0.275;
        label4.X = gameDashboardPosition.X + (gameDashboardSize.Width * 0.15);
        label4.Y = gameDashboardSize.Height * 0.46;

        this.btPlayAgainSize.Height = GetResolutionHeight(this.btPlayAgainImage.height);
        this.btPlayAgainSize.Width = GetResolutionWidth(this.btPlayAgainImage.width, this.btPlayAgainImage.height, this.btPlayAgainSize.Height);
        this.btPlayAgainPosition.X = (document.documentElement.offsetWidth / 2) - (this.btPlayAgainSize.Width / 2);
        this.btPlayAgainPosition.Y = document.documentElement.offsetHeight * 0.52;

        this.figEggDestroiedSize.Height = GetResolutionHeight(this.figEggDestroiedImage.height);
        this.figEggDestroiedSize.Width = GetResolutionWidth(this.figEggDestroiedImage.width, this.figEggDestroiedImage.height, this.figEggDestroiedSize.Height);
        this.figEggDestroiedPosition.X = (document.documentElement.offsetWidth / 2) - (this.figEggDestroiedSize.Width / 2);
        this.figEggDestroiedPosition.Y = document.documentElement.offsetHeight * 0.68;

        _ctx.restore();
    }

    this.show = function () {
        this.showScreen = true;
        newScreenOpacity = 1;
    }
    this.hide = function () {
        newScreenOpacity = 0;
        this.showScreen = false;
    }
}