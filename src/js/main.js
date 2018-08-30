
(function () {

    const playerSpeed = 1.5;
    const diagonalSpeedCoefficient = 0.707;

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

    const ONLINE_TOGGLE_DELAY = 2000;
    const ONLINE_MIN_TOGGLE_TIME = 8000;
    const ONLINE_MAX_TOGGLE_TIME = 30000;

    const LAYER_GROUND = 'G';
    const LAYER_FLASHING = 'F';
    const LAYER_BLOCKERS = 'B';
    const LAYER_WALLS = 'W';

    const HELP_TEXT_DISPLAY_TIME = 3000;

    const tileSheetImage = '../images/tilesheet.png';

    const maps = [
        [
            "                    ",
            "                    ",
            "                    ",
            "                    ",
            "                    ",
            "        ##A##       ",
            "        #####       ",
            "        ##@##       ",
            "        #####       ",
            "        #####       ",
            "                    ",
            "                    ",
            "                    ",
            "                    ",
            "                    ",
        ],
        [
            "                    ",
            "                    ",
            "                    ",
            "         ####       ",
            "         #GG#       ",
            "         #GG#       ",
            " #@###############  ",
            " #################  ",
            "                #A  ",
            "          GG        ",
            "                    ",
            "                    ",
            "                    ",
            "                    ",
            "                    ",
        ],
        [
            "                          ",
            "       G                  ",
            "                          ",
            "           ####           ",
            "           #@##      #A#  ",
            "    #      ####          G",
            "    #      ####       ##  ",
            "    # G                #  ",
            "    #                  #  ",
            "             ====         ",
            "             ##A=   G     ",
            "              ##=         ",
            "         ###   #=         ",
            "           #    G         ",
            "                          ",
            "   #                 #    ",
            "   ##   A           ###   ",
            "   G#          G          ",
            "                          ",
            "                          "
        ]
    ];

    let mapIndex = 0;

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

    function resetLevel() {
        sprites = [];
        online = true;
        onlineToggleSwitchTime = null;
        onlineLatestToggleTime = levelStartTime = performance.now();
        onlineToggleWaitTime = 10000;
    }

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

    function keepWithinMap(sprite) {
        sprite.position.clamp(
            0,
            0,
            tileEngine.mapWidth - sprite.width,
            tileEngine.mapHeight - sprite.height);
    }

    function createArtifact(position, number) {
        let result = kontra.sprite({
            type: 'item',
            position: position,
            number: number,
            color: artifactColors[number % artifactColors.length],
            width: 20,
            height: 20,
            ttl: Infinity,

            render() {
                let cx = this.context;
                let w = this.width, h = this.height;

                cx.save();
                cx.translate(this.x, this.y);

                cx.fillStyle = 'black';
                cx.strokeStyle = this.color;
                cx.lineWidth = 3;

                cx.beginPath();
                cx.moveTo(0, h);
                cx.lineTo(w/2, 0);
                cx.lineTo(w, h);
                cx.closePath();
                cx.fill();
                cx.stroke();

                cx.restore();
            }
        });

        keepWithinMap(result);
        return result;
    }

    function createGhost(position) {
        let result = kontra.sprite({
            type: 'ghost',
            position: position,
            width: 30,
            height: 30,
            color: 'red',
            ttl: Infinity,
            dir: getRandomInt(5),

            update() {
                let movement;

                if (collidesWithBlockers(this)) {
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
                } else if (player.isAlive()) {
                    let playerPosition = player.position;
                    let attackTarget = kontra.vector(playerPosition.x, playerPosition.y);
                    let distance = getDistance(this.position, attackTarget);
                    if (distance < 200) {
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
            color: 'cyan',
            width: 20,
            height: 30,
            ttl: Infinity,

            update() {
                let xDiff = 0, yDiff = 0;

                if (kontra.keys.pressed('left')) {
                    xDiff = -playerSpeed;
                } else if (kontra.keys.pressed('right')) {
                    xDiff = playerSpeed;
                }

                if (kontra.keys.pressed('up')) {
                    yDiff = -playerSpeed;
                } else if (kontra.keys.pressed('down')) {
                    yDiff = playerSpeed;
                }

                if (xDiff !== 0 && yDiff !== 0) {
                    xDiff *= diagonalSpeedCoefficient;
                    yDiff *= diagonalSpeedCoefficient;
                }

                let newBounds = {
                    x: this.x + xDiff,
                    y: this.y + yDiff,
                    width: this.width,
                    height: this.height,
                };

                if (!collidesWithLayer(newBounds, LAYER_WALLS)) {
                    this.x = newBounds.x;
                    this.y = newBounds.y;
                }
            },

            render() {
                this.context.fillStyle = this.color;
                this.context.fillRect(this.x, this.y, this.width, this.height);
            }
        });

        keepWithinMap(result);
        return result;
    }

    function findPositionsOf(map, element) {
        let result = [];
        for (let rowIndex = 0; rowIndex < map.length; rowIndex++) {
            let row = map[rowIndex];
            for (let colIndex = 0; colIndex < row.length; colIndex++) {
                if (row[colIndex] === element) {
                    result.push(kontra.vector(colIndex * TILE_WIDTH, rowIndex * TILE_HEIGHT));
                }
            }
        }

        return result;
    }

    function mapFromData(array, convert) {
        return array.reduce((total, current) => total + current).split('').map(convert);
    }

    function createMap(map) {
        resetLevel();

        tileEngine = kontra.tileEngine({
            tileWidth: TILE_WIDTH,
            tileHeight: TILE_HEIGHT,
            width: map[0].length,
            height: map.length,
        });

        tileEngine.addTilesets({
            image: kontra.assets.images[tileSheetImage],
        });

        const blockerData = mapFromData(
            map, tile => (tile === '#' || tile === 'A') ? TILE_BLOCKER : 0);

        tileEngine.addLayers([{
            name: LAYER_GROUND,
            data: mapFromData(
                map,
                tile => (tile === ' ' || tile === 'G' || tile === '@') ? TILE_GROUND : 0),
        }, {
            name: LAYER_WALLS,
            data: mapFromData(map, tile => tile === '=' ? TILE_WALL : 0),
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

        let artifactPositions = findPositionsOf(map, 'A');
        artifactCount = artifactPositions.length;
        numberOfArtifactsCollected = 0;
        artifactPositions.forEach((pos, i) => {
            pos.x += 5;
            pos.y += 5;
            let artifact = createArtifact(pos, i);
            sprites.push(artifact);
        });

        findPositionsOf(map, 'G').forEach((pos) => {
            let ghost = createGhost(pos);
            sprites.push(ghost);
        });
    }

    function drawText(cx, x, y, text) {
        cx.fillStyle = 'white';
        cx.font = "16px Sans-serif";
        cx.fillText(text, x, y);
    }

    function bindKeys() {
        kontra.keys.bind('o', () => {
            onlineToggleSwitchTime = performance.now();
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

            if ((sprite.type === 'ghost') &&
                (sprite.color !== 'yellow') &&
                player.collidesWith(sprite))
            {
                player.ttl = 0;
            }

            if ((sprite.type === 'item') &&
                player.collidesWith(sprite))
            {
                sprite.ttl = 0;
                numberOfArtifactsCollected++;
            }
        }
    }

    function isWinning() {
        return numberOfArtifactsCollected === artifactCount;
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
                    onlineToggleWaitTime =
                        ONLINE_MIN_TOGGLE_TIME +
                        Math.random() * (ONLINE_MAX_TOGGLE_TIME - ONLINE_MIN_TOGGLE_TIME);
                }

                if (onlineToggleSwitchTime &&
                    ONLINE_TOGGLE_DELAY < (now - onlineToggleSwitchTime)) {
                    online = !online;
                    onlineToggleSwitchTime = null;
                }

                if (isWinning() && (++mapIndex < maps.length)) {
                    createMap(maps[mapIndex]);
                }

                sprites = sprites.filter(s => s.isAlive());
            },

            render() {
                let cx = kontra.context;
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

                drawText(
                    cx,
                    kontra.canvas.width / 2, 20,
                    `${numberOfArtifactsCollected} / ${artifactCount}`);

                if (isWinning()) {
                    drawText(cx, kontra.canvas.width * 0.46, 80, "YOU WIN!");
                } else if ((performance.now() - levelStartTime) < HELP_TEXT_DISPLAY_TIME) {
                    drawText(
                        cx,
                        kontra.canvas.width * 0.42, kontra.canvas.height * 0.25,
                        "Collect all artifacts!");
                }
            }
        });
    }

    function main() {
        kontra.init();
        kontra.assets.load(tileSheetImage)
            .then(() => {
                createMap(maps[mapIndex]);
                bindKeys();
                const loop = createGameLoop();
                loop.start();
            }).catch(error => {
                console.log(error); // jshint ignore:line
            });
    }

    main();
})();
