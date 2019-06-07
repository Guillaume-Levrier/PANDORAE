const normalCore = () => {

// SHADERLOADER
var ShaderLoader = function()
{
    // Shaders

    ShaderLoader.get = function( id )
    {
        return ShaderLoader.shaders[ id ];
    };

};

ShaderLoader.prototype =
{

    loadShaders : function( shaders, baseUrl, callback )
    {
        ShaderLoader.shaders = shaders;

        this.baseUrl = baseUrl || "./";
        this.callback = callback;
        this.batchLoad( this, 'onShadersReady' );

    },

    batchLoad : function( scope, callback )
    {
        var queue = 0;
        for ( var name in ShaderLoader.shaders ) {

            queue++;
            var req = new XMLHttpRequest();
            req.onload = loadHandler( name, req );
            req.open( 'get', scope.baseUrl + name + '.glsl', true );
            req.send();
        }

        function loadHandler( name, req ) {
            return function()
            {
                ShaderLoader.shaders[ name ] = req.responseText;
                if ( --queue <= 0 ) scope[ callback ]();
            };
        }
    },

    onShadersReady : function()
    {
        if( this.callback ) this.callback();
    }
};

// FBO

// For more on FBO, check Nicoptere's article here http://barradeau.com/blog/?p=621

var FBO = function(exports){

    var scene, orthoCamera, rtt;
    exports.init = function( width, height, renderer, simulationMaterial, renderMaterial ){
      renderer.domElement.id = 'coreCanvas';
      
        var gl = renderer.getContext();

        //1 we need FLOAT Textures to store positions
        //https://github.com/KhronosGroup/WebGL/blob/master/sdk/tests/conformance/extensions/oes-texture-float.html
        if (!gl.getExtension("OES_texture_float")){
            throw new Error( "float textures not supported" );
        }

        //2 we need to access textures from within the vertex shader
        //https://github.com/KhronosGroup/WebGL/blob/90ceaac0c4546b1aad634a6a5c4d2dfae9f4d124/conformance-suites/1.0.0/extra/webgl-info.html
        if( gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) == 0 ) {
            throw new Error( "vertex shader cannot read textures" );
        }

        //3 rtt setup
        scene = new THREE.Scene();
        orthoCamera = new THREE.OrthographicCamera(-1,1,1,-1,1/Math.pow( 2, 53 ),1 );

        //4 create a target texture
        var options = {
            minFilter: THREE.NearestFilter,//important as we want to sample square pixels
            magFilter: THREE.NearestFilter,//
            format: THREE.RGBAFormat,
            type:THREE.FloatType//important as we need precise coordinates (not ints)
        };
        rtt = new THREE.WebGLRenderTarget( width,height, options);


        //5 the simulation:
        //create a bi-unit quadrilateral and uses the simulation material to update the Float Texture
        var geom = new THREE.BufferGeometry();
        geom.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array([   -1,-1,0, 1,-1,0, 1,1,0, -1,-1, 0, 1, 1, 0, -1,1,0 ]), 3 ) );
        geom.addAttribute( 'uv', new THREE.BufferAttribute( new Float32Array([   0,1, 1,1, 1,0,     0,1, 1,0, 0,0 ]), 2 ) );
        scene.add( new THREE.Mesh( geom, simulationMaterial ) );

        var cell = new THREE.Group();

        var cellGeometry = new THREE.SphereBufferGeometry(3,512,512);
        var cellMaterial = new THREE.MeshPhongMaterial( { color: 0x156289, transparent: true, opacity: 0.7, emissive: 0x072534, side: THREE.DoubleSide, flatShading: true } );
        var sphere = new THREE.Mesh( cellGeometry, cellMaterial );
        cell.add( sphere );
        scene.add( cell );

        //6 the particles:
        //create a vertex buffer of size width * height with normalized coordinates
        var l = (width * height );
        var vertices = new Float32Array( l * 3 );
        for ( var i = 0; i < l; i++ ) {

            var i3 = i * 3;
            vertices[ i3 ] = ( i % width ) / width ;
            vertices[ i3 + 1 ] = ( i / width ) / height;
        }

        //create the particles geometry
        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute( 'position',  new THREE.BufferAttribute( vertices, 3 ) );

        //the rendermaterial is used to render the particles
        exports.particles = new THREE.Points( geometry, renderMaterial );
        exports.renderer = renderer;

    };

    //7 update loop
    exports.update = function(){

        //1 update the simulation and render the result in a target texture
        exports.renderer.render( scene, orthoCamera, rtt, true );

        //2 use the result of the swap as the new position for the particles' renderer
        exports.particles.material.uniforms.positions.value = rtt;
    };
    return exports;
}

({});

// MORPH

var scene, camera, renderer, controls;
var simulationShader, automatic;
var zoomFactor = 1;

const reloadCore = () => {
           var sl = new ShaderLoader();
           sl.loadShaders({
               simulation_vs : "",
               simulation_fs : "",
               render_vs : "",
               render_fs : ""
           }, "./themes/normal/glsl/morph/", init );
       };

