// Projects database and details
const PROJECTS = [
  {
    id: "drims",
    title: "CitizenLink 2.0 (D.R.I.M.S.)",
    subtitle: "Thesis Project • Citizen Complaint Management & Analytics",
    badge: "Thesis / Web App",
    isLocal: true,
    description: "A complaint management system built for Local Government Units featuring Hybrid NLP classification and DBSCAN spatial heatmap clustering for complaint hotspot detection.",
    tech: ["NodeJS", "Express", "Supabase", "PostgreSQL", "DBSCAN", "ChartJS", "Leaflet"],
    github: "https://github.com/neko-san1432/D.R.I.M.S.",
    details: "CitizenLink 2.0 (developed under the project code D.R.I.M.S.) is an advanced Web platform designed to bridge citizens and LGU officers. It solves the complaint overflow problem by implementing a Hybrid Natural Language Processing (NLP) pipeline to automatically parse and route complaint categories. Additionally, it applies the Density-Based Spatial Clustering of Applications with Noise (DBSCAN) algorithm to coordinate complaints geospatially, mapping out hotspots so administrators can allocate public resources efficiently. The backend uses Express and PostgreSQL (hosted on Supabase) optimized with geospatial indexing."
  },
  {
    id: "colorgame",
    title: "3D Color Game Simulator",
    subtitle: "Local Project • Physics Simulation",
    badge: "Simulation / Three.js",
    isLocal: true,
    description: "A 3D simulation of the traditional Filipino carnival 'Perya' color game, calculating outcomes based on physics collision boundaries and face detection.",
    tech: ["Three.js", "Rapier3D", "TypeScript", "Vite", "Canvas"],
    github: "",
    details: "Inspired by the local Filipino 'Perya' color game, this simulation uses Three.js for visual rendering and Rapier3D for rigid-body physics. The simulator models the dynamic rolling of multiple colored cubes inside an active funnel. By measuring the physical face orientations relative to the global upward vector once the cubes come to rest, it determines and logs game outcomes. This allows for probabilistic analysis of the game's payout ratios over thousands of iterations."
  },
  {
    id: "predator",
    title: "Predator Bot (EA)",
    subtitle: "Quant Project • Algorithmic Trading Systems",
    badge: "Under Maintenance",
    isLocal: true,
    isMaintenance: true,
    description: "Algorithmic trading engine designed for MetaTrader 5 (MQL5) and TradingView (Pine Script). Feature set currently classified.",
    tech: ["MQL5", "Pine Script", "MetaTrader 5", "Python", "Backtesting"],
    github: "https://github.com/neko-san1432/predator-bot",
    details: "Predator Bot is an Expert Advisor (EA) suite developed for MetaTrader 5 and TradingView. It integrates quantitative models (volatility scalp models, compounding, trailing profit guards) to execute trades automatically across currency pairs. The project is currently undergoing maintenance and security review to optimize risk profiles and latency execution, so its structural telemetry remains offline."
  },
  {
    id: "criticart",
    title: "CritiCart",
    subtitle: "GitHub Project • E-Commerce Feedback Platform",
    badge: "Web App",
    isLocal: false,
    description: "A global review platform allowing users to aggregate, inspect, and critique products based on the specific online marketplaces they originate from.",
    tech: ["JavaScript", "HTML5", "CSS3", "Local API Integration"],
    github: "https://github.com/neko-san1432/CritiCart",
    details: "CritiCart provides a consumer advocacy portal where users rate and review specific online e-commerce listings. It helps buyers recognize patterns in seller quality and catalog authenticity across multiple third-party shops, compiling rating analytics in a clean, interactive user interface."
  },
  {
    id: "ettiquetta",
    title: "Ettiquetta Japan",
    subtitle: "GitHub Project • Cultural Interactive Guide",
    badge: "Web Guide",
    isLocal: false,
    description: "An interactive travel guide focusing on traditional Japanese etiquette, customs, and situational behaviors.",
    tech: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
    github: "https://github.com/neko-san1432/Ettiquetta-Japan",
    details: "Ettiquetta Japan is a lightweight, responsive static web application designed to help foreign travelers navigate cultural norms in Japan. It features custom illustration panels, regional customs lists, and interactive quiz mechanics."
  }
];

