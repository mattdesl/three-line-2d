module.exports = function(THREE) {
    return function (opt) {
        opt = opt||{}
        var thickness = typeof opt.thickness === "number" ? opt.thickness : 0.1
        var opacity = typeof opt.opacity === "number" ? opt.opacity : 1.0
        var diffuse = typeof opt.diffuse === "number" ? opt.diffuse : 0xffffff
        var precision = opt.precision || "highp"

        // remove to satisfy r73
        delete opt.thickness
        delete opt.opacity
        delete opt.diffuse
        delete opt.precision

        return Object.assign({
            uniforms: {
                thickness: { type: 'f', value: thickness },
                opacity: { type: 'f', value: opacity },
                diffuse: { type: 'c', value:  new THREE.Color(diffuse) }
            },
            vertexShader: [
                "uniform float thickness;",
                "attribute float lineMiter;",
                "attribute vec2 lineNormal;",
                "void main() {",
                    "vec3 pointPos = position.xyz + vec3(lineNormal * thickness/2.0 * lineMiter, 0.0);",
                    "gl_Position = projectionMatrix * modelViewMatrix * vec4( pointPos, 1.0 );",
                "}"
            ].join("\n"),
            fragmentShader: [   
                "percision "+ precision +" float;",
                "uniform vec3 diffuse;",
                "void main() {",
                    "gl_FragColor = vec4(diffuse, opacity);",
                "}"
            ].join("\n")
        }, opt)
    }
}