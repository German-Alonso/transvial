/* ============================================
   TRANSVIAL LTDA. — INTERACTIONS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Load dynamic content from admin if available ---
  loadAdminContent();

  // --- Navbar scroll effect ---
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.navbar__links a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  function handleScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section highlighting
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --- Smooth scroll ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
      // Close mobile menu if open
      closeMobileMenu();
    });
  });

  // --- Mobile menu ---
  const toggle = document.querySelector('.navbar__toggle');
  const mobileNav = document.querySelector('.navbar__links');
  const overlay = document.querySelector('.mobile-overlay');

  function closeMobileMenu() {
    toggle.classList.remove('active');
    mobileNav.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function openMobileMenu() {
    toggle.classList.add('active');
    mobileNav.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  toggle.addEventListener('click', () => {
    if (mobileNav.classList.contains('open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  overlay.addEventListener('click', closeMobileMenu);

  // --- Scroll reveal animations ---
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));

  // --- Contact form ---
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = '✓ Mensaje enviado';
      btn.style.background = '#2a7a3f';
      btn.style.color = '#fff';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.color = '';
        form.reset();
      }, 3000);
    });
  }
});

// ============================
// SUPABASE CONFIG
// ============================
const SUPABASE_URL = 'https://kazyjjgiwrffzznadjyt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imthenlqamdpd3JmZnp6bmFkanl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NDIyMTcsImV4cCI6MjA4OTAxODIxN30.kaP-VhAyWkfGDScJ774boKDipCJ7EJXUmLIzjNJ4ZAM';
let siteSupabase = null;
if (typeof window.supabase !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function') {
  try {
    siteSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (e) {
    // Supabase init failed
  }
}

async function loadAdminContent() {
  const STORAGE_KEY = 'transvial_admin_data';
  let data = null;

  // Try Supabase first
  if (siteSupabase) {
    try {
      const { data: row, error } = await siteSupabase
        .from('site_content')
        .select('data')
        .eq('id', 1)
        .single();
      if (!error && row && row.data && Object.keys(row.data).length > 0) {
        data = row.data;
        // Update localStorage cache
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    } catch (e) {
      // Fall through to localStorage
    }
  }

  // Fallback to localStorage
  if (!data) {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return; // No admin data, keep static HTML
    try {
      data = JSON.parse(stored);
    } catch (e) {
      return;
    }
  }

  if (!data) return;
  window.transvialData = data;

  // --- Hero ---
  if (data.hero) {
    const badge = document.querySelector('.hero__badge');
    if (badge && data.hero.badge) {
      badge.childNodes[badge.childNodes.length - 1].textContent = data.hero.badge;
    }

    const h1 = document.querySelector('.hero h1');
    if (h1 && data.hero.title1) {
      h1.innerHTML = `${escHtml(data.hero.title1)}<br><em>${escHtml(data.hero.title2 || '')}</em>`;
    }

    const subtitle = document.querySelector('.hero__subtitle');
    if (subtitle && data.hero.subtitle) subtitle.textContent = data.hero.subtitle;

    const btnPrimary = document.querySelector('.hero__actions .btn--primary');
    if (btnPrimary && data.hero.btnPrimary) btnPrimary.textContent = data.hero.btnPrimary;

    const btnSecondary = document.querySelector('.hero__actions .btn--outline');
    if (btnSecondary && data.hero.btnSecondary) btnSecondary.textContent = data.hero.btnSecondary;

    // Hero background image
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      const isProyectos = window.location.pathname.includes('proyectos.html');
      const isResiduos = window.location.pathname.includes('residuos-trabajos.html');
      // Assume home page if it's neither of the specific subpages
      const isHome = !isProyectos && !isResiduos;
      
      let bgUrl1 = data.hero.bgImage1 || data.hero.bgImage || '';
      let bgUrl2 = data.hero.bgImage2 || '';
      
      const setStaticBg = (url) => {
        if (!url) return;
        heroSection.style.backgroundImage = `linear-gradient(rgba(17,17,17,0.75), rgba(17,17,17,0.85)), url('${url}')`;
        heroSection.style.backgroundSize = 'cover';
        heroSection.style.backgroundPosition = 'center';
      };

      if (isHome) {
        if (bgUrl1 && bgUrl2) {
          // Initialize slider DOM inside heroSection
          const bgUrls = [bgUrl1, bgUrl2];
          const sliderHtml = bgUrls.map((url, index) => 
            `<div class="hero__slider-img ${index === 0 ? 'active' : ''}" style="background-image: linear-gradient(rgba(17,17,17,0.75), rgba(17,17,17,0.85)), url('${url}')"></div>`
          ).join('');
          
          const sliderContainer = document.createElement('div');
          sliderContainer.className = 'hero__slider';
          sliderContainer.innerHTML = sliderHtml;
          
          heroSection.insertBefore(sliderContainer, heroSection.firstChild);
          
          let currentIndex = 0;
          const slides = sliderContainer.querySelectorAll('.hero__slider-img');
          setInterval(() => {
            slides[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % slides.length;
            slides[currentIndex].classList.add('active');
          }, 7000);
        } else {
          setStaticBg(bgUrl1 || bgUrl2);
        }
      } else if (isProyectos) {
        const choice = data.hero.bgChoiceConstruccion || '1';
        setStaticBg(choice === '2' ? bgUrl2 : bgUrl1);
      } else if (isResiduos) {
        const choice = data.hero.bgChoiceResiduos || '1';
        setStaticBg(choice === '2' ? bgUrl2 : bgUrl1);
      }
    }
  }

  // --- Stats ---
  if (data.stats && data.stats.length) {
    const items = document.querySelectorAll('.stats-bar__item');
    data.stats.forEach((stat, i) => {
      if (items[i]) {
        const num = items[i].querySelector('.stats-bar__number');
        const lbl = items[i].querySelector('.stats-bar__label');
        if (num) num.textContent = stat.number;
        if (lbl) lbl.textContent = stat.label;
      }
    });
  }

  // --- Servicios ---
  if (data.servicios && data.servicios.length) {
    const grid = document.querySelector('.servicios__grid');
    if (grid) {
      grid.innerHTML = data.servicios.map((s, i) => `
        <div class="service-card reveal reveal-delay-${(i % 6) + 1}">
          <div class="service-card__number">${String(i + 1).padStart(2, '0')}</div>
          <div class="service-card__icon">
            <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 44h40"/><path d="M10 44V28l8-8 8 8v16"/><path d="M30 44V20l8-8v32"/><path d="M14 36h4"/><path d="M14 32h4"/>
            </svg>
          </div>
          <h3>${escHtml(s.title)}</h3>
          <p class="service-card__desc">${escHtml(s.desc)}</p>
          <ul class="service-card__list">
            ${(s.items || []).map(item => `<li>${escHtml(item)}</li>`).join('')}
          </ul>
          <a href="#contacto" class="service-card__btn">Consultar</a>
        </div>
      `).join('');
    }
  }

  // --- Residuos ---
  if (data.residuos) {
    const r = data.residuos;
    // Update description paragraphs
    const residuosText = document.querySelector('.residuos__text');
    if (residuosText) {
      const paragraphs = residuosText.querySelectorAll('p');
      if (paragraphs[0] && r.desc1) paragraphs[0].textContent = r.desc1;
      if (paragraphs[1] && r.desc2) paragraphs[1].textContent = r.desc2;
    }

    // Dynamically render all trabajos in the sidebar
    if (r.trabajos && r.trabajos.length) {
      const sidebar = document.querySelector('.residuos__sidebar');
      if (sidebar) {
        // Keep the badge (regulatory info) but rebuild the project references
        const badge = sidebar.querySelector('.residuos__badge');
        const badgeHtml = badge ? badge.outerHTML : '';
        const principalJobs = r.trabajos.filter(t => t.principal);

        sidebar.innerHTML = badgeHtml + principalJobs.map((t, i) => `
          <div class="residuos__project">
            <div class="residuos__project-label">${i === 0 ? 'Trabajo destacado' : 'Trabajo'}</div>
            <h4>${escHtml(t.title)}</h4>
            <p>${escHtml(t.desc)}</p>
            ${t.year ? `<small style="color:var(--accent);font-weight:600">${escHtml(t.year)}${t.client ? ' — ' + escHtml(t.client) : ''}</small>` : ''}
          </div>
        `).join('') + `
          <a href="residuos-trabajos.html" class="residuos__project" style="display:flex;flex-direction:row;align-items:center;justify-content:space-between;text-decoration:none;border:1px solid rgba(255,255,255,0.1);padding:24px;background:rgba(255,255,255,0.02);border-radius:2px;transition:background 0.3s ease, border-color 0.3s ease;">
            <h4 style="margin:0;font-size:1.1rem;color:var(--text);">Ver todos los trabajos</h4>
            <div style="width:36px;height:36px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;color:var(--bg);">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </a>
        `;
      }
    }
  }

  // --- Proyectos ---
  if (data.proyectos && data.proyectos.length) {
    const featured = data.proyectos.find(p => p.featured);
    const secondary = data.proyectos.filter(p => !p.featured);

    // Featured project
    if (featured) {
      const fpEl = document.querySelector('.featured-project');
      if (fpEl) {
        const imgUrl = featured.image || (data.imagenes && data.imagenes.featured) || '';
        fpEl.innerHTML = `
          <div class="featured-project__image">
            ${imgUrl ? `<img src="${escHtml(imgUrl)}" alt="${escHtml(featured.title)}" style="width:100%;height:100%;object-fit:cover;">` : `
            <div class="image-placeholder">
              <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.5">
                <rect x="5" y="15" width="50" height="35" rx="2"/><circle cx="20" cy="28" r="5"/><path d="M5 42 l15 -10 10 8 12 -14 13 16"/>
              </svg>
              <p>Foto del proyecto — próximamente</p>
            </div>`}
          </div>
          <div class="featured-project__info">
            <div class="featured-project__status">
              <div class="pulse-dot"></div>
              ${escHtml(featured.year || 'En ejecución')}
            </div>
            <h3>${escHtml(featured.title)}</h3>
            <div class="featured-project__meta">
              ${featured.ubicacion ? `<div class="featured-project__meta-item"><strong>Ubicación</strong>${escHtml(featured.ubicacion)}</div>` : ''}
              ${featured.superficie ? `<div class="featured-project__meta-item"><strong>Superficie</strong>${escHtml(featured.superficie)}</div>` : ''}
              ${featured.unidades ? `<div class="featured-project__meta-item"><strong>Unidades</strong>${escHtml(featured.unidades)}</div>` : ''}
              ${featured.client ? `<div class="featured-project__meta-item"><strong>Cliente</strong>${escHtml(featured.client)}</div>` : ''}
            </div>
            <p class="featured-project__desc">${escHtml(featured.desc)}</p>
          </div>
        `;
      }
    }

    // Projects Grid
    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid && data.proyectos.length) {
      const isProyectosPage = window.location.pathname.includes('proyectos.html');
      
      // On index, show only principal projects (from secondary list to avoid duplicating featured).
      // On proyectos.html, show all projects (including featured).
      let displayProjects = isProyectosPage ? data.proyectos : secondary.filter(p => p.principal);

      let cardsHtml = displayProjects.map((p, i) => {
        const hasImage = p.image ? true : false;
        const bgStyle = hasImage ? `background-image: url('${p.image}'); background-size: cover; background-position: center;` : '';
        // Resolve service IDs to names
        const servicios = data.servicios || [];
        const servicioTags = (p.servicioIds || []).map(sid => {
          const s = servicios.find(x => x.id === sid);
          return s ? `<span class="project-card__tag">${escHtml(s.title)}</span>` : '';
        }).filter(Boolean).join('');
        return `
        <div class="project-card ${hasImage ? 'project-card--has-bg' : ''} reveal reveal-delay-${(i % 4) + 1}" style="${bgStyle}" onclick="openProjectModal(${p.id})">
          ${hasImage ? '<div class="project-card__overlay"></div>' : ''}
          <div class="project-card__content">
            <h4>${escHtml(p.title)}</h4>
            ${servicioTags ? `<div class="project-card__tags">${servicioTags}</div>` : ''}
          </div>
        </div>
      `}).join('');

      // Add "Ver todos" card at the end only on the main page
      if (!isProyectosPage) {
        cardsHtml += `
          <a href="proyectos.html" class="project-card project-card--more reveal reveal-delay-4" style="display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;text-decoration:none;background:var(--accent);color:var(--bg);min-height:200px;transition:transform 0.3s ease, background 0.3s ease;">
            <h4 style="color:var(--bg);margin-bottom:15px;font-size:1.2rem;">Ver todos los proyectos</h4>
            <div style="width:48px;height:48px;border-radius:50%;background:var(--bg);display:flex;align-items:center;justify-content:center;color:var(--accent);">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </a>
        `;
      }

      projectsGrid.innerHTML = cardsHtml;
    }

    // Special rendering for Residuos jobs page
    const isResiduosPage = window.location.pathname.includes('residuos-trabajos.html');
    if (isResiduosPage && data.residuos && data.residuos.trabajos) {
      const residuosGrid = document.getElementById('residuos-grid');
      if (residuosGrid) {
        let cardsHtml = data.residuos.trabajos.map((t, i) => `
          <div class="project-card reveal reveal-delay-${(i % 4) + 1}">
            <div class="project-card__year">${escHtml(t.year || '')}</div>
            <h4>${escHtml(t.title)}</h4>
            <p>${escHtml(t.desc)}</p>
            <div class="project-card__client">${t.client ? `Ubicación/Cliente: ${escHtml(t.client)}` : ''}</div>
          </div>
        `).join('');
        residuosGrid.innerHTML = cardsHtml;
      }
    }
  }

  // --- Equipos ---
  if (data.equipos && data.equipos.length) {
    const grid = document.querySelector('.flota__grid');
    if (grid) {
      grid.innerHTML = data.equipos.map((eq, i) => {
        const hasImage = eq.image ? true : false;
        const bgStyle = hasImage ? `background-image: url('${eq.image}'); background-size: cover; background-position: center;` : '';
        return `
        <div class="equip-card ${hasImage ? 'equip-card--has-bg' : ''} reveal reveal-delay-${(i % 4) + 1}" style="${bgStyle}">
          ${hasImage ? '<div class="equip-card__overlay"></div>' : ''}
          <div class="equip-card__content">
            <div class="equip-card__icon">
              <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="14" y="28" width="22" height="12" rx="1"/><circle cx="18" cy="44" r="4"/><circle cx="32" cy="44" r="4"/>
                <path d="M14 28l-6-14"/><path d="M8 14l-4 6h8"/><path d="M36 28l8-10"/><path d="M44 18l4 4-6 4"/>
              </svg>
            </div>
            <h4>${escHtml(eq.title)}</h4>
            <p>${escHtml(eq.desc)}</p>
          </div>
        </div>
      `}).join('');
    }
  }

  // --- Clientes ---
  if (data.clientes && data.clientes.length) {
    const grid = document.querySelector('.clientes__grid');
    if (grid) {
      grid.innerHTML = data.clientes.map((c, i) => `
        <div class="client-card reveal reveal-delay-${(i % 4) + 1}">
          ${c.image 
            ? `<img src="${escHtml(c.image)}" alt="${escHtml(c.name)}" class="client-card__logo">` 
            : `<span class="client-card__name">${escHtml(c.name)}</span>`
          }
        </div>
      `).join('');
    }
  }

  // --- Contacto ---
  if (data.contacto) {
    const infoItems = document.querySelectorAll('.contacto__info-item');
    if (infoItems.length >= 4) {
      // Dirección
      const dirP = infoItems[0].querySelector('p');
      if (dirP && data.contacto.direccion) dirP.textContent = data.contacto.direccion;

      // Teléfono
      const telA = infoItems[1].querySelector('a');
      if (telA && data.contacto.telefono) {
        telA.textContent = data.contacto.telefono;
        telA.href = 'tel:' + data.contacto.telefono.replace(/\s/g, '');
      }

      // WhatsApp
      const waA = infoItems[2].querySelector('a');
      if (waA && data.contacto.whatsapp) {
        waA.textContent = data.contacto.whatsapp;
        if (data.contacto.whatsappLink) waA.href = data.contacto.whatsappLink;
      }

      // Email
      const emA = infoItems[3].querySelector('a');
      if (emA && data.contacto.email) {
        emA.textContent = data.contacto.email;
        emA.href = 'mailto:' + data.contacto.email;
      }
    }

    // Footer RUT
    const rutEl = document.querySelector('.footer__rut');
    if (rutEl && data.contacto.rut) rutEl.textContent = 'RUT: ' + data.contacto.rut;

    // Poblar Selector de Tipo de Consulta con Servicios
    const selectTipo = document.getElementById('tipo');
    if (selectTipo && data.servicios && data.servicios.length > 0) {
      // Clear existing options except the first disabled one
      const firstOp = selectTipo.querySelector('option[disabled]');
      selectTipo.innerHTML = '';
      if (firstOp) selectTipo.appendChild(firstOp);
      
      data.servicios.forEach(s => {
        const option = document.createElement('option');
        option.value = s.id;
        option.textContent = s.title;
        selectTipo.appendChild(option);
      });
      
      const optionOtro = document.createElement('option');
      optionOtro.value = 'otro';
      optionOtro.textContent = 'Otro';
      selectTipo.appendChild(optionOtro);
    }
  }

  // Re-observe new elements for reveal animation
  setTimeout(() => {
    const newReveals = document.querySelectorAll('.reveal:not(.visible)');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    newReveals.forEach(el => observer.observe(el));
  }, 100);
}

function escHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ============================
// MAQUINARIA MODAL DISPLAY
// ============================
function openMaquinariaModal(equipoId, equipoTitle) {
  let modal = document.getElementById('maquinariaModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'maquinariaModal';
    modal.className = 'maquinaria-modal';
    modal.innerHTML = `
      <div class="maquinaria-modal__content">
        <button class="maquinaria-modal__close" onclick="closeMaquinariaModal()">&times;</button>
        <h3 id="maquinariaModalTitle" class="maquinaria-modal__title"></h3>
        <div id="maquinariaModalList" class="maquinaria-modal__list"></div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if(e.target === modal) closeMaquinariaModal();
    });
  }

  const maquinas = (window.transvialData.maquinaria || []).filter(m => String(m.equipoId) === String(equipoId));
  
  document.getElementById('maquinariaModalTitle').textContent = `Unidades: ${equipoTitle}`;
  
  const listContainer = document.getElementById('maquinariaModalList');
  if (maquinas.length === 0) {
    listContainer.innerHTML = '<p style="color:var(--gray-light);">No hay unidades registradas para esta categoría.</p>';
  } else {
    listContainer.innerHTML = maquinas.map(m => `
      <div class="maquinaria-item">
        <div class="maquinaria-item__media">
          ${m.image ? `<img src="${escHtml(m.image)}" alt="${escHtml(m.title)}" class="maquinaria-item__img">` : `<div class="maquinaria-item__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 17h-2v-4l2-8h10l2 8v4h-2m-10 0a2 2 0 1 0 4 0 2 2 0 1 0 -4 0m10 0a2 2 0 1 0 4 0 2 2 0 1 0 -4 0m-14-12h14" /></svg></div>`}
        </div>
        <div class="maquinaria-item__footer">
          <span class="maquinaria-item__name">${escHtml(m.title)}</span>
          <a href="#contacto" class="maquinaria-item__btn" onclick="closeMaquinariaModal()">Consultar</a>
        </div>
      </div>
    `).join('');
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMaquinariaModal() {
  const modal = document.getElementById('maquinariaModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ============================
// PROJECT DETAIL MODAL
// ============================
function openProjectModal(projectId) {
  const data = window.transvialData;
  if (!data || !data.proyectos) return;
  const p = data.proyectos.find(x => x.id === projectId);
  if (!p) return;

  let modal = document.getElementById('projectDetailModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'projectDetailModal';
    modal.className = 'project-modal';
    modal.innerHTML = `<div class="project-modal__content" id="projectModalContent"></div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeProjectModal();
    });
  }

  // Resolve services
  const servicios = data.servicios || [];
  const servicioHtml = (p.servicioIds || []).map(sid => {
    const s = servicios.find(x => x.id === sid);
    return s ? `<span class="project-modal__service-tag">${escHtml(s.title)}</span>` : '';
  }).filter(Boolean).join('');

  // Build meta items
  let metaHtml = '';
  if (p.year) metaHtml += `<div class="project-modal__meta-item"><strong>Período</strong>${escHtml(p.year)}</div>`;
  if (p.ubicacion) metaHtml += `<div class="project-modal__meta-item"><strong>Ubicación</strong>${escHtml(p.ubicacion)}</div>`;
  if (p.superficie) metaHtml += `<div class="project-modal__meta-item"><strong>Superficie</strong>${escHtml(p.superficie)}</div>`;
  if (p.unidades) metaHtml += `<div class="project-modal__meta-item"><strong>Unidades</strong>${escHtml(p.unidades)}</div>`;
  if (p.client) metaHtml += `<div class="project-modal__meta-item"><strong>Cliente</strong>${escHtml(p.client)}</div>`;

  const content = document.getElementById('projectModalContent');
  content.innerHTML = `
    <button class="project-modal__close" onclick="closeProjectModal()">&times;</button>
    ${p.image 
      ? `<img src="${escHtml(p.image)}" alt="${escHtml(p.title)}" class="project-modal__image">` 
      : `<div class="project-modal__image-placeholder">
          <svg width="48" height="48" viewBox="0 0 60 60" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3">
            <rect x="5" y="15" width="50" height="35" rx="2"/><circle cx="20" cy="28" r="5"/><path d="M5 42 l15 -10 10 8 12 -14 13 16"/>
          </svg>
        </div>`
    }
    <div class="project-modal__body">
      ${p.year ? `<div class="project-modal__year">${escHtml(p.year)}</div>` : ''}
      <h2 class="project-modal__title">${escHtml(p.title)}</h2>
      ${metaHtml ? `<div class="project-modal__meta">${metaHtml}</div>` : ''}
      ${p.desc ? `<p class="project-modal__desc">${escHtml(p.desc)}</p>` : ''}
      ${servicioHtml ? `<div class="project-modal__services">${servicioHtml}</div>` : ''}
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  const modal = document.getElementById('projectDetailModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}
