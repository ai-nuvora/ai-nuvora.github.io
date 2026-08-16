/* ==========================================================================
   NUVORA.AI — MAIN.JS
   Global, framework-free behavior used on every page:
   - sticky header shadow
   - mobile nav toggle
   - scroll-reveal (Tier 2 "3D" entrance)
   - article-card mouse-tilt (Tier 2 3D)
   - blog filter + client-side search (blog page only, guarded)
   All of this respects prefers-reduced-motion automatically because the
   heavy lifting (transition/animation) lives in CSS, which already has a
   global reduced-motion override in style.css.
   ========================================================================== */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Sticky header shadow ---------------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------------- Mobile nav toggle ---------------- */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------- Mark active nav link ---------------- */
  var here = location.pathname.replace(/index\.html$/, "");
  document.querySelectorAll(".nav-links a[href]").forEach(function (a) {
    var href = a.getAttribute("href").replace(/index\.html$/, "");
    if (href === here || (href !== "/" && here.indexOf(href) === 0)) {
      a.classList.add("is-active");
    }
  });

  /* ---------------- Scroll reveal (Tier 2 3D) ---------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
      );
      revealEls.forEach(function (el, i) {
        el.style.setProperty("--stagger", (i % 6) * 70 + "ms");
        io.observe(el);
      });
    }
  }

  /* ---------------- Article card mouse-tilt (Tier 2 3D) ---------------- */
  if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".article-card").forEach(function (card) {
      var inner = card.querySelector(".article-card-tilt");
      if (!inner) return;
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        inner.style.transform =
          "rotateX(" + (y * -6) + "deg) rotateY(" + (x * 8) + "deg) translateZ(4px)";
      });
      card.addEventListener("mouseleave", function () {
        inner.style.transform = "rotateX(0) rotateY(0) translateZ(0)";
      });
    });
  }

  /* ---------------- Blog filter + search (guarded: only runs if present) ---------------- */
  var filterBar = document.querySelector("[data-filter-tabs]");
  var searchInput = document.querySelector("[data-article-search]");
  var cards = document.querySelectorAll("[data-article-card]");

  function applyFilters() {
    var activeTab = document.querySelector(".filter-tab.is-active");
    var cat = activeTab ? activeTab.getAttribute("data-filter") : "all";
    var q = searchInput ? searchInput.value.trim().toLowerCase() : "";

    cards.forEach(function (card) {
      var matchesCat = cat === "all" || card.getAttribute("data-category") === cat;
      var text = (card.getAttribute("data-title") || "").toLowerCase();
      var matchesSearch = q === "" || text.indexOf(q) !== -1;
      card.style.display = matchesCat && matchesSearch ? "" : "none";
    });
  }

  if (filterBar) {
    filterBar.querySelectorAll(".filter-tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        filterBar.querySelectorAll(".filter-tab").forEach(function (t) {
          t.classList.remove("is-active");
        });
        tab.classList.add("is-active");
        applyFilters();
      });
    });

    // Deep-link support: /blog/?cat=ai or /blog/?cat=technology
    var params = new URLSearchParams(window.location.search);
    var catParam = params.get("cat");
    if (catParam) {
      var match = filterBar.querySelector('.filter-tab[data-filter="' + catParam + '"]');
      if (match) {
        filterBar.querySelectorAll(".filter-tab").forEach(function (t) {
          t.classList.remove("is-active");
        });
        match.classList.add("is-active");
      }
    }
    applyFilters();
  }
  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }

  /* ---------------- Reading progress bar (article pages only) ---------------- */
  var progressBar = document.querySelector(".reading-progress");
  if (progressBar) {
    var updateProgress = function () {
      var h = document.documentElement;
      var scrolled = h.scrollTop;
      var height = h.scrollHeight - h.clientHeight;
      progressBar.style.width = (height > 0 ? (scrolled / height) * 100 : 0) + "%";
    };
    document.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
  }

  /* ---------------- Footer year ---------------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
