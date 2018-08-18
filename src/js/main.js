
const playerSpeed = 3;

kontra.init();

function createHomeBase(x, y) {
    return kontra.sprite({
        type: 'base',
        x: x,
        y: y,
        color: 'blue',
        width: 40,
        height: 40,
    });
}

function createItem(x, y) {
    return kontra.sprite({
        type: 'item',
        x: x,
        y: y,
        color: 'green',
        width: 10,
        height: 10,

        render(x, y) {
            this.context.save();
            this.context.fillStyle = this.color;
            let xPos, yPos;
            if (y) {
                xPos = x;
                yPos = y;
            } else {
                xPos = this.x;
                yPos = this.y;
            }
            this.context.translate(xPos, yPos);
            this.context.fillRect(0, 0, this.width, this.height);
            this.context.restore();
        }
    });
}

let player = kontra.sprite({
    type: 'player',
    x: kontra.canvas.width / 2,
    y: kontra.canvas.height / 2,
    color: 'red',
    width: 20,
    height: 30,
    items: [],

    hasItem() {
        return this.items.length > 0;
    },

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
    },

    render() {
        this.context.fillStyle = this.color;
        this.context.fillRect(this.x, this.y, this.width, this.height);

        for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            item.render(this.x + this.width / 2 - item.width / 2, this.y - 5);
        }
    }
});

let sprites = [ createHomeBase(300, 300), player, createItem(200, 200), createItem(320, 200) ];
let spritesToBeAdded = [];

function getDistanceSquared(a, b) {
    let xDist = Math.abs(a.x - b.x);
    let yDist = Math.abs(a.y - b.y);
    return (xDist * xDist) + (yDist * yDist);
}

function getDistance(a, b) {
    return Math.sqrt(getDistanceSquared(a, b));
}

function findClosestOfType(self, type) {
    let min = Infinity;
    let closest = null;

    for (let i = 0; i < sprites.length; i++) {
        let other = sprites[i];

        if (other.type === type) {
            let distance = getDistanceSquared(self, other);
            if (distance < min) {
                min = distance;
                closest = other;
            }
        }
    }

    return closest;
}

function pickUpItem(player) {
    let item = findClosestOfType(player, 'item');

    if (item && getDistance(player, item) < 40) {
        item.isPickedUp = true;
        item.x = 0;
        item.y = 0;
        player.items.push(item);
    }
}

function dropItem(player) {
    if (player.hasItem()) {
        let item = player.items.pop();
        item.isPickedUp = false;
        item.x = player.x + player.width / 2 - item.width / 2;
        item.y = player.y + player.height - item.height;

        let droppingOnBase = sprites.some(s => s.type === 'base' && item.collidesWith(s));
        if (!droppingOnBase) {
            spritesToBeAdded.push(item);
        }
    }
}

kontra.keys.bind('space', () => {
    if (player.hasItem()) {
        dropItem(player);
    } else {
        pickUpItem(player);
    }
});

let loop = kontra.gameLoop({
    update: function() {
        for (let i = 0; i < sprites.length; i++) {
            let sprite = sprites[i];
            sprite.update();
        }

        sprites = sprites.filter(s => !s.isPickedUp);

        while (spritesToBeAdded.length > 0) {
            let s = spritesToBeAdded.shift();
            sprites.push(s);
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
