var scene, camera, renderer, controls;
var simulationnShader;

//ONLOAD
window.onload = function() {
    var sl = new ShaderLoader();
    sl.loadShaders({
        simulation_vs : "",
        simulation_fs : "",
        render_vs : "",
        render_fs : ""
    }, "glsl/noise/", init );
};

// INIT
function init()
{

    var w = window.innerWidth;
    var h = window.innerHeight;

    renderer = new THREE.WebGLRenderer({ logarithmicDepthBuffer: true });
    renderer.setSize( w,h );
    renderer.setClearColor(0xFFFFFF);
    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 60,w/h, 1, 1000  );

    controls = new THREE.OrbitControls(camera);
    camera.position.z =
    controls.minDistance =
    controls.maxDistance = 400;

    var width  = 512;
    var height = 512;


    var data = getSphere( width * height, 128 );

    var texture = new THREE.DataTexture( data, width, height, THREE.RGBFormat, THREE.FloatType, THREE.DEFAULT_MAPPING, THREE.RepeatWrapping, THREE.RepeatWrapping );
    texture.needsUpdate = true;

// shapes depends on amplitude/maxDistance. If amplitude/maxdistance > 0, looks like a Sphere.
    simulationShader = new THREE.ShaderMaterial({

        uniforms: {
            texture: { type: "t", value: texture },
            timer: { type: "f", value: 0},
            frequency: { type: "f", value: 0.01 },
            amplitude: { type: "f", value: 96 },
            maxDistance: { type: "f", value: 48 }
        },
        vertexShader: ShaderLoader.get( "simulation_vs"),
        fragmentShader:  ShaderLoader.get( "simulation_fs")



    });

    var renderShader = new THREE.ShaderMaterial( {
        uniforms: {
            positions: { type: "t", value: null },
            pointSize: { type: "f", value: 3 },
            big: { type: "v3", value: new THREE.Vector3(207,221,212).multiplyScalar(1/0xFF) },
            small: { type: "v3", value: new THREE.Vector3(80,80,80).multiplyScalar(1/0xFF) }
        },
        vertexShader: ShaderLoader.get( "render_vs"),
        fragmentShader: ShaderLoader.get( "render_fs"),
        transparent: true,
        side:THREE.DoubleSide
//                blending:THREE.AdditiveBlending
    } );


//FBO INIT
    FBO.init( width,height, renderer, simulationShader, renderShader );
    scene.add( FBO.particles );

    window.addEventListener( "resize", onResize );
    onResize();
    update();
}

Math.cbrt = Math.cbrt || function(x) {
    var y = Math.pow(Math.abs(x), 1/3);
    return x < 0 ? -y : y;
};
function getPoint(v,size)
{
    //the 'discard' method, not the most efficient
    v.x = Math.random() * 2 - 1 ;
    v.y = Math.random() * 2 - 1 ;
    v.z = Math.random() * 2 - 1 ;
    if(v.length()>1)return getPoint(v,size);
    return v.normalize().multiplyScalar(size);

    //exact but slow-ish
    /*
    var phi = Math.random() * 2 * Math.PI;
    var costheta = Math.random() * 2 -1;
    var u = Math.random();

    var theta = Math.acos( costheta );
    var r = size * Math.cbrt( u );

    v.x = r * Math.sin( theta) * Math.cos( phi );
    v.y = r * Math.sin( theta) * Math.sin( phi );
    v.z = r * Math.cos( theta );
    return v;
    //*/
}

//returns a Float32Array buffer of spherical 3D points
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

    controls.update();

    //update simulation
    FBO.update();

    //update mesh
    simulationShader.uniforms.timer.value += 0.01;
    FBO.particles.rotation.x = Math.cos( Date.now() *.001 ) * Math.PI / 180 * 2;
    FBO.particles.rotation.y -= Math.PI / 180 * .05;

    //render the particles at the new location
    renderer.render( scene, camera );

}

setInterval(consolelogging, 200);
function consolelogging() { console.log(pandoratio); }
