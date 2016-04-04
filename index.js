var inherits = require('inherits')
var getNormals = require('polyline-normals')
var VERTS_PER_POINT = 2

var tmp = [0, 0]

module.exports = function(THREE) {

    function LineMesh(path, opt) {
        if (!(this instanceof LineMesh))
            return new LineMesh(path, opt)
        THREE.BufferGeometry.call(this)

        if (Array.isArray(path)) {
            opt = opt||{}
        } else if (typeof path === 'object') {
            opt = path
            path = []
        }

        opt = opt||{}

        if (opt.distances) 
            this.addAttribute('lineDistance', new THREE.BufferAttribute(null, 1))

        this.update(path, opt.closed)
    }

    inherits(LineMesh, THREE.BufferGeometry)
    
    LineMesh.prototype.update = function(path, closed) {
        path = path||[]
        var normals = getNormals(path, closed)

        if (closed) {
            path = path.slice()
            path.push(path[0])
            normals.push(normals[0])
        }
        this.addAttribute('position', new THREE.BufferAttribute(null, 3))
        this.addAttribute('lineNormal', new THREE.BufferAttribute(null, 2))
        this.addAttribute('lineMiter', new THREE.BufferAttribute(null, 1))
        if (this.attributes['lineDistance']) 
            this.addAttribute('lineDistance', new THREE.BufferAttribute(null, 1))

        this.setIndex(new THREE.BufferAttribute(null, 1))
        if (!this.attributes['position'].array ||
            (path.length !== this.attributes['position'].array.length/3/VERTS_PER_POINT)) {
            var count = path.length * VERTS_PER_POINT
            this.attributes['position'].array = new Float32Array(count * 3)
            this.attributes['lineNormal'].array = new Float32Array(count * 2)
            this.attributes['lineMiter'].array = new Float32Array(count * 1)
            this.index.array = new Uint16Array(Math.max(0, (path.length-1) * 6))

            if (this.attributes['lineDistance'])
                this.attributes['lineDistance'].array = new Float32Array(count * 1)
        }
        var useDist = Boolean(this.attributes['lineDistance'])

        this.attributes['position'].needsUpdate = true
        this.attributes['lineNormal'].needsUpdate = true
        this.attributes['lineMiter'].needsUpdate = true
        if (useDist)
            this.attributes['lineDistance'].needsUpdate = true
        var index = 0,
            c = 0, 
            dIndex = 0,
            indexArray = this.index.array
            
        path.forEach(function(point, pointIndex, self) {
            var i = index
            indexArray[c++] = i + 0 
            indexArray[c++] = i + 1 
            indexArray[c++] = i + 2 
            indexArray[c++] = i + 2 
            indexArray[c++] = i + 1 
            indexArray[c++] = i + 3 

            this.attributes['position'].setXYZ(index++, point[0], point[1], 0)
            this.attributes['position'].setXYZ(index++, point[0], point[1], 0)

            if (useDist) {
                var d = pointIndex/(self.length-1)
                this.attributes['lineDistance'].setX(dIndex++, d)
                this.attributes['lineDistance'].setX(dIndex++, d)
            }
        }, this)

        var nIndex = 0, 
            mIndex = 0
        normals.forEach(function(n) {
            var norm = n[0]
            var miter = n[1]
            this.attributes['lineNormal'].setXY(nIndex++, norm[0], norm[1])
            this.attributes['lineNormal'].setXY(nIndex++, norm[0], norm[1])

            this.attributes['lineMiter'].setX(mIndex++, -miter)
            this.attributes['lineMiter'].setX(mIndex++, miter)
        }, this)
    }
    return LineMesh
}