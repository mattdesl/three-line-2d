var assign = require('object-assign');

module.exports = function (THREE) {
  return function (opt) {
    opt = opt || {};
    var thickness = typeof opt.thickness === 'number' ? opt.thickness : 0.1;
    var opacity = typeof opt.opacity === 'number' ? opt.opacity : 1.0;
    var diffuse = opt.diffuse !== null ? opt.diffuse : 0xffffff;

    // remove to satisfy r73
    delete opt.thickness;
    delete opt.opacity;
    delete opt.diffuse;
    delete opt.precision;

    var ret = assign({
      uniforms: {
        thickness: { type: 'f', value: thickness },
        opacity: { type: 'f', value: opacity },
        diffuse: { type: 'c', value: new THREE.Color(diffuse) }
      },
      vertexShader: [
        'uniform float thickness;',
        'attribute float lineMiter;',
        'attribute vec2 lineNormal;',
        'void main() {',
        'vec3 pointPos = position.xyz + vec3(lineNormal * thickness / 2.0 * lineMiter, 0.0);',
        'gl_Position = projectionMatrix * modelViewMatrix * vec4(pointPos, 1.0);',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform vec3 diffuse;',
        'uniform float opacity;',
        'void main() {',
        'gl_FragColor = vec4(diffuse, opacity);',
        '}'
      ].join('\n')
    }, opt);

    var threeVers = (parseInt(THREE.REVISION, 10) || 0) | 0;
    if (threeVers < 72) {
      // Old versions need to specify shader attributes
      ret.attributes = {
        lineMiter: { type: 'f', value: 0 },
        lineNormal: { type: 'v2', value: new THREE.Vector2() }
      };
    }
    return ret;
  };
};
