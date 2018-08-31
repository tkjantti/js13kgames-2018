/*
 * Kontra.js v4.0.1 (Custom Build on 2018-08-31) | MIT
 * Build: https://straker.github.io/kontra/download?files=gameLoop+keyboard+sprite+tileEngine
 */
kontra = {

  /**
   * Initialize the canvas.
   * @memberof kontra
   *
   * @param {string|HTMLCanvasElement} canvas - Main canvas ID or Element for the game.
   */
  init(canvas) {

    // check if canvas is a string first, an element next, or default to getting
    // first canvas on page
    var canvasEl = this.canvas = document.getElementById(canvas) ||
                                 canvas ||
                                 document.querySelector('canvas');

    // @if DEBUG
    if (!canvasEl) {
      throw Error('You must provide a canvas element for the game');
    }
    // @endif

    this.context = canvasEl.getContext('2d');
  },

  /**
   * Noop function.
   * @see https://stackoverflow.com/questions/21634886/what-is-the-javascript-convention-for-no-operation#comment61796464_33458430
   * @memberof kontra
   * @private
   *
   * The new operator is required when using sinon.stub to replace with the noop.
   */
  _noop: new Function,

  /**
   * Dispatch event to any part of the code that needs to know when
   * a new frame has started. Will be filled out in pointer events.
   * @memberOf kontra
   * @private
   */
  _tick: new Function
};

(function() {

  /**
   * Game loop that updates and renders the game every frame.
   * @memberof kontra
   *
   * @param {object}   properties - Properties of the game loop.
   * @param {number}   [properties.fps=60] - Desired frame rate.
   * @param {boolean}  [properties.clearCanvas=true] - Clear the canvas every frame.
   * @param {function} properties.update - Function called to update the game.
   * @param {function} properties.render - Function called to render the game.
   */
  kontra.gameLoop = function(properties) {
    properties = properties || {};

    // check for required functions
    // @if DEBUG
    if ( !(properties.update && properties.render) ) {
      throw Error('You must provide update() and render() functions');
    }
    // @endif

    // animation variables
    let fps = properties.fps || 60;
    let accumulator = 0;
    let delta = 1E3 / fps;  // delta between performance.now timings (in ms)
    let step = 1 / fps;

    let clear = (properties.clearCanvas === false ?
                kontra._noop :
                function clear() {
                  kontra.context.clearRect(0,0,kontra.canvas.width,kontra.canvas.height);
                });
    let last, rAF, now, dt;

    /**
     * Called every frame of the game loop.
     */
    function frame() {
      rAF = requestAnimationFrame(frame);

      now = performance.now();
      dt = now - last;
      last = now;

      // prevent updating the game with a very large dt if the game were to lose focus
      // and then regain focus later
      if (dt > 1E3) {
        return;
      }

      kontra._tick();
      accumulator += dt;

      while (accumulator >= delta) {
        gameLoop.update(step);

        accumulator -= delta;
      }

      clear();
      gameLoop.render();
    }

    // game loop object
    let gameLoop = {
      update: properties.update,
      render: properties.render,
      isStopped: true,

      /**
       * Start the game loop.
       * @memberof kontra.gameLoop
       */
      start() {
        last = performance.now();
        this.isStopped = false;
        requestAnimationFrame(frame);
      },

      /**
       * Stop the game loop.
       */
      stop() {
        this.isStopped = true;
        cancelAnimationFrame(rAF);
      },

      // expose properties for testing
      // @if DEBUG
      _frame: frame,
      set _last(value) {
        last = value;
      }
      // @endif
    };

    return gameLoop;
  };
})();