window.onload = reloadCore();

       function init()
       {


           var w = coreCanvasW;
           var h = coreCanvasH;

        
           renderer = new THREE.WebGLRenderer({ logarithmicDepthBuffer: true });
           renderer.setSize( w,h );
           renderer.setClearColor( 0xFFFFFF , 1 );
           renderer.className +="themeCustom";
                      
           document.body.insertBefore(renderer.domElement,document.getElementById("signal"));


           scene = new THREE.Scene();
           camera = new THREE.PerspectiveCamera(60,w/h, 1,1000 );

           controls = new THREE.OrbitControls(camera);
           camera.position.z =
           controls.minDistance = 
           controls.maxDistance = 400;

           camera.zoom = zoomFactor;

           var width  = 512;
           var height = 512;

           //first model
           var dataA = getSphere( width * height, 128 );
           var textureA = new THREE.DataTexture( dataA, width, height, THREE.RGBFormat, THREE.FloatType, THREE.DEFAULT_MAPPING, THREE.RepeatWrapping, THREE.RepeatWrapping );
           textureA.needsUpdate = true;

           //second model
           var dataB = getSphere( width * height, 128 );
           var textureB = new THREE.DataTexture( dataB, width, height, THREE.RGBFormat, THREE.FloatType, THREE.DEFAULT_MAPPING, THREE.RepeatWrapping, THREE.RepeatWrapping );
           textureB.needsUpdate = true;

           simulationShader = new THREE.ShaderMaterial({
               uniforms: {
                   textureA: { type: "t", value: textureA },
                   textureB: { type: "t", value: textureB },
                   timer: { type: "f", value: 0},
                   frequency: { type: "f", value: 0.01 },
                   amplitude: { type: "f", value: 96 },
                   maxDistanceA: { type: "f", value: 48 },
                   maxDistanceB: { type: "f", value: 148 }
               },
               vertexShader: ShaderLoader.get( "simulation_vs"),
               fragmentShader:  ShaderLoader.get( "simulation_fs")
           });

           var renderShader = new THREE.ShaderMaterial( {
             uniforms: {
                 positions: { type: "t", value: null },
                 pointSize: { type: "f", value: 1 },
                 big: { type: "v3", value: new THREE.Vector3(207,221,212).multiplyScalar(1/0xFF) },
                 small: { type: "v3", value: new THREE.Vector3(80,80,80).multiplyScalar(1/0xFF) }
             },
               vertexShader: ShaderLoader.get( "render_vs"),
               fragmentShader: ShaderLoader.get( "render_fs"),
               transparent: true,
               side:THREE.DoubleSide
  //             blending:THREE.AdditiveBlending
           } );

           FBO.init( width,height, renderer, simulationShader, renderShader );
           scene.add( FBO.particles );

           window.addEventListener( "resize", onResize );
           onResize();
           update();
       }

       //returns a Float32Array buffer of spherical 3D points
       function getPoint(v,size)
       {
           v.x = Math.random() * 2 - 1 ;
           v.y = Math.random() * 2 - 1 ;
           v.z = Math.random() * 2 - 1 ;
           if(v.length()>1)return getPoint(v,size);
           return v.normalize().multiplyScalar(size);
       }
       function getSphere( count, size ){
           var len = count * 3;
           var data = new Float32Array( len );
           var p = new THREE.Vector3();
           for( var i = 0; i < len; i+=3 )
           {
               getPoint( p, size );
               data[ i     ] = p.x;
               data[ i + 1 ] = p.y;
               data[ i + 2 ] = p.z;
           }
           return data;
       }
       function onResize()
       { 
           
            var w = window.innerWidth;
            var h = window.innerHeight;
           renderer.setSize(w,h);
           camera.aspect = w/h;
           camera.updateProjectionMatrix();        
           
       }
       function update()
       {
           requestAnimationFrame(update);


           //update params
           simulationShader.uniforms.timer.value = parseFloat( pandoratio );
           FBO.particles.rotation.x = Math.cos( Date.now() *.001 ) * Math.PI / 180 * 2;
           FBO.particles.rotation.y -= Math.PI / 180 * .1;
           //update simulation
           FBO.update();
           //render the particles at the new location
           renderer.render( scene, camera );
       }


//Add background
// <video autoplay loop class="themeCustom" id="screenMachine" type="video/mp4"></video>

let cinemagraph = document.createElement('video');
cinemagraph.id = 'screenMachine';
cinemagraph.type="video/mp4";
cinemagraph.className +="themeCustom";
cinemagraph.className +=" purgeable";
cinemagraph.loop=true;
cinemagraph.autoplay = true;

    document.body.insertBefore(cinemagraph,document.getElementById("coreCanvas"));

//<div class="themeCustom" id="vignette"></div>

let vignette = document.createElement('div');
vignette.id = "vignette";
vignette.className +="themeCustom";
vignette.className +=" purgeable";
document.body.insertBefore(vignette,document.getElementById("coreCanvas"));

//<img class="themeCustom" id="mask">   
let mask = document.createElement('img');
mask.id = "mask";
mask.className +="themeCustom";
mask.className +=" purgeable";
document.body.insertBefore(mask,document.getElementById("coreCanvas"));

}



module.exports = () => {normalCore();};
