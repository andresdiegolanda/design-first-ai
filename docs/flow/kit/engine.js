// =====================================================================================================
// The flow-page engine, shared by the two pages of a pair. The page sets window.PAGE (one of the two ids in
// AF.meta.files); the content is in window.AF (the data_*.js files). Nothing here talks to any server: every
// document, prompt and excerpt shown is illustrative and says so. Keyboard: arrows step, space plays, Esc
// closes, F fits, T held things, M marks, R start over, 1-9 pick a journey. Everything page-specific (names,
// labels, legend, vocabulary) comes from AF.meta, so this file is the same for every pair of pages.
// =====================================================================================================
(function () {
  "use strict";
  var PAGE = window.PAGE, AF = window.AF;
  var PAGES = Object.keys(AF.meta.files), OTHER = PAGES.filter(function (p) { return p !== PAGE; })[0] || PAGE;
  var AFTER = AF.meta.after || PAGES[1];                       // the page whose components are "new or changed"
  var LABEL = AF.meta.labels || {}, SHORT = AF.meta.shortLabels || LABEL;
  var W = Object.assign({ one: "token", many: "tokens", Many: "Tokens", held: "Tokens it holds", all: "Every token, where it comes from", listTitle: "Tokens", travels: "The dot" }, AF.meta.words || {});
  function L(p) { return LABEL[p] || p; }
  function S(p) { return SHORT[p] || L(p); }
  var NS = "http://www.w3.org/2000/svg";
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function svg(tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs) { if (attrs[k] != null) { e.setAttribute(k, attrs[k]); } } if (parent) { parent.appendChild(e); } return e; }
  function stripTags(h) { var d = document.createElement("div"); d.innerHTML = h || ""; return d.textContent || ""; }

  // ---- page view of the data: a node or edge that is 'absent' on this page is not drawn at all
  var NODES = {}, EDGES = {}, TOKENS = {};
  AF.nodes.forEach(function (n) { var v = n[PAGE] || {}; if (v.state === "absent") { return; } NODES[n.id] = n; });
  AF.edges.forEach(function (e) { if (e.pages && e.pages.indexOf(PAGE) < 0) { return; } if (!NODES[e.from] || !NODES[e.to]) { return; } EDGES[e.id] = e; });
  AF.tokens.forEach(function (t) { TOKENS[t.id] = t; });
  var JOURNEYS = AF.journeys[PAGE] || [];
  function nv(n) { return n[PAGE] || {}; }
  function nTitle(n) { return nv(n).title || n.title; }
  function nShort(n) { return nv(n).short || n.short || String(nTitle(n)).split(" ")[0]; }
  function nSub(n) { return nv(n).sub != null ? nv(n).sub : n.sub; }
  function nTec(n) { return nv(n).tec != null ? nv(n).tec : n.tec; }
  function nState(n) { return nv(n).state || "normal"; }
  function nHolds(n) { return nv(n).holds || []; }
  function otherHas(id) { var n = AF.nodes.filter(function (x) { return x.id === id; })[0]; return n && (n[OTHER] || {}).state !== "absent"; }

  // ---- state
  var st = { j: null, s: -1, playing: false, timer: null, anim: null, gen: 0, follow: false, vb: { x: 0, y: 0, w: AF.W, h: AF.H }, hlToken: null, sel: null };

  // =====================================================================================================
  // Scene
  // =====================================================================================================
  var root = $("scene"), world = $("world"), gZones = $("zones"), gGroups = $("groups"), gEdges = $("edges"), gNodes = $("nodes"), gMarks = $("marks"), dot = $("dot");
  var ROUTES = {};   // edge id -> [[x,y],...] full polyline

  function rectOf(n) { return { l: n.x - n.w / 2, r: n.x + n.w / 2, t: n.y - n.h / 2, b: n.y + n.h / 2 }; }
  function borderToward(n, px, py) {
    var R = rectOf(n);
    if (px >= R.l && px <= R.r && (py < R.t || py > R.b)) { return [px, py < R.t ? R.t : R.b]; }
    if (py >= R.t && py <= R.b && (px < R.l || px > R.r)) { return [px < R.l ? R.l : R.r, py]; }
    var dx = px - n.x, dy = py - n.y; if (!dx && !dy) { return [n.x, n.y]; }
    var sx = dx ? (n.w / 2) / Math.abs(dx) : Infinity, sy = dy ? (n.h / 2) / Math.abs(dy) : Infinity, k = Math.min(sx, sy);
    return [n.x + dx * k, n.y + dy * k];
  }
  function routeOf(e) {
    var a = NODES[e.from], b = NODES[e.to], pts = (e.pts || []).slice();
    if (!pts.length) {
      var A = rectOf(a), B = rectOf(b);
      var ox1 = Math.max(A.l, B.l), ox2 = Math.min(A.r, B.r), oy1 = Math.max(A.t, B.t), oy2 = Math.min(A.b, B.b);
      if (ox2 - ox1 > 10) { var x = (ox1 + ox2) / 2; return [[x, a.y < b.y ? A.b : A.t], [x, a.y < b.y ? B.t : B.b]]; }
      if (oy2 - oy1 > 10) { var y = (oy1 + oy2) / 2; return [[a.x < b.x ? A.r : A.l, y], [a.x < b.x ? B.l : B.r, y]]; }
      return [borderToward(a, b.x, b.y), borderToward(b, a.x, a.y)];
    }
    var first = pts[0], last = pts[pts.length - 1];
    return [borderToward(a, first[0], first[1])].concat(pts, [borderToward(b, last[0], last[1])]);
  }
  function dOf(p) { return p.map(function (q, i) { return (i ? "L" : "M") + q[0].toFixed(1) + "," + q[1].toFixed(1); }).join(" "); }
  function edgeCls(e) { return (e[PAGE] && e[PAGE].cls) || e.cls || "main"; }

  function drawScene() {
    root.setAttribute("viewBox", "0 0 " + AF.W + " " + AF.H);
    AF.zones.forEach(function (z) {
      var col = z.color;
      if (z.pts) { svg("polygon", { points: z.pts.map(function (p) { return p.join(","); }).join(" "), "class": "zone", fill: "rgba(255,255,255,.028)", stroke: col, "stroke-opacity": .35, rx: 16 }, gZones); }
      else { svg("rect", { x: z.x, y: z.y, width: z.w, height: z.h, rx: 16, "class": "zone", fill: "rgba(255,255,255,.028)", stroke: col, "stroke-opacity": .35 }, gZones); }
      var t = svg("text", { x: z.tx, y: z.ty, "class": "zone-title", fill: col }, gZones); t.textContent = z.title;
      if (z.sub) { var s = svg("text", { x: z.tx, y: z.ty + 17, "class": "zone-sub" }, gZones); s.textContent = z.sub; }
    });
    AF.groups.forEach(function (g) {
      if (g.pages && g.pages.indexOf(PAGE) < 0) { return; }
      svg("rect", { x: g.x, y: g.y, width: g.w, height: g.h, rx: 12, "class": "group-box" }, gGroups);
      var t = svg("text", { x: g.x + 12, y: g.y + 16, "class": "group-title" }, gGroups); t.textContent = (g.titles && g.titles[PAGE]) || g.title;
    });
    // edges (and their arrowheads)
    Object.keys(EDGES).forEach(function (id) {
      var e = EDGES[id], p = routeOf(e); ROUTES[id] = p;
      var cls = edgeCls(e);
      var path = svg("path", { d: dOf(p), "class": "edge " + cls, id: "edge-" + id, "marker-end": "url(#arr-" + cls + ")" }, gEdges);
      if (e.both) { path.setAttribute("marker-start", "url(#arr-" + cls + ")"); }
      if (e.label) {
        var lp = e.lp || midPoint(p);
        var t = svg("text", { x: lp[0], y: lp[1], "class": "edge-label", "text-anchor": e.la || "middle" }, gEdges); t.textContent = e.label;
      }
    });
    Object.keys(NODES).forEach(function (id) { drawNode(NODES[id]); });
  }
  function midPoint(p) {
    var L = 0, seg = []; for (var i = 1; i < p.length; i++) { var d = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); seg.push(d); L += d; }
    var h = L / 2; for (var j = 0; j < seg.length; j++) { if (h <= seg[j]) { var k = h / seg[j]; return [p[j][0] + (p[j + 1][0] - p[j][0]) * k, p[j][1] + (p[j + 1][1] - p[j][1]) * k - 5]; } h -= seg[j]; }
    return p[0];
  }

  var ICONS = {
    key: "M8 14a4 4 0 1 1 3.5-6H22v4h-3v3h-3v-3h-4.5A4 4 0 0 1 8 14z M7 10h.01",
    person: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21c0-4 4-6 8-6s8 2 8 6",
    alien: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21c0-4 4-6 8-6s8 2 8 6 M17 3l4 4 M21 3l-4 4",
    badge: "M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z M9 12l2 2 4-4",
    shield: "M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z",
    shieldx: "M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z M9.5 9.5l5 5 M14.5 9.5l-5 5",
    box: "M3 7l9-4 9 4-9 4-9-4z M3 7v10l9 4 9-4V7 M12 11v10",
    window: "M3 5h18v14H3z M3 9h18 M6 7h.01 M9 7h.01",
    funnel: "M3 5h18l-7 8v6l-4 2v-8L3 5z",
    doc: "M6 2h8l5 5v15H6z M14 2v5h5 M9 13h7 M9 17h7",
    coin: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M9 9h4.5a2 2 0 0 1 0 4H10a2 2 0 0 0 0 4h5 M12 6v2 M12 17v1",
    gear: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19 12l2-1-1-3-2 .3-1.3-1.3.3-2-3-1-1 2h-2l-1-2-3 1 .3 2L6 7.3 4 7l-1 3 2 1v2l-2 1 1 3 2-.3 1.3 1.3-.3 2 3 1 1-2h2l1 2 3-1-.3-2 1.3-1.3 2 .3 1-3-2-1z",
    arrows: "M4 8h14 M14 4l4 4-4 4 M20 16H6 M10 12l-4 4 4 4",
    idcard: "M3 5h18v14H3z M8 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M5 16c.5-2 1.7-3 3-3s2.5 1 3 3 M14 9h4 M14 13h4",
    braces: "M8 3c-2 0-3 1-3 3v3c0 1.5-1 3-2 3 1 0 2 1.5 2 3v3c0 2 1 3 3 3 M16 3c2 0 3 1 3 3v3c0 1.5 1 3 2 3-1 0-2 1.5-2 3v3c0 2-1 3-3 3",
    chat: "M4 4h16v12H8l-4 4V4z M8 9h8 M8 12h5",
    clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v5l3 2",
    disk: "M5 3h11l3 3v15H5z M8 3v6h8V3 M8 21v-7h8v7",
    cloud: "M7 18h10a4 4 0 0 0 .7-7.9A6 6 0 0 0 6.2 9.6 4.2 4.2 0 0 0 7 18z",
    db: "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3z M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6 M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
    graph: "M5 19V9 M10 19V5 M15 19v-7 M20 19v-4",
    lock: "M6 11h12v10H6z M8 11V7a4 4 0 0 1 8 0v4",
    door: "M6 21V3h11v18 M3 21h18 M14 12h.01"
  };

  function drawNode(n) {
    var state = nState(n), v = nv(n);
    var g = svg("g", { "class": "node " + state + (n.actor ? " actor" : ""), "data-id": n.id, transform: "translate(" + (n.x - n.w / 2) + " " + (n.y - n.h / 2) + ")" }, gNodes);
    g.style.setProperty("--c", n.color);
    svg("rect", { "class": "box", width: n.w, height: n.h, rx: 10 }, g);
    var cx = 22, cy = n.h / 2;
    svg("circle", { "class": "ico-bg", cx: cx, cy: cy, r: 15 }, g);
    var ic = svg("g", { transform: "translate(" + (cx - 9) + " " + (cy - 9) + ") scale(.75)" }, g);
    svg("path", { d: ICONS[v.icon || n.icon] || ICONS.box, "class": "ico" }, ic);
    var tx = 44, lines = [[nTitle(n), "title"], [nSub(n), "sub"], [nTec(n), "tec"]].filter(function (l) { return l[0]; });
    var lh = 16, y0 = n.h / 2 - (lines.length - 1) * lh / 2 + 4;
    lines.forEach(function (l, i) { var t = svg("text", { x: tx, y: y0 + i * lh, "class": l[1] + " near" }, g); t.textContent = l[0]; fitText(t, n.w - tx - 10); });
    var ft = svg("text", { x: tx, y: n.h / 2, "class": "far-t" }, g); ft.textContent = nTitle(n);
    svg("circle", { "class": "pulse", cx: n.w / 2, cy: n.h / 2, r: Math.max(n.w, n.h) / 2, "transform-origin": (n.w / 2) + " " + (n.h / 2) }, g);
    // marks: a number (a defect, a trap) or a pill (a pattern, a story step), and a word for gone or unused components
    if (v.mark != null) {
      if (typeof v.mark === "number") { var b = svg("g", { "class": "badge-num", transform: "translate(" + (n.w - 2) + " 2)" }, g); svg("circle", { r: 11 }, b); var bt = svg("text", {}, b); bt.textContent = v.mark; }
      else { var s = String(v.mark), w = s.length * 6.4 + 12, p = svg("g", { "class": "badge-story", transform: "translate(" + (n.w - w - 6) + " -9)" }, g); svg("rect", { width: w, height: 17, rx: 8.5 }, p); var pt = svg("text", { x: w / 2, y: 8.5 }, p); pt.textContent = s; }
    }
    if (v.word) {
      var col = state === "ghost" ? "#94a3b8" : state === "new" ? "#34d399" : state === "defect" ? "#f87171" : "#94a3b8";
      var ww = v.word.length * 6.6 + 12, tg = svg("g", { "class": "badge-tag", transform: "translate(" + (v.mark != null ? 10 : n.w - ww - 6) + " -9)" }, g);
      svg("rect", { width: ww, height: 17, rx: 4, fill: "#0b1020", stroke: col }, tg); var tt = svg("text", { x: ww / 2, y: 8.5, fill: col }, tg); tt.textContent = v.word;
    }
    // the tokens this component holds on this page
    var holds = nHolds(n);
    if (holds.length) {
      var hg = svg("g", { "class": "holds", transform: "translate(" + (n.w - 12) + " " + (n.h + 1) + ")" }, g);
      holds.slice().reverse().forEach(function (tid, i) {
        var t = TOKENS[tid]; if (!t) { return; }
        var c = svg("g", { transform: "translate(" + (-i * 21) + " 0)", "data-token": tid }, hg);
        svg("circle", { r: 9.5, fill: t.color }, c); var tl = svg("text", {}, c); tl.textContent = t.letter;
        var ti = svg("title", {}, c); ti.textContent = t.name + " — click for details";
        c.addEventListener("click", function (ev) { ev.stopPropagation(); showToken(tid); });
      });
    }
    g.addEventListener("click", function () { if (drag.moved) { return; } showNode(n.id); });
    g.addEventListener("contextmenu", function (ev) { ev.preventDefault(); openMenu(n.id, ev.clientX, ev.clientY); });
    g.addEventListener("mouseenter", function (ev) { tipOn(ev, "<b>" + esc(nTitle(n)) + "</b><br>" + esc(firstSentence(n.what)) + "<br><span style='color:var(--text3)'>Click: details · right-click: actions</span>"); });
    g.addEventListener("mousemove", tipMove);
    g.addEventListener("mouseleave", tipOff);
  }
  function layoutFar(g, n) {
    var t = g.querySelector(".far-t"); if (!t) { return; }
    var words = String(nTitle(n)).split(" "), max = n.w - 52, lines = [], cur = "";
    t.textContent = "";
    var probe = svg("tspan", {}, t);
    words.forEach(function (w) { var tryS = cur ? cur + " " + w : w; probe.textContent = tryS; if (probe.getComputedTextLength() > max && cur) { lines.push(cur); cur = w; } else { cur = tryS; } });
    if (cur) { lines.push(cur); }
    if (lines.length > 2) { lines = [lines[0], lines.slice(1).join(" ")]; }
    t.textContent = "";
    var lh = 25, y0 = n.h / 2 - (lines.length - 1) * lh / 2 + 8;
    var spans = lines.map(function (l, i) { var ts = svg("tspan", { x: 44, y: y0 + i * lh }, t); ts.textContent = l; return ts; });
    // a single long word (a class name) gets a smaller font rather than an ellipsis
    var widest = Math.max.apply(null, spans.map(function (ts) { return ts.getComputedTextLength(); }));
    if (widest > max) { t.style.fontSize = Math.max(12, Math.floor(22 * max / widest)) + "px"; }
    spans.forEach(function (ts) { fitText(ts, max); });
  }
  function fitText(t, max) { try { var s = t.textContent; while (t.getComputedTextLength() > max && s.length > 4) { s = s.slice(0, -2); t.textContent = s + "…"; } } catch (e) { /* not rendered yet */ } }
  function firstSentence(h) { var s = stripTags(h); var i = s.search(/[.:](\s|$)/); return i > 0 && i < 170 ? s.slice(0, i + 1) : s.slice(0, 170) + (s.length > 170 ? "…" : ""); }
  function nodeEl(id) { return gNodes.querySelector(".node[data-id='" + id + "']"); }

  // =====================================================================================================
  // Camera: viewBox, pan, zoom, fit, follow
  // =====================================================================================================
  var camAnim = null;
  function setVB(v) { st.vb = v; root.setAttribute("viewBox", v.x + " " + v.y + " " + v.w + " " + v.h); placeBubble(); farCheck(); }
  // the overview: when the scene is small on screen, only big titles are drawn (details come back on zoom)
  function farCheck() { var r = root.getBoundingClientRect(); if (!r.width) { return; } var k = r.width / st.vb.w; root.classList.toggle("far", k < 0.62); }
  function aspect() { var r = root.getBoundingClientRect(); return r.width && r.height ? r.width / r.height : AF.W / AF.H; }
  function fitBox(x, y, w, h, pad) {
    pad = pad || 30; x -= pad; y -= pad; w += 2 * pad; h += 2 * pad;
    var a = aspect(); if (w / h > a) { var nh = w / a; y -= (nh - h) / 2; h = nh; } else { var nw = h * a; x -= (nw - w) / 2; w = nw; }
    return { x: x, y: y, w: w, h: h };
  }
  function animateVB(to, ms) {
    if (camAnim) { cancelAnimationFrame(camAnim); }
    var from = st.vb, t0 = performance.now(); ms = ms || 600;
    function step(t) { var k = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - k, 3);
      setVB({ x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e, w: from.w + (to.w - from.w) * e, h: from.h + (to.h - from.h) * e });
      if (k < 1) { camAnim = requestAnimationFrame(step); } else { camAnim = null; } }
    camAnim = requestAnimationFrame(step);
  }
  // keep a view inside the scene where it can be (no empty half-screens)
  function clampVB(v) {
    var M = 20, o = { x: v.x, y: v.y, w: v.w, h: v.h };
    if (o.w >= AF.W + 2 * M) { o.x = (AF.W - o.w) / 2; } else { o.x = Math.max(-M, Math.min(AF.W + M - o.w, o.x)); }
    if (o.h >= AF.H + 2 * M) { o.y = (AF.H - o.h) / 2; } else { o.y = Math.max(-M, Math.min(AF.H + M - o.h, o.y)); }
    return o;
  }
  function fitAll(anim) { var v = fitBox(0, 0, AF.W, AF.H, 0); if (anim) { animateVB(v); } else { setVB(v); } }
  function focusOn(ids) {
    var xs = [], ys = []; ids.forEach(function (id) { var n = NODES[id]; if (!n) { return; } var R = rectOf(n); xs.push(R.l, R.r); ys.push(R.t, R.b); });
    if (!xs.length) { return; }
    var x = Math.min.apply(null, xs), y = Math.min.apply(null, ys), w = Math.max.apply(null, xs) - x, h = Math.max.apply(null, ys) - y;
    var minW = 1250; if (w < minW) { x -= (minW - w) / 2; w = minW; }
    var minH = 700; if (h < minH) { y -= (minH - h) / 2; h = minH; }
    var v = st.vb, target = fitBox(x, y, w, h, 60);
    // far off the comfortable zoom (the overview, or zoomed right in): go to it
    if (v.w > target.w * 1.3 || v.w < target.w * 0.75) { animateVB(clampVB(target), 750); return; }
    // otherwise keep the zoom, and pan only if the stop isn't comfortably inside the view
    var m = .1, inside = x >= v.x + v.w * m && x + w <= v.x + v.w * (1 - m) && y >= v.y + v.h * m && y + h <= v.y + v.h * (1 - m);
    if (inside) { return; }
    var cx = x + w / 2, cy = y + h / 2;
    animateVB(clampVB({ x: cx - v.w / 2, y: cy - v.h / 2, w: v.w, h: v.h }), 700);
  }
  var drag = { on: false, moved: false };
  root.addEventListener("mousedown", function (e) { if (e.button !== 0) { return; } drag = { on: true, moved: false, x: e.clientX, y: e.clientY, vb: st.vb }; });
  window.addEventListener("mousemove", function (e) {
    if (!drag.on) { return; }
    var dx = e.clientX - drag.x, dy = e.clientY - drag.y; if (Math.abs(dx) + Math.abs(dy) > 4) { drag.moved = true; root.classList.add("dragging"); }
    if (!drag.moved) { return; }
    var r = root.getBoundingClientRect(), s = drag.vb.w / r.width;
    setVB({ x: drag.vb.x - dx * s, y: drag.vb.y - dy * s, w: drag.vb.w, h: drag.vb.h });
  });
  window.addEventListener("mouseup", function () { if (drag.on) { setTimeout(function () { drag.moved = false; }, 0); } drag.on = false; root.classList.remove("dragging"); });
  root.addEventListener("wheel", function (e) { e.preventDefault(); zoomAt(e.deltaY < 0 ? 1 / 1.15 : 1.15, e.clientX, e.clientY); }, { passive: false });
  function zoomAt(f, cx, cy) {
    var r = root.getBoundingClientRect(), v = st.vb;
    if (cx == null) { cx = r.left + r.width / 2; cy = r.top + r.height / 2; }
    var px = v.x + (cx - r.left) / r.width * v.w, py = v.y + (cy - r.top) / r.height * v.h;
    var w = Math.max(500, Math.min(AF.W * 2, v.w * f)), h = w / aspect();
    setVB({ x: px - (px - v.x) * (w / v.w), y: py - (py - v.y) * (h / v.h), w: w, h: h });
  }
  $("z-in").onclick = function () { zoomAt(1 / 1.25); };
  $("z-out").onclick = function () { zoomAt(1.25); };
  $("z-fit").onclick = function () { fitAll(true); };
  $("z-follow").onclick = function () { st.follow = !st.follow; this.textContent = "Follow: " + (st.follow ? "on" : "off"); };
  window.addEventListener("resize", function () { var v = st.vb, a = aspect(); setVB({ x: v.x, y: v.y, w: v.w, h: v.w / a }); });

  // =====================================================================================================
  // The dot: what travels, and what it carries
  // =====================================================================================================
  var dotBody = dot.querySelector(".body"), dotHalo = dot.querySelector(".halo"), dotLabel = dot.querySelector(".label");
  function carryList(c) { return c == null ? [] : Array.isArray(c) ? c : [c]; }
  function setDot(x, y, carry) {
    dot.classList.remove("hidden");
    if (x != null) { dot.setAttribute("transform", "translate(" + x + " " + y + ")"); }
    if (carry !== undefined) {
      var list = carryList(carry), t = list.length ? TOKENS[list[0]] : null, col = t ? t.color : "#fde68a";
      var label = list.length ? list.map(function (id) { return TOKENS[id] ? TOKENS[id].letter : "?"; }).join("") : "";
      var r = label.length > 1 ? 9 + label.length * 3.4 : 11;
      dotBody.setAttribute("r", r); dotHalo.setAttribute("r", r + 7);
      dotBody.setAttribute("fill", col); dotHalo.setAttribute("fill", col);
      dotLabel.textContent = label || "•";
    }
  }
  function hideDot() { if (st.anim) { cancelAnimationFrame(st.anim); st.anim = null; } dot.classList.add("hidden"); hideBubble(); }
  function dotXY() { var m = /translate\(([-\d.]+) ([-\d.]+)\)/.exec(dot.getAttribute("transform") || ""); return m ? [+m[1], +m[2]] : null; }
  // find the page's edge between two nodes, in either direction
  function edgeBetween(a, b) {
    for (var id in EDGES) { var e = EDGES[id]; if (e.from === a && e.to === b) { return { id: id, pts: ROUTES[id] }; } }
    for (var id2 in EDGES) { var e2 = EDGES[id2]; if (e2.from === b && e2.to === a) { return { id: id2, pts: ROUTES[id2].slice().reverse() }; } }
    return null;
  }
  function routeFor(j, i) {
    var p = j.steps[i], prev = p.from || (i > 0 ? j.steps[i - 1].at : null);
    if (!prev) { return { legs: [], start: p.at }; }
    var chain = [prev].concat(p.via || [], [p.at]), legs = [];
    for (var k = 1; k < chain.length; k++) {
      if (chain[k - 1] === chain[k]) { continue; }
      var e = edgeBetween(chain[k - 1], chain[k]);
      legs.push(e ? { id: e.id, pts: e.pts, to: chain[k] } : { jump: true, to: chain[k] });
    }
    return { legs: legs, start: prev };
  }
  function moveAlong(pts, ms, done) {
    var path = svg("path", { d: dOf(pts), fill: "none", stroke: "none", "class": "mover" }, world), L = path.getTotalLength(), t0 = performance.now();
    function step(t) {
      var k = Math.min(1, (t - t0) / ms), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2, q = path.getPointAtLength(L * e);
      setDot(q.x, q.y); placeBubble();
      if (k < 1) { st.anim = requestAnimationFrame(step); } else { st.anim = null; path.remove(); done(); }
    }
    st.anim = requestAnimationFrame(step);
  }
  function pulse(id) { var el = nodeEl(id); if (!el) { return; } var c = el.querySelector(".pulse"); c.classList.remove("go"); void c.getBoundingClientRect(); c.classList.add("go"); }

  // =====================================================================================================
  // Journeys
  // =====================================================================================================
  function clearEdgeMarks() { gEdges.querySelectorAll(".edge").forEach(function (p) { p.classList.remove("active", "walked"); var c = p.getAttribute("class").split(" ").filter(function (x) { return x !== "edge"; })[0]; p.setAttribute("marker-end", "url(#arr-" + c + ")"); }); }
  function markEdge(id, cls) { var p = $("edge-" + id); if (!p) { return; } p.classList.remove("active", "walked"); p.classList.add(cls); p.setAttribute("marker-end", "url(#arr-dot)"); }
  function setActiveNode(id) { gNodes.querySelectorAll(".node").forEach(function (g) { g.classList.toggle("active", g.getAttribute("data-id") === id); }); }
  function clearVerdict() { gMarks.innerHTML = ""; }
  function showVerdict(p) {
    clearVerdict(); if (!p.verdict) { return; }
    var n = NODES[p.at], v = p.verdict, w = String(v.text).length * 9.5 + 24;
    var g = svg("g", { "class": "verdict " + (v.tone || "warn"), transform: "translate(" + (n.x + n.w / 2 - w / 2) + " " + (n.y - n.h / 2 - 36) + ")" }, gMarks);
    svg("rect", { width: w, height: 28, rx: 7 }, g); var t = svg("text", { x: w / 2, y: 14 }, g); t.textContent = v.text;
  }
  function pickJourney(idx, stepIdx) {
    pause(); tokenHighlight(null);
    st.j = JOURNEYS[idx]; st.s = -1;
    clearEdgeMarks(); drawJourneyList();
    goStep(stepIdx || 0, { still: true });
  }
  function goStep(i, opt) {
    opt = opt || {};
    var j = st.j; if (!j) { return; }
    if (i < 0 || i >= j.steps.length) { return; }
    var gen = stopMoving();
    var back = i < st.s, prevS = st.s;
    st.s = i;
    var p = j.steps[i];
    // mark the walked edges up to this stop, the current legs as active
    clearEdgeMarks();
    for (var k = 1; k <= i; k++) { routeFor(j, k).legs.forEach(function (l) { if (l.id) { markEdge(l.id, k === i ? "active" : "walked"); } }); }
    setActiveNode(p.at); showVerdict(p); drawFooter(); showStepPanel(); setHash();
    var r = routeFor(j, i);
    if (st.follow) { var ids = [p.at]; if (r.start) { ids.push(r.start); } (p.via || []).forEach(function (x) { ids.push(x); }); focusOn(ids); }
    var carry = p.carry || null;   // a stop that names nothing carries nothing
    var arrive = function (keep) { var n = NODES[p.at]; if (keep) { setDot(null, null, carry); } else { setDot(n.x, n.y - n.h / 2 - 2, carry); } pulse(p.at); showBubble(p); if (st.playing) { schedule(); } };
    if (opt.still || back || !r.legs.length || Math.abs(i - prevS) > 1) { hideBubble(); arrive(false); return; }
    hideBubble();
    var s0 = NODES[r.start]; if (!dotXY()) { setDot(s0.x, s0.y, carry); }
    setDot(null, null, carry);
    var legs = r.legs.slice(), ms = { slow: 1700, normal: 1150, fast: 650 }[$("speed").value] || 1150;
    (function next() {
      if (gen !== st.gen) { return; }
      if (!legs.length) { arrive(true); return; }
      var l = legs.shift();
      if (l.jump) { var n = NODES[l.to]; dot.style.opacity = 0; setTimeout(function () { if (gen !== st.gen) { return; } setDot(n.x, n.y - n.h / 2 - 2); dot.style.opacity = 1; setTimeout(next, 250); }, 300); return; }
      moveAlong(l.pts, Math.max(500, ms / Math.max(1, r.legs.length * .7)), next);
    })();
  }
  // stop any movement in flight; returns the new generation
  function stopMoving() {
    if (st.anim) { cancelAnimationFrame(st.anim); st.anim = null; }
    world.querySelectorAll("path.mover").forEach(function (x) { x.remove(); });
    dot.style.opacity = 1;
    return ++st.gen;
  }
  // Start over: everything as it was when the page opened
  function resetAll() {
    pause(); stopMoving();
    st.j = null; st.s = -1; st.sel = null;
    tokenHighlight(null); clearEdgeMarks(); clearVerdict(); hideDot(); dot.removeAttribute("transform");
    gNodes.querySelectorAll(".node").forEach(function (g) { g.classList.remove("active", "sel"); });
    closeMenu(); closeModal(); tipOff();
    $("speed").value = "normal";
    st.follow = false; $("z-follow").textContent = "Follow: off";
    document.body.classList.add("show-tokens", "show-marks"); $("b-holds").classList.add("on"); $("b-marks").classList.add("on");
    drawJourneyList(); drawFooter(); showHome(); setHash(""); fitAll(true);
  }
  function schedule() { clearTimeout(st.timer); var secs = { slow: 8, normal: 5, fast: 2.8 }[$("speed").value] || 5; st.timer = setTimeout(function () { if (!st.playing) { return; } if (st.s >= st.j.steps.length - 1) { pause(); return; } goStep(st.s + 1); }, secs * 1000); }
  function play() { if (!st.j) { pickJourney(0); } st.playing = true; $("b-play").textContent = "⏸ Pause"; if (st.s >= st.j.steps.length - 1) { goStep(0, { still: true }); } schedule(); }
  function pause() { st.playing = false; clearTimeout(st.timer); $("b-play").textContent = "▶ Play"; }
  $("b-play").onclick = function () { if (st.playing) { pause(); } else { play(); } };
  $("b-next").onclick = function () { pause(); if (st.j) { goStep(st.s + 1); } else { pickJourney(0); } };
  $("b-prev").onclick = function () { pause(); if (st.j) { goStep(st.s - 1); } };
  $("b-first").onclick = function () { pause(); if (st.j) { goStep(0, { still: true }); } };
  dot.querySelector(".body").addEventListener("click", function (e) { e.stopPropagation(); advanceFromDot(); });
  function advanceFromDot() { if (!st.j) { return; } pause(); if (st.s < st.j.steps.length - 1) { goStep(st.s + 1); } else { showBubble({ say: "End of <b>" + esc(st.j.name) + "</b>. Pick another journey on the left, or start again with ⏮.", end: true }); } }

  function drawJourneyList() {
    var box = $("journey-list"), last = null; box.innerHTML = "";
    JOURNEYS.forEach(function (j, i) {
      if (j.phase && j.phase !== last) { var hd = document.createElement("div"); hd.className = "phase"; hd.textContent = j.phase; box.appendChild(hd); last = j.phase; }
      var b = document.createElement("button");
      b.className = "journey" + (st.j === j ? " on" : "") + (j.tone ? " " + j.tone : "");
      b.innerHTML = "<span class='letter'>" + esc(j.letter) + "</span><span class='name'>" + esc(j.name) + "<span class='stops'>" + j.steps.length + " stops" + (j.tagline ? " · " + esc(j.tagline) : "") + "</span></span>";
      b.onclick = function () { pickJourney(i); };
      box.appendChild(b);
    });
  }
  function drawFooter() {
    var j = st.j, prog = $("progress");
    if (!j) { $("f-where").textContent = "No journey yet"; $("f-say").innerHTML = "Pick a journey on the left, or click any component of the scene."; prog.innerHTML = ""; return; }
    var p = j.steps[st.s], n = NODES[p.at];
    $("f-where").textContent = j.name + " · stop " + (st.s + 1) + " of " + j.steps.length + " · " + stripTags(nTitle(n));
    $("f-say").innerHTML = p.say;
    prog.innerHTML = "";
    j.steps.forEach(function (q, i) {
      var b = document.createElement("i"); b.className = (i < st.s ? "done" : i === st.s ? "now" : "") + (q.verdict ? " " + (q.verdict.tone || "") : "");
      b.title = (i + 1) + ". " + stripTags(nTitle(NODES[q.at])); b.onclick = function () { pause(); goStep(i, { still: true }); }; prog.appendChild(b);
    });
    $("b-prev").disabled = st.s <= 0; $("b-next").disabled = st.s >= j.steps.length - 1;
  }

  // =====================================================================================================
  // Bubble
  // =====================================================================================================
  var bubble = $("bubble"), bubbleText = bubble.querySelector(".text");
  function carryChips(c) { return carryList(c).map(function (id) { return tchip(id); }).join(""); }
  function showBubble(p) {
    var foot = p.end ? "" : (st.s < st.j.steps.length - 1 ? "Click the dot or press → for the next stop" : "Last stop of this journey");
    var carry = carryList(p.carry).length ? "<span class='carry'>" + carryChips(p.carry) + "</span>" : "";
    bubbleText.innerHTML = p.say + carry + (foot ? "<span class='foot'>" + foot + "</span>" : "");
    bindChips(bubbleText);
    bubble.classList.remove("hidden"); placeBubble();
  }
  function hideBubble() { bubble.classList.add("hidden"); }
  function placeBubble() {
    if (bubble.classList.contains("hidden") || dot.classList.contains("hidden")) { return; }
    var r = dot.getBoundingClientRect(), c = $("canvas").getBoundingClientRect(); if (!r.width) { return; }
    var bw = bubble.offsetWidth, bh = bubble.offsetHeight, G = 12, T = 56, B = c.height - 46;
    // keep clear of the dot and of the component it stops at: above it, else below, else beside
    var box = { l: r.left - c.left, r: r.right - c.left, t: r.top - c.top, b: r.bottom - c.top };
    var el = st.j && st.s >= 0 && !st.anim ? nodeEl(st.j.steps[st.s].at) : null;
    [el ? el.querySelector(".box") : null, el ? gMarks.querySelector(".verdict") : null].forEach(function (x) { if (!x) { return; } var q = x.getBoundingClientRect(); box = { l: Math.min(box.l, q.left - c.left), r: Math.max(box.r, q.right - c.left), t: Math.min(box.t, q.top - c.top), b: Math.max(box.b, q.bottom - c.top) }; });
    var cx = Math.max(8, Math.min(c.width - bw - 8, (r.left + r.right) / 2 - c.left - bw / 2));
    var cands = [[cx, box.t - bh - G], [cx, box.b + G], [box.r + G, Math.max(T, Math.min(B - bh, box.t))], [box.l - bw - G, Math.max(T, Math.min(B - bh, box.t))]];
    var pick = cands.filter(function (p) { return p[0] >= 8 && p[0] + bw <= c.width - 8 && p[1] >= T && p[1] + bh <= B; })[0] || [cx, Math.max(T, Math.min(B - bh, box.t - bh - G))];
    bubble.style.left = pick[0] + "px"; bubble.style.top = pick[1] + "px";
  }
  bubble.addEventListener("click", function (e) { if (e.target.closest(".tchip")) { return; } hideBubble(); });

  // =====================================================================================================
  // Panel
  // =====================================================================================================
  var stack = [];
  function panel(title, html, keep) { if (!keep) { stack = []; } else { stack.push([$("p-title").textContent, $("p-body").innerHTML]); } $("p-title").textContent = title; $("p-body").innerHTML = html; $("p-body").scrollTop = 0; bindPanel(); $("p-back").disabled = !stack.length; }
  $("p-back").onclick = function () { var s = stack.pop(); if (s) { $("p-title").textContent = s[0]; $("p-body").innerHTML = s[1]; bindPanel(); } $("p-back").disabled = !stack.length; };
  $("p-journey").onclick = function () { if (st.j) { showStepPanel(); } else { showHome(); } };
  function tag(ev) { if (!ev) { return ""; } var map = Object.assign({ proven: "proven", inferred: "inferred", assumed: "assumed", open: "open", target: "target", unchanged: "unchanged", defect: "defect" }, AF.meta.tagClasses || {}); var k = String(ev).split(/[ ,:]/)[0].toLowerCase(); return "<span class='tag " + (map[k] || "assumed") + "'>" + esc(ev) + "</span>"; }
  function tchip(id) { var t = TOKENS[id]; if (!t) { return ""; } return "<span class='tchip' data-token='" + id + "'><i style='background:" + t.color + "'>" + esc(t.letter) + "</i>" + esc(t.short || t.name) + "</span>"; }
  function stateTag(n) {
    var s = nState(n), v = nv(n);
    if (s === "defect") { return "<span class='tag defect'>defect " + (v.mark || "") + "</span>"; }
    if (s === "ghost") { return "<span class='tag unchanged'>deleted</span>"; }
    if (s === "unused") { return "<span class='tag unchanged'>not used</span>"; }
    if (s === "new") { return "<span class='tag target'>new or changed</span>"; }
    return PAGE === AFTER ? "<span class='tag unchanged'>unchanged</span>" : "";
  }
  function stepButtons(j) { return "<div class='steps'>" + j.steps.map(function (q, i) { return "<button class='" + (i === st.s ? "on" : i < st.s ? "done" : "") + "' data-step='" + i + "'>" + (i + 1) + " " + esc(nShort(NODES[q.at])) + "</button>"; }).join("") + "</div>"; }
  function showStepPanel() {
    var j = st.j, p = j.steps[st.s], n = NODES[p.at];
    var h = "<div class='h2'>" + esc(nTitle(n)) + " " + (p.ev ? tag(p.ev) : "") + "</div>" + stepButtons(j);
    if (st.s === 0 && j.intro) { h += "<div class='plain'>" + j.intro + "</div>"; }
    h += "<p class='p'>" + p.say + "</p>";
    if (carryList(p.carry).length) { h += "<div class='h3'>What the dot carries</div><p class='p'>" + carryChips(p.carry) + "</p>"; }
    if (p.body) { h += p.body; }
    if (p.http) { h += httpCard(p.http); }
    if (p.jwt) { h += jwtCard(p.jwt); }
    if (p.compare) { h += "<div class='compare'>" + p.compare + "</div>"; }
    if (p.src) { h += "<p class='src'>Source: " + p.src + "</p>"; }
    h += "<div class='h3'>This component</div><ul class='actions'><li><button data-node='" + p.at + "'>About " + esc(nTitle(n)) + "<span class='k'>what it is, what it holds</span></button></li></ul>";
    panel("Stop " + (st.s + 1) + " · " + stripTags(nTitle(n)), h);
  }
  function httpCard(x) {
    var head = x.title || (x.dir === "res" ? "Response" : "Request");
    return "<div class='card'><div class='hd'><b>" + esc(head) + "</b><span style='margin-left:auto'>illustrative · no real values</span></div><pre>" + x.text + "</pre></div>";
  }
  function jwtCard(x) {
    var t = TOKENS[x.token], head = (t ? t.name : W.one) + (x.head ? " · " + x.head : " · an excerpt");
    return "<div class='card'><div class='hd'>" + (t ? tchip(x.token) : "") + "<b>" + esc(head) + "</b><span style='margin-left:auto'>illustrative</span></div><pre>" + x.text + "</pre></div>" + (x.note ? "<p class='p soft'>" + x.note + "</p>" : "");
  }
  function showNode(id) {
    var n = NODES[id]; if (!n) { return; }
    tokenHighlight(null); st.sel = id;
    gNodes.querySelectorAll(".node").forEach(function (g) { g.classList.toggle("sel", g.getAttribute("data-id") === id); });
    var v = nv(n), h = "<div class='h2'>" + esc(nTitle(n)) + " " + stateTag(n) + (v.mark && typeof v.mark !== "number" ? " <span class='tag story'>" + esc(v.mark) + "</span>" : "") + "</div>";
    h += "<p class='p soft'>" + esc(zoneName(n)) + (nSub(n) ? " · " + esc(nSub(n)) : "") + "</p>";
    h += "<div class='h3'>What it is</div><p class='p'>" + n.what + "</p>";
    var note = (n.notes || {})[PAGE];
    if (note) { h += "<div class='h3'>" + esc(L(PAGE)) + " " + (v.ev ? tag(v.ev) : "") + "</div><div class='" + (nState(n) === "defect" ? "note-bad" : nState(n) === "new" ? "note-good" : "plain") + "'>" + note + "</div>"; }
    if (n.why) { h += "<div class='h3'>Why it matters</div><p class='p'>" + n.why + "</p>"; }
    var holds = nHolds(n);
    h += "<div class='h3'>" + esc(W.held) + "</div>" + (holds.length ? "<p class='p'>" + holds.map(tchip).join(" ") + "</p>" : "<p class='p soft'>None.</p>");
    var visits = visitsOf(id);
    if (visits.length) { h += "<div class='h3'>Journeys that stop here</div><ul class='actions'>" + visits.map(function (x) { return "<li><button data-go='" + x.j + ":" + x.s + "'><b>" + esc(JOURNEYS[x.j].letter) + "</b> " + esc(JOURNEYS[x.j].name) + "<span class='k'>stop " + (x.s + 1) + "</span></button></li>"; }).join("") + "</ul>"; }
    var other = (n.notes || {})[OTHER];
    if (otherHas(id)) { h += "<div class='compare'><b>" + esc(L(OTHER)) + ":</b> " + (other ? other : "the same.") + " <a href='" + AF.meta.files[OTHER] + "#n=" + id + "'>See it on the other page →</a></div>"; }
    else { h += "<div class='compare'><b>" + esc(L(OTHER)) + ":</b> this component doesn't exist there.</div>"; }
    if (n.src) { h += "<p class='src'>Source: " + n.src + "</p>"; }
    panel(stripTags(nTitle(n)), h);
    setHash("n=" + id);
  }
  function zoneName(n) { var z = AF.zones.filter(function (x) { return x.id === n.zone; })[0]; return z ? z.title : ""; }
  function visitsOf(id) { var r = []; JOURNEYS.forEach(function (j, ji) { j.steps.forEach(function (p, si) { if (p.at === id) { r.push({ j: ji, s: si }); } }); }); var seen = {}; return r.filter(function (x) { if (seen[x.j]) { return false; } seen[x.j] = 1; return true; }); }
  function showHome() {
    var m = AF.meta[PAGE], h = m.intro;
    h += "<div class='h3'>Journeys</div><ul class='actions'>" + JOURNEYS.map(function (j, i) { return "<li><button data-pick='" + i + "'><b>" + esc(j.letter) + "</b> " + esc(j.name) + "<span class='k'>" + j.steps.length + " stops</span></button></li>"; }).join("") + "</ul>";
    h += "<div class='h3'>And</div><ul class='actions'><li><button data-open='tokens'>" + esc(W.all) + "</button></li><li><button data-open='legend'>What each colour and line means</button></li><li><button data-open='howto'>How to use this page</button></li></ul>";
    panel(m.panelTitle, h);
  }
  function tokenTrail(tid) {
    // edges the token travels on this page: every leg of every step that carries it
    var ids = {};
    JOURNEYS.forEach(function (j) { j.steps.forEach(function (p, i) { if (carryList(p.carry).indexOf(tid) >= 0) { routeFor(j, i).legs.forEach(function (l) { if (l.id) { ids[l.id] = 1; } }); } }); });
    return Object.keys(ids);
  }
  function tokenHighlight(tid) {
    st.hlToken = tid;
    gNodes.querySelectorAll(".node").forEach(function (g) { g.classList.remove("hl", "dim"); g.style.removeProperty("--hl"); });
    gEdges.querySelectorAll(".edge").forEach(function (p) { p.classList.remove("hl"); p.style.removeProperty("--hl"); });
    if (!tid) { return; }
    var t = TOKENS[tid], holders = Object.keys(NODES).filter(function (id) { return nHolds(NODES[id]).indexOf(tid) >= 0; });
    var trail = tokenTrail(tid), touched = {};
    trail.forEach(function (id) { var p = $("edge-" + id); if (p) { p.classList.add("hl"); p.style.setProperty("--hl", t.color); } touched[EDGES[id].from] = 1; touched[EDGES[id].to] = 1; });
    holders.forEach(function (id) { touched[id] = 1; });
    gNodes.querySelectorAll(".node").forEach(function (g) { var id = g.getAttribute("data-id"); if (holders.indexOf(id) >= 0) { g.classList.add("hl"); g.style.setProperty("--hl", t.color); } else if (!touched[id]) { g.classList.add("dim"); } });
  }
  function showToken(tid) {
    var t = TOKENS[tid]; if (!t) { return; }
    tokenHighlight(tid);
    var here = t[PAGE] || {}, there = t[OTHER] || {};
    var h = "<div class='h2'>" + tchip(tid) + " " + (here.status ? "<span class='tag " + (here.status === "gone" || here.status === "absent" ? "unchanged" : here.bad ? "defect" : here.isnew ? "target" : "proven") + "'>" + esc(here.status) + "</span>" : "") + "</div>";
    h += "<p class='p'>" + t.what + "</p>";
    if (here.text) { h += "<div class='" + (here.bad ? "note-bad" : here.isnew ? "note-good" : "plain") + "'>" + here.text + "</div>"; }
    var ROWS = AF.meta.thingRows || [["issuedBy", "Issued by"], ["audience", "Addressed to"], ["proves", "Proves"], ["heldBy", "Held by"], ["stored", "Stored"], ["lifetime", "Lives"], ["sentTo", "Sent to"], ["renewedBy", "Renewed by"]];
    var rows = ROWS.map(function (r) { return [r[1], here[r[0]] != null ? here[r[0]] : t[r[0]]]; }).filter(function (r) { return r[1]; });
    h += "<table class='t'>" + rows.map(function (r) { return "<tr><th>" + r[0] + "</th><td>" + r[1] + "</td></tr>"; }).join("") + "</table>";
    if (t.example) { h += jwtCard({ token: tid, text: t.example, note: t.exampleNote }); }
    var holders = Object.keys(NODES).filter(function (id) { return nHolds(NODES[id]).indexOf(tid) >= 0; });
    if (holders.length) { h += "<div class='h3'>On the scene, it sits in</div><ul class='actions'>" + holders.map(function (id) { return "<li><button data-node='" + id + "'>" + esc(nTitle(NODES[id])) + "<span class='k'>" + esc(zoneName(NODES[id])) + "</span></button></li>"; }).join("") + "</ul>"; }
    var journeys = []; JOURNEYS.forEach(function (j, ji) { var s = -1; j.steps.forEach(function (p, si) { if (s < 0 && carryList(p.carry).indexOf(tid) >= 0) { s = si; } }); if (s >= 0) { journeys.push({ j: ji, s: s }); } });
    if (journeys.length) { h += "<div class='h3'>Watch it travel</div><ul class='actions'>" + journeys.map(function (x) { return "<li><button data-go='" + x.j + ":" + x.s + "'><b>" + esc(JOURNEYS[x.j].letter) + "</b> " + esc(JOURNEYS[x.j].name) + "<span class='k'>from stop " + (x.s + 1) + "</span></button></li>"; }).join("") + "</ul>"; }
    if (there.text) { h += "<div class='compare'><b>" + esc(L(OTHER)) + ":</b> " + there.text + " <a href='" + AF.meta.files[OTHER] + "#t=" + tid + "'>See it on the other page →</a></div>"; }
    if (t.src) { h += "<p class='src'>Source: " + t.src + "</p>"; }
    h += "<p class='p soft'>The scene now highlights where it sits (outlined) and the lines it travels on this page. <a href='#' data-clearhl='1'>Clear the highlight</a>.</p>";
    panel(t.name, h, true);
    setHash("t=" + tid);
  }
  function showTokens() {
    var groups = [];
    AF.tokens.forEach(function (t) { var g = groups.filter(function (x) { return x.name === t.group; })[0]; if (!g) { g = { name: t.group, items: [] }; groups.push(g); } g.items.push(t); });
    var h = "<p class='p'>" + AF.meta[PAGE].tokensIntro + "</p>";
    groups.forEach(function (g) {
      h += "<div class='h3'>" + esc(g.name) + "</div><table class='t wide'><tr><th>" + esc(W.one.charAt(0).toUpperCase() + W.one.slice(1)) + "</th><th>From</th><th>" + esc(S(PAGE)) + "</th></tr>";
      g.items.forEach(function (t) { var here = t[PAGE] || {}; h += "<tr class='click' data-token='" + t.id + "'><td>" + tchip(t.id) + "</td><td>" + t.from + "</td><td>" + (here.status ? "<span class='tag " + (here.status === "gone" || here.status === "absent" ? "unchanged" : here.bad ? "defect" : here.isnew ? "target" : "proven") + "'>" + esc(here.status) + "</span>" : "") + "</td></tr>"; });
      h += "</table>";
    });
    h += "<p class='p soft'>Click a row: the scene outlines where that " + esc(W.one) + " sits and the lines it travels. On the scene, the coloured circles under each component are the " + esc(W.many) + " it holds (toggle them with <kbd>T</kbd>).</p>";
    panel(W.listTitle, h);
  }
  function bindChips(root2) { root2.querySelectorAll(".tchip[data-token]").forEach(function (c) { c.onclick = function (e) { e.stopPropagation(); showToken(c.getAttribute("data-token")); }; }); }
  function bindPanel() {
    var b = $("p-body");
    bindChips(b);
    b.querySelectorAll("[data-step]").forEach(function (x) { x.onclick = function () { pause(); goStep(+x.getAttribute("data-step"), { still: true }); }; });
    b.querySelectorAll("[data-node]").forEach(function (x) { x.onclick = function () { showNode(x.getAttribute("data-node")); }; });
    b.querySelectorAll("[data-go]").forEach(function (x) { x.onclick = function () { var a = x.getAttribute("data-go").split(":"); pickJourney(+a[0], +a[1]); }; });
    b.querySelectorAll("[data-pick]").forEach(function (x) { x.onclick = function () { pickJourney(+x.getAttribute("data-pick")); }; });
    b.querySelectorAll("[data-open]").forEach(function (x) { x.onclick = function () { var w = x.getAttribute("data-open"); if (w === "tokens") { showTokens(); } else { openModal(w); } }; });
    b.querySelectorAll("tr[data-token]").forEach(function (x) { x.onclick = function () { showToken(x.getAttribute("data-token")); }; });
    b.querySelectorAll("[data-clearhl]").forEach(function (x) { x.onclick = function (e) { e.preventDefault(); tokenHighlight(null); }; });
  }

  // =====================================================================================================
  // Context menu, tooltip, modal
  // =====================================================================================================
  var menu = $("menu");
  function openMenu(id, x, y) {
    var n = NODES[id], h = "<div class='hd'><div class='n'>" + esc(nTitle(n)) + "</div><div class='e'>" + esc(zoneName(n)) + "</div></div>";
    h += "<button data-m='about'>About this component<span class='k'>click</span></button>";
    nHolds(n).forEach(function (tid) { h += "<button data-m='token' data-a='" + tid + "'>" + esc(W.one.charAt(0).toUpperCase() + W.one.slice(1)) + ": " + esc(TOKENS[tid].name) + "</button>"; });
    var visits = visitsOf(id);
    if (visits.length) { h += "<div class='sepline'></div>"; visits.forEach(function (v) { h += "<button data-m='go' data-a='" + v.j + ":" + v.s + "'>▶ " + esc(JOURNEYS[v.j].name) + "<span class='k'>stop " + (v.s + 1) + "</span></button>"; }); }
    h += "<div class='sepline'></div>";
    h += otherHas(id) ? "<a href='" + AF.meta.files[OTHER] + "#n=" + id + "'>Same component: " + esc(L(OTHER).toLowerCase()) + " →</a>" : "<button disabled style='opacity:.5'>" + esc(L(OTHER)) + ": doesn't exist</button>";
    menu.innerHTML = h; menu.style.display = "block";
    var w = menu.offsetWidth, hh = menu.offsetHeight;
    menu.style.left = Math.min(x, window.innerWidth - w - 8) + "px"; menu.style.top = Math.min(y, window.innerHeight - hh - 8) + "px";
    menu.querySelectorAll("button[data-m]").forEach(function (b) { b.onclick = function () { var m = b.getAttribute("data-m"), a = b.getAttribute("data-a"); closeMenu(); if (m === "about") { showNode(id); } else if (m === "token") { showToken(a); } else if (m === "go") { var q = a.split(":"); pickJourney(+q[0], +q[1]); } }; });
    tipOff();
  }
  function closeMenu() { menu.style.display = "none"; }
  document.addEventListener("click", function (e) { if (!menu.contains(e.target)) { closeMenu(); } });
  var tip = $("tip");
  function tipOn(e, h) { tip.innerHTML = h; tip.style.display = "block"; tipMove(e); }
  function tipMove(e) { tip.style.left = Math.min(e.clientX + 14, window.innerWidth - tip.offsetWidth - 8) + "px"; tip.style.top = (e.clientY + 16) + "px"; }
  function tipOff() { tip.style.display = "none"; }
  function openModal(which) {
    var m = AF.meta, M = (m.modals || {})[which];
    var title = which === "legend" ? "What the colours and lines mean" : which === "howto" ? "How to use this page" : which === "transcript" ? "This journey, as text" : (M && M.title) || which;
    var html = which === "legend" ? legendHtml() : which === "howto" ? m.howto : which === "transcript" ? transcriptHtml() : (M && (typeof M.html === "function" ? M.html() : M.html)) || "";
    $("m-title").textContent = title; $("m-content").innerHTML = html; $("modal").classList.add("open");
    $("m-content").querySelectorAll(".tchip[data-token]").forEach(function (c) { c.onclick = function () { closeModal(); showToken(c.getAttribute("data-token")); }; });
    $("m-content").querySelectorAll("[data-pick]").forEach(function (x) { x.onclick = function () { closeModal(); pickJourney(+x.getAttribute("data-pick")); }; });
    $("m-content").querySelectorAll("[data-go]").forEach(function (x) { x.onclick = function () { closeModal(); var a = x.getAttribute("data-go").split(":"); pickJourney(+a[0], +a[1]); }; });
    $("m-content").querySelectorAll("[data-node]").forEach(function (x) { x.onclick = function () { closeModal(); showNode(x.getAttribute("data-node")); focusOn([x.getAttribute("data-node")]); }; });
    $("m-content").querySelectorAll("[data-copy]").forEach(function (b) { b.onclick = function () { var src = $(b.getAttribute("data-copy")); if (!src) { return; } var txt = src.tagName === "TEXTAREA" ? src.value : src.innerText; (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(function () { b.textContent = "Copied"; setTimeout(function () { b.textContent = "Copy"; }, 1500); }, function () { if (src.tagName === "TEXTAREA") { src.select(); } }); }; });
    $("m-content").querySelectorAll(".reveal > summary").forEach(function (x) { /* native details */ });
    $("m-content").querySelectorAll("[data-modal]").forEach(function (x) { x.onclick = function () { openModal(x.getAttribute("data-modal")); }; });
  }
  // the current journey (or all of them) as plain text: for a document, a slide, or reading without the scene
  function transcriptHtml() {
    var list = st.j ? [st.j] : JOURNEYS, h = "";
    if (!st.j) { h += "<p class='p soft'>No journey is selected, so this is every journey on the page. Pick one on the left to get only that one.</p>"; }
    var txt = list.map(function (j) {
      var lines = [j.letter + ". " + j.name + (j.tagline ? " (" + j.tagline + ")" : ""), ""];
      if (j.intro) { lines.push(stripTags(j.intro), ""); }
      j.steps.forEach(function (p, i) { lines.push((i + 1) + ". [" + stripTags(nTitle(NODES[p.at])) + "] " + stripTags(p.say) + (p.verdict ? "  → " + p.verdict.text : "")); });
      return lines.join("\n");
    }).join("\n\n");
    h += "<div class='codehead'><span>" + esc(list.length === 1 ? list[0].name : JOURNEYS.length + " journeys") + " · plain text</span><button class='btn' data-copy='m-transcript'>Copy</button></div>";
    h += "<textarea id='m-transcript' class='transcript' readonly>" + esc(txt) + "</textarea>";
    return h;
  }
  function closeModal() { $("modal").classList.remove("open"); }
  $("m-close").onclick = closeModal;
  $("modal").addEventListener("click", function (e) { if (e.target.id === "modal") { closeModal(); } });
  function legendHtml() {
    function box(stroke, fill, dash, extra) { return "<svg width='46' height='24'><rect x='2' y='3' width='42' height='18' rx='5' fill='" + fill + "' stroke='" + stroke + "' stroke-width='1.6'" + (dash ? " stroke-dasharray='" + dash + "'" : "") + "/>" + (extra || "") + "</svg>"; }
    function line(stroke, dash, w) { return "<svg width='46' height='24'><line x1='3' y1='12' x2='43' y2='12' stroke='" + stroke + "' stroke-width='" + (w || 1.8) + "'" + (dash ? " stroke-dasharray='" + dash + "'" : "") + "/></svg>"; }
    var G = AF.meta.legend || {}, states = G.states || {}, lines = G.lines || {};
    var h = "<div class='legend-grid'><div>";
    h += "<div class='h3'>Where it lives</div>";
    AF.zones.forEach(function (z) { h += "<div class='legend-row'>" + box(z.color, "rgba(255,255,255,.03)") + "<span><b>" + esc(z.title) + "</b> — " + esc(z.sub || "") + "</span></div>"; });
    h += "<div class='h3'>What a component's border says</div>";
    h += "<div class='legend-row'>" + box("#818cf8", "#111a33") + "<span>" + (states.normal || "as it should be") + "</span></div>";
    h += "<div class='legend-row'>" + box("#f87171", "rgba(127,29,29,.3)", null, "<circle cx='40' cy='5' r='5' fill='#450a0a' stroke='#f87171'/>") + "<span>" + (states.defect || "a problem, with its number") + "</span></div>";
    h += "<div class='legend-row'>" + box("#34d399", "rgba(6,78,59,.3)") + "<span>" + (states["new"] || "new or changed, with the mark that says by what") + "</span></div>";
    h += "<div class='legend-row'>" + box("#64748b", "transparent", "6 5") + "<span>" + (states.ghost || "gone (drawn so you can see what went)") + "</span></div>";
    h += "<div class='legend-row'>" + box("#64748b", "transparent", "3 4") + "<span>" + (states.unused || "exists, but nobody uses it on this page") + "</span></div>";
    h += "</div><div>";
    h += "<div class='h3'>Lines</div>";
    h += "<div class='legend-row'>" + line("#3b4a6b") + "<span>" + (lines.main || "something that happens") + "</span></div>";
    h += "<div class='legend-row'>" + line("rgba(163,174,201,.6)", "2 4") + "<span>" + (lines.sec || "reads, or stores") + "</span></div>";
    h += "<div class='legend-row'>" + line("#f87171", "7 5") + "<span>" + (lines.bad || "something that shouldn't happen") + "</span></div>";
    h += "<div class='legend-row'>" + line("#34d399") + "<span>" + (lines["new"] || "something new") + "</span></div>";
    h += "<div class='legend-row'>" + line("#fde68a", "8 6", 2.8) + "<span>the journey, right now (then solid: already walked)</span></div>";
    h += "<div class='h3'>The dot</div><p class='p'>" + (G.dot || "It is what travels. Its colour and letter say what it carries; the list is in the bubble under it.") + "</p>";
    h += "<div class='h3'>" + esc(W.Many) + "</div><p class='p'>" + AF.tokens.map(function (t) { return tchip(t.id); }).join(" ") + "</p>";
    if (G.tags) { h += "<div class='h3'>Evidence tags</div><p class='p'>" + G.tags + "</p>"; }
    h += "</div></div>";
    return h;
  }
  $("b-legend").onclick = function () { openModal("legend"); };
  $("b-howto").onclick = function () { openModal("howto"); };
  // the "Learn" menu: every extra window the page offers (declared in AF.meta.modals, in order)
  var learn = $("b-learn");
  if (learn) {
    learn.onclick = function (ev) {
      ev.stopPropagation();
      var keys = Object.keys(AF.meta.modals || {}), h = "<div class='hd'><div class='n'>Learn</div><div class='e'>windows that teach, not the scene</div></div>";
      h += "<button data-m='modal' data-a='transcript'>This journey as text<span class='k'>copy it</span></button>";
      keys.forEach(function (k) { h += "<button data-m='modal' data-a='" + k + "'>" + esc(AF.meta.modals[k].title) + (AF.meta.modals[k].k ? "<span class='k'>" + esc(AF.meta.modals[k].k) + "</span>" : "") + "</button>"; });
      menu.innerHTML = h; menu.style.display = "block";
      var r = learn.getBoundingClientRect(); menu.style.left = Math.min(r.left, window.innerWidth - menu.offsetWidth - 8) + "px"; menu.style.top = (r.bottom + 6) + "px";
      menu.querySelectorAll("button[data-m]").forEach(function (b) { b.onclick = function () { closeMenu(); openModal(b.getAttribute("data-a")); }; });
    };
  }
  $("b-reset").onclick = function () { resetAll(); };
  $("b-tokens").onclick = function () { showTokens(); };
  $("b-holds").onclick = function () { document.body.classList.toggle("show-tokens"); this.classList.toggle("on", document.body.classList.contains("show-tokens")); };
  $("b-marks").onclick = function () { document.body.classList.toggle("show-marks"); this.classList.toggle("on", document.body.classList.contains("show-marks")); };

  // =====================================================================================================
  // Links between the two pages (hash), keyboard, start
  // =====================================================================================================
  function setHash(h) {
    if (!h && st.j) { h = "j=" + st.j.id + "&s=" + (st.s + 1); }
    try { history.replaceState(null, "", h ? "#" + h : location.pathname); } catch (e) { /* file:// in some browsers */ }
    var a = $("other-link"), cp = st.j && st.j.counterpart ? "#j=" + st.j.counterpart : (h && /^n=|^t=/.test(h) ? "#" + h : "");
    a.href = AF.meta.files[OTHER] + cp;
    a.title = st.j && st.j.counterpart ? "Open the same journey on the other page" : "Open the other page";
  }
  function readHash() {
    var h = (location.hash || "").replace(/^#/, ""), q = {}; h.split("&").forEach(function (kv) { var p = kv.split("="); if (p[0]) { q[p[0]] = decodeURIComponent(p[1] || ""); } });
    if (q.j) { var ji = -1; JOURNEYS.forEach(function (j, i) { if (j.id === q.j) { ji = i; } }); if (ji >= 0) { pickJourney(ji, Math.max(0, (+q.s || 1) - 1)); return true; } }
    if (q.n && NODES[q.n]) { showNode(q.n); focusOn([q.n]); return true; }
    if (q.t && TOKENS[q.t]) { showToken(q.t); return true; }
    return false;
  }
  document.addEventListener("keydown", function (e) {
    if (e.target && /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) { return; }
    if (e.key === "ArrowRight") { e.preventDefault(); pause(); if (st.j) { goStep(st.s + 1); } else { pickJourney(0); } }
    else if (e.key === "ArrowLeft") { e.preventDefault(); pause(); if (st.j) { goStep(st.s - 1); } }
    else if (e.key === " ") { e.preventDefault(); if (st.playing) { pause(); } else { play(); } }
    else if (e.key === "Home") { pause(); if (st.j) { goStep(0, { still: true }); } }
    else if (e.key === "Escape") { closeMenu(); closeModal(); hideBubble(); tokenHighlight(null); }
    else if (e.key === "f" || e.key === "F") { fitAll(true); }
    else if (e.key === "t" || e.key === "T") { $("b-holds").click(); }
    else if (e.key === "m" || e.key === "M") { $("b-marks").click(); }
    else if ((e.key === "r" || e.key === "R") && !e.ctrlKey && !e.metaKey) { resetAll(); }
    else if (/^[1-9]$/.test(e.key) && JOURNEYS[+e.key - 1]) { pickJourney(+e.key - 1); }
  });

  document.body.classList.add(PAGE, "show-tokens", "show-marks");
  $("b-holds").classList.add("on"); $("b-marks").classList.add("on");
  drawScene(); drawJourneyList(); drawFooter();
  requestAnimationFrame(function () {
    gNodes.querySelectorAll("text.near").forEach(function (t) { var g = t.closest(".node"); if (!g) { return; } var n = NODES[g.getAttribute("data-id")]; fitText(t, n.w - 54); });
    gNodes.querySelectorAll(".node").forEach(function (g) { layoutFar(g, NODES[g.getAttribute("data-id")]); });
    fitAll(false);
    if (!readHash()) { showHome(); setHash(""); }
  });
  window.AF_DEBUG = { st: st, goStep: goStep, pickJourney: pickJourney, resetAll: resetAll, JOURNEYS: JOURNEYS, NODES: NODES, EDGES: EDGES, ROUTES: ROUTES, routeFor: routeFor };
})();
