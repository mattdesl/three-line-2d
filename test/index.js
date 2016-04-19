global.THREE = require('three');
const createLoop = require('raf-loop');
const createApp = require('./app');

var Line = require('../')(THREE)
var BasicShader = require('../shaders/basic')(THREE)
var DashShader = require('./shader-dash')(THREE)
var GradientShader = require('./shader-gradient')(THREE)

var normalize = require('normalize-path-scale')
var arc = require('arc-to')
var curve = require('adaptive-bezier-curve')

var curvePath = path1()
var circlePath = normalize(arc(0, 0, 25, 0, Math.PI*2, false, 64))
var boxPath = [[0, 0], [1, 0], [1, 1], [0, 1]]

var app = createApp({ antialias: true });
app.renderer.setClearColor(0x00, 1);

var time = 0;
setup();

function setup () {
  // Our bezier curve 
  var curveGeometry = Line()
  var mat = new THREE.ShaderMaterial(BasicShader({
      side: THREE.DoubleSide,
      transparent: true,
      diffuse: 0x5cd7ff
  }))
  var mesh = new THREE.Mesh(curveGeometry, mat)
  app.scene.add(mesh)

  // // Our dashed circle
  // circlePath.pop()
  // var circleGeometry = Line(circlePath, { distances: true, closed: true })
  // var dashMat = new THREE.ShaderMaterial(DashShader())
  // var mesh2 = new THREE.Mesh(circleGeometry, dashMat)
  // mesh2.position.x = -2
  // mesh2.scale.multiplyScalar(0.5)
  // app.scene.add(mesh2)

  // // Our glowing box
  // circlePath.pop()
  // var boxGeometry = Line(boxPath, { distances: true, closed: true })
  // var boxMat = new THREE.ShaderMaterial(GradientShader({
  //     thickness: 0.3
  // }))
  // var boxMesh = new THREE.Mesh(boxGeometry, boxMat)
  // boxMesh.position.y = 0.5
  // boxMesh.position.z = 0.5
  // boxMesh.scale.multiplyScalar(0.5)
  // app.scene.add(boxMesh)

  // // testing delayed update of buffers
  setTimeout(function() {
      curveGeometry.update(curvePath) 
  }, 500)
  
  createLoop(function (dt) {
    time += dt / 1000
    //animate some thickness stuff
    mat.uniforms.thickness.value = Math.sin(time*0.5)*0.2

    //animate some dash properties
    // dashMat.uniforms.dashDistance.value = (Math.sin(time)/2+0.5)*0.5
    // dashMat.uniforms.dashSteps.value = (Math.sin(Math.cos(time))/2+0.5)*24

    // //animate gradient
    // boxMat.uniforms.time.value = time
    
    app.updateProjectionMatrix();
    app.renderer.render(app.scene, app.camera);
  }).start();
}

function path1() {
    var curvePath = curve([40, 40], [70, 100], [120, 20], [200, 40], 5)
    curvePath.push([200, 100])
    curvePath.push([250, 50])

    //a bezier curve, normalized to -1.0 to 1.0
    return normalize(curvePath)
}