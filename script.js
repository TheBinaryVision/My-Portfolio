/* ═══════════════════════════════════════════════════
   Roshan Vishwakarma — Portfolio Script
   Single file shared across all pages
═══════════════════════════════════════════════════ */

// ── 1. NAVBAR: mobile toggle + scroll shadow ──────
const navbar   = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks  = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        hamburger.innerHTML = isOpen
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';
        hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when any nav link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
            navLinks.classList.remove('open');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
}

// Scroll shadow on navbar
if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.style.boxShadow = window.scrollY > 10
            ? '0 2px 24px rgba(0,0,0,0.35)'
            : 'none';
    }, { passive: true });
}

// ── 2. ACTIVE NAV LINK ────────────────────────────
const currentFile = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a:not(.nav-cta)').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentFile || (currentFile === '' && href === 'index.html')) {
        link.classList.add('active');
    }
});

// ── 3. SCROLL-TRIGGERED FADE-IN (staggered) ──────
const fadeEls = document.querySelectorAll('.fade-in');

if (fadeEls.length > 0) {
    const io = new IntersectionObserver((entries) => {
        // Group entries that intersect in the same frame
        const visible = entries.filter(e => e.isIntersecting);
        visible.forEach((entry, i) => {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, i * 70);           // 70 ms stagger — subtle, not slow
            io.unobserve(entry.target);
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    fadeEls.forEach(el => io.observe(el));
}

// ── 4. PROJECT FILTER (projects.html) ─────────────
const filterTabs  = document.querySelectorAll('.filter-tab');
const projectCards = document.querySelectorAll('.project-card[data-category]');

if (filterTabs.length > 0) {
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filter = tab.dataset.filter;

            projectCards.forEach((card, i) => {
                const cats = card.dataset.category || '';
                const show = filter === 'all' || cats.includes(filter);
                if (show) {
                    card.style.display = 'flex';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(12px)';
                    // Staggered reveal
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, i * 60);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ── 5. CONTACT FORM (contacts.html) ───────────────
// Formspree handles the actual email delivery.
// This JS intercepts to show a polished success state.
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = contactForm.querySelector('button[type="submit"]');
        const originalHTML = btn.innerHTML;

        // Loading state
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
        btn.disabled = true;
        btn.style.opacity = '0.8';

        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                // Success state
                btn.innerHTML = '<i class="fas fa-check-circle"></i> Message Sent!';
                btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
                btn.style.opacity = '1';
                contactForm.reset();

                // Show a brief success note
                const note = contactForm.querySelector('.form-note') || (() => {
                    const p = document.createElement('p');
                    p.className = 'form-note';
                    p.style.cssText = 'font-size:0.78rem;color:#4ade80;text-align:center;margin-top:0.6rem;';
                    contactForm.appendChild(p);
                    return p;
                })();
                note.textContent = "Thanks! I'll get back to you within 24 hours.";

                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.style.background = '';
                    btn.disabled = false;
                    note.textContent = '';
                }, 5000);

            } else {
                throw new Error('Network response not ok');
            }

        } catch {
            // Error state — fall back to mailto
            btn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Try Email Instead';
            btn.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
            btn.style.opacity = '1';
            btn.disabled = false;

            btn.addEventListener('click', () => {
                window.location.href = 'mailto:roshan@example.com';
            }, { once: true });

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
            }, 5000);
        }
    });
}

// ── 6. SCROLL-TO-TOP (appears after 400px scroll) ─
const scrollBtn = document.createElement('button');
scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollBtn.setAttribute('aria-label', 'Scroll to top');
scrollBtn.style.cssText = `
    position: fixed;
    bottom: 1.8rem;
    right: 1.8rem;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--text-muted);
    font-size: 0.85rem;
    cursor: pointer;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.25s;
    opacity: 0;
    pointer-events: none;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
`;

document.body.appendChild(scrollBtn);

scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

scrollBtn.addEventListener('mouseenter', () => {
    scrollBtn.style.borderColor = 'var(--accent)';
    scrollBtn.style.color = 'var(--accent)';
    scrollBtn.style.background = 'rgba(78,158,187,0.1)';
});
scrollBtn.addEventListener('mouseleave', () => {
    scrollBtn.style.borderColor = 'var(--border)';
    scrollBtn.style.color = 'var(--text-muted)';
    scrollBtn.style.background = 'var(--surface)';
});

window.addEventListener('scroll', () => {
    const show = window.scrollY > 400;
    scrollBtn.style.opacity = show ? '1' : '0';
    scrollBtn.style.pointerEvents = show ? 'auto' : 'none';
    scrollBtn.style.transform = show ? 'translateY(0)' : 'translateY(8px)';
}, { passive: true });