document.addEventListener('DOMContentLoaded', () => {
    // Demo Merchant Data
    const merchants = [
        { id: 1, name: 'TechHub Electronics', cat: 'electronics', rating: '4.8', distance: '1.2 km', eta: '15-20 min', items: ['Laptop Charger', 'USB-C Cable', 'Power Bank'] },
        { id: 2, name: 'Vellore Stationery & Books', cat: 'stationery', rating: '4.7', distance: '0.8 km', eta: '10-15 min', items: ['Stationery Notebook', 'Exam Pad', 'Pens Set'] },
        { id: 3, name: 'Apollo Pharmacy Express', cat: 'pharmacy', rating: '4.9', distance: '1.5 km', eta: '12-18 min', items: ['Essential Medicines', 'First Aid Kit', 'Hand Sanitizer'] },
        { id: 4, name: 'QuickMart Supermarket', cat: 'essentials', rating: '4.6', distance: '2.0 km', eta: '20-25 min', items: ['Energy Drink', 'Snack Pack', 'Water Bottle'] }
    ];

    // Render Merchants Grid
    const merchantGrid = document.getElementById('merchant-cards-grid');
    function renderMerchants(filterCat = 'all', searchQuery = '') {
        if (!merchantGrid) return;
        merchantGrid.innerHTML = '';

        const filtered = merchants.filter(m => {
            const matchesCat = filterCat === 'all' || m.cat === filterCat;
            const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 m.items.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCat && matchesSearch;
        });

        if (filtered.length === 0) {
            merchantGrid.innerHTML = '<p class="text-muted" style="grid-column: 1/-1;">No matching stores or items found in Vellore.</p>';
            return;
        }

        filtered.forEach(m => {
            const card = document.createElement('div');
            card.className = 'card service-card';
            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:start;">
                    <h3>${m.name}</h3>
                    <span style="background:var(--primary-neon); color:#000; font-weight:800; padding:2px 6px; border-radius:4px; font-size:0.8rem;">★ ${m.rating}</span>
                </div>
                <p style="color:var(--text-muted); font-size:0.9rem;">📍 ${m.distance} • ⏱️ ${m.eta}</p>
                <p><strong>Popular:</strong> ${m.items.join(', ')}</p>
                <button class="btn primary-btn" style="margin-top:0.5rem;" onclick="selectMerchantItem('${m.items[0]}')">Order Item</button>
            `;
            merchantGrid.appendChild(card);
        });
    }

    renderMerchants();

    // Global selector bridge for inline onclick
    window.selectMerchantItem = function(itemName) {
        const itemSelect = document.getElementById('item-type');
        if (itemSelect) {
            itemSelect.value = itemSelect.querySelector(`option[value="${itemName}"]`) ? itemName : 'Other Item';
        }
        document.getElementById('request-flow').scrollIntoView({ behavior: 'smooth' });
    };

    // Category Filtering
    const categoryChips = document.querySelectorAll('.category-chip');
    categoryChips.forEach(chip => {
        chip.addEventListener('click', () => {
            categoryChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            renderMerchants(chip.dataset.cat, searchInput.value);
        });
    });

    // Search Input Handling
    const searchInput = document.getElementById('marketplace-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const activeChip = document.querySelector('.category-chip.active');
            renderMerchants(activeChip ? activeChip.dataset.cat : 'all', e.target.value);
        });
    }

    // Portal Navigation
    const navLinks = document.querySelectorAll('nav a');
    const portalSections = document.querySelectorAll('.portal-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1) + '-portal';

            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            portalSections.forEach(section => {
                section.id === targetId ? section.classList.remove('hidden') : section.classList.add('hidden');
            });
        });
    });

    // Service Cards Shortcut
    const serviceCards = document.querySelectorAll('.service-card[data-service]');
    const itemSelect = document.getElementById('item-type');
    const urgencySelect = document.getElementById('urgency-level');

    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const service = card.dataset.service;
            if (service === 'forgot' && itemSelect) itemSelect.value = 'ID Card & Keys';
            if (service === 'urgent' && urgencySelect) urgencySelect.value = 'GETCHA NOW';
            document.getElementById('request-flow').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Request Form & GPS Marker Animation Engine
    const getchaForm = document.getElementById('getcha-form');
    const trackingSection = document.getElementById('tracking-section');
    const trackingStatus = document.getElementById('tracking-status');
    const partnerMarker = document.getElementById('partner-marker');

    const statActive = document.getElementById('stat-active');
    const statRevenue = document.getElementById('stat-revenue');
    let totalRevenue = 0;
    let activeOrders = 0;

    if (getchaForm) {
        getchaForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const item = itemSelect.value;
            const pickup = document.getElementById('pickup-location').value;
            const drop = document.getElementById('drop-location').value;
            const urgency = urgencySelect.value;

            let fee = 49;
            if (urgency === 'Fast') fee += 30;
            if (urgency === 'GETCHA NOW') fee += 50;

            const orderId = 'GC' + Math.floor(1000 + Math.random() * 9000);

            document.getElementById('track-id').textContent = '#' + orderId;
            document.getElementById('track-item').textContent = item;
            document.getElementById('track-pickup').textContent = pickup;
            document.getElementById('track-drop').textContent = drop;
            document.getElementById('track-fee').textContent = '₹' + fee;

            trackingSection.classList.remove('hidden');
            trackingStatus.textContent = 'Searching for GETCHA Partner in Vellore...';

            if (partnerMarker) partnerMarker.style.left = '10%';

            // Simulate GPS partner dispatch and movement
            setTimeout(() => {
                trackingStatus.textContent = "Partner Assigned: We've gotcha! (Demo Partner 01)";
                if (partnerMarker) partnerMarker.style.left = '50%';
            }, 2000);

            setTimeout(() => {
                trackingStatus.textContent = 'Item Picked Up — En Route to Destination';
                if (partnerMarker) partnerMarker.style.left = '85%';
            }, 4000);

            activeOrders += 1;
            totalRevenue += fee;

            if (statActive) statActive.textContent = activeOrders;
            if (statRevenue) statRevenue.textContent = '₹' + totalRevenue;

            trackingSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Partner Portal Actions
    const partnerToggleBtn = document.getElementById('partner-toggle-online');
    const partnerJobsList = document.getElementById('partner-jobs-list');
    let isOnline = false;

    if (partnerToggleBtn) {
        partnerToggleBtn.addEventListener('click', () => {
            isOnline = !isOnline;
            if (isOnline) {
                partnerToggleBtn.textContent = 'GO OFFLINE';
                partnerToggleBtn.classList.replace('secondary-btn', 'primary-btn');
                partnerJobsList.innerHTML = `
                    <div class="card" style="margin-top: 1rem; border-left: 4px solid var(--primary-neon);">
                        <h4>NEW GETCHA JOB #GC1024</h4>
                        <p><strong>Pickup:</strong> Vellore Tech Hub</p>
                        <p><strong>Drop:</strong> Katpadi Road, Desk 12</p>
                        <p><strong>Payout:</strong> ₹52</p>
                        <button class="btn primary-btn" onclick="alert('Job Accepted! We\\'ve gotcha.')">Accept Job</button>
                    </div>
                `;
            } else {
                partnerToggleBtn.textContent = 'GO ONLINE';
                partnerToggleBtn.classList.replace('primary-btn', 'secondary-btn');
                partnerJobsList.innerHTML = '<p class="text-muted">No active requests nearby. Go online to accept delivery tasks.</p>';
            }
        });
    }
});
