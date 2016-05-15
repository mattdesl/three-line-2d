# three-line-2d

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

[![img](http://i.imgur.com/7yGGXdd.png)](http://mattdesl.github.io/three-line-2d/)

([click to view demo](http://mattdesl.github.io/three-line-2d/))

A utility for 2D line drawing in ThreeJS, by expanding a polyline in a vertex shader for variable thickness, anti-aliasing, gradients, line dashes, and other GPU effects.

Works in ThreeJS r69-r75, and possibly newer versions.

See [test/index.js](test/index.js) for a complete example, as well as other shader applications. 

```js
var bezier = require('adaptive-bezier-curve');
var Line = require('three-line-2d')(THREE);
var BasicShader = require('three-line-2d/shaders/basic')(THREE);

//build a smooth bezier curve in world units
var quality = 5;
var curve = bezier([0, 0], [0.5, 1], [1, 1], [2, 0], quality);

//create our geometry
var curveGeometry = Line(curve);

//create a material using a basic shader
var mat = new THREE.ShaderMaterial(BasicShader({
    side: THREE.DoubleSide,
    diffuse: 0x5cd7ff,
    thickness: 0.3
}));

var mesh = new THREE.Mesh(curveGeometry, mat);
app.scene.add(mesh);
```

## Usage

[![NPM](https://nodei.co/npm/three-line-2d.png)](https://nodei.co/npm/three-line-2d/)

#### `geometry = Line(path, [opt])`

Creates a new Line geometry from a 2D list of points. Options:

- `distances` if true, each vertex will also pass a `lineDistance` attribute to the vertex shader. This can be used to compute the U texture coordinate from the start of the line to its end.
- `closed` if true, a segment will be drawn from the last point to the the first point, and the normals will be adjusted accordingly (default false)

*Note:* You can also omit the `path` and just pass an `opt` object to initially construct the geometry. However, some versions of ThreeJS do not support dynamically growing vertex data, so it's best to pass an initial list of points with the maximum capacity of your desired line.

#### `geometry.update(path[, closed])`

Updates the geometry with the new 2D polyline, which can optionally be a closed loop (default false).

## Running from Source

```sh
git clone https://github.com/mattdesl/three-line-2d.git
cd three-line-2d
npm install
```

You can run the demo locally on `localhost:9966` with:

```sh
npm run start
```

You can build the demo to a static JavaScript bundle with:

```sh
npm run build
```

## Changelog

## 1.1.0

- Major code cleanup and new test with cleaner modules
- Support r69-r75
- It seems like ThreeJS does not support dynamically growing geometry across all versions; use with care!

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/three-line-2d/blob/master/LICENSE.md) for details.
