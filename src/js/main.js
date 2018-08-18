
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
        ttl: Infinity,
    });
}

function createItem(x, y, number) {
    return kontra.sprite({
        type: 'item',
        x: x,
        y: y,
        number: number,
        color: '#004400',
        width: 15,
        height: 15,
        ttl: Infinity,

        render(x, y) {
            this.context.save();
            let xPos, yPos;
            if (y) {
                xPos = x;
                yPos = y;
            } else {
                xPos = this.x;
                yPos = this.y;
            }
            this.context.translate(xPos, yPos);
            this.context.fillStyle = this.color;
            this.context.fillRect(0, 0, this.width, this.height);
            this.context.fillStyle = 'white';
            this.context.textBaseline = "top";
            this.context.font = "12px Sans-serif";
            this.context.fillText(this.number.toString(), this.width * 0.3, this.height * 0.25);
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
    ttl: Infinity,

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

let sprites = [ createHomeBase(300, 300), player ];
let spritesToBeAdded = [];

const numberOfItemsToCollect = 3;

for (let i = 1; i <= numberOfItemsToCollect; i++) {
    let item = createItem(
        40 + Math.random() * (kontra.canvas.width - 2*40),
        40 + Math.random() * (kontra.canvas.height - 2*40),
        i);
    sprites.push(item);
}

let nextItemNumberToCollect = 1;


function addText(x, y, text, ttl) {
    let textSprite = kontra.sprite({
        type: 'text',
        x: x,
        y: y,
        color: 'white',
        text: text,
        ttl: ttl,

        render() {
            this.context.fillStyle = this.color;
            this.context.font = "16px Sans-serif";
            this.context.textBaseline = "top";
            this.context.fillText(this.text, this.x, this.y);

        }
    });
    spritesToBeAdded.push(textSprite);
}

function addInfoText(text) {
    addText(kontra.canvas.width * 0.4, kontra.canvas.height * 0.25, text, 200);
}

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
        if (! droppingOnBase) {
            spritesToBeAdded.push(item);
        } else if (item.number !== nextItemNumberToCollect) {
            addText(item.x + 20, item.y, `Next item is ${nextItemNumberToCollect}!`, 100);
            spritesToBeAdded.push(item);
        } else {
            nextItemNumberToCollect++;

            if (nextItemNumberToCollect > numberOfItemsToCollect) {
                addInfoText("YOU WIN");
            }
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

addInfoText("Collect items in order!");

let loop = kontra.gameLoop({
    update: function() {
        for (let i = 0; i < sprites.length; i++) {
            let sprite = sprites[i];
            sprite.update();
        }

        sprites = sprites.filter(s => !s.isPickedUp && s.isAlive());

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
