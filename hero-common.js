/* ==========================================================================
   NUVORA.AI — HERO-COMMON.JS  (Tier 1 WebGL bootstrap)

   Shared by hero-home.js / hero-ai.js / hero-tech.js — the ONLY three pages
   that load Three.js at all. This file:
   - skips WebGL entirely if prefers-reduced-motion is set, or WebGL is
     unavailable, or the container is missing (graceful CSS fallback in
     that case — see .hero-fallback in style.css)
   - pauses the render loop when the hero scrolls out of view or the tab
     is hidden, so it never burns battery/CPU off-screen
   - caps pixel ratio on mobile for performance
   NUVORA.HeroBase.init() returns { scene, camera, renderer, THREE } or
   null (meaning: fall back to the static CSS gradient, do nothing else).
   ========================================================================== */

window.NUVORA = window.NUVORA || {};

NUVORA.HeroBase = {
  init: function (containerSelector, buildScene) {
    var container = document.querySelector(containerSelector);
    if (!container) return null;

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return null;
    if (typeof THREE === "undefined") return null;

    var isMobile = window.innerWidth < 720;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 9);

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
      return null;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    var ctx = { THREE: THREE, scene: scene, camera: camera, renderer: renderer, isMobile: isMobile };
    var scenery = buildScene(ctx) || {};

    var mouseX = 0, mouseY = 0, targetRotY = 0, targetRotX = 0;
    window.addEventListener("mousemove", function (e) {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    });

    var running = true;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          running = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    io.observe(container);

    document.addEventListener("visibilitychange", function () {
      running = running && !document.hidden;
    });

    var clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      if (!running) return;
      var dt = clock.getDelta();
      var elapsed = clock.getElapsedTime();

      if (typeof scenery.onFrame === "function") {
        scenery.onFrame(dt, elapsed, mouseX, mouseY);
      }
      renderer.render(scene, camera);
    }
    animate();

    function onResize() {
      var w = container.clientWidth, h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", onResize);

    return ctx;
  }
};
