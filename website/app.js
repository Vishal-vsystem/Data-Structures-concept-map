document.addEventListener('DOMContentLoaded', () => {
    // Navigation state
    const navLinks = document.querySelectorAll('nav a');
    const portalSections = document.querySelectorAll('.portal-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1) + '-portal';

            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            portalSections.forEach(section => {
                if (section.id === targetId) {
                    section.classList.remove('hidden');
                } else {
                    section.classList.add('hidden');
                }
            });
        });
    });

    // Service cards click auto-select
    const serviceCards = document.querySelectorAll('.service-card');
    const itemSelect = document.getElementById('item-type');
    const urgencySelect = document.getElementById('urgency-level');

    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const service = card.dataset.service;
            if (service === 'forgot' && itemSelect) {
                itemSelect.value = 'Keys';
            } else if (service === 'urgent' && urgencySelect) {
                urgencySelect.value = 'GETCHA NOW';
            }
            document.getElementById('request-flow').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Form submission & local state
    const getchaForm = document.getElementById('getcha-form');
    const trackingSection = document.getElementById('tracking-section');
    const trackId = document.getElementById('track-id');
    const trackItem = document.getElementById('track-item');
    const trackPickup = document.getElementById('track-pickup');
    const trackDrop = document.getElementById('track-drop');
    const trackFee = document.getElementById('track-fee');
    const trackingStatus = document.getElementById('tracking-status');

    // Admin stat counters
    const statActive = document.getElementById('stat-active');
    const statRevenue = document.getElementById('stat-revenue');
    let totalRevenue = 0;
    let activeOrdersCount = 0;

    if (getchaForm) {
        getchaForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const item = itemSelect.value;
            const pickup = document.getElementById('pickup-location').value;
            const drop = document.getElementById('drop-location').value;
            const urgency = urgencySelect.value;

            // Simple fee calculation logic
            let baseFee = 49;
            if (urgency === 'Fast') baseFee += 30;
            if (urgency === 'GETCHA NOW') baseFee += 50;

            const orderNumber = 'GC' + Math.floor(1000 + Math.random() * 9000);

            trackId.textContent = '#' + orderNumber;
            trackItem.textContent = item;
            trackPickup.textContent = pickup;
            trackDrop.textContent = drop;
            trackFee.textContent = '₹' + baseFee;

            trackingSection.classList.remove('hidden');
            trackingStatus.textContent = 'Searching for Partner...';

            // Simulate partner dispatch
            setTimeout(() => {
                trackingStatus.textContent = "Partner Assigned: We've gotcha!";
            }, 2500);

            activeOrdersCount += 1;
            totalRevenue += baseFee;

            if (statActive) statActive.textContent = activeOrdersCount;
            if (statRevenue) statRevenue.textContent = '₹' + totalRevenue;

            trackingSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Partner online toggle simulation
    const partnerToggleBtn = document.getElementById('partner-toggle-online');
    const partnerJobsList = document.getElementById('partner-jobs-list');
    let isOnline = false;

    if (partnerToggleBtn) {
        partnerToggleBtn.addEventListener('click', () => {
            isOnline = !isOnline;
            if (isOnline) {
                partnerToggleBtn.textContent = 'GO OFFLINE';
                partnerToggleBtn.classList.remove('secondary-btn');
                partnerToggleBtn.classList.add('primary-btn');

                partnerJobsList.innerHTML = `
                    <div class="card" style="margin-top: 1rem; border-left: 4px solid #2563eb;">
                        <h4>NEW GETCHA JOB #GC1024</h4>
                        <p><strong>Pickup:</strong> Hostel Block A</p>
                        <p><strong>Drop:</strong> Library Desk 12</p>
                        <p><strong>Payout:</strong> ₹52</p>
                        <button class="btn primary-btn" onclick="alert('Job Accepted! We\\'ve gotcha.')">Accept Job</button>
                    </div>
                `;
            } else {
                partnerToggleBtn.textContent = 'GO ONLINE';
                partnerToggleBtn.classList.remove('primary-btn');
                partnerToggleBtn.classList.add('secondary-btn');
                partnerJobsList.innerHTML = '<p class="text-muted">No active jobs nearby. Go online to view requests.</p>';
            }
        });
    }
});
