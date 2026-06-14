// app.js

// Project specifications database
const projectSpecs = {
  drims: {
    title: "CITIZENLINK 2.0 (D.R.I.M.S.)",
    category: "Thesis Project // Web System",
    description: "An advanced citizen complaint management platform engineered for Local Government Units (LGUs). Integrated with a Hybrid NLP engine to perform real-time text analysis and categorization for incoming complaints. Employs DBSCAN density-based geospatial clustering analytics to map, identify, and alert administrators of complaint hotspot regions in real-time.",
    stack: "Node.js (Express), Supabase (PostgreSQL with PostGIS), Leaflet Map Analytics, Chart.js, Joi Validation, Helmet Security",
    features: [
      "Hybrid NLP model for automatic categorization & hierarchical routing.",
      "Custom DBSCAN algorithm for density-based complaint hotspot clustering.",
      "Comprehensive multi-role authorization (Citizens, Admins, LGU staff).",
      "PostgreSQL Row Level Security (RLS) and Postgres PostGIS maps."
    ],
    github: "https://github.com/neko-san1432/CitizenLink.git"
  },
  colorgame: {
    title: "3D COLOR GAME SIMULATOR",
    category: "3D Physics Engine Simulation",
    description: "A physics-based web simulator modeling the traditional Filipino 'Perya' Color Game. Leverages high-fidelity 3D graphics rendering to recreate custom dice models. Computes game outcomes dynamically using rigid-body collision states of three color-faced cubes hitting a landing board.",
    stack: "Three.js (WebGL rendering), Rapier3D (Physics Engine), Vite, TypeScript, Chart.js",
    features: [
      "Real-time Three.js WebGL rendering for 3D physics game assets.",
      "Rapier3D physics integrations for complex rigid body cube face physics.",
      "Accurate real-time statistics and analytics charting on dice faces."
    ],
    github: "https://github.com/neko-san1432/color-game-simulator"
  },
  predator: {
    title: "PREDATOR BOT (EA)",
    category: "Quantitative Trading System",
    description: "An algorithmic trading bot designed to build and backtest quantitative trading strategies. The platform executes rapid trades utilizing advanced risk-control modules like ProfitGuard and adaptive trailing stops to guard small capital accounts.",
    stack: "MQL5 (MetaTrader 5), Pine Script (TradingView), Python, Excel Backtester",
    features: [
      "ScalperBot and Sniper Volatility algorithmic cores.",
      "ProfitGuard profit locking & risk mitigation engine.",
      "Adaptive compound capital scaling modules for small cap limits."
    ],
    github: "https://github.com/neko-san1432/predator-bot.git",
    status: "UNDER_MAINTENANCE"
  },
  criticart: {
    title: "CRITICART",
    category: "E-Commerce Critique Engine",
    description: "A web platform designed to collect, cross-reference, and verify product reviews from external online shop URLs. Allows users worldwide to critique, rate, and report products based on their e-commerce storefront of origin.",
    stack: "JavaScript, HTML5, Vanilla CSS, GitHub Pages Hosting",
    features: [
      "URL-indexed product tracking system.",
      "Community rating system with credibility rankings.",
      "Fully responsive static structure."
    ],
    github: "https://github.com/neko-san1432/CritiCart"
  },
  ettiquetta: {
    title: "ETTIQUETTA JAPAN",
    category: "Interactive Cultural Guide",
    description: "An interactive travel and cultural guide application displaying critical etiquette details, norms, and suggestions for travelers to Japan. Structured with modular guides.",
    stack: "JavaScript, CSS Grid, HTML5, SVG Graphics",
    features: [
      "Interactive category selection cards.",
      "Animated custom navigation.",
      "Optimized static client architecture."
    ],
    github: "https://github.com/neko-san1432/Ettiquetta-Japan"
  }
};

// Audio synthesize effect for retro click
function playRetroBeep(frequency = 600, duration = 0.05) {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'square';
    oscillator.frequency.value = frequency;
    
    gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Ignore audio context blocks
  }
}

// Global page initialization
document.addEventListener('DOMContentLoaded', () => {
  // Beep on navigation clicks
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('click', () => {
      playRetroBeep();
    });
  });

  // RPG Stat Bar loading
  const statBars = document.querySelectorAll('.stat-bar-inner');
  if (statBars.length > 0) {
    setTimeout(() => {
      statBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = width;
      });
      playRetroBeep(800, 0.15);
    }, 400);
  }

  // Project cards filters
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.card-retro');
  
  if (filterButtons.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        playRetroBeep(450, 0.08);
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        projectCards.forEach(card => {
          const tags = card.getAttribute('data-tags');
          if (filter === 'all' || tags.includes(filter)) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Specifications modal controllers
  const modal = document.getElementById('spec-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  
  if (modal && closeBtn) {
    // Open modal
    document.querySelectorAll('.view-details-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const projectKey = btn.getAttribute('data-project');
        const spec = projectSpecs[projectKey];
        
        if (spec) {
          playRetroBeep(700, 0.1);
          
          document.getElementById('modal-title').textContent = spec.title;
          
          let featuresHtml = '';
          spec.features.forEach(f => {
            featuresHtml += `<li><span style="color: var(--neon-green)">[x]</span> ${f}</li>`;
          });
          
          let footerHtml = '';
          if (spec.status === 'UNDER_MAINTENANCE') {
            footerHtml = `<div style="margin-top: 25px; padding: 10px; border: 2px solid var(--neon-magenta); text-align: center; color: var(--neon-magenta); font-weight: bold;">
              CLASSIFIED - ACTIVE MAINTENANCE STAGE
            </div>`;
          } else {
            footerHtml = `<div style="margin-top: 25px; text-align: center;">
              <a href="${spec.github}" target="_blank" class="btn-retro">AUDIT_ON_GITHUB</a>
            </div>`;
          }

          document.getElementById('modal-body').innerHTML = `
            <div style="color: var(--neon-magenta); font-weight: bold; margin-bottom: 10px;">SYSTEM: ${spec.category}</div>
            <p style="font-size: 16px; line-height: 1.4; color: var(--text-primary); margin-bottom: 15px;">${spec.description}</p>
            <div style="margin-bottom: 15px;">
              <span style="color: var(--neon-yellow); font-weight: bold;">STACK CORE:</span> <span style="font-size: 15px;">${spec.stack}</span>
            </div>
            <div style="font-weight: bold; color: var(--neon-cyan); margin-bottom: 5px;">CORE PROTOCOLS:</div>
            <ul style="list-style: none; padding-left: 10px; font-size: 15px; display: flex; flex-direction: column; gap: 5px;">
              ${featuresHtml}
            </ul>
            ${footerHtml}
          `;
          
          modal.classList.add('active');
          
          // Re-bind click event to newly created button inside modal
          const githubBtn = modal.querySelector('.btn-retro');
          if (githubBtn) {
            githubBtn.addEventListener('click', () => {
              playRetroBeep();
            });
          }
        }
      });
    });

    // Close modal
    closeBtn.addEventListener('click', () => {
      playRetroBeep(300, 0.05);
      modal.classList.remove('active');
    });

    // Close on overlay click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        playRetroBeep(300, 0.05);
        modal.classList.remove('active');
      }
    });
  }
});
