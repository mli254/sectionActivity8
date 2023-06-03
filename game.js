class FirstLoad extends Phaser.Scene {
    constructor() {
        super('firstload');
    }

    preload() {
        this.load.image('rolypoly', './assets/rolypoly.png');
        this.load.image('slug', './assets/slug.png');
        this.load.image('ground', './assets/ground.png');
    }

    create() {
        this.add.rectangle(0,0,1080,640,0x000000).setOrigin(0,0);
        this.add.text(centerX, centerY, "Watch out for slugs!").setOrigin(0.5).setStyle({fontSize: `${36}px`, color: '#ffffff'});
        let instruction = this.add.text(centerX, centerY+100, "Click to advance").setOrigin(0.5).setStyle({color: '#ffffff'}).setAlpha(0);
        this.time.delayedCall(1000, () => {
            this.add.tween({
                targets: instruction,
                alpha: {from: 0, to: 1},
                duration: 1000
            });

            this.input.on('pointerdown', () => this.scene.start('sluglevel'));
        })

    }
}

class SecondLoad extends Phaser.Scene {
    constructor() {
        super('secondload');
    }

    preload() {

    }

    create() {
        
    }
}

class ThirdLoad extends Phaser.Scene {
    constructor() {
        super('thirdload');
    }

    preload() {

    }

    create() {
        
    }
}

class SlugLevel extends Phaser.Scene {
    constructor() {
        super('sluglevel');
    }

    preload() {

    }

    create() {
        this.add.rectangle(0,0,1080,640,0xa3c4ac).setOrigin(0,0);

        this.slugSpeed = -450;
        this.slugSpeedMax = -1000;
        this.ground = this.physics.add.image(0, 398, 'ground').setOrigin(0,0);
        this.ground.setImmovable(true);
        this.ground.body.allowGravity = false;

        rolypoly = this.physics.add.sprite(0, 348, 'rolypoly');
        rolypoly.setCollideWorldBounds(true);
        rolypoly.setBounce(0.5);
        rolypoly.setImmovable();
        rolypoly.setMaxVelocity(0, 600);
        rolypoly.setDragY(200);
        rolypoly.destroyed = false;

        //this.physics.add.collider(rolypoly, this.ground);
        this.physics.world.collide(rolypoly, this.ground, this.groundCollision, null, this);

        // set up barrier group
        this.slugGroup = this.add.group({
            runChildUpdate: true    // make sure update runs on group children
        });
        // wait a few seconds before spawning barriers
        this.time.delayedCall(2500, () => { 
            this.addSlug(); 
        });

        // set up cursor keys
        cursors = this.input.keyboard.createCursorKeys();
    }

    // create new barriers and add them to existing barrier group
    addSlug() {
        let speedVariance =  Phaser.Math.Between(0, 50);
        let slug = new Slug(this, this.slugSpeed - speedVariance);
        this.slugGroup.add(slug);
    }

    update() {
        // make sure paddle is still alive
        if(!rolypoly.destroyed) {
            // check for player input
            if(cursors.up.isDown) {
                rolypoly.body.velocity.y -= rolypolyVelocity;
            } else {
                rolypoly.body.velocity.y += rolypolyVelocity;
            }
            // check for collisions
            this.physics.world.collide(rolypoly, this.slugGroup, this.rolypolyCollision, null, this);
        }
    }

    rolypolyCollision() {
        rolypoly.destroyed = true;   
        this.cameras.main.shake(1500, 0.0075);
        // kill paddle
        rolypoly.destroy();  
        this.time.delayedCall(2000, () => { this.scene.start('firstload'); });
    }

    groundCollision() {
        if (groundCollide==true){
            rolypoly.body.velocity.y = 0;
            groundCollide = false;
        } else {
            groundCollide = true;
        }
    }
}

const game = new Phaser.Game({
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1080,
        height: 320
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                x: 0,
                y: 0.4
            }
        }
    },
    scene: [FirstLoad, SecondLoad, ThirdLoad, SlugLevel],
});

// define globals
let centerX = game.config.width/2;
let centerY = game.config.height/2;
let w = game.config.width;
let h = game.config.height;
let rolypoly = null;
const rolypolyVelocity = 250;
let cursors;
let groundCollide = false;