(function() {
  let callbacks = {};
  let pressedKeys = {};

  let keyMap = {
    // named keys
    13: 'enter',
    27: 'esc',
    32: 'space',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  // alpha keys
  // @see https://stackoverflow.com/a/43095772/2124254
  for (let i = 0; i < 26; i++) {
    keyMap[65+i] = (10 + i).toString(36);
  }
  // numeric keys
  for (i = 0; i < 10; i++) {
    keyMap[48+i] = ''+i;
  }

  addEventListener('keydown', keydownEventHandler);
  addEventListener('keyup', keyupEventHandler);
  addEventListener('blur', blurEventHandler);

  /**
   * Execute a function that corresponds to a keyboard key.
   * @private
   *
   * @param {Event} e
   */
  function keydownEventHandler(e) {
    let key = keyMap[e.which];
    pressedKeys[key] = true;

    if (callbacks[key]) {
      callbacks[key](e);
    }
  }

  /**
   * Set the released key to not being pressed.
   * @private
   *
   * @param {Event} e
   */
  function keyupEventHandler(e) {
    pressedKeys[ keyMap[e.which] ] = false;
  }

  /**
   * Reset pressed keys.
   * @private
   *
   * @param {Event} e
   */
  function blurEventHandler(e) {
    pressedKeys = {};
  }

  /**
   * Object for using the keyboard.
   */
  kontra.keys = {
    /**
     * Register a function to be called on a key press.
     * @memberof kontra.keys
     *
     * @param {string|string[]} keys - key or keys to bind.
     */
    bind(keys, callback) {
      // smaller than doing `Array.isArray(keys) ? keys : [keys]`
      [].concat(keys).map(function(key) {
        callbacks[key] = callback;
      })
    },

    /**
     * Remove the callback function for a key.
     * @memberof kontra.keys
     *
     * @param {string|string[]} keys - key or keys to unbind.
     */
    unbind(keys, undefined) {
      [].concat(keys).map(function(key) {
        callbacks[key] = undefined;
      })
    },

    /**
     * Returns whether a key is pressed.
     * @memberof kontra.keys
     *
     * @param {string} key - Key to check for press.
     *
     * @returns {boolean}
     */
    pressed(key) {
      return !!pressedKeys[key];
    }
  };
})();

(function() {

  class Vector {
    /**
     * Initialize the vectors x and y position.
     * @memberof kontra.vector
     * @private
     *
     * @param {number} [x=0] - X coordinate.
     * @param {number} [y=0] - Y coordinate.
     *
     * @returns {vector}
     */
    constructor(x, y) {
      this._x = x || 0;
      this._y = y || 0;
    }

    /**
     * Add a vector to this vector.
     * @memberof kontra.vector
     *
     * @param {vector} vector - Vector to add.
     * @param {number} dt=1 - Time since last update.
     */
    add(vector, dt) {
      this.x += (vector.x || 0) * (dt || 1);
      this.y += (vector.y || 0) * (dt || 1);
    }

    /**
     * Clamp the vector between two points that form a rectangle.
     * @memberof kontra.vector
     *
     * @param {number} xMin - Min x value.
     * @param {number} yMin - Min y value.
     * @param {number} xMax - Max x value.
     * @param {number} yMax - Max y value.
     */
    clamp(xMin, yMin, xMax, yMax) {
      this._c = true;
      this._a = xMin;
      this._b = yMin;
      this._d = xMax;
      this._e = yMax;
    }

    /**
     * Vector x
     * @memberof kontra.vector
     *
     * @property {number} x
     */
    get x() {
      return this._x;
    }

    /**
     * Vector y
     * @memberof kontra.vector
     *
     * @property {number} y
     */
    get y() {
      return this._y;
    }

    set x(value) {
      this._x = (this._c ? Math.min( Math.max(this._a, value), this._d ) : value);
    }

    set y(value) {
      this._y = (this._c ? Math.min( Math.max(this._b, value), this._e ) : value);
    }
  }

  /**
   * A vector for 2D space.
   * @memberof kontra
   *
   * @param {number} [x=0] - X coordinate.
   * @param {number} [y=0] - Y coordinate.
   */
  kontra.vector = (x, y) => {
    return new Vector(x, y);
  };
  kontra.vector.prototype = Vector.prototype;





  class Sprite {
    /**
     * Initialize properties on the sprite.
     * @memberof kontra.sprite
     *
     * @param {object} properties - Properties of the sprite.
     * @param {number} properties.x - X coordinate of the sprite.
     * @param {number} properties.y - Y coordinate of the sprite.
     * @param {number} [properties.dx] - Change in X position.
     * @param {number} [properties.dy] - Change in Y position.
     * @param {number} [properties.ddx] - Change in X velocity.
     * @param {number} [properties.ddy] - Change in Y velocity.
     *
     * @param {number} [properties.ttl=0] - How may frames the sprite should be alive.
     * @param {Context} [properties.context=kontra.context] - Provide a context for the sprite to draw on.
     *
     * @param {Image|Canvas} [properties.image] - Image for the sprite.
     *
     * @param {object} [properties.animations] - Animations for the sprite instead of an image.
     *
     * @param {string} [properties.color] - If no image or animation is provided, use color to draw a rectangle for the sprite.
     * @param {number} [properties.width] - Width of the sprite for drawing a rectangle.
     * @param {number} [properties.height] - Height of the sprite for drawing a rectangle.
     *
     * @param {function} [properties.update] - Function to use to update the sprite.
     * @param {function} [properties.render] - Function to use to render the sprite.
     *
     * If you need the sprite to live forever, or just need it to stay on screen until you
     * decide when to kill it, you can set <code>ttl</code> to <code>Infinity</code>.
     * Just be sure to set <code>ttl</code> to 0 when you want the sprite to die.
     */
    // @see https://github.com/jed/140bytes/wiki/Byte-saving-techniques#use-placeholder-arguments-instead-of-var
    init(properties, prop, temp, firstAnimation) {
      properties = properties || {};

      this.position = kontra.vector(properties.x, properties.y);
      this.velocity = kontra.vector(properties.dx, properties.dy);
      this.acceleration = kontra.vector(properties.ddx, properties.ddy);

      // defaults
      this.width = this.height = 0;
      this.context = kontra.context;

      // loop through properties before overrides
      for (prop in properties) {
        this[prop] = properties[prop];
      }

      // image sprite
      if (temp = properties.image) {
        this.image = temp;
        this.width = temp.width;
        this.height = temp.height;
      }
      // animation sprite
      else if (temp = properties.animations) {

        // clone each animation so no sprite shares an animation
        for (prop in temp) {
          this.animations[prop] = temp[prop].clone();

          // default the current animation to the first one in the list
          firstAnimation = firstAnimation || temp[prop];
        }

        this._ca = firstAnimation;
        this.width = firstAnimation.width;
        this.height = firstAnimation.height;
      }

      return this;
    }

    // define getter and setter shortcut functions to make it easier to work with the
    // position, velocity, and acceleration vectors.

    /**
     * Sprite position.x
     * @memberof kontra.sprite
     *
     * @property {number} x
     */
    get x() {
      return this.position.x;
    }

    /**
     * Sprite position.y
     * @memberof kontra.sprite
     *
     * @property {number} y
     */
    get y() {
      return this.position.y;
    }

    /**
     * Sprite velocity.x
     * @memberof kontra.sprite
     *
     * @property {number} dx
     */
    get dx() {
      return this.velocity.x;
    }

    /**
     * Sprite velocity.y
     * @memberof kontra.sprite
     *
     * @property {number} dy
     */
    get dy() {
      return this.velocity.y;
    }

    /**
     * Sprite acceleration.x
     * @memberof kontra.sprite
     *
     * @property {number} ddx
     */
    get ddx() {
      return this.acceleration.x;
    }

    /**
     * Sprite acceleration.y
     * @memberof kontra.sprite
     *
     * @property {number} ddy
     */
    get ddy() {
      return this.acceleration.y;
    }

    set x(value) {
      this.position.x = value;
    }
    set y(value) {
      this.position.y = value;
    }
    set dx(value) {
      this.velocity.x = value;
    }
    set dy(value) {
      this.velocity.y = value;
    }
    set ddx(value) {
      this.acceleration.x = value;
    }
    set ddy(value) {
      this.acceleration.y = value;
    }

    /**
     * Determine if the sprite is alive.
     * @memberof kontra.sprite
     *
     * @returns {boolean}
     */
    isAlive() {
      return this.ttl > 0;
    }

    /**
     * Simple bounding box collision test.
     * @memberof kontra.sprite
     *
     * @param {object} object - Object to check collision against.
     *
     * @returns {boolean} True if the objects collide, false otherwise.
     */
    collidesWith(object) {
      return this.x < object.x + object.width &&
             this.x + this.width > object.x &&
             this.y < object.y + object.height &&
             this.y + this.height > object.y;
    }

    /**
     * Update the sprites velocity and position.
     * @memberof kontra.sprite
     * @abstract
     *
     * @param {number} dt - Time since last update.
     *
     * This function can be overridden on a per sprite basis if more functionality
     * is needed in the update step. Just call <code>this.advance()</code> when you need
     * the sprite to update its position.
     *
     * @example
     * sprite = kontra.sprite({
     *   update: function update(dt) {
     *     // do some logic
     *
     *     this.advance(dt);
     *   }
     * });
     */
    update(dt) {
      this.advance(dt);
    }

    /**
     * Render the sprite.
     * @memberof kontra.sprite.
     * @abstract
     *
     * This function can be overridden on a per sprite basis if more functionality
     * is needed in the render step. Just call <code>this.draw()</code> when you need the
     * sprite to draw its image.
     *
     * @example
     * sprite = kontra.sprite({
     *   render: function render() {
     *     // do some logic
     *
     *     this.draw();
     *   }
     * });
     */
    render() {
      this.draw();
    }

    /**
     * Play an animation.
     * @memberof kontra.sprite
     *
     * @param {string} name - Name of the animation to play.
     */
    playAnimation(name) {
      this._ca = this.animations[name];

      if (!this._ca.loop) {
        this._ca.reset();
      }
    }

    /**
     * Advance the sprites position, velocity, and current animation (if it
     * has one).
     * @memberof kontra.sprite
     *
     * @param {number} dt - Time since last update.
     */
    advance(dt) {
      this.velocity.add(this.acceleration, dt);
      this.position.add(this.velocity, dt);

      this.ttl--;

      if (this._ca) {
        this._ca.update(dt);
      }
    }

    /**
     * Draw the sprite to the canvas.
     * @memberof kontra.sprite
     */
    draw() {
      if (this.image) {
        this.context.drawImage(this.image, this.x, this.y);
      }
      else if (this._ca) {
        this._ca.render(this);
      }
      else {
        this.context.fillStyle = this.color;
        this.context.fillRect(this.x, this.y, this.width, this.height);
      }
    }
  };

  /**
   * A sprite with a position, velocity, and acceleration.
   * @memberof kontra
   * @requires kontra.vector
   *
   * @param {object} properties - Properties of the sprite.
   * @param {number} properties.x - X coordinate of the sprite.
   * @param {number} properties.y - Y coordinate of the sprite.
   * @param {number} [properties.dx] - Change in X position.
   * @param {number} [properties.dy] - Change in Y position.
   * @param {number} [properties.ddx] - Change in X velocity.
   * @param {number} [properties.ddy] - Change in Y velocity.
   *
   * @param {number} [properties.ttl=0] - How may frames the sprite should be alive.
   * @param {Context} [properties.context=kontra.context] - Provide a context for the sprite to draw on.
   *
   * @param {Image|Canvas} [properties.image] - Image for the sprite.
   *
   * @param {object} [properties.animations] - Animations for the sprite instead of an image.
   *
   * @param {string} [properties.color] - If no image or animation is provided, use color to draw a rectangle for the sprite.
   * @param {number} [properties.width] - Width of the sprite for drawing a rectangle.
   * @param {number} [properties.height] - Height of the sprite for drawing a rectangle.
   *
   * @param {function} [properties.update] - Function to use to update the sprite.
   * @param {function} [properties.render] - Function to use to render the sprite.
   */
  kontra.sprite = (properties) => {
    return (new Sprite()).init(properties);
  };
  kontra.sprite.prototype = Sprite.prototype;
})();

(function() {
  // save Math.min and Math.max to variable and use that instead

  /**
   * A tile engine for rendering tilesets. Works well with the tile engine program Tiled.
   * @memberof kontra
   *
   * @param {object} properties - Properties of the tile engine.
   * @param {number} [properties.tileWidth=32] - Width of a tile.
   * @param {number} [properties.tileHeight=32] - Height of a tile.
   * @param {number} properties.width - Width of the map (in tiles).
   * @param {number} properties.height - Height of the map (in tiles).
   * @param {number} [properties.x=0] - X position to draw.
   * @param {number} [properties.y=0] - Y position to draw.
   * @param {number} [properties.sx=0] - X position to clip the tileset.
   * @param {number} [properties.sy=0] - Y position to clip the tileset.
   * @param {Context} [properties.context=kontra.context] - Provide a context for the tile engine to draw on.
   */
  kontra.tileEngine = function(properties) {
    properties = properties || {};

    // size of the map (in tiles)
    // @if DEBUG
    if (!properties.width || !properties.height) {
      throw Error('You must provide width and height properties');
    }
    // @endif

    /**
     * Get the index of the x, y or row, col.
     * @memberof kontra.tileEngine
     * @private
     *
     * @param {number} position.x - X coordinate of the tile.
     * @param {number} position.y - Y coordinate of the tile.
     * @param {number} position.row - Row of the tile.
     * @param {number} position.col - Col of the tile.
     *
     * @return {number} Returns the tile index or -1 if the x, y or row, col is outside the dimensions of the tile engine.
     */
    function getIndex(position) {
      let row, col;

      if (typeof position.x !== 'undefined' && typeof position.y !== 'undefined') {
        row = tileEngine.getRow(position.y);
        col = tileEngine.getCol(position.x);
      }
      else {
        row = position.row;
        col = position.col;
      }

      // don't calculate out of bound numbers
      if (row < 0 || col < 0 || row >= height || col >= width) {
        return -1;
      }

      return col + row * width;
    }

    /**
     * Modified binary search that will return the tileset associated with the tile
     * @memberof kontra.tileEngine
     * @private
     *
     * @param {number} tile - Tile grid.
     *
     * @return {object}
     */
    function getTileset(tile) {
      let min = 0;
      let max = tileEngine.tilesets.length - 1;
      let index, currTile;

      while (min <= max) {
        index = (min + max) / 2 | 0;
        currTile = tileEngine.tilesets[index];

        if (tile >= currTile.firstGrid && tile <= currTile.lastGrid) {
          return currTile;
        }
        else if (currTile.lastGrid < tile) {
          min = index + 1;
        }
        else {
          max = index - 1;
        }
      }
    }

    /**
     * Pre-render the tiles to make drawing fast.
     * @memberof kontra.tileEngine
     * @private
     */
    function preRenderImage() {
      let tile, tileset, image, x, y, sx, sy, tileOffset, w;

      // draw each layer in order
      for (let i = 0, layer; layer = tileEngine.layers[layerOrder[i]]; i++) {
        for (let j = 0, len = layer.data.length; j < len; j++) {
          tile = layer.data[j];

          // skip empty tiles (0)
          if (!tile) {
            continue;
          }

          tileset = getTileset(tile);
          image = tileset.image;

          x = (j % width) * tileWidth;
          y = (j / width | 0) * tileHeight;

          tileOffset = tile - tileset.firstGrid;
          w = image.width / tileWidth;

          sx = (tileOffset % w) * tileWidth;
          sy = (tileOffset / w | 0) * tileHeight;

          offscreenContext.drawImage(
            image,
            sx, sy, tileWidth, tileHeight,
            x, y, tileWidth, tileHeight
          );
        }
      }
    }

    let width = properties.width;
    let height = properties.height;

    // size of the tiles. Most common tile size on opengameart.org seems to be 32x32,
    // followed by 16x16
    // Tiled names the property tilewidth and tileheight
    let tileWidth = properties.tileWidth || properties.tilewidth || 32;
    let tileHeight = properties.tileHeight || properties.tileheight || 32;

    let mapWidth = width * tileWidth;
    let mapHeight = height * tileHeight;

    let context = properties.context || kontra.context;
    let canvasWidth = context.canvas.width;
    let canvasHeight = context.canvas.height;

    // create an off-screen canvas for pre-rendering the map
    // @see http://jsperf.com/render-vs-prerender
    let offscreenCanvas = document.createElement('canvas');
    let offscreenContext = offscreenCanvas.getContext('2d');

    // when clipping an image, sx and sy must within the image region, otherwise
    // Firefox and Safari won't draw it.
    // @see http://stackoverflow.com/questions/19338032/canvas-indexsizeerror-index-or-size-is-negative-or-greater-than-the-allowed-a
    let sxMax = Math.max(0, mapWidth - canvasWidth);
    let syMax = Math.max(0, mapHeight - canvasHeight);

    let _sx, _sy;

    // draw order of layers (by name)
    let layerOrder = [];

    let tileEngine = {
      width: width,
      height: height,

      tileWidth: tileWidth,
      tileHeight: tileHeight,

      mapWidth: mapWidth,
      mapHeight: mapHeight,

      context: context,

      x: properties.x || 0,
      y: properties.y || 0,

      tilesets: [],
      layers: {},

      /**
       * Add an tileset for the tile engine to use.
       * @memberof kontra.tileEngine
       *
       * @param {object|object[]} tileset - Properties of the image to add.
       * @param {Image|Canvas} tileset.image - Path to the image or Image object.
       * @param {number} tileset.firstGrid - The first tile grid to start the image.
       */
      addTilesets: function addTilesets(tilesets) {
        [].concat(tilesets).map(function(tileset) {
          let tilesetImage = tileset.image;
          let image, firstGrid, numTiles, lastTileset, tiles;

          // @see https://github.com/jed/140bytes/wiki/Byte-saving-techniques#coercion-to-test-for-types
          if (''+tilesetImage === tilesetImage) {
            let i = Infinity;

            while (i >= 0) {
              i = tilesetImage.lastIndexOf('/', i);
              let path = (i < 0 ? tilesetImage : tilesetImage.substr(i));

              if (kontra.assets.images[path]) {
                image = kontra.assets.images[path];
                break;
              }

              i--;
            }
          }
          else {
            image = tilesetImage;
          }

          firstGrid = tileset.firstGrid;

          // if the width or height of the provided image is smaller than the tile size,
          // default calculation to 1
          numTiles = ( (image.width / tileWidth | 0) || 1 ) *
                     ( (image.height / tileHeight | 0) || 1 );

          if (!firstGrid) {
            // only calculate the first grid if the tile map has a tileset already
            if (tileEngine.tilesets.length > 0) {
              lastTileset = tileEngine.tilesets[tileEngine.tilesets.length - 1];
              tiles = (lastTileset.image.width / tileWidth | 0) *
                      (lastTileset.image.height / tileHeight | 0);

              firstGrid = lastTileset.firstGrid + tiles;
            }
            // otherwise this is the first tile added to the tile map
            else {
              firstGrid = 1;
            }
          }

          tileEngine.tilesets.push({
            firstGrid: firstGrid,
            lastGrid: firstGrid + numTiles - 1,
            image: image
          });

          // sort the tile map so we can perform a binary search when drawing
          tileEngine.tilesets.sort(function(a, b) {
            return a.firstGrid - b.firstGrid;
          });
        });
      },

      /**
       * Add a layer to the tile engine.
       * @memberof kontra.tileEngine
       *
       * @param {object} properties - Properties of the layer to add.
       * @param {string} properties.name - Name of the layer.
       * @param {number[]} properties.data - Tile layer data.
       * @param {boolean} [properties.render=true] - If the layer should be drawn.
       * @param {number} [properties.zIndex] - Draw order for tile layer. Highest number is drawn last (i.e. on top of all other layers).
       */
      addLayers: function addLayers(layers) {
        [].concat(layers).map(function(layer) {
          layer.render = (layer.render === undefined ? true : layer.render);

          let data, r, row, c, prop, value;

          // flatten a 2D array into a single array
          if (Array.isArray(layer.data[0])) {
            data = [];

            for (r = 0; row = layer.data[r]; r++) {
              for (c = 0; c < width; c++) {
                data.push(row[c] || 0);
              }
            }
          }
          else {
            data = layer.data;
          }

          tileEngine.layers[layer.name] = {
            data: data,
            zIndex: layer.zIndex || 0,
            render: layer.render
          };

          // merge properties of layer onto layer object
          for (prop in layer.properties) {
            value = layer.properties[prop];

            try {
              value = JSON.parse(value);
            }
            catch(e) {}

            tileEngine.layers[layer.name][prop] = value;
          }

          // only add the layer to the layer order if it should be drawn
          if (tileEngine.layers[layer.name].render) {
            layerOrder.push(layer.name);

            layerOrder.sort(function(a, b) {
              return tileEngine.layers[a].zIndex - tileEngine.layers[b].zIndex;
            });

          }
        });

        preRenderImage();
      },

      /**
       * Simple bounding box collision test for layer tiles.
       * @memberof kontra.tileEngine
       *
       * @param {string} name - Name of the layer.
       * @param {object} object - Object to check collision against.
       * @param {number} object.x - X coordinate of the object.
       * @param {number} object.y - Y coordinate of the object.
       * @param {number} object.width - Width of the object.
       * @param {number} object.height - Height of the object.
       *
       * @returns {boolean} True if the object collides with a tile, false otherwise.
       */
      layerCollidesWith: function layerCollidesWith(name, object) {
        // calculate all tiles that the object can collide with
        let row = tileEngine.getRow(object.y);
        let col = tileEngine.getCol(object.x);

        let endRow = tileEngine.getRow(object.y + object.height);
        let endCol = tileEngine.getCol(object.x + object.width);

        // check all tiles
        let index;
        for (let r = row; r <= endRow; r++) {
          for (let c = col; c <= endCol; c++) {
            index = getIndex({row: r, col: c});

            if (tileEngine.layers[name].data[index]) {
              return true;
            }
          }
        }

        return false;
      },

      /**
       * Get the tile from the specified layer at x, y or row, col.
       * @memberof kontra.tileEngine
       *
       * @param {string} name - Name of the layer.
       * @param {object} position - Position of the tile in either x, y or row, col.
       * @param {number} position.x - X coordinate of the tile.
       * @param {number} position.y - Y coordinate of the tile.
       * @param {number} position.row - Row of the tile.
       * @param {number} position.col - Col of the tile.
       *
       * @returns {number}
       */
      tileAtLayer: function tileAtLayer(name, position) {
        let index = getIndex(position);

        if (index >= 0) {
          return tileEngine.layers[name].data[index];
        }
      },

      /**
       * Render the pre-rendered canvas.
       * @memberof kontra.tileEngine
       */
      render: function render() {
        /* istanbul ignore next */
        tileEngine.context.drawImage(
          offscreenCanvas,
          tileEngine.sx, tileEngine.sy, canvasWidth, canvasHeight,
          tileEngine.x, tileEngine.y, canvasWidth, canvasHeight
        );
      },

      /**
       * Render a specific layer.
       * @memberof kontra.tileEngine
       *
       * @param {string} name - Name of the layer to render.
       */
      renderLayer: function renderLayer(name) {
        let layer = tileEngine.layers[name];

        // calculate the starting tile
        let row = tileEngine.getRow();
        let col = tileEngine.getCol();
        let index = getIndex({row: row, col: col});

        // calculate where to start drawing the tile relative to the drawing canvas
        let startX = col * tileWidth - tileEngine.sx;
        let startY = row * tileHeight - tileEngine.sy;

        // calculate how many tiles the drawing canvas can hold
        let viewWidth = Math.min(Math.ceil(canvasWidth / tileWidth) + 1, width);
        let viewHeight = Math.min(Math.ceil(canvasHeight / tileHeight) + 1, height);
        let numTiles = viewWidth * viewHeight;

        let count = 0;
        let x, y, tile, tileset, image, tileOffset, w, sx, sy;

        // draw just enough of the layer to fit inside the drawing canvas
        while (count < numTiles) {
          tile = layer.data[index];

          if (tile) {
            tileset = getTileset(tile);
            image = tileset.image;

            x = startX + (count % viewWidth) * tileWidth;
            y = startY + (count / viewWidth | 0) * tileHeight;

            tileOffset = tile - tileset.firstGrid;
            w = image.width / tileWidth;

            sx = (tileOffset % w) * tileWidth;
            sy = (tileOffset / w | 0) * tileHeight;

            tileEngine.context.drawImage(
              image,
              sx, sy, tileWidth, tileHeight,
              x, y, tileWidth, tileHeight
            );
          }

          if (++count % viewWidth === 0) {
            index = col + (++row * width);
          }
          else {
            index++;
          }
        }
      },

      /**
       * Get the row from the y coordinate.
       * @memberof kontra.tileEngine
       *
       * @param {number} y - Y coordinate.
       *
       * @return {number}
       */
      getRow: function getRow(y) {
        y = y || 0;

        return (tileEngine.sy + y) / tileHeight | 0;
      },

      /**
       * Get the col from the x coordinate.
       * @memberof kontra.tileEngine
       *
       * @param {number} x - X coordinate.
       *
       * @return {number}
       */
      getCol: function getCol(x) {
        x = x || 0;

        return (tileEngine.sx + x) / tileWidth | 0;
      },

      get sx() {
        return _sx;
      },

      get sy() {
        return _sy;
      },

      // ensure sx and sy are within the image region
      set sx(value) {
        _sx = Math.min( Math.max(0, value), sxMax );
      },

      set sy(value) {
        _sy = Math.min( Math.max(0, value), syMax );
      },

      // expose properties for testing
      // @if DEBUG
      _layerOrder: layerOrder
      // @endif
    };

    // set here so we use setter function
    tileEngine.sx = properties.sx || 0;
    tileEngine.sy = properties.sy || 0;

    // make the off-screen canvas the full size of the map
    offscreenCanvas.width = mapWidth;
    offscreenCanvas.height = mapHeight;

    // merge properties of the tile engine onto the tile engine itself
    for (let prop in properties.properties) {
      let value = properties.properties[prop];

      try {
        value = JSON.parse(value);
      }
      catch(e) {}

      // passed in properties override properties.properties
      tileEngine[prop] = tileEngine[prop] || value;
    }

    if (properties.tilesets) {
      tileEngine.addTilesets(properties.tilesets);
    }

    if (properties.layers) {
      tileEngine.addLayers(properties.layers);
    }

    return tileEngine;
  };
})();