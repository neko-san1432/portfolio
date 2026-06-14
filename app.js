document.addEventListener('DOMContentLoaded', () => {
    // 1. Live Sync Time in Terminal
    const syncTimeElement = document.getElementById('sync-time');
    if (syncTimeElement) {
        const now = new Date();
        const options = { month: 'short', day: '2-digit', year: 'numeric' };
        const timeString = now.toLocaleDateString('en-US', options) + ' ' + 
                           now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) + ' UTC';
        syncTimeElement.textContent = timeString;
    }

    // 2. Dynamic Contribution Graph Generator
    const contribGraph = document.getElementById('contribution-graph');
    if (contribGraph) {
        const days = ['Mon', 'Wed', 'Fri'];
        
        days.forEach(dayName => {
            const row = document.createElement('div');
            row.className = 'contrib-row';
            
            const label = document.createElement('span');
            label.className = 'contrib-label';
            label.textContent = dayName;
            row.appendChild(label);
            
            const daysContainer = document.createElement('div');
            daysContainer.className = 'contrib-days';
            
            // Generate 24 contribution blocks (representing weeks)
            for (let i = 0; i < 28; i++) {
                const dayBlock = document.createElement('span');
                dayBlock.className = 'contrib-day';
                
                // Distribute levels naturally (level 0: 25%, level 1: 35%, level 2: 20%, level 3: 15%, level 4: 5%)
                const rand = Math.random();
                let level = 0;
                if (rand > 0.95) level = 4;
                else if (rand > 0.80) level = 3;
                else if (rand > 0.60) level = 2;
                else if (rand > 0.25) level = 1;
                
                dayBlock.classList.add(`level-${level}`);
                daysContainer.appendChild(dayBlock);
            }
            
            row.appendChild(daysContainer);
            contribGraph.appendChild(row);
        });
    }

    // 3. Search and Filtering System (Projects Page)
    const searchInput = document.getElementById('project-search');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    let activeCategory = 'all';
    let searchQuery = '';

    function filterProjects() {
        projectCards.forEach(card => {
            const category = card.dataset.category;
            const title = card.querySelector('.project-card-title').textContent.toLowerCase();
            const desc = card.querySelector('.project-card-desc').textContent.toLowerCase();
            const tags = Array.from(card.querySelectorAll('.project-tech-item')).map(el => el.textContent.toLowerCase());
            
            const matchesCategory = (activeCategory === 'all' || category === activeCategory);
            const matchesSearch = title.includes(searchQuery) || desc.includes(searchQuery) || tags.some(tag => tag.includes(searchQuery));
            
            if (matchesCategory && matchesSearch) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            filterProjects();
        });
    }

    if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeCategory = btn.dataset.category;
                filterProjects();
            });
        });
    }
});
