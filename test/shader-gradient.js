var assign = require('object-assign');
var number = require('as-number');

module.exports = function (THREE) {
  return function (opt) {
    opt = opt || {};

    var ret = assign({
      transparent: true,
      uniforms: {
        thickness: { type: 'f', value: number(opt.thickness, 0.1) },
        opacity: { type: 'f', value: number(opt.opacity, 1.0) },
        diffuse: { type: 'c', value: new THREE.Color(opt.diffuse) },
        time: { type: 'f', value: 0 }
      },
      vertexShader: [
        'uniform float thickness;',
        'attribute float lineMiter;',
        'attribute vec2 lineNormal;',
        'attribute float lineDistance;',
        'varying float edge;',
        'varying float lineU;',
        'uniform float time;',
        'void main() {',
        'edge = sign(lineMiter);',
        'lineU = lineDistance;',
        'vec3 pointPos = position.xyz + vec3(lineNormal * thickness/2.0 * lineMiter, 0.0);',
        'gl_Position = projectionMatrix * modelViewMatrix * vec4( pointPos, 1.0 );',
        '}'
      ].join('\n'),
      fragmentShader: [
        'varying float edge;',
        'varying float lineU;',

        'uniform float opacity;',
        'uniform float time;',
        'uniform vec3 diffuse;',

        'void main() {',
        'float lineV = 1.0 - abs(edge);',
        'lineV = smoothstep(0.0, 0.8, lineV);',
        'float radial = lineU * sin(time + lineU*2.0);',
        'gl_FragColor = vec4(vec3(lineV), 1.0);',
        'gl_FragColor.a *= opacity * radial * lineV;',
        '}'
      ].join('\n')
    }, opt);

    // remove to satisfy r73
    delete ret.thickness;
    delete ret.opacity;
    delete ret.diffuse;

    var threeVers = (parseInt(THREE.REVISION, 10) || 0) | 0;
    if (threeVers < 72) {
      // Old versions need to specify shader attributes
      ret.attributes = {
        lineMiter: { type: 'f', value: 0 },
        lineDistance: { type: 'f', value: 0 },
        lineNormal: { type: 'v2', value: new THREE.Vector2() }
      };
    }
    return ret;
  };
};
