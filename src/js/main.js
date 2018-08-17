
kontra.init();

const playerSpeed = 3;

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

let loop = kontra.gameLoop({
    update: function() {
        player.update();

        if (player.x > kontra.canvas.width) {
            player.x = -player.width;
        }
    },
    render: function() {
        player.render();
    }
});

loop.start();
