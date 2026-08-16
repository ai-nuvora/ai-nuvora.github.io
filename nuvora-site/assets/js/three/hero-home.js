/* ==========================================================================
   NUVORA.AI — HOMEPAGE HERO SCENE (v2 — brand-specific)

   Not generic shapes: this scene builds the actual Nuvora "N" mark out of
   low-poly faceted shards (charcoal → orange, same split as the real logo),
   scatters them, then assembles them into the N on load — echoing the
   fact that the real logo *is* a shattered/faceted N. Thin "circuit"
   lines connect nearby shards (nods to the AI/network side of the brand),
   and a slow-receding grid floor gives it a technology-publication feel
   instead of a generic stock 3D background.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  NUVORA.HeroBase.init("#hero-home-canvas", function (ctx) {
    var THREE = ctx.THREE, scene = ctx.scene, camera = ctx.camera;
    camera.position.set(0, 0.4, 9.5);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    var key = new THREE.DirectionalLight(0xffffff, 1.15);
    key.position.set(4, 5, 6);
    scene.add(key);
    var rim = new THREE.DirectionalLight(0xf5720a, 1.0);
    rim.position.set(-5, -1, -4);
    scene.add(rim);

    var nGroup = new THREE.Group();
    nGroup.position.set(1.5, 0.1, 0);
    scene.add(nGroup);

    var orangeMat = new THREE.MeshStandardMaterial({ color: 0xf5720a, flatShading: true, roughness: 0.35, metalness: 0.15 });
    var charcoalMat = new THREE.MeshStandardMaterial({ color: 0x2f2f2f, flatShading: true, roughness: 0.55, metalness: 0.1 });

    // ---- Build the "N" as three shard-populated strokes, matching the logo's
    // charcoal-to-orange diagonal transition. ----
    function lerp3(a, b, t) {
      return new THREE.Vector3(
        a.x + (b.x - a.x) * t,
        a.y + (b.y - a.y) * t,
        a.z + (b.z - a.z) * t
      );
    }

    var strokeLeft = { from: new THREE.Vector3(-1.5, -1.5, 0), to: new THREE.Vector3(-1.5, 1.5, 0) };
    var strokeDiag = { from: new THREE.Vector3(-1.5, 1.5, 0), to: new THREE.Vector3(1.5, -1.5, 0) };
    var strokeRight = { from: new THREE.Vector3(1.5, -1.5, 0), to: new THREE.Vector3(1.5, 1.5, 0) };

    var shardCountPerStroke = ctx.isMobile ? 5 : 8;
    var shards = [];

    function addStroke(stroke, colorFn) {
      for (var i = 0; i < shardCountPerStroke; i++) {
        var t = i / (shardCountPerStroke - 1);
        var base = lerp3(stroke.from, stroke.to, t);
        base.x += (Math.random() - 0.5) * 0.22;
        base.y += (Math.random() - 0.5) * 0.22;
        base.z += (Math.random() - 0.5) * 0.35;

        var mat = colorFn(t);
        var size = 0.22 + Math.random() * 0.16;
        var geo = new THREE.IcosahedronGeometry(size, 0);
        var mesh = new THREE.Mesh(geo, mat);

        mesh.userData.target = base.clone();
        mesh.userData.scatter = new THREE.Vector3(
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 10 - 4
        );
        mesh.position.copy(mesh.userData.scatter);
        mesh.userData.delay = Math.random() * 0.5;
        mesh.userData.axis = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
        mesh.userData.spin = 0.15 + Math.random() * 0.25;
        mesh.scale.setScalar(0.001);

        nGroup.add(mesh);
        shards.push(mesh);
      }
    }

    addStroke(strokeLeft, function () { return charcoalMat; });
    addStroke(strokeDiag, function (t) { return t < 0.5 ? charcoalMat : orangeMat; });
    addStroke(strokeRight, function () { return orangeMat; });

    // ---- Circuit lines between nearby shards (AI/network nod) ----
    var lineMat = new THREE.LineBasicMaterial({ color: 0xf5720a, transparent: true, opacity: 0 });
    var linePositions = [];
    for (var a = 0; a < shards.length; a++) {
      for (var b = a + 1; b < shards.length; b++) {
        if (shards[a].userData.target.distanceTo(shards[b].userData.target) < 0.85) {
          linePositions.push(shards[a].userData.target.x, shards[a].userData.target.y, shards[a].userData.target.z);
          linePositions.push(shards[b].userData.target.x, shards[b].userData.target.y, shards[b].userData.target.z);
        }
      }
    }
    var lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
    var lines = new THREE.LineSegments(lineGeo, lineMat);
    nGroup.add(lines);

    // ---- Tech grid floor (receding, tilted — publication/technology feel) ----
    var gridSize = 26;
    var gridDivisions = 26;
    var grid = new THREE.GridHelper(gridSize, gridDivisions, 0xf5720a, 0x3a3a3a);
    grid.material.transparent = true;
    grid.material.opacity = 0.14;
    grid.position.set(0, -3.4, -2);
    scene.add(grid);

    // ---- Starfield / data-point particles ----
    var particleGeo = new THREE.BufferGeometry();
    var count = ctx.isMobile ? 70 : 170;
    var positions = new Float32Array(count * 3);
    for (var p = 0; p < count; p++) {
      positions[p * 3] = (Math.random() - 0.5) * 18;
      positions[p * 3 + 1] = (Math.random() - 0.5) * 9 + 1;
      positions[p * 3 + 2] = (Math.random() - 0.5) * 9 - 3;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    var particleMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.03, transparent: true, opacity: 0.45 });
    var particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    var assembleStart = null;

    return {
      onFrame: function (dt, elapsed, mouseX, mouseY) {
        if (assembleStart === null) assembleStart = elapsed;
        var t = elapsed - assembleStart;

        shards.forEach(function (mesh) {
          var localT = Math.min(Math.max((t - mesh.userData.delay) / 1.4, 0), 1);
          var eased = 1 - Math.pow(1 - localT, 3); // ease-out cubic
          mesh.position.lerpVectors(mesh.userData.scatter, mesh.userData.target, eased);
          var scale = Math.min(eased * 1.15, 1);
          mesh.scale.setScalar(Math.max(scale, 0.001));
          mesh.rotateOnAxis(mesh.userData.axis, mesh.userData.spin * dt);
        });

        // Fade circuit lines in once shards have mostly landed
        var lineT = Math.min(Math.max((t - 1.2) / 1.0, 0), 1);
        lineMat.opacity = lineT * 0.3;

        nGroup.rotation.y = Math.sin(elapsed * 0.14) * 0.16 + mouseX * 0.14;
        nGroup.rotation.x = mouseY * 0.09;

        grid.position.x = mouseX * 0.4;
        particles.rotation.y = elapsed * 0.012;
      }
    };
  });
});
