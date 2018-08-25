
const playerSpeed = 2;
const numberOfItemsToCollect = 3;

const TILE_WIDTH = 32;
const TILE_HEIGHT = 32;

const TILE_GROUND = 1;
const TILE_BASE = 2;
const TILE_BLOCKER = 4;

const DIR_NONE = 0, DIR_WEST = 1, DIR_EAST = 2, DIR_NORTH = 3, DIR_SOUTH = 4;

const tileSheetImage = '../images/tilesheet.png';

const map =  [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 2, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 1, 1,
    1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1,
    1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1,
    1, 1, 1, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 1, 1, 1,
    1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
];

let tileEngine;

let uiSprites = [];
let uiSpritesToAdd = [];
let sprites = [];
let spritesToBeAdded = [];

let player;

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

kontra.vector.prototype.minus = function (v) {
    return kontra.vector(this.x - v.x, this.y - v.y);
};

kontra.vector.prototype.magnitude = function() {
  return Math.sqrt(this.x * this.x + this.y * this.y);
};

function getDistance(a, b) {
    return a.minus(b).magnitude();
}

function getMovementBetween(spriteFrom, spriteTo) {
    let fromX = spriteFrom.x + spriteFrom.width / 2;
    let fromY = spriteFrom.y + spriteFrom.height / 2;
    let toX = spriteTo.x + spriteTo.width / 2;
    let toY = spriteTo.y + spriteTo.height / 2;

    return kontra.vector(toX - fromX, toY - fromY);
}

kontra.vector.prototype.normalized = function () {
    let length = this.magnitude();
    if (length === 0.0) {
        return kontra.vector(0, 0);
    }
    return kontra.vector(this.x / length, this.y / length);
};

kontra.vector.prototype.addDir = function (dir, magnitude) {
    switch (dir) {
    case DIR_WEST:
        this.x -= magnitude;
        break;
    case DIR_EAST:
        this.x += magnitude;
        break;
    case DIR_NORTH:
        this.y -= magnitude;
        break;
    case DIR_SOUTH:
        this.y += magnitude;
        break;
    case DIR_NONE:
        break;
    default:
        break;
    }
};

function getRandomPosition(margin = 40) {
    let x = margin + Math.random() * (tileEngine.mapWidth - 2 * margin);
    let y = margin + Math.random() * (tileEngine.mapHeight - 2 * margin);
    return kontra.vector(x, y);
}

function collidesWithBlocker(sprite) {
    let cameraCoordinateBounds = {
        x: -tileEngine.sx + sprite.x,
        y: -tileEngine.sy + sprite.y,
        width: sprite.width,
        height: sprite.height
    };
    return tileEngine.layerCollidesWith('blockers', cameraCoordinateBounds);
}

function keepWithinMap(sprite) {
    sprite.position.clamp(
        0,
        0,
        tileEngine.mapWidth - sprite.width,
        tileEngine.mapHeight - sprite.height);
}

