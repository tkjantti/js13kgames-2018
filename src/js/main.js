
const playerSpeed = 3;
const numberOfItemsToCollect = 3;

const TILE_WIDTH = 32;
const TILE_HEIGHT = 32;

const tileSheetImage = '../images/tilesheet.png';

let ghostSpriteSheet;

function createAnimations() {
    ghostSpriteSheet = kontra.spriteSheet({
        image: kontra.assets.images[tileSheetImage],
        frameWidth: TILE_WIDTH,
        frameHeight: TILE_HEIGHT,
        animations: {
            idle: {
                frames: 15
            }
        }
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

function createGhost(x, y) {
    return kontra.sprite({
        type: 'ghost',
        x: x,
        y: y,
        width: TILE_WIDTH,
        height: TILE_HEIGHT,
        color: 'blue',
        animations: ghostSpriteSheet.animations,
        ttl: Infinity,
    });
}

function createPlayer(x, y) {
    return kontra.sprite({
        type: 'player',
        x: x,
        y: y,
        color: 'red',
        width: 20,
        height: 30,
        items: [],
        ttl: Infinity,
        keyState: {
            left: false,
            right: false,
            up: false,
            down: false,
        },
        movingHorizontal: false,

        hasItem() {
            return this.items.length > 0;
        },

        getMovement() {
            let oldKeyState = this.keyState;
            let newKeyState = {
                left: kontra.keys.pressed('left'),
                right: kontra.keys.pressed('right'),
                up: kontra.keys.pressed('up'),
                down: kontra.keys.pressed('down'),
            };
            this.keyState = newKeyState;

            let leftJustPressed = !oldKeyState.left && newKeyState.left;
            let rightJustPressed = !oldKeyState.right && newKeyState.right;
            let horizontalJustPressed = leftJustPressed || rightJustPressed;

            let upJustPressed = !oldKeyState.up && newKeyState.up;
            let downJustPressed = !oldKeyState.down && newKeyState.down;
            let verticalJustPressed = upJustPressed || downJustPressed;

            if (horizontalJustPressed) {
                this.movingHorizontal = true;
            } else if (verticalJustPressed) {
                this.movingHorizontal = false;
            }

            let dx = 0, dy = 0;
            if (newKeyState.left) {
                dx = -playerSpeed;
            } else if (newKeyState.right) {
                dx = playerSpeed;
            }

            if (newKeyState.up) {
                dy = -playerSpeed;
            } else if (newKeyState.down) {
                dy = playerSpeed;
            }

            if (dx && dy) {
                if (this.movingHorizontal) {
                    return { x: dx, y: 0 };
                } else {
                    return { x: 0, y: dy };
                }
            } else if (dx) {
                return { x: dx, y: 0 };
            } else if (dy) {
                return { x: 0, y: dy };
            }

            return { x: 0, y: 0 };
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
}

let uiSprites = [];
let uiSpritesToAdd = [];
let sprites = [];
let spritesToBeAdded = [];
let player;

const TILE_BASE = 13;

let tileEngine;

const groundLayer = [
    1, 1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 4, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 4, 1, 1, 5, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 4, 1, 4, 4, 1, 4, 4,
    1, 1, 1, 1, 1, 1, 5, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 4, 1, 1, 1, 5, 4, 1, 1, 1, 1, 6, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
    1, 1, 1, 1, 1, 1, 5, 1, 1, 4, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 5, 1, 4, 1, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 5, 1, 1, 1, 4, 1, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    9, 9, 9, 9, 9, 9, 8, 9, 9, 9, 9, 9, 11,1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1,
    1, 1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 4, 1, 1, 4, 5, 4, 1, 4, 1, 1, 13,1, 4, 1, 4, 1, 1, 1, 1, 1, 1, 1, 4, 1,
    1, 1, 1, 1, 1, 1, 5, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 4, 1, 4, 1, 1, 5, 1, 1, 1, 1, 1, 2, 3, 4, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 4, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4,
    1, 1, 4, 1, 1, 1, 5, 4, 1, 4, 1, 4, 1, 1, 1, 1, 4, 1, 4, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 4, 5, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4,
    1, 4, 1, 4, 1, 1, 5, 1, 1, 4, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 5, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 4, 1, 5, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1,
    1, 1, 1, 1, 1, 1, 5, 1, 4, 1, 1, 4, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
];

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

    tileEngine.addLayers({
        name: 'ground',
        data: groundLayer,
    });

    player = createPlayer(tileEngine.mapWidth / 2, tileEngine.mapHeight / 2);
    sprites.push(player);

    for (let i = 1; i <= numberOfItemsToCollect; i++) {
        let item = createItem(
            40 + Math.random() * (tileEngine.mapWidth - 2*40),
            40 + Math.random() * (tileEngine.mapHeight - 2*40),
            i);
        sprites.push(item);
    }

    for (let i = 0; i < 5; i++) {
        let ghost = createGhost(
            40 + Math.random() * (tileEngine.mapWidth - 2*40),
            40 + Math.random() * (tileEngine.mapHeight - 2*40)
        );
        sprites.push(ghost);
    }
}

let nextItemNumberToCollect = 1;

function createText(x, y, text, ttl) {
    return kontra.sprite({
        type: 'text',
        x: x,
        y: y,
        color: 'black',
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
        if (player.hasItem()) {
            dropItem(player);
        } else {
            pickUpItem(player);
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

function move(sprite, movement) {
    if (movement.x) {
        let isWithinLeftBorder = (movement.x < 0) && (sprite.x > 0);
        let isWithinRightBorder = movement.x > 0 &&
            (sprite.x + sprite.width) < tileEngine.mapWidth;
        if (isWithinLeftBorder || isWithinRightBorder) {
            sprite.x += movement.x;
        }
    }
    if (movement.y) {
        let isWithinTopBorder = (movement.y < 0) && (sprite.y > 0);
        let isWithinBottomBorder = movement.y > 0 &&
            (sprite.y + sprite.height) < tileEngine.mapHeight;
        if (isWithinTopBorder || isWithinBottomBorder) {
            sprite.y += movement.y;
        }
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
                if (sprite.getMovement) {
                    let movement = sprite.getMovement();
                    move(sprite, movement);
                }
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
            createAnimations();
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
