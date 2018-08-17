
const playerSpeed = 3;

kontra.init();

function createItem(x, y) {
    return kontra.sprite({
        x: x,
        y: y,
        color: 'green',
        radius: 5,

        render: function () {
            this.context.strokeStyle = 'white';
            this.context.beginPath();
            this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            this.context.stroke();
        },
    });
}

let player = kontra.sprite({
    x: kontra.canvas.width / 2,
    y: kontra.canvas.height / 2,
    color: 'red',
    width: 20,
    height: 30,

    update() {
        if (kontra.keys.pressed('left')) {
            this.x -= playerSpeed;
        } else if (kontra.keys.pressed('right')) {
            this.x += playerSpeed;
        } else if (kontra.keys.pressed('up')) {
            this.y -= playerSpeed;
        } else if (kontra.keys.pressed('down')) {
            this.y += playerSpeed;
        }
    }
});

let sprites = [ player, createItem(200, 200), createItem(320, 200) ];

let loop = kontra.gameLoop({
    update: function() {
        for (let i = 0; i < sprites.length; i++) {
            let sprite = sprites[i];
            sprite.update();
        }
    },

    render: function() {
        for (let i = 0; i < sprites.length; i++) {
            let sprite = sprites[i];
            sprite.render();
        }
    }
});

loop.start();
