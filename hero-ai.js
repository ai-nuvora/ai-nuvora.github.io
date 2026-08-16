/* ==========================================================================
   NUVORA.AI — AI CATEGORY PAGE HERO SCENE
   Same brand-color language as the homepage, restyled as a connected
   node/edge network — visually reinforcing "AI" without introducing a
   different visual language.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  NUVORA.HeroBase.init("#hero-ai-canvas", function (ctx) {
    var THREE = ctx.THREE, scene = ctx.scene;

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    var key = new THREE.DirectionalLight(0xffffff, 1);
    key.position.set(3, 4, 5);
    scene.add(key);

    var group = new THREE.Group();
    group.position.x = 1.4;
    scene.add(group);

    var nodeCount = ctx.isMobile ? 14 : 26;
    var nodes = [];
    var nodeGeo = new THREE.IcosahedronGeometry(0.09, 0);
    var nodeMatOrange = new THREE.MeshStandardMaterial({ color: 0xf5720a, flatShading: true });
    var nodeMatCharcoal = new THREE.MeshStandardMaterial({ color: 0x3a3a3a, flatShading: true });

    for (var i = 0; i < nodeCount; i++) {
      var mesh = new THREE.Mesh(nodeGeo, i % 4 === 0 ? nodeMatOrange : nodeMatCharcoal);
      mesh.position.set(
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 3.6,
        (Math.random() - 0.5) * 3
      );
      mesh.userData.base = mesh.position.clone();
      mesh.userData.phase = Math.random() * Math.PI * 2;
      group.add(mesh);
      nodes.push(mesh);
    }

    // Connect nearby nodes with thin lines
    var lineMat = new THREE.LineBasicMaterial({ color: 0xf5720a, transparent: true, opacity: 0.28 });
    var linePositions = [];
    for (var a = 0; a < nodes.length; a++) {
      for (var b = a + 1; b < nodes.length; b++) {
        if (nodes[a].position.distanceTo(nodes[b].position) < 1.8) {
          linePositions.push(nodes[a].position.x, nodes[a].position.y, nodes[a].position.z);
          linePositions.push(nodes[b].position.x, nodes[b].position.y, nodes[b].position.z);
        }
      }
    }
    var lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
    var lines = new THREE.LineSegments(lineGeo, lineMat);
    group.add(lines);

    return {
      onFrame: function (dt, elapsed, mouseX, mouseY) {
        nodes.forEach(function (n) {
          n.position.y = n.userData.base.y + Math.sin(elapsed * 0.6 + n.userData.phase) * 0.12;
          n.rotation.y += dt * 0.4;
        });
        group.rotation.y = mouseX * 0.15;
        group.rotation.x = mouseY * 0.1;
      }
    };
  });
});
