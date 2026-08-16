/* ==========================================================================
   NUVORA.AI — TECHNOLOGY CATEGORY PAGE HERO SCENE
   Same low-poly faceted language as the homepage, restyled as a wireframe
   / circuit-board structure — reinforcing "Technology" while staying in
   the same brand-visual family (no unrelated stock effect).
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  NUVORA.HeroBase.init("#hero-tech-canvas", function (ctx) {
    var THREE = ctx.THREE, scene = ctx.scene;

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    var key = new THREE.DirectionalLight(0xffffff, 1);
    key.position.set(3, 4, 6);
    scene.add(key);

    var group = new THREE.Group();
    group.position.x = 1.4;
    scene.add(group);

    // Solid faceted core
    var coreGeo = new THREE.IcosahedronGeometry(1.5, 0);
    var coreMat = new THREE.MeshStandardMaterial({
      color: 0x2b2b2b, flatShading: true, roughness: 0.5, metalness: 0.2,
      transparent: true, opacity: 0.9
    });
    var core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // Wireframe shell, slightly larger, orange
    var wireGeo = new THREE.IcosahedronGeometry(1.62, 0);
    var wireMat = new THREE.MeshBasicMaterial({ color: 0xf5720a, wireframe: true, transparent: true, opacity: 0.7 });
    var wire = new THREE.Mesh(wireGeo, wireMat);
    group.add(wire);

    // Orbiting satellite shards (circuit "nodes")
    var satMat = new THREE.MeshStandardMaterial({ color: 0xf5720a, flatShading: true });
    var sats = [];
    var satCount = ctx.isMobile ? 4 : 7;
    for (var i = 0; i < satCount; i++) {
      var geo = new THREE.IcosahedronGeometry(0.12, 0);
      var sat = new THREE.Mesh(geo, satMat);
      var radius = 2.4 + Math.random() * 0.6;
      sat.userData.angle = (i / satCount) * Math.PI * 2;
      sat.userData.radius = radius;
      sat.userData.speed = 0.25 + Math.random() * 0.2;
      sat.userData.tilt = (Math.random() - 0.5) * 1.2;
      group.add(sat);
      sats.push(sat);
    }

    return {
      onFrame: function (dt, elapsed, mouseX, mouseY) {
        core.rotation.y += dt * 0.12;
        core.rotation.x += dt * 0.05;
        wire.rotation.y -= dt * 0.08;
        wire.rotation.x -= dt * 0.03;

        sats.forEach(function (s) {
          s.userData.angle += dt * s.userData.speed;
          s.position.set(
            Math.cos(s.userData.angle) * s.userData.radius,
            Math.sin(s.userData.angle) * s.userData.radius * 0.4 + s.userData.tilt,
            Math.sin(s.userData.angle) * s.userData.radius * 0.5
          );
        });

        group.rotation.y += mouseX * 0.0006;
        group.rotation.x += mouseY * 0.0004;
      }
    };
  });
});
