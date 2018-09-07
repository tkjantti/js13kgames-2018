/* global maps */

(function () {

    //----------------------------------------------------------------------------
    // Music data section
    //----------------------------------------------------------------------------
    // Song data
    const song = { songData: [{ i: [3, 0, 128, 0, 2, 176, 128, 20, 0, 0, 0, 12, 33, 96, 2, 0, 61, 4, 1, 2, 109, 86, 7, 32, 112, 3, 67, 2], p: [, , 3, 2, 2, 2, 2, 1, 4, 5, 2, 1, 2, 1, 4, 5, 4, 5, 2, 1, 2, 1], c: [{ n: [106, 118, 130, 142, 130, 118, 106, 118, 106, 118, 130, 142, 130, 118, 106, 118, 108, 120, 132, 144, 132, 120, 108, 120, 108, 120, 132, 144, 132, 120, 108, 120, 94, 106, 118, 130, 118, 106, 94, 106, 94, 106, 118, 130, 118, 106, 94, 106, 96, 108, 120, 132, 120, 108, 96, 108, 96, 108, 120, 132, 120, 108, 96, 108], f: [] }, { n: [106, 118, 130, 142, 130, 118, 106, 118, 106, 118, 130, 142, 130, 118, 106, 118, 106, 118, 130, 142, 130, 118, 106, 118, 106, 118, 130, 142, 130, 118, 106, 118, 94, 106, 118, 130, 118, 106, 94, 106, 94, 106, 118, 130, 118, 106, 94, 106, 94, 106, 118, 130, 118, 106, 94, 106, 94, 106, 118, 130, 118, 106, 94, 106], f: [] }, { n: [106, 118, 130, 142, 130, 118, 106, 118, 106, 118, 130, 142, 130, 118, 106, 118, 106, 118, 130, 142, 130, 118, 106, 118, 106, 118, 130, 142, 130, 118, 106, 118, 94, 106, 118, 130, 118, 106, 94, 106, 94, 106, 118, 130, 118, 106, 94, 106, 94, 106, 118, 130, 118, 106, 94, 106, 94, 106, 118, 130, 118, 106, 94, 106], f: [6, , , , 6, , , , 6, , , , 6, , , , 6, , , , 6, , , , 6, , , , 6, , , , 16, , , , 32, , , , 64, , , , 96, , , , 128, , , , 160, , , , 176, , , , 192] }, { n: [111, 123, 135, 147, 135, 123, 111, 123, 111, 123, 135, 147, 135, 123, 111, 123, 111, 123, 135, 147, 135, 123, 111, 123, 111, 123, 135, 147, 135, 123, 111, 123, 99, 111, 123, 135, 123, 111, 99, 111, 99, 111, 123, 135, 123, 111, 99, 111, 99, 111, 123, 135, 123, 111, 99, 111, 99, 111, 123, 135, 123, 111, 99, 111], f: [] }, { n: [111, 123, 135, 147, 135, 123, 111, 123, 111, 123, 135, 147, 135, 123, 111, 123, 113, 125, 137, 149, 137, 125, 113, 125, 113, 125, 137, 149, 137, 125, 113, 125, 99, 111, 123, 135, 123, 111, 99, 111, 99, 111, 123, 135, 123, 111, 99, 111, 101, 113, 125, 137, 125, 113, 101, 113, 101, 113, 125, 137, 125, 113, 101, 113], f: [] }] }, { i: [0, 255, 116, 1, 0, 255, 116, 0, 1, 0, 4, 6, 35, 0, 0, 0, 0, 0, 0, 2, 14, 0, 0, 32, 0, 0, 0, 0], p: [, , , , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], c: [{ n: [144, , , , 144, , , , 144, , , , 144, , , , 144, , , , 144, , , , 144, , , , 144], f: [] }] }, { i: [3, 100, 128, 1, 3, 201, 128, 2, 0, 0, 0, 6, 49, 0, 0, 0, 139, 4, 1, 3, 30, 184, 119, 244, 147, 6, 84, 6], p: [, , , 2, 2, 2, 2, 1, 4, 3, 2, 1, 2, 1, 4, 3, 4, 3, 2, 1, 2, 1], c: [{ n: [, , 94, , , , 94, , , , 94, , , , 94, , , , 96, , , , 96, , , , 96, , , , 96], f: [] }, { n: [, , 94, , , , 94, , , , 94, , , , 94, , , , 94, , , , 94, , , , 94, , , , 94], f: [] }, { n: [, , 99, , , , 99, , , , 99, , , , 99, , , , 101, , , , 101, , , , 101, , , , 101], f: [] }, { n: [, , 99, , , , 99, , , , 99, , , , 99, , , , 99, , , , 99, , , , 99, , , , 99], f: [] }] }, { i: [2, 255, 128, 0, 3, 255, 128, 0, 0, 0, 5, 6, 58, 12, 4, 0, 195, 6, 1, 2, 135, 0, 0, 32, 147, 6, 121, 6], p: [3, 4, 2, 2, 2, 2, 2, 5, 6, 7, 2, 5, 2, 1, 6, 7, 6, 7, 2, 1, 2, 5], c: [{ n: [130, , , , 138, , , , 130, , , , 135, , , , 132, , , , 140, , , , 132, , , , 137], f: [] }, { n: [130, , , , 138, , , , 130, , , , 135, , , , 130, , , , 138, , , , 130, , , , 135], f: [2, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 255] }, { n: [130, , , , 138, , , , 130, , , , 135, , , , 130, , , , 138, , , , 130, , , , 135], f: [2, , , , , , , , 2, , , , , , , , 2, , , , , , , , 2, , , , , , , , , , , , , , , , 32, , , , , , , , 64, , , , , , , , 96] }, { n: [130, , , , 138, , , , 130, , , , 135, , , , 130, , , , 138, , , , 130, , , , 135], f: [2, , , , , , , , 2, , , , , , , , 2, , , , , , , , 2, , , , , , , , 130, , , , , , , , 160, , , , , , , , 192, , , , , , , , 224] }, { n: [130, , , , 138, , , , 130, , , , 135, , , , 132, , , , 140, , , , 132], f: [2, , , , 2, , , , 2, , , , 2, , , , 2, , , , 2, , , , 2, , , , , , , , 224, , , , 192, , , , 160, , , , 128, , , , 96, , , , 64, , , , 16] }, { n: [135, , , , 143, , , , 135, , , , 140, , , , 135, , , , 143, , , , 135, , , , 140], f: [2, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 255] }, { n: [135, , , , 143, , , , 135, , , , 140, , , , 137, , , , 145, , , , 137, , , , 142], f: [] }] }, { i: [3, 0, 128, 0, 3, 68, 128, 0, 1, 218, 4, 4, 40, 0, 0, 1, 55, 4, 1, 2, 67, 115, 124, 190, 67, 6, 39, 1], p: [, , , , , , , , 1, 1, 1, 1, , , 1, 1, 1, 1], c: [{ n: [, , , , 135, , , , , , , , 135, , , , , , , , 135, , , , , , , , 135, , 147], f: [] }] }, { i: [0, 0, 140, 0, 0, 0, 140, 0, 0, 60, 4, 10, 34, 0, 0, 0, 187, 5, 0, 1, 239, 135, 0, 32, 108, 5, 16, 4], p: [, , , , , , , , 1, 1, 1, 1, , , 1, 1, 1, 1], c: [{ n: [, , 147, , , , 147, , , , 147, , , , 147, , , , 147, , , , 147, , , , 147, , , , 147], f: [] }] }, { i: [0, 255, 106, 1, 0, 255, 106, 0, 1, 0, 5, 7, 164, 0, 0, 0, 0, 0, 0, 2, 255, 0, 2, 32, 83, 5, 25, 1], p: [, , , , , , , 1], c: [{ n: [, , , , , , , , , , , , , , , , 147], f: [] }] }, { i: [0, 0, 140, 0, 0, 0, 140, 0, 0, 255, 158, 158, 158, 0, 0, 0, 51, 2, 1, 2, 58, 239, 0, 32, 88, 1, 157, 2], p: [, , , , , , , 1, , , , , , 1, , , , 1, , , , 1], c: [{ n: [135], f: [] }] },], rowLen: 5513, patternLen: 32, endPattern: 21, numChannels: 8 }
    const mainTune = document.createElement("audio");

    const playerSpeed = 1.5;
    const diagonalSpeedCoefficient = 0.707;

    const KEY_LEFT = 37;
    const KEY_UP = 38;
    const KEY_RIGHT = 39;
    const KEY_DOWN = 40;

    const TILE_WIDTH = 32;
    const TILE_HEIGHT = 32;

    const TILE_GROUND = 1;
    const TILE_WALL = 3;
    const TILE_BLOCKER = 4;

    const DIR_NONE = 0, DIR_WEST = 1, DIR_EAST = 2, DIR_NORTH = 3, DIR_SOUTH = 4;

    const artifactColors = [
        '#FFFF00',
        '#FF00FF',
        '#00FFFF',
        '#FF0000',
        '#00FF00',
        '#0000FF',
    ];

    const ONLINE_TOGGLE_DELAY = 1200;

    const LAYER_GROUND = 'G';
    const LAYER_FLASHING = 'F';
    const LAYER_BLOCKERS = 'B';
    const LAYER_WALLS = 'W';

    const HELP_TEXT_DISPLAY_TIME = 3000;

    const tileSheetImagePath = '../images/tilesheet.png';

    let keysDown = {};

    let cx; // Convas context

    let tileSheetImage;

    let mapIndex = 0;
    let currentMap;

    let tileEngine;

    let sprites = [];

    let player;

    let artifactCount;
    let numberOfArtifactsCollected = 0;

    let online;

    // When online mode was requested on/off (it takes a little time to toggle it).
    let onlineToggleSwitchTime;

    // Last time when online mode was toggled on/off.
    let onlineLatestToggleTime;

    // How long to wait until next on/off toggle.
    let onlineToggleWaitTime;

    let levelStartTime;

    // Angle for the ghosts in the winning animation.
    let ghostAngle = 0;

    function resetLevel() {
        sprites = [];
        online = true;
        onlineToggleSwitchTime = null;
        onlineLatestToggleTime = levelStartTime = performance.now();
    }

    function mapIsFinished() {
        return numberOfArtifactsCollected === artifactCount;
    }

    function gameIsFinished() {
        return mapIndex >= (maps.length - 1);
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    class Vector {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }

        add(v) {
            this.x += v.x;
            this.y += v.y;
        }

        plus(v) {
            return new Vector(this.x + v.x, this.y + v.y);
        }

        minus(v) {
            return new Vector(this.x - v.x, this.y - v.y);
        }

        magnitude() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }

        normalized() {
            let length = this.magnitude();
            if (length === 0.0) {
                return new Vector(0, 0);
            }
            return new Vector(this.x / length, this.y / length);
        }

        addDir(dir, magnitude) {
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
        }
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    /*
     * Gets distance between two positions.
     */
    function getDistance(a, b) {
        return a.minus(b).magnitude();
    }

    function getMovementBetween(spriteFrom, spriteTo) {
        let fromX = spriteFrom.x + spriteFrom.width / 2;
        let fromY = spriteFrom.y + spriteFrom.height / 2;
        let toX = spriteTo.x + spriteTo.width / 2;
        let toY = spriteTo.y + spriteTo.height / 2;

        return new Vector(toX - fromX, toY - fromY);
    }

    function collidesWithLayer(sprite, layer) {
        let cameraCoordinateBounds = {
            x: -tileEngine.sx + sprite.x,
            y: -tileEngine.sy + sprite.y,
            width: sprite.width,
            height: sprite.height
        };
        return tileEngine.layerCollidesWith(layer, cameraCoordinateBounds);
    }

    function collidesWithBlockers(sprite) {
        return online && collidesWithLayer(sprite, LAYER_BLOCKERS);
    }

    function createArtifact(position, number) {
        return {
            type: 'item',
            position: position,
            color: artifactColors[number % artifactColors.length],
            width: 20,
            height: 20,

            get x() {
                return this.position.x;
            },

            get y() {
                return this.position.y;
            },

            update() {},

            render() {
                let w = this.width, h = this.height;

                cx.save();
                cx.translate(this.x, this.y);

                cx.fillStyle = 'black';
                cx.strokeStyle = this.color;
                cx.lineWidth = 3;

                cx.beginPath();
                cx.moveTo(0, h);
                cx.lineTo(w / 2, 0);
                cx.lineTo(w, h);
                cx.closePath();
                cx.fill();
                cx.stroke();

                cx.restore();
            }
        };
    }

    function createGhost(position, number) {
        return {
            type: 'ghost',
            position: position,
            number: number,
            width: 22,
            height: 22,
            color: 'red',
            dir: getRandomInt(5),

            get x() {
                return this.position.x;
            },

            get y() {
                return this.position.y;
            },

            update() {
                let movement;

                if (collidesWithBlockers(this)) {
                    this.color = 'yellow';
                    let randomDirection = new Vector(
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
                } else if (gameIsFinished() && 1500 < (performance.now() - levelStartTime)) {
                    let angle = ghostAngle + this.number * 0.3;
                    let r = 180 + Math.sin(ghostAngle * 10) * 30;
                    let target = player.position.plus(
                        new Vector(Math.cos(angle) * r, Math.sin(angle) * r));
                    movement = target.minus(this.position).normalized();
                } else if (!player.dead) {
                    let playerPosition = player.position;
                    let attackTarget = new Vector(playerPosition.x, playerPosition.y);
                    let distance = getDistance(this.position, attackTarget);
                    if (distance < 400) {
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

                    if (!collidesWithBlockers(newBounds)) {
                        this.position.add(movement);
                    } else {
                        let newTarget = new Vector(this.x, this.y);

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
                // Different size for drawing than for collision checking.
                let w = this.width * 1.4, h = this.height * 1.4;
                let x = this.x - (w - this.width) * 0.5;
                let y = this.y - (h - this.height) * 0.70;

                cx.save();
                cx.translate(x, y);

                cx.fillStyle = this.color;
                cx.fillRect(0, h / 2, w, h / 2);

                cx.beginPath();
                cx.arc(w / 2, h / 2, w / 2, 0, 2 * Math.PI);
                cx.fill();

                cx.fillStyle = 'black';
                cx.beginPath();
                cx.arc(w * 0.3, h / 2, w * 0.15, 0, 2 * Math.PI);
                cx.arc(w * 0.7, h / 2, w * 0.15, 0, 2 * Math.PI);
                cx.fill();

                cx.restore();
            }
        };
    }

    function createPlayer(position) {
        return {
            type: 'player',
            position: position,
            width: 20,
            height: 25,

            get x() {
                return this.position.x;
            },

            get y() {
                return this.position.y;
            },

            collidesWith(other) {
                return this.x < other.x + other.width &&
                    this.x + this.width > other.x &&
                    this.y < other.y + other.height &&
                    this.y + this.height > other.y;
            },

            update() {
                let xDiff = 0, yDiff = 0;

                if (keysDown[KEY_LEFT]) {
                    xDiff = -playerSpeed;
                } else if (keysDown[KEY_RIGHT]) {
                    xDiff = playerSpeed;
                }

                if (keysDown[KEY_UP]) {
                    yDiff = -playerSpeed;
                } else if (keysDown[KEY_DOWN]) {
                    yDiff = playerSpeed;
                }

                if (xDiff && yDiff) {
                    xDiff *= diagonalSpeedCoefficient;
                    yDiff *= diagonalSpeedCoefficient;
                }

                let newBounds = {
                    // keep within the map
                    x: clamp(this.x + xDiff, 0, tileEngine.mapWidth - this.width),
                    y: clamp(this.y + yDiff, 0, tileEngine.mapHeight - this.height),

                    width: this.width,
                    height: this.height,
                };

                if (!collidesWithLayer(newBounds, LAYER_WALLS)) {
                    this.position = new Vector(newBounds.x, newBounds.y);
                } else if (xDiff && yDiff) {
                    // Check if can move horizontally.
                    newBounds = {
                        x: clamp(this.x + xDiff, 0, tileEngine.mapWidth - this.width),
                        y: this.y,
                        width: this.width,
                        height: this.height,
                    };
                    if (!collidesWithLayer(newBounds, LAYER_WALLS)) {
                        this.position = new Vector(newBounds.x, newBounds.y);
                    } else {
                        // Check if can move vertically.
                        newBounds = {
                            x: this.x,
                            y: clamp(this.y + yDiff, 0, tileEngine.mapHeight - this.height),
                            width: this.width,
                            height: this.height,
                        };
                        if (!collidesWithLayer(newBounds, LAYER_WALLS)) {
                            this.position = new Vector(newBounds.x, newBounds.y);
                        }
                    }
                }
            },

            render() {
                cx.fillStyle = 'cyan';
                cx.fillRect(this.x, this.y, this.width, this.height);
            }
        };
    }

    function findPositionsOf(map, element) {
        let result = [];
        let data = map.data;

        for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
            let row = data[rowIndex];
            for (let colIndex = 0; colIndex < row.length; colIndex++) {
                if (row[colIndex] === element) {
                    result.push(new Vector(colIndex * TILE_WIDTH, rowIndex * TILE_HEIGHT));
                }
            }
        }

        return result;
    }

    function mapToLayer(map, convert) {
        return map.data.reduce((total, current) => total + current).split('').map(convert);
    }

    function createMap(map) {
        resetLevel();

        currentMap = map;

        onlineToggleWaitTime = map.online;

        tileEngine = kontra.tileEngine({
            tileWidth: TILE_WIDTH,
            tileHeight: TILE_HEIGHT,
            width: map.data[0].length,
            height: map.data.length,
        });

        tileEngine.addTilesets({
            image: tileSheetImage
        });

        const blockerData = mapToLayer(
            map, tile => (tile === '#' || tile === 'A') ? TILE_BLOCKER : 0);

        tileEngine.addLayers([{
            name: LAYER_GROUND,
            data: mapToLayer(
                map,
                tile => (tile === ' ' || tile === 'G' || tile === '@' || tile === 'a') ? TILE_GROUND : 0),
        }, {
            name: LAYER_WALLS,
            data: mapToLayer(map, tile => tile === '=' ? TILE_WALL : 0),
            render: true,
        }, {
            name: LAYER_FLASHING,
            data: blockerData,
            render: false,
        }, {
            name: LAYER_BLOCKERS,
            data: blockerData,
            render: false,
        }]);

        let playerPosition = findPositionsOf(map, '@')[0];
        playerPosition.x += 5;
        player = createPlayer(playerPosition);
        sprites.push(player);

        let artifactPositions = findPositionsOf(map, 'A').concat(findPositionsOf(map, 'a'));
        artifactCount = artifactPositions.length;
        numberOfArtifactsCollected = 0;
        artifactPositions.forEach((pos, i) => {
            pos.x += 5;
            pos.y += 5;
            let artifact = createArtifact(pos, i);
            sprites.push(artifact);
        });

        findPositionsOf(map, 'G').forEach((pos, i) => {
            let ghost = createGhost(pos, i);
            sprites.push(ghost);
        });
    }

    function drawStatusText(cx, text) {
        cx.fillStyle = 'white';
        cx.font = "20px Sans-serif";
        cx.fillText(text, kontra.canvas.width * 0.48, 40);
    }

    function drawInfoText(cx, text) {
        cx.fillStyle = 'white';
        cx.font = "22px Sans-serif";
        let textWidth = text.length * 14;
        cx.fillText(text, kontra.canvas.width / 2 - textWidth / 2, 120);
    }

    function bindKeys() {
        document.addEventListener("keydown", e => {
            keysDown[e.which] = true;
        });

        document.addEventListener("keyup", e => {
            keysDown[e.which] = false;
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
        if (mapIsFinished()) {
            return;
        }

        for (let i = 0; i < sprites.length; i++) {
            let sprite = sprites[i];

            if ((sprite.type === 'ghost') &&
                (sprite.color !== 'yellow') &&
                player.collidesWith(sprite))
            {
                player.dead = true;
                stopTune(); // End effect here?
            }

            if ((sprite.type === 'item') &&
                player.collidesWith(sprite))
            {
                sprite.dead = true;
                numberOfArtifactsCollected++;
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

                let now = performance.now();

                if (onlineToggleWaitTime < (now - onlineLatestToggleTime)) {
                    onlineToggleSwitchTime = now;
                    onlineLatestToggleTime = now;
                    onlineToggleWaitTime = online ? currentMap.offline : currentMap.online;
                }

                if (onlineToggleSwitchTime &&
                    ONLINE_TOGGLE_DELAY < (now - onlineToggleSwitchTime)) {
                    online = !online;
                    onlineToggleSwitchTime = null;
                }

                if (mapIsFinished() && (mapIndex < maps.length - 1)) {
                    createMap(maps[++mapIndex]);
                }

                sprites = sprites.filter(s => !s.dead);

                ghostAngle += 0.005; // Update winning animation
            },

            render() {
                tileEngine.render();
                if (onlineToggleSwitchTime && (Math.random() >= 0.5)) {
                    tileEngine.renderLayer(LAYER_FLASHING);
                }
                if (online && !onlineToggleSwitchTime) {
                    tileEngine.renderLayer(LAYER_BLOCKERS);
                }

                cx.save();
                cx.translate(-tileEngine.sx, -tileEngine.sy);
                for (let i = 0; i < sprites.length; i++) {
                    let sprite = sprites[i];
                    sprite.render();
                }
                cx.restore();

                if (artifactCount) {
                    drawStatusText(cx, `${numberOfArtifactsCollected} / ${artifactCount}`);
                }

                if (((performance.now() - levelStartTime) < HELP_TEXT_DISPLAY_TIME) && currentMap.text) {
                    drawInfoText(cx, currentMap.text);
                }
            }
        });
    }

    function playTune() {
        mainTune.play();
    }
    function stopTune() {
        mainTune.pause();
        mainTune.currentTime = 0.0;
    }
    function initMusicPlayer() {
        var songplayer = new CPlayer();
        // Initialize music generation (player).
        songplayer.init(song);
        // Generate music...
        var done = false;
        setInterval(function () {
            if (done) {
                return;
            }
            done = (songplayer.generate() >= 1);
            if (done) {
                // Put the generated song in an Audio element.
                var wave = songplayer.createWave();
                mainTune.src = URL.createObjectURL(new Blob([wave], { type: "audio/wav" }));
                mainTune.loop = true;
                mainTune.play();
            }
        }, 0);
    }

    function main() {
        kontra.init();
        cx = kontra.context;

        initMusicPlayer();

        tileSheetImage = document.createElement('img');
        tileSheetImage.src = tileSheetImagePath;

        tileSheetImage.onload = () => {
            createMap(maps[mapIndex]);
            bindKeys();
            const loop = createGameLoop();
            loop.start();
        };
    }

    main();
})();