// Three.js Hologram Variables
let scene, camera, renderer;
let hologramMesh, particleSystem, scanningRing;
let animationFrameId;

// Initialize Three.js Voxel/Pixel Hologram
function initHologram() {
  const container = document.getElementById('hologram-viewport');
  if (!container) return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  // Scene
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x060913, 0.015);

  // Camera
  camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
  camera.position.z = 180;

  // Renderer
  const canvas = document.createElement('canvas');
  canvas.id = 'canvas3d';
  container.appendChild(canvas);

  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false, alpha: true });
  // Set renderer size to 1/4 of container to create standard low-res retro pixelated look
  renderer.setSize(width / 4, height / 4, false);
  renderer.setPixelRatio(1);

  // Hologram Object Group
  const hologramGroup = new THREE.Group();
  scene.add(hologramGroup);

  // 1. Low-poly Voxel Icosahedron (Representing the server core)
  const sphereGeo = new THREE.IcosahedronGeometry(45, 1);
  const wireframeMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    wireframe: true,
    transparent: true,
    opacity: 0.4
  });
  hologramMesh = new THREE.Mesh(sphereGeo, wireframeMat);
  hologramGroup.add(hologramMesh);

  // 2. Center Voxel Core
  const coreGeo = new THREE.BoxGeometry(20, 20, 20);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0xbd00ff,
    wireframe: true,
    transparent: true,
    opacity: 0.6
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  hologramGroup.add(coreMesh);

  // 3. Floating Pixel Particles
  const particleGeo = new THREE.BufferGeometry();
  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    const radius = 50 + Math.random() * 15;

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x00f0ff,
    size: 3, // Larger blocky dots
    transparent: true,
    opacity: 0.6
  });

  particleSystem = new THREE.Points(particleGeo, particleMat);
  hologramGroup.add(particleSystem);

  // 4. Scanning Ring
  const ringGeo = new THREE.RingGeometry(48, 50, 8);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5,
    wireframe: true
  });
  scanningRing = new THREE.Mesh(ringGeo, ringMat);
  scanningRing.rotation.x = Math.PI / 2;
  hologramGroup.add(scanningRing);

  // Lighting
  const light = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(light);

  // Telemetry indicators references
  const scanVal = document.getElementById('hud-scan-value');
  const rotVal = document.getElementById('hud-rot-value');
  const signalVal = document.getElementById('hud-signal-value');

  // Animation Loop
  let clock = new THREE.Clock();
  let time = 0;

  function animate() {
    animationFrameId = requestAnimationFrame(animate);

    const delta = clock.getDelta();
    time += delta;

    // Rotate core meshes
    hologramMesh.rotation.y += 0.005;
    hologramMesh.rotation.x += 0.002;
    coreMesh.rotation.y -= 0.008;
    coreMesh.rotation.z += 0.004;

    // Orbit behavior for particle systems
    const posAttr = particleSystem.geometry.attributes.position;
    for (let i = 0; i < particleCount; i++) {
      let x = posAttr.getX(i);
      let z = posAttr.getZ(i);
      const speed = 0.003;
      const nx = x * Math.cos(speed) - z * Math.sin(speed);
      const nz = x * Math.sin(speed) + z * Math.cos(speed);

      posAttr.setX(i, nx);
      posAttr.setZ(i, nz);
    }
    posAttr.needsUpdate = true;

    // Scanning Ring sweep
    scanningRing.position.y = Math.sin(time * 1.5) * 45;
    scanningRing.rotation.z += 0.008;

    // Telemetry updates
    if (scanVal && Math.random() < 0.1) {
      scanVal.textContent = (Math.sin(time) * 100 + 100).toFixed(2) + " MHz";
    }
    if (rotVal && Math.random() < 0.1) {
      rotVal.textContent = "Y: " + (hologramMesh.rotation.y % (Math.PI * 2)).toFixed(2) + " RAD";
    }
    if (signalVal && Math.random() < 0.05) {
      signalVal.textContent = (90 + Math.random() * 9.8).toFixed(1) + "% SECURE";
    }

    renderer.render(scene, camera);
  }

  animate();

  // Resize Handler
  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  const container = document.getElementById('hologram-viewport');
  if (!container || !renderer || !camera) return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width / 4, height / 4, false);
}

// Morph Hologram Visual States based on hovered items
function morphHologram(projectType) {
  if (!hologramMesh || !particleSystem || !scanningRing) return;

  switch (projectType) {
    case 'drims':
      hologramMesh.material.color.setHex(0x00f0ff); // Cyan
      particleSystem.material.color.setHex(0xbd00ff); // Violet
      scanningRing.scale.set(1.2, 1.2, 1);
      break;
    case 'colorgame':
      hologramMesh.material.color.setHex(0x00ff75); // Neon Green
      particleSystem.material.color.setHex(0x00f0ff);
      scanningRing.scale.set(1.0, 1.0, 1);
      break;
    case 'predator':
      hologramMesh.material.color.setHex(0xff0055); // Red Alert
      particleSystem.material.color.setHex(0xffaa00); // Amber
      scanningRing.scale.set(1.3, 1.3, 1);
      break;
    default:
      hologramMesh.material.color.setHex(0x00f0ff);
      particleSystem.material.color.setHex(0xbd00ff);
      scanningRing.scale.set(1, 1, 1);
      break;
  }
}

// Project Details Modal Handler
function setupModal() {
  const overlay = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close-btn');

  if (!overlay || !closeBtn) return;

  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('active');
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
    }
  });
}

function openProjectModal(id) {
  const project = PROJECTS.find(p => p.id === id);
  if (!project) return;

  const overlay = document.getElementById('project-modal');
  const title = document.getElementById('modal-title-el');
  const subtitle = document.getElementById('modal-subtitle-el');
  const desc = document.getElementById('modal-desc-el');
  const techGrid = document.getElementById('modal-tech-el');
  const githubLink = document.getElementById('modal-github-link');

  if (!overlay) return;

  title.textContent = project.title;
  subtitle.textContent = project.subtitle;
  desc.innerHTML = `
    <div class="modal-section">
      <div class="modal-section-title">PROJECT TELEMETRY</div>
      <p class="terminal-desc">${project.description}</p>
    </div>
    <div class="modal-section">
      <div class="modal-section-title">DETAILED OVERVIEW</div>
      <p style="font-size:0.95rem; line-height:1.6; margin-bottom:1rem; font-family:var(--font-hud);">${project.details}</p>
    </div>
  `;

  // Tech stack rendering
  techGrid.innerHTML = '';
  project.tech.forEach(t => {
    const span = document.createElement('span');
    span.className = 'skill-tag';
    span.textContent = t;
    techGrid.appendChild(span);
  });

  // Github Button Handling
  if (project.github && !project.isMaintenance) {
    githubLink.href = project.github;
    githubLink.style.display = 'inline-flex';
  } else {
    githubLink.style.display = 'none';
  }

  overlay.classList.add('active');
}

// Custom language logo helper
function getSkillIcon(id) {
  switch(id) {
    case 'drims':
      return `
        <svg class="skill-icon-svg" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="image-rendering: pixelated;">
          <rect x="2" y="2" width="12" height="12" fill="#00f0ff" />
          <rect x="4" y="4" width="8" height="8" fill="#060913" />
          <rect x="6" y="6" width="4" height="4" fill="#ff0055" />
        </svg>
      `;
    case 'colorgame':
      return `
        <svg class="skill-icon-svg" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="image-rendering: pixelated;">
          <rect x="3" y="3" width="10" height="10" fill="#bd00ff" />
          <rect x="5" y="5" width="2" height="2" fill="#fff" />
          <rect x="9" y="9" width="2" height="2" fill="#fff" />
        </svg>
      `;
    case 'predator':
      return `
        <svg class="skill-icon-svg" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="image-rendering: pixelated;">
          <rect x="2" y="7" width="12" height="2" fill="#ff0055" />
          <rect x="7" y="2" width="2" height="12" fill="#ff0055" />
        </svg>
      `;
    case 'criticart':
      return `
        <svg class="skill-icon-svg" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="image-rendering: pixelated;">
          <rect x="4" y="2" width="8" height="12" fill="#eab308" />
          <rect x="6" y="4" width="4" height="4" fill="#000" />
        </svg>
      `;
    case 'ettiquetta':
      return `
        <svg class="skill-icon-svg" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="image-rendering: pixelated;">
          <rect x="1" y="4" width="14" height="8" fill="#f43f5e" />
          <circle cx="8" cy="8" r="3" fill="#fff" />
        </svg>
      `;
    default:
      return '';
  }
}

// Render Project Cards dynamically matching pixel-style dossier card grid
function renderProjects(filter = 'all', searchQuery = '') {
  const container = document.getElementById('projects-container');
  if (!container) return;

  container.innerHTML = '';

  const filtered = PROJECTS.filter(p => {
    const matchesFilter = filter === 'all' || 
      (filter === 'local' && p.isLocal) || 
      (filter === 'github' && !p.isLocal) ||
      (filter === 'systems' && (p.id === 'drims' || p.id === 'predator'));
      
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tech.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="terminal-desc" style="grid-column: 1/-1; text-align:center;">NO DATA RECORDS FOUND MATCHING QUERY.</div>`;
    return;
  }

  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = `skill-arsenal-card ${p.isMaintenance ? 'under-maintenance' : ''}`;
    card.innerHTML = `
      <div class="card-badge ${p.isMaintenance ? 'maintenance' : p.isLocal ? 'local' : ''}">
        ${p.isMaintenance ? 'MAINT' : p.isLocal ? 'LOCAL' : 'REPO'}
      </div>
      ${getSkillIcon(p.id)}
      <div class="skill-name" style="margin-top: 0.5rem;">${p.title.split(' ')[0]}</div>
      <div class="skill-sub">${p.badge}</div>
    `;

    card.addEventListener('click', () => {
      openProjectModal(p.id);
    });

    card.addEventListener('mouseenter', () => {
      morphHologram(p.id);
    });

    card.addEventListener('mouseleave', () => {
      morphHologram('default');
    });

    container.appendChild(card);
  });
}

// Typewriter Effect for Terminal Outputs
function runTypewriter(element, speed = 10) {
  const content = element.innerHTML;
  element.innerHTML = '';
  let partIndex = 0;
  const tokens = content.split(/(<[^>]*>)/g);
  
  function typeNextToken() {
    if (partIndex >= tokens.length) return;
    
    const token = tokens[partIndex];
    if (token.startsWith('<') && token.endsWith('>')) {
      element.innerHTML += token;
      partIndex++;
      typeNextToken();
    } else {
      let charIndex = 0;
      function typeChar() {
        if (charIndex < token.length) {
          element.innerHTML += token.charAt(charIndex);
          charIndex++;
          setTimeout(typeChar, speed);
        } else {
          partIndex++;
          setTimeout(typeNextToken, speed);
        }
      }
      typeChar();
    }
  }
  
  typeNextToken();
}

// Global page initialization
document.addEventListener('DOMContentLoaded', () => {
  setupModal();

  // Run typewriter animation on all terminal descriptions
  const terminalElements = document.querySelectorAll('.terminal-desc');
  terminalElements.forEach(el => {
    runTypewriter(el, 8);
  });

  // If on index.html, start Three.js
  if (document.getElementById('hologram-viewport')) {
    initHologram();
  }

  // If on projects.html, render active catalog
  if (document.getElementById('projects-container')) {
    renderProjects();

    const searchInput = document.getElementById('project-search');
    const filterButtons = document.querySelectorAll('.filter-btn');

    let currentFilter = 'all';
    let currentQuery = '';

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentQuery = e.target.value;
        renderProjects(currentFilter, currentQuery);
      });
    }

    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.dataset.filter;
        renderProjects(currentFilter, currentQuery);
      });
    });
  }

  // Interactivity for home elements
  const hoverTelemetryItems = document.querySelectorAll('.hologram-trigger');
  hoverTelemetryItems.forEach(item => {
    item.addEventListener('mouseenter', (e) => {
      const type = e.target.dataset.hologramType;
      morphHologram(type);
    });
    item.addEventListener('mouseleave', () => {
      morphHologram('default');
    });
  });
});
