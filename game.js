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
let gameOverText;

const game = new Phaser.Game(config);

function preload() {
    this.load.image('player', 'https://i.imgur.com/uLXtWtb.png'); // স্পেসশিপ
    this.load.image('bullet', 'https://i.imgur.com/3X7vU53.png'); // বুলেট
    this.load.image('enemy', 'https://i.imgur.com/CMtAQys.png'); // শত্রু
    this.load.spritesheet('explosion', 'https://i.imgur.com/kjA7pDg.png', { frameWidth: 64, frameHeight: 64 }); // এক্সপ্লোসন অ্যানিমেশন
}

function create() {
    // প্লেয়ার তৈরি
    player = this.physics.add.sprite(400, 500, 'player').setScale(0.5);
    player.setCollideWorldBounds(true);

    bullets = this.physics.add.group();
    enemies = this.physics.add.group();

    // কিপ্যাড কন্ট্রোল
    cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown-SPACE', shootBullet, this);

    // এনেমি স্পাওন
    this.time.addEvent({
        delay: 1000,
        callback: spawnEnemy,
        callbackScope: this,
        loop: true
    });

    // স্কোর টেক্সট
    scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '20px', fill: '#fff' });

    // গেমওভার টেক্সট
    gameOverText = this.add.text(300, 250, '', { fontSize: '40px', fill: '#fff' });

    // প্লেয়ার এবং শত্রুদের সংঘর্ষ
    this.physics.add.collider(player, enemies, gameOver, null, this);

    // বুলেট এবং এনেমির সংঘর্ষ
    this.physics.add.collider(bullets, enemies, destroyEnemy, null, this);
}

function update() {
    if (gameOverText.visible) return; // গেমওভার হলে আর কিছু আপডেট হবে না

    // প্লেয়ার মুভমেন্ট
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
    enemy.setOutOfBoundsKill(true); // শত্রু স্ক্রীন থেকে বের হলে মারা যাবে
}

function destroyEnemy(bullet, enemy) {
    bullet.destroy();
    enemy.destroy();
    score += 10;
    scoreText.setText('Score: ' + score);
}

function gameOver() {
    // গেমওভার হলে প্লেয়ারকে রেড রঙে পরিণত করুন
    player.setTint(0xff0000);
    player.anims.play('turn');
    this.physics.pause();

    // গেমওভার টেক্সট
    gameOverText.setText('Game Over! Final Score: ' + score);
    gameOverText.visible = true;
                                                }
