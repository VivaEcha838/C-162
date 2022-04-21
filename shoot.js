AFRAME.registerComponent("bullets", {
  init: function () {
    this.shootBullet();
  },
  shootBullet: function () {
    window.addEventListener("keydown", (e) => {
      if (e.key === "z") {
        var bullet = document.createElement("a-entity");

        bullet.setAttribute("geometry", {
          primitive: "sphere",
          radius: 0.1,
        });

        bullet.setAttribute("material", "color", "black");
        bullet.setAttribute("dynamic-body", {shape: 'sphere', mass: "0"})
        var cam = document.querySelector("#camera");

        pos = cam.getAttribute("position");

        bullet.setAttribute("position", {
          x: pos.x,
          y: pos.y,
          z: pos.z,
        });

        var camera = document.querySelector("#camera").object3D;

        //get the camera direction as Three.js Vector
        var direction = new THREE.Vector3();
        camera.getWorldDirection(direction);

        //set the velocity and it's direction
        bullet.setAttribute("velocity", direction.multiplyScalar(-10));
        bullet.addEventListener("collide", this.removeBullet)
        var scene = document.querySelector("#scene");

        scene.appendChild(bullet);
      }
    });
  },

  removeBullet: function (e) {
    //Original entity (bullet)
    console.log(e.detail.target.el);

    //Other entity, which bullet touched.
    console.log(e.detail.body.el);

    //bullet element
    var targetElement = e.detail.target.el

    //element which is hit
    var hitElement = e.detail.body.el

    if (hitElement.id.includes("box")) 
      {
        //set material attribute
        hitElement.setAttribute("material", {
          opacity: 0.5,
          transparent: true
        })

        //impulse and point vector
        var impulse = new CANNON.Vec3(-2, 2, 1)
        var worldPoint = new CANNON.Vec3().copy(hitElement.getAttribute("position"))

        hitElement.body.applyImpulse(impulse, worldPoint)

        //remove event listener
        targetElement.removeEventListener("collide", this.shoot())
        
        //remove the bullets from the scene
        var scene = document.querySelector("#scene")
        scene.removeChild(targetElement)
    }
  },
});


