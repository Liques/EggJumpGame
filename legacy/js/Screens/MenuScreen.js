/// <reference group="Dedicated Worker" />

function MenuScreen() {
    this.menuLogoImage = new Image();
    this.showMenuOpacity = 0;
    this.showMenu = true;
    this.menuLogoPosition = new Vector2(0, 0);
    this.menuLogoSize = new Size(1, 1);

    this.btPlayImage = new Image();
    this.menuBtPlayPosition = new Vector2(0, 0);
    this.menuBtPlaySize = new Size(1, 1);


    this.resize = function (_canvas) {
        this.menuLogoSize.height = GetResolutionHeight(this.menuLogoImage.height);
        this.menuLogoSize.width = GetResolutionWidth(this.menuLogoImage.width, this.menuLogoImage.height, this.menuLogoSize.height);
        this.menuLogoPosition.X = (document.documentElement.offsetWidth / 2) - (this.menuLogoSize.width / 2);
        this.menuLogoPosition.Y = document.documentElement.offsetHeight * 0.05;

        this.menuBtPlaySize.height = GetResolutionHeight(this.btPlayImage.height);
        this.menuBtPlaySize.width = GetResolutionWidth(this.btPlayImage.width, this.btPlayImage.height, this.menuBtPlaySize.height);
        this.menuBtPlayPosition.X = (document.documentElement.offsetWidth / 2) - (this.menuBtPlaySize.width / 2);
        this.menuBtPlayPosition.Y = document.documentElement.offsetHeight * 0.68;
    }

    this.update = function () {
        if (!this.showMenu && this.showMenuOpacity > 0) {
            this.showMenuOpacity *= 0.9;
            if (this.showMenuOpacity < 0) {
                this.showMenuOpacity = 0;
            }

        } else if (this.showMenu && this.showMenuOpacity < 1) {
            this.showMenuOpacity += 0.05;
            if (this.showMenuOpacity > 1) {
                this.showMenuOpacity = 1;
            }

        }
        if (this.showMenu) {

            ChangeCameraPosition(CameraAltitudeVirtual + (10 * deltaTime), false);
        }
    }

    this.draw = function (_ctx) {
        if (this.showMenuOpacity > 0) {
            //var currentMenuHeight = GetResolutionHeight(menuImage.height);
            //var currentMenuWidth = GetResolutionWidth(menuImage.width,
            _ctx.save();
            _ctx.globalAlpha = this.showMenuOpacity;
            _ctx.drawImage(this.menuLogoImage, this.menuLogoPosition.X, this.menuLogoPosition.Y, this.menuLogoSize.width, this.menuLogoSize.height);
            _ctx.drawImage(this.btPlayImage, this.menuBtPlayPosition.X, this.menuBtPlayPosition.Y, this.menuBtPlaySize.width, this.menuBtPlaySize.height);

            _ctx.restore();
        }

    }
}