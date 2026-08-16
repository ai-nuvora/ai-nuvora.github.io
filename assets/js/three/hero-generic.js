/* ==========================================================================
   NUVORA.AI — GENERIC PAGE HERO SCENE
   A lighter-weight version of the homepage shard cluster, reused on every
   page that isn't Home/AI/Technology (Blog, About, Contact, Article,
   Legal) so the ENTIRE site carries real WebGL 3D — not just three pages.
   Fewer shards + no particle field keeps it cheap enough for a page whose
   real job is reading, not spectacle.
   Usage: <div class="hero-canvas" id="hero-xxx-canvas"></div>
          <script>NUVORA_GENERIC_HERO_ID = "hero-xxx-canvas";</script>
          <script src="/assets/js/three/hero-generic.js" defer></script>
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  var targetId = window.NUVORA_GENERIC_HERO_ID || "hero-generic-canvas";

  NUVORA.HeroBase.init("#" + targetId, function (ctx) {
    var THREE = ctx.THREE, scene = ctx.scene;

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    var key = new THREE.DirectionalLight(0xffffff, 1);
    key.position.set(3, 4, 5);
    scene.add(key);
    var rim = new THREE.DirectionalLight(0xf5720a, 0.7);
    rim.position.set(-4, -2, -3);
    scene.add(rim);

    var group = new THREE.Group();
    group.position.x = 1.8;
    scene.add(group);

    var orangeMat = new THREE.MeshStandardMaterial({ color: 0xf5720a, flatShading: true, roughness: 0.4 });
    var charcoalMat = new THREE.MeshStandardMaterial({ color: 0x333333, flatShading: true, roughness: 0.55 });

    var count = ctx.isMobile ? 3 : 5;
    var shards = [];
    for (var i = 0; i < count; i++) {
      var geo = new THREE.IcosahedronGeometry(0.55 + Math.random() * 0.75, 0);
      var mesh = new THREE.Mesh(geo, i % 2 === 0 ? orangeMat : charcoalMat);
      mesh.position.set(
        (Math.random() - 0.5) * 3.4,
        (Math.random() - 0.5) * 2.6,
        (Math.random() - 0.5) * 2
      );
      mesh.userData.axis = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
      mesh.userData.spin = 0.06 + Math.random() * 0.14;
      group.add(mesh);
      shards.push(mesh);
    }

    return {
      onFrame: function (dt, elapsed, mouseX, mouseY) {
        shards.forEach(function (m) { m.rotateOnAxis(m.userData.axis, m.userData.spin * dt); });
        group.rotation.y = Math.sin(elapsed * 0.12) * 0.12 + mouseX * 0.08;
        group.rotation.x = mouseY * 0.06;
      }
    };
  });
});