function createItem(position, number) {
    let result = kontra.sprite({
        type: 'item',
        position: position,
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

    keepWithinMap(result);
    return result;
}

function createGhost(position) {
    let result = kontra.sprite({
        type: 'ghost',
        position: position,
        width: TILE_WIDTH,
        height: TILE_HEIGHT,
        color: 'red',
        ttl: Infinity,
        dir: getRandomInt(5),

        update() {
            let movement;

            if (collidesWithBlocker(this)) {
                this.color = 'yellow';
                let randomDirection = kontra.vector(
                    (-0.5 + Math.random()) * 20,
                    (-0.5 + Math.random()) * 20);
                this.position.add(randomDirection);
                return;
            } else if (this.color !== 'red') {
                this.color = 'red';
            }

            if (this._target) {
                if (1000 < performance.now() - this._targetBegin) {
                    this._target = null;
                    this._targetBegin = null;
                } else {
                    movement = this._target.minus(this.position).normalized();
                }
            } else {
                let playerPosition = player.position;
                let attackTarget = kontra.vector(playerPosition.x, playerPosition.y);
                let distance = getDistance(this.position, attackTarget);
                if (distance < 300) {
                    if (distance > 140) {
                        // Adds some variance to how the ghosts approach the player.
                        attackTarget.addDir(this.dir, 130);
                    }
                    movement = getMovementBetween(this, player).normalized();
                }
            }

            if (movement) {
                let newBounds = {
                    x: this.x + movement.x,
                    y: this.y + movement.y,
                    width: this.width,
                    height: this.height,
                };

                if (!collidesWithBlocker(newBounds)) {
                    this.position.add(movement);
                } else {
                    let newTarget = kontra.vector(this.x, this.y);

                    // Back off a little.
                    newTarget.x -= movement.x * 5;
                    newTarget.y -= movement.y * 5;

                    let toPlayer = getMovementBetween(this, player);
                    let dodgeHorizontally = Math.abs(toPlayer.x) < Math.abs(toPlayer.y);
                    let dodgeAmount = 50;

                    if (dodgeHorizontally) {
                        newTarget.x += (Math.random() >= 0.5) ? dodgeAmount : -dodgeAmount;
                    } else {
                        newTarget.y += (Math.random() >= 0.5) ? dodgeAmount : -dodgeAmount;
                    }

                    this._target = newTarget;
                    this._targetBegin = performance.now();
                }
            }
        },

        render() {
            let w = this.width, h = this.height, cx = this.context;

            cx.save();
            cx.translate(this.x, this.y);

            cx.fillStyle = this.color;
            cx.fillRect(0, h/2, this.width, h/2);

            cx.beginPath();
            cx.arc(w/2, h/2, w/2, 0, 2 * Math.PI);
            cx.fill();

            cx.fillStyle = 'black';
            cx.beginPath();
            cx.arc(w*0.3, h/2, w*0.15, 0, 2 * Math.PI);
            cx.arc(w*0.7, h/2, w*0.15, 0, 2 * Math.PI);
            cx.fill();
            cx.restore();
        }
    });

    keepWithinMap(result);
    return result;
}

function createPlayer(position) {
    let result = kontra.sprite({
        type: 'player',
        position: position,
        color: 'green',
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
            }

            if (kontra.keys.pressed('up')) {
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

    keepWithinMap(result);
    return result;
}

function getStartingPosition() {
    for (let i = 0; i < 20; i++) {
        let pos = getRandomPosition();
        if (sprites.every(s => getDistance(pos, s.position) > 100)) { // jshint ignore:line
            return pos;
        }
    }

    return null;
}

function createMap() {
    tileEngine = kontra.tileEngine({
        tileWidth: TILE_WIDTH,
        tileHeight: TILE_HEIGHT,
        width: 26,
        height: 20,
    });

    tileEngine.addTilesets({
        image: kontra.assets.images[tileSheetImage],
    });

    tileEngine.addLayers([{
        name: 'ground',
        data: map.map(tile => tile === TILE_BLOCKER ? TILE_GROUND : tile),
    }, {
        name: 'blockers',
        data: map.map(tile => tile === TILE_BLOCKER ? TILE_BLOCKER : 0),
    }]);

    player = createPlayer(kontra.vector(tileEngine.mapWidth / 2, tileEngine.mapHeight / 2));
    sprites.push(player);

    for (let i = 1; i <= numberOfItemsToCollect; i++) {
        let pos = getStartingPosition();
        if (pos) {
            let item = createItem(pos, i);
            sprites.push(item);
        }
    }

    for (let i = 0; i < 5; i++) {
        var pos = getStartingPosition();
        if (pos) {
            let ghost = createGhost(pos);
            sprites.push(ghost);
        }
    }
}

let nextItemNumberToCollect = 1;

function createText(x, y, text, ttl) {
    return kontra.sprite({
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
}

function addText(x, y, text, ttl) {
    let textSprite = createText(x, y, text, ttl);
    spritesToBeAdded.push(textSprite);
}

function addInfoText(text) {
    let textSprite = createText(kontra.canvas.width * 0.4, kontra.canvas.height * 0.25, text, 200);
    uiSpritesToAdd.push(textSprite);
}

function findClosestOfType(self, type) {
    let min = Infinity;
    let closest = null;

    for (let i = 0; i < sprites.length; i++) {
        let other = sprites[i];

        if (other.type === type) {
            let distance = getDistance(self.position, other.position);
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

    if (item && getDistance(player.position, item.position) < 40) {
        item.isPickedUp = true;
        item.x = 0;
        item.y = 0;
        player.items.push(item);
    }
}

function isOnGroundTile(sprite, tile) {
    let tileAtSpot = tileEngine.tileAtLayer(
        'ground',
        {
            x: -tileEngine.sx + sprite.x + sprite.width / 2,
            y: -tileEngine.sy + sprite.y + sprite.height,
        });
    return (tileAtSpot === tile);
}

function dropItem(player) {
    if (player.hasItem()) {
        let item = player.items.pop();
        item.isPickedUp = false;
        item.x = player.x + player.width / 2 - item.width / 2;
        item.y = player.y + player.height - item.height;

        if (! isOnGroundTile(item, TILE_BASE)) {
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

function bindKeys() {
    kontra.keys.bind('space', () => {
        if (player.isAlive()) {
            if (player.hasItem()) {
                dropItem(player);
            } else {
                pickUpItem(player);
            }
        }
    });
}

function adjustCamera() {
    const margin = 200;
    const cameraSpeed = playerSpeed;

    if (player.x - tileEngine.sx < margin) {
        tileEngine.sx -= cameraSpeed;
    } else if ((tileEngine.sx + kontra.canvas.width) - player.x < margin) {
        tileEngine.sx += cameraSpeed;
    }

    if (player.y - tileEngine.sy < margin) {
        tileEngine.sy -= cameraSpeed;
    } else if ((tileEngine.sy + kontra.canvas.height) - player.y < margin) {
        tileEngine.sy += cameraSpeed;
    }
}

function checkCollisions() {
    for (let i = 0; i < sprites.length; i++) {
        let sprite = sprites[i];

        if (sprite.type === 'ghost' && player.collidesWith(sprite)) {
            player.ttl = 0;
        }
    }
}

function createGameLoop() {
    return kontra.gameLoop({
        update() {
            for (let i = 0; i < sprites.length; i++) {
                let sprite = sprites[i];
                sprite.update();
            }

            checkCollisions();

            adjustCamera();

            for (let i = 0; i < uiSprites.length; i++) {
                let sprite = uiSprites[i];
                sprite.update();
            }

            sprites = sprites.filter(s => !s.isPickedUp && s.isAlive());
            uiSprites = uiSprites.filter(s => s.isAlive());

            while (spritesToBeAdded.length > 0) {
                let s = spritesToBeAdded.shift();
                sprites.push(s);
            }
            while (uiSpritesToAdd.length > 0) {
                let s = uiSpritesToAdd.shift();
                uiSprites.push(s);
            }
        },

        render() {
            tileEngine.render();

            kontra.context.save();
            kontra.context.translate(-tileEngine.sx, -tileEngine.sy);
            for (let i = 0; i < sprites.length; i++) {
                let sprite = sprites[i];
                sprite.render();
            }
            kontra.context.restore();

            for (let i = 0; i < uiSprites.length; i++) {
                let sprite = uiSprites[i];
                sprite.render();
            }
        }
    });
}

function main() {
    kontra.init();
    kontra.assets.load(tileSheetImage)
        .then(() => {
            createMap();
            bindKeys();
            addInfoText("Collect items in order!");
            const loop = createGameLoop();
            loop.start();
        }).catch(error => {
            console.log(error); // jshint ignore:line
        });
}

main();
