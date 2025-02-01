const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let arrow;
let bow;
let target;
let score = 0;
let windSpeed = 0;
let scoreText;

function preload() {
    this.load.image('bow', 'assets/bow.png');
    this.load.image('arrow', 'assets/arrow.png');
    this.load.image('target', 'assets/target.png');
}

function create() {
    // Add bow sprite
    bow = this.add.sprite(100, 300, 'bow').setOrigin(0.5, 0.5);

    // Add target sprite
    target = this.add.sprite(700, Phaser.Math.Between(100, 500), 'target');
    
    // Create an arrow physics object
    arrow = this.physics.add.sprite(bow.x + 50, bow.y, 'arrow');
    arrow.setGravityY(-200);
    arrow.setCollideWorldBounds(true);
    arrow.setBounce(0.8);
    
    // Add score text
    scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '32px',
        fill: '#000'
    });

    // Wind effect is randomly generated every 5 seconds
    this.time.addEvent({
        delay: 5000,
        callback: setWindEffect,
        callbackScope: this,
        loop: true
    });

    // Detect pointer clicks to shoot arrows
    this.input.on('pointerdown', shootArrow, this);
}

function shootArrow(pointer) {
    // Set the arrow's starting position and speed
    arrow.setPosition(bow.x + 50, bow.y);
    arrow.setVelocityX(600 + windSpeed);
    arrow.setVelocityY(arrow.body.velocity.y - windSpeed / 2);
}

function setWindEffect() {
    // Wind speed randomly changes between -50 and 50
    windSpeed = Phaser.Math.Between(-50, 50);
    console.log('Wind speed:', windSpeed);
}

function update() {
    // Update target's position to move randomly
    target.y += (Math.random() - 0.5) * 2;

    // Check for collision between arrow and target
    if (Phaser.Geom.Intersects.RectangleToRectangle(arrow.getBounds(), target.getBounds())) {
        score += 10;
        scoreText.setText('Score: ' + score);
        target.y = Phaser.Math.Between(100, 500); // Move the target
    }
}

const game = new Phaser.Game(config);
