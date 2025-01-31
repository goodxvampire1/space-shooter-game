const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let player;
let cursors;
let bullets;
let enemies;
let score = 0;
let scoreText;

const game = new Phaser.Game(config);

function preload() {
    this.load.image('player', 'https://i.imgur.com/uLXtWtb.png'); // স্পেসশিপ
    this.load.image('bullet', 'https://i.imgur.com/3X7vU53.png'); // বুলেট
    this.load.image('enemy', 'https://i.imgur.com/CMtAQys.png'); // শত্রু
}

function create() {
    player = this.physics.add.sprite(400, 500, 'player').setScale(0.5);
    player.setCollideWorldBounds(true);

    bullets = this.physics.add.group();
    enemies = this.physics.add.group();

    cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown-SPACE', shootBullet, this);

    this.time.addEvent({
        delay: 1000,
        callback: spawnEnemy,
        callbackScope: this,
        loop: true
    });

    scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '20px', fill: '#fff' });
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-300);
    } else if (cursors.right.isDown) {
        player.setVelocityX(300);
    } else {
        player.setVelocityX(0);
    }
}

function shootBullet() {
    let bullet = bullets.create(player.x, player.y - 20, 'bullet');
    bullet.setVelocityY(-400);
    bullet.setCollideWorldBounds(true);
    bullet.outOfBoundsKill = true;
}

function spawnEnemy() {
    let xPosition = Phaser.Math.Between(50, 750);
    let enemy = enemies.create(xPosition, 50, 'enemy');
    enemy.setVelocityY(150);

    this.physics.add.collider(bullets, enemy, destroyEnemy, null, this);
}

function destroyEnemy(bullet, enemy) {
    bullet.destroy();
    enemy.destroy();
    score += 10;
    scoreText.setText('Score: ' + score);
                                     }
