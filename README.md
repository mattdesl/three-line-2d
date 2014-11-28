# three-line-2d

[![unstable](http://badges.github.io/stability-badges/dist/unstable.svg)](http://github.com/badges/stability-badges)

![img](http://i.imgur.com/7yGGXdd.png)

A utility for 2D line drawing in ThreeJS, by expanding the points in a vertex shader for fast variable thickness, anti-aliasing, line dashes, and other effects.

See [test.js](test/test.js) for a complete example, as well as other shader applications. 

```js
var bezier = require('adaptive-bezier-curve')
var Line = require('three-line-2d')
var BasicShader = require('three-line-2d/shaders/basic')

//build a smooth bezier curve in world units
var quality = 5
var curve = bezier([0, 0], [0.5, 1], [1, 1], [2, 0], quality)

//create our geometry
var curveGeometry = Line()

//create a material using a basic shader
var mat = new THREE.ShaderMaterial(BasicShader({
    side: THREE.DoubleSide,
    diffuse: 0x5cd7ff,
    thickness: 0.3
}))

var mesh = new THREE.Mesh(curveGeometry, mat)
app.scene.add(mesh)

    ```

## Usage

[![NPM](https://nodei.co/npm/three-line-2d.png)](https://nodei.co/npm/three-line-2d/)

#### `geometry = Line(path, [opt])`

Creates a new Line geometry from a 2D list of points. 

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/three-line-2d/blob/master/LICENSE.md) for details.
