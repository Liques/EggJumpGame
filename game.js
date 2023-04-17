// game.js
var game = new Phaser.Game("100%", "100%", Phaser.AUTO, "game");

var menuScreen = {
    preload: function () {
        // load the logo image
        game.load.image("logo", "images/splashscreen.png");
        // load the background image
        game.load.image("background", "images/fundomata.jpg");
        // load the button image
        game.load.image("button", "images/btPlay.png");
    },
    create: function () {
        // add the background image to the screen as a tile sprite
        var background = game.add.tileSprite(0, 0, game.width, game.height, "background");

        // set the tile position to the bottom of the image
        background.tilePosition.y = background.height;

        // add a scrolling animation to the background's tile position
        var scrollBackground = game.add.tween(background.tilePosition).to({ y: 0 }, 5000, Phaser.Easing.Linear.None, true, 0, -1);

        // add the logo image to the center of the screen
        var logo = game.add.image(game.world.centerX, game.world.centerY, "logo");
        logo.anchor.set(0.5);

        // add a fade in animation to the logo
        logo.alpha = 0;
        var fadeInLogo = game.add.tween(logo).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);

        // add a wave animation to the logo's y position
        var waveLogo = game.add.tween(logo).to({ y: "+20" }, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);

        // add the button image below the logo
        var button = game.add.image(game.world.centerX, logo.y + logo.height / 2 + 50, "button");
        button.anchor.set(0.5);

        // make the button 55% smaller
        button.scale.set(0.45);

        // add a fade in animation to the button
        button.alpha = 0;
        var fadeInButton = game.add.tween(button).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);

        // add a click listener to start the game
        button.inputEnabled = true;
        button.events.onInputDown.add(function () {
            // add a fade out animation to the whole screen
            var fadeOutScreen = game.add.tween(game.world).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            fadeOutScreen.onComplete.add(function () {
                // start the game screen
                game.state.start("gameScreen");
            });

        });

        // make the whole screen transparent at first
        game.world.alpha = 0;

        // add a fade in animation to the whole screen
        var fadeInScreen = game.add.tween(game.world).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
    }
};

var gameScreen = {
    preload: function () {
        // load the logo image
        game.load.image("logo", "images/splashscreen.png");
    },
    create: function () {
        // add the logo image to the center of the screen
        var logo = game.add.image(game.world.centerX, game.world.centerY, "logo");
        logo.anchor.set(0.5);

        // add a button image below the logo
        var button = game.add.image(game.world.centerX, logo.y + logo.height / 2 + 50, "button");
        button.anchor.set(0.5);

        // make the button 55% smaller
        button.scale.set(0.45);

        // add a click listener to go to the game over screen
        button.inputEnabled = true;
        button.events.onInputDown.add(function () {
            // add a fade out animation to the whole screen
            var fadeOutScreen = game.add.tween(game.world).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            fadeOutScreen.onComplete.add(function () {
                // start the game over screen
                game.state.start("gameOver");
            });

        });

        // make the whole screen transparent at first
        game.world.alpha = 0;

        // add a fade in animation to the whole screen
        var fadeInScreen = game.add.tween(game.world).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
    }
};

var gameOver = {
    preload: function() {
      // load the background image
      game.load.image("background", "images/fundomata.jpg");
      // load the broken egg image
      game.load.image("brokenEgg", "images/ovoQuebrado.png");
      // load the button image
      game.load.image("button", "images/btPlayAgain.png");
    },
    create: function() {
      // add the background image to the screen as a tile sprite
      var background = game.add.tileSprite(0, 0, game.width, game.height, "background");
      // set the tile position to the bottom of the image
      background.tilePosition.y = background.height;
      // add a scrolling animation to the background's tile position
      var scrollBackground = game.add.tween(background.tilePosition).to({y: 0}, 5000, Phaser.Easing.Linear.None, true, 0, -1);
      
      // add the broken egg image to 35% from the top of the screen
      var brokenEgg = game.add.image(game.world.centerX, game.height * 0.35, "brokenEgg");
      brokenEgg.anchor.set(0.4);
      // make the broken egg small at first
      brokenEgg.scale.set(0);
      // add a bounce animation to the broken egg with a slower duration
      var bounceEgg = game.add.tween(brokenEgg.scale).to({x: 1.2, y: 1.2}, 1000, Phaser.Easing.Bounce.Out, true);
      bounceEgg.onComplete.add(function() {
        // add a scale down animation to the broken egg
        var scaleDownEgg = game.add.tween(brokenEgg.scale).to({x: 1, y: 1}, 300, Phaser.Easing.Linear.None, true);
      });
      
      // add a text below the broken egg at 55% from the top of the screen with a shadow effect
      var text = game.add.text(game.world.centerX, game.height * 0.55, "You made 456 points!", {font: "5vh Arial", fill: "#ffffff", align: "center"});
      text.anchor.set(0.5);
      text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2); // set a shadow with x and y offsets of 3 pixels and a black color with half opacity and a blur of 2 pixels
      
      // add a button image below the text at 65% from the top of the screen
      var button = game.add.image(game.world.centerX, game.height * 0.65, "button");
      button.anchor.set(0.6);
      // make the button 50% smaller
      button.scale.set(0.5);
      
      // add a click listener to go to the game screen
      button.inputEnabled = true;
      button.events.onInputDown.add(function() {
        // add a fade out animation to the whole screen
        var fadeOutScreen = game.add.tween(game.world).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
        fadeOutScreen.onComplete.add(function() {
          // start the game screen
          game.state.start("gameScreen");
        });
      });
      
      // make the whole screen transparent at first
      game.world.alpha = 0;
      
      // add a fade in animation to the whole screen
      var fadeInScreen = game.add.tween(game.world).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true);
    }
  };

// add the states to the game
game.state.add("menuScreen", menuScreen);
game.state.add("gameScreen", gameScreen);
game.state.add("gameOver", gameOver);

// start the menu screen
game.state.start("menuScreen");