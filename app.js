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
let hologramSphere, particleSystem, scanningRing;
let animationFrameId;

// Initialize Three.js Hologram
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
  camera.position.z = 200;

  // Renderer
  const canvas = document.createElement('canvas');
  canvas.id = 'canvas3d';
  container.appendChild(canvas);

  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Hologram Object Group
  const hologramGroup = new THREE.Group();
  scene.add(hologramGroup);

  // 1. Globe Wireframe (Icosahedron)
  const sphereGeo = new THREE.IcosahedronGeometry(50, 2);
  const wireframeMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    wireframe: true,
    transparent: true,
    opacity: 0.25
  });
  hologramSphere = new THREE.Mesh(sphereGeo, wireframeMat);
  hologramGroup.add(hologramSphere);

  // 2. Inner Dot Sphere
  const innerSphereGeo = new THREE.IcosahedronGeometry(48, 1);
  const innerPointsMat = new THREE.PointsMaterial({
    color: 0xbd00ff,
    size: 1.5,
    transparent: true,
    opacity: 0.6
  });
  const innerPoints = new THREE.Points(innerSphereGeo, innerPointsMat);
  hologramGroup.add(innerPoints);

  // 3. Orbiting Particles
  const particleGeo = new THREE.BufferGeometry();
  const particleCount = 180;
  const positions = new Float32Array(particleCount * 3);
  const velocities = [];

  for (let i = 0; i < particleCount; i++) {
    // Distribute randomly in a shell of radius 60 to 80
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    const radius = 60 + Math.random() * 20;

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);

    velocities.push({
      x: (Math.random() - 0.5) * 0.05,
      y: (Math.random() - 0.5) * 0.05,
      z: (Math.random() - 0.5) * 0.05
    });
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x00f0ff,
    size: 2,
    transparent: true,
    opacity: 0.5
  });

  particleSystem = new THREE.Points(particleGeo, particleMat);
  hologramGroup.add(particleSystem);

  // 4. Scanning Ring
  const ringGeo = new THREE.RingGeometry(52, 53, 64);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5
  });
  scanningRing = new THREE.Mesh(ringGeo, ringMat);
  scanningRing.rotation.x = Math.PI / 2;
  hologramGroup.add(scanningRing);

  // Lighting
  const light = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(light);

  // Telemetry info panel references
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

    // Rotate core structures
    hologramSphere.rotation.y += 0.005;
    hologramSphere.rotation.x += 0.002;
    innerPoints.rotation.y -= 0.003;

    // Wobble and move particle positions slightly
    const posAttr = particleSystem.geometry.attributes.position;
    for (let i = 0; i < particleCount; i++) {
      let x = posAttr.getX(i);
      let y = posAttr.getY(i);
      let z = posAttr.getZ(i);

      // Orbit behavior (simple rotation around Y axis)
      const speed = 0.002;
      const nx = x * Math.cos(speed) - z * Math.sin(speed);
      const nz = x * Math.sin(speed) + z * Math.cos(speed);

      posAttr.setX(i, nx);
      posAttr.setZ(i, nz);
    }
    posAttr.needsUpdate = true;

    // Scanning Ring Sweep (moving up and down)
    scanningRing.position.y = Math.sin(time * 1.5) * 50;
    
    // Rotate ring slightly for flavor
    scanningRing.rotation.z += 0.01;

    // Dynamic telemetry updates
    if (scanVal && Math.random() < 0.1) {
      scanVal.textContent = (Math.sin(time) * 100 + 100).toFixed(2) + " MHz";
    }
    if (rotVal && Math.random() < 0.1) {
      rotVal.textContent = "Y: " + (hologramSphere.rotation.y % (Math.PI * 2)).toFixed(2) + " RAD";
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

  renderer.setSize(width, height);
}

// Morph Hologram Visual States based on hovered items
function morphHologram(projectType) {
  if (!hologramSphere || !particleSystem || !scanningRing) return;

  switch (projectType) {
    case 'drims':
      hologramSphere.material.color.setHex(0x00f0ff); // Cyan
      particleSystem.material.color.setHex(0xbd00ff); // Violet
      scanningRing.scale.set(1.2, 1.2, 1);
      break;
    case 'colorgame':
      hologramSphere.material.color.setHex(0x00ff75); // Neon Green
      particleSystem.material.color.setHex(0x00f0ff);
      scanningRing.scale.set(1.0, 1.0, 1);
      break;
    case 'predator':
      hologramSphere.material.color.setHex(0xff0055); // Red Alert
      particleSystem.material.color.setHex(0xffaa00); // Amber
      scanningRing.scale.set(1.4, 1.4, 1);
      break;
    default:
      hologramSphere.material.color.setHex(0x00f0ff);
      particleSystem.material.color.setHex(0x00f0ff);
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
      <p style="font-size:0.95rem; line-height:1.6; margin-bottom:1rem;">${project.details}</p>
    </div>
  `;

  // Tech stack rendering
  techGrid.innerHTML = '';
  project.tech.forEach(t => {
    const span = document.createElement('span');
    span.className = 'skill-tag' + (project.id === 'colorgame' ? ' purple' : '');
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

// Render Project Cards dynamically
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
    card.className = `hud-panel project-card ${p.isMaintenance ? 'under-maintenance' : ''} ${p.id === 'colorgame' ? 'accent-purple' : ''}`;
    card.innerHTML = `
      <div class="project-image-placeholder">
        <div class="project-badge ${p.isMaintenance ? 'maintenance' : p.isLocal ? 'local' : ''}">
          ${p.isMaintenance ? 'MAINTENANCE' : p.isLocal ? 'LOCAL' : 'GITHUB'}
        </div>
        <div class="project-graphic-hud">${p.id} telemetry</div>
      </div>
      <div class="project-card-content">
        <div>
          <h3 class="project-card-title">${p.title}</h3>
          <p class="project-card-desc">${p.description}</p>
        </div>
        <div class="project-card-tech">
          ${p.tech.slice(0, 3).map(t => `<span>[${t}]</span>`).join(' ')}
          ${p.tech.length > 3 ? `<span>[+${p.tech.length - 3}]</span>` : ''}
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      openProjectModal(p.id);
    });

    // Hover effects on cards interact with the 3D hologram (if present on index.html)
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
  // Splits by HTML tags so elements like <br> are output atomically
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

