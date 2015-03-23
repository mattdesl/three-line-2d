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

        this._positions = new THREE.BufferAttribute(null, 3)
        this._normals = new THREE.BufferAttribute(null, 2)
        this._miters = new THREE.BufferAttribute(null, 1)
        this._indices = new THREE.BufferAttribute(null, 1)

        if (opt.distances) 
            this._distances = new THREE.BufferAttribute(null, 1)

        this.update(path, opt.closed)

        this.addAttribute('position', this._positions)
        this.addAttribute('lineNormal', this._normals)
        this.addAttribute('lineMiter', this._miters)
        this.addAttribute('index', this._indices)

        if (opt.distances)
            this.addAttribute('lineDistance', this._distances)
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
        
        if (!this._positions.array ||
            (path.length !== this._positions.array.length/3/VERTS_PER_POINT)) {
            var count = path.length * VERTS_PER_POINT
            this._positions.array = new Float32Array(count * 3)
            this._normals.array = new Float32Array(count * 2)
            this._miters.array = new Float32Array(count * 1)
            this._indices.array = new Uint16Array(Math.max(0, (path.length-1) * 6))

            if (this._distances)
                this._distances.array = new Float32Array(count * 1)
        }
        var useDist = Boolean(this._distances)

        this._positions.needsUpdate = true
        this._miters.needsUpdate = true
        this._normals.needsUpdate = true
        this._indices.needsUpdate = true
        if (useDist)
            this._distances.needsUpdate = true
        
        var index = 0,
            c = 0, 
            dIndex = 0,
            indexArray = this._indices.array
            
        path.forEach(function(point, pointIndex, self) {
            var i = index
            indexArray[c++] = i + 0 
            indexArray[c++] = i + 1 
            indexArray[c++] = i + 2 
            indexArray[c++] = i + 2 
            indexArray[c++] = i + 1 
            indexArray[c++] = i + 3 

            this._positions.setXYZ(index++, point[0], point[1], 0)
            this._positions.setXYZ(index++, point[0], point[1], 0)

            if (useDist) {
                var d = pointIndex/(self.length-1)
                this._distances.setX(dIndex++, d)
                this._distances.setX(dIndex++, d)
            }
        }, this)

        var nIndex = 0, 
            mIndex = 0
        normals.forEach(function(n) {
            var norm = n[0]
            var miter = n[1]
            this._normals.setXY(nIndex++, norm[0], norm[1])
            this._normals.setXY(nIndex++, norm[0], norm[1])

            this._miters.setX(mIndex++, -miter)
            this._miters.setX(mIndex++, miter)
        }, this)
    }
    return LineMesh
}