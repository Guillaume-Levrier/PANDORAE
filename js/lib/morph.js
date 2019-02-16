var scene, camera, renderer, controls;
var simulationShader, automatic;
var zoomFactor = 0.6;

const reloadCore = () => {
           var sl = new ShaderLoader();
           sl.loadShaders({
               simulation_vs : "",
               simulation_fs : "",
               render_vs : "",
               render_fs : ""
           }, "./glsl/morph/", init );
       };

window.onload = reloadCore();

       function init()
       {


           //var w = window.innerWidth;
           //var h = window.innerHeight;

           var w = 700;
           var h = 500;

           renderer = new THREE.WebGLRenderer({ logarithmicDepthBuffer: true });
           renderer.setSize( w,h );
           renderer.setClearColor( 0xFFFFFF , 1 );
           
           //document.getElementById("core-container").appendChild(renderer.domElement);
           
           document.body.appendChild(renderer.domElement);

           var vignette = document.createElement("div");
           vignette.id = "vignette";
           
           document.body.appendChild(vignette);
           

           scene = new THREE.Scene();
           camera = new THREE.PerspectiveCamera(60,w/h, 1,1000 );

           controls = new THREE.OrbitControls(camera);
           camera.position.z =
           controls.minDistance = 
           controls.maxDistance = 400;

           camera.zoom = zoomFactor;

           var width  = 256;
           var height = 256;

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
          /*  var w = 700;
            var h = 500;
           renderer.setSize(w,h);
           camera.aspect = w/h;
           camera.updateProjectionMatrix();
           document.getElementById("core-container").style.marginTop = parseInt((window.innerHeight/2)-250);*/
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
//       setInterval(consolelogging, 200);
//       function consolelogging() { console.log(pandoratio); }
