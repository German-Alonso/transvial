/* ============================================
   TRANSVIAL — ADMIN PANEL LOGIC
   ============================================ */

const ADMIN_PASSWORD = 'transvial2025';
const STORAGE_KEY = 'transvial_admin_data';

// ============================
// SUPABASE CONFIG
// ============================
const SUPABASE_URL = 'https://kazyjjgiwrffzznadjyt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imthenlqamdpd3JmZnp6bmFkanl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NDIyMTcsImV4cCI6MjA4OTAxODIxN30.kaP-VhAyWkfGDScJ774boKDipCJ7EJXUmLIzjNJ4ZAM';
let supabaseClient = null;
if (typeof window.supabase !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function') {
  try {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase connected');
  } catch (e) {
    console.warn('Supabase init failed:', e);
  }
} else {
  console.warn('Supabase SDK not loaded, using localStorage only');
}

// ============================
// DEFAULT DATA (mirrors static site)
// ============================
const DEFAULT_DATA = {
  maquinaria: [],
  hero: {
    badge: 'Desde 1990 en Canelones, Uruguay',
    title1: 'Obras que perduran.',
    title2: 'Resultados concretos.',
    subtitle: 'Más de 30 años ejecutando obras viales, civiles, hidráulicas y movimiento de tierras en todo el territorio uruguayo. Infraestructura pesada con rigor técnico y compromiso.',
    btnPrimary: 'Solicitar presupuesto',
    btnSecondary: 'Ver servicios',
    bgImage: ''
  },
  stats: [
    { number: '+30', label: 'Años de trayectoria' },
    { number: '+60', label: 'Proyectos ejecutados' },
    { number: '5', label: 'Líneas de servicio' },
    { number: '100%', label: 'Cobertura nacional' }
  ],
  servicios: [
    {
      id: 1, title: 'Movimiento de Tierras y Excavaciones',
      desc: 'Preparación de terrenos para obras de infraestructura con maquinaria pesada propia.',
      items: ['Excavaciones masivas y selectivas','Rellenos y compactación','Perfilado y nivelación de terrenos','Desmonte y limpieza de predios','Transporte de materiales']
    },
    {
      id: 2, title: 'Obras Viales, Civiles e Hidráulicas',
      desc: 'Construcción de caminos, puentes, alcantarillas y obras de drenaje para infraestructura pública y privada.',
      items: ['Construcción y mantenimiento de caminos','Obras de drenaje y alcantarillado','Puentes y obras hidráulicas','Pavimentación y sub-base','Señalización vial']
    },
    {
      id: 3, title: 'Construcción Civil',
      desc: 'Ejecución de obras civiles complejas: edificios, plataformas industriales, fundaciones y estructuras.',
      items: ['Edificios residenciales y comerciales','Plataformas industriales','Fundaciones y estructuras de hormigón','Excavaciones en roca','Obras subterráneas']
    },
    {
      id: 4, title: 'Gestión de Residuos',
      desc: 'Operación de sitios de disposición final de residuos con monitoreo ambiental y cumplimiento normativo.',
      items: ['Operación de sitios de disposición final','Monitoreo ambiental continuo','Mantenimiento perimetral','Personal permanente en obra','Trazabilidad de residuos CD&R']
    },
    {
      id: 5, title: 'Alquiler y Transporte de Equipos Viales',
      desc: 'Flota de maquinaria pesada disponible para alquiler y servicio de transporte especializado.',
      items: ['Excavadoras y retroexcavadoras','Motoniveladoras y compactadoras','Camiones volcadores','Transporte de cargas sobredimensionadas','Operadores calificados']
    },
    {
      id: 6, title: 'Venta de Materiales de Construcción',
      desc: 'Suministro de materiales para obra: pedregullo, arena, balasto, tosca y otros agregados.',
      items: ['Pedregullo y arena','Balasto y tosca','Piedra partida y bruta','Materiales seleccionados','Entrega en obra']
    }
  ],
  proyectos: [
    {
      id: 1, title: 'Montevideo Harbour', year: 'En ejecución', client: 'González Conde Construcciones',
      desc: 'Complejo residencial y comercial sobre la Rambla Baltasar Brum, Montevideo. Incluye 560 apartamentos, oficinas y paseo comercial.',
      ubicacion: 'Rambla Baltasar Brum, Montevideo', superficie: '~65.000 m² construidos', unidades: '560 apartamentos',
      featured: true, image: ''
    },
    { id: 2, title: 'Conaprole', year: '2008', client: 'Conaprole', desc: 'Plataforma industrial para la principal empresa láctea del país. Movimiento de tierras y preparación de terreno.', featured: false, image: '' },
    { id: 3, title: 'Louis Dreyfus', year: '2013 — 2015', client: 'Louis Dreyfus', desc: 'Infraestructura logística. Preparación de plataformas, accesos y obras civiles complementarias.', featured: false, image: '' },
    { id: 4, title: 'Constructora Santa María', year: '2012 — 2013', client: 'Constructora Santa María', desc: 'Excavación profunda en roca para fundaciones. Trabajo de alta complejidad técnica con maquinaria especializada.', featured: false, image: '' },
    { id: 5, title: 'Ferrocarril', year: 'Próximamente', client: 'Detalles a confirmar', desc: 'Proyecto de infraestructura ferroviaria. Detalles en proceso de definición.', featured: false, image: '' }
  ],
  equipos: [
    { id: 1, title: 'Excavadoras', desc: 'Equipos de excavación hidráulica para movimiento de tierras de gran volumen.', tag: 'Disponible para alquiler', tagType: 'rent' },
    { id: 2, title: 'Retroexcavadoras', desc: 'Máquinas versátiles para excavación, carga y movimiento de materiales en obra.', tag: 'Disponible para alquiler', tagType: 'rent' },
    { id: 3, title: 'Motoniveladoras', desc: 'Nivelación de terrenos, perfilado de caminos y mantenimiento de superficies.', tag: 'Disponible para alquiler', tagType: 'rent' },
    { id: 4, title: 'Compactadoras', desc: 'Rodillos vibratorios y compactadores para consolidación de suelos y bases.', tag: 'Disponible para alquiler', tagType: 'rent' },
    { id: 5, title: 'Camiones Volcadores', desc: 'Transporte de materiales a granel: tierra, pedregullo, arena y escombros.', tag: 'Disponible para alquiler', tagType: 'rent' },
    { id: 6, title: 'Montacargas', desc: 'Equipos de elevación para carga y descarga de materiales pesados.', tag: 'Disponible para alquiler', tagType: 'rent' },
    { id: 7, title: 'Plataformas Sobredimensionadas', desc: 'Transporte de cargas especiales y equipos sobredimensionados con escoltas.', tag: 'Disponible para alquiler', tagType: 'rent' },
    { id: 8, title: 'Laboratorio de Suelos In Situ', desc: 'Ensayos de densidad, humedad y compactación directamente en obra. Diferencial técnico.', tag: 'Diferencial técnico', tagType: 'tech' }
  ],
  clientes: [
    { id: 1, name: 'Conaprole' },
    { id: 2, name: 'ANCAP' },
    { id: 3, name: 'Louis Dreyfus' },
    { id: 4, name: 'Salfacorp' },
    { id: 5, name: 'González Conde Construcciones' },
    { id: 6, name: 'Intendencia de Canelones' },
    { id: 7, name: 'Frigorífico Canelones' },
    { id: 8, name: 'Procosertel' }
  ],
  contacto: {
    direccion: 'Ruta 81 Km. 23, San Antonio, Canelones, Uruguay',
    telefono: '+598 4335 9036',
    whatsapp: '+598 99 332817',
    whatsappLink: 'https://wa.me/59899332817',
    email: 'info@transvial.com.uy',
    rut: '02 011300 0019'
  },
  residuos: {
    desc1: 'Transvial Ltda. opera sitios de disposición final de residuos con equipos propios, personal permanente y monitoreo ambiental continuo. Contamos con experiencia en la gestión integral de residuos de construcción y demolición (CD&R), residuos sólidos urbanos y disposición final controlada.',
    desc2: 'Nuestro equipo asegura el cumplimiento de las normativas ambientales vigentes, con trazabilidad de residuos, mantenimiento perimetral de los sitios y atención 24/7 ante contingencias.',
    trabajos: [
      { id: 1, title: 'Operación Sitio de Disposición Final — Canelones', year: '2015 — Presente', client: 'Intendencia de Canelones', desc: 'Operación continua del sitio de disposición final de residuos sólidos urbanos. Incluye gestión diaria, compactación, cobertura y monitoreo ambiental.', image: '' },
      { id: 2, title: 'Gestión de Residuos CD&R — Montevideo Harbour', year: '2023 — Presente', client: 'González Conde Construcciones', desc: 'Gestión integral de residuos de construcción y demolición del proyecto Montevideo Harbour. Clasificación, transporte y disposición final con trazabilidad completa.', image: '' },
      { id: 3, title: 'Limpieza y Remediación — Predio Industrial', year: '2020 — 2021', client: 'Confidencial', desc: 'Limpieza de predio industrial contaminado. Remoción de residuos acumulados, clasificación de materiales y remediación del suelo según normativa del MVOTMA.', image: '' }
    ]
  },
  imagenes: {
    hero: '',
    featured: '',
    gallery: []
  }
};

// ============================
// DATA MANAGEMENT
// ============================
let data = {};
let isSaving = false;

async function loadData() {
  // Try Supabase first
  if (supabaseClient) {
    try {
      const { data: rows, error } = await supabaseClient
        .from('site_content')
        .select('data')
        .eq('id', 1)
        .single();
      if (!error && rows && rows.data && Object.keys(rows.data).length > 0) {
        data = rows.data;
        // Merge with defaults for any missing keys
        for (const key in DEFAULT_DATA) {
          if (!(key in data)) data[key] = JSON.parse(JSON.stringify(DEFAULT_DATA[key]));
        }
        // Update localStorage cache
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        console.log('Data loaded from Supabase');
        return;
      }
    } catch (e) {
      console.warn('Supabase load failed, falling back to localStorage', e);
    }
  }

  // Fallback to localStorage
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      data = JSON.parse(stored);
      for (const key in DEFAULT_DATA) {
        if (!(key in data)) data[key] = JSON.parse(JSON.stringify(DEFAULT_DATA[key]));
      }
    } catch (e) {
      data = JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
  } else {
    data = JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}

function saveData() {
  // Always save to localStorage (instant cache)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

  // Save to Supabase (async, non-blocking)
  if (supabaseClient && !isSaving) {
    isSaving = true;
    supabaseClient
      .from('site_content')
      .update({ data: data, updated_at: new Date().toISOString() })
      .eq('id', 1)
      .then(({ error }) => {
        if (error) {
          console.error('Supabase save error:', error);
          // Try insert if row doesn't exist
          return supabaseClient
            .from('site_content')
            .upsert({ id: 1, data: data, updated_at: new Date().toISOString() });
        }
      })
      .then(() => {
        console.log('Data saved to Supabase');
      })
      .catch(e => console.error('Supabase save failed:', e))
      .finally(() => { isSaving = false; });
  }
}

function getNextId(arr) {
  if (!arr.length) return 1;
  return Math.max(...arr.map(i => i.id || 0)) + 1;
}

// ============================
// TOAST
// ============================
function showToast(msg = 'Guardado correctamente') {
  const toast = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ============================
// LOGIN
// ============================
document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const pw = document.getElementById('loginPassword').value;
  if (pw === ADMIN_PASSWORD) {
    document.getElementById('loginOverlay').style.display = 'none';
    document.getElementById('adminLayout').style.display = 'flex';
    await loadData();
    renderAll();
  } else {
    document.getElementById('loginError').textContent = 'Contraseña incorrecta';
  }
});

// ============================
// SIDEBAR NAVIGATION
// ============================
document.querySelectorAll('.sidebar__link[data-section]').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const section = this.dataset.section;
    // Update active link
    document.querySelectorAll('.sidebar__link').forEach(l => l.classList.remove('active'));
    this.classList.add('active');
    // Show section
    document.querySelectorAll('.admin-section').forEach(s => s.style.display = 'none');
    const target = document.getElementById('sec-' + section);
    if (target) target.style.display = 'block';
    // Close mobile sidebar
    document.getElementById('sidebar').classList.remove('open');
  });
});

// Mobile sidebar toggle
document.getElementById('sidebarToggle').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
});

// ============================
// MODAL
// ============================
function openModal(title, bodyHTML, onSave) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = bodyHTML;
  document.getElementById('modalOverlay').classList.add('active');
  document.getElementById('modalSave').onclick = () => {
    onSave();
    closeModal();
  };
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
}

// Close modal on overlay click
document.getElementById('modalOverlay').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeModal();
});

// ============================
// RENDER ALL
// ============================
function renderAll() {
  renderHero();
  renderStats();
  renderServicios();
  renderResiduos();
  renderProyectos();
  renderEquipos();
  renderMaquinaria();
  renderClientes();
  renderContacto();
}

// ============================
// HERO
// ============================
function renderHero() {
  document.getElementById('heroBadge').value = data.hero.badge || '';
  document.getElementById('heroTitle1').value = data.hero.title1 || '';
  document.getElementById('heroTitle2').value = data.hero.title2 || '';
  document.getElementById('heroSubtitle').value = data.hero.subtitle || '';
  document.getElementById('heroBtnPrimary').value = data.hero.btnPrimary || '';
  document.getElementById('heroBtnSecondary').value = data.hero.btnSecondary || '';
  
  document.getElementById('heroDropzone1').innerHTML = imageUploadHtml('heroBgImage1', data.hero.bgImage1 || data.hero.bgImage || '');
  document.getElementById('heroDropzone2').innerHTML = imageUploadHtml('heroBgImage2', data.hero.bgImage2 || '');
  
  document.getElementById('heroBgConstruccion').value = data.hero.bgChoiceConstruccion || '1';
  document.getElementById('heroBgResiduos').value = data.hero.bgChoiceResiduos || '1';
}

function saveHero() {
  data.hero = {
    badge: document.getElementById('heroBadge').value,
    title1: document.getElementById('heroTitle1').value,
    title2: document.getElementById('heroTitle2').value,
    subtitle: document.getElementById('heroSubtitle').value,
    btnPrimary: document.getElementById('heroBtnPrimary').value,
    btnSecondary: document.getElementById('heroBtnSecondary').value,
    bgImage1: document.getElementById('heroBgImage1').value,
    bgImage2: document.getElementById('heroBgImage2').value,
    bgChoiceConstruccion: document.getElementById('heroBgConstruccion').value,
    bgChoiceResiduos: document.getElementById('heroBgResiduos').value
  };
  saveData();
  showToast('Hero actualizado');
}

// ============================
// STATS
// ============================
function renderStats() {
  const container = document.getElementById('statsContainer');
  container.innerHTML = data.stats.map((stat, i) => `
    <div class="stat-edit-row">
      <div class="stat-number">${stat.number}</div>
      <div class="form-field" style="flex:0 0 120px;">
        <label>Número</label>
        <input type="text" value="${escapeHtml(stat.number)}" onchange="data.stats[${i}].number=this.value; this.closest('.stat-edit-row').querySelector('.stat-number').textContent=this.value;">
      </div>
      <div class="form-field">
        <label>Etiqueta</label>
        <input type="text" value="${escapeHtml(stat.label)}" onchange="data.stats[${i}].label=this.value;">
      </div>
    </div>
  `).join('');
}

function saveStats() {
  saveData();
  showToast('Estadísticas actualizadas');
}

// ============================
// SERVICIOS
// ============================
function renderServicios() {
  const container = document.getElementById('serviciosContainer');
  container.innerHTML = data.servicios.map(s => `
    <div class="admin-item">
      <div class="admin-item__header">
        <span class="admin-item__number">#${String(s.id).padStart(2,'0')}</span>
        <div class="admin-item__actions">
          <button class="admin-item__btn" onclick="editServicio(${s.id})" title="Editar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="admin-item__btn admin-item__btn--delete" onclick="deleteServicio(${s.id})" title="Eliminar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
          </button>
        </div>
      </div>
      <h3>${escapeHtml(s.title)}</h3>
      <p>${escapeHtml(s.desc)}</p>
      <div class="admin-item__meta">${s.items ? s.items.length + ' ítems' : ''}</div>
    </div>
  `).join('');
}

function addServicio() {
  const id = getNextId(data.servicios);
  openModal('Agregar Servicio', servicioFormHtml(), () => {
    data.servicios.push({
      id,
      title: document.getElementById('m_title').value,
      desc: document.getElementById('m_desc').value,
      items: document.getElementById('m_items').value.split('\n').filter(l => l.trim())
    });
    saveData();
    renderServicios();
    showToast('Servicio agregado');
  });
}

function editServicio(id) {
  const s = data.servicios.find(x => x.id === id);
  if (!s) return;
  openModal('Editar Servicio', servicioFormHtml(s), () => {
    s.title = document.getElementById('m_title').value;
    s.desc = document.getElementById('m_desc').value;
    s.items = document.getElementById('m_items').value.split('\n').filter(l => l.trim());
    saveData();
    renderServicios();
    showToast('Servicio actualizado');
  });
}

function deleteServicio(id) {
  confirmDelete('¿Seguro que querés eliminar este servicio?', () => {
    data.servicios = data.servicios.filter(x => x.id !== id);
    saveData();
    renderServicios();
    showToast('Servicio eliminado');
  });
}

function servicioFormHtml(s = {}) {
  return `
    <div class="form-field">
      <label>Título</label>
      <input type="text" id="m_title" value="${escapeHtml(s.title || '')}">
    </div>
    <div class="form-field">
      <label>Descripción</label>
      <textarea id="m_desc" rows="3">${escapeHtml(s.desc || '')}</textarea>
    </div>
    <div class="form-field">
      <label>Ítems (uno por línea)</label>
      <textarea id="m_items" rows="6">${s.items ? s.items.join('\n') : ''}</textarea>
    </div>
  `;
}

// ============================
// RESIDUOS
// ============================
function renderResiduos() {
  const r = data.residuos || { desc1: '', desc2: '', trabajos: [] };
  document.getElementById('residuosDesc1').value = r.desc1 || '';
  document.getElementById('residuosDesc2').value = r.desc2 || '';

  const container = document.getElementById('residuosContainer');
  container.innerHTML = (r.trabajos || []).map(t => `
    <div class="admin-item">
      <div class="admin-item__header">
        <span class="admin-item__number">${escapeHtml(t.year || '')}</span>
        <div class="admin-item__actions">
          <button class="admin-item__btn" onclick="editResiduo(${t.id})" title="Editar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="admin-item__btn admin-item__btn--delete" onclick="deleteResiduo(${t.id})" title="Eliminar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
          </button>
        </div>
      </div>
      <h3>${escapeHtml(t.title)}</h3>
      <p>${escapeHtml(t.desc)}</p>
      <div class="admin-item__meta">
        <span>Cliente: ${escapeHtml(t.client || '')}</span>
        ${t.principal ? '<span style="color:var(--yellow);margin-left:10px;">◆ Principal</span>' : ''}
      </div>
      ${t.image ? `<div class="image-preview" style="margin-top:12px;"><img src="${escapeHtml(t.image)}" alt=""></div>` : ''}
    </div>
  `).join('');
}

function saveResiduosDesc() {
  if (!data.residuos) data.residuos = { desc1: '', desc2: '', trabajos: [] };
  data.residuos.desc1 = document.getElementById('residuosDesc1').value;
  data.residuos.desc2 = document.getElementById('residuosDesc2').value;
  saveData();
  showToast('Descripción de residuos actualizada');
}

function addResiduo() {
  if (!data.residuos) data.residuos = { desc1: '', desc2: '', trabajos: [] };
  if (!data.residuos.trabajos) data.residuos.trabajos = [];
  const id = getNextId(data.residuos.trabajos);
  openModal('Agregar Trabajo de Residuos', residuoFormHtml(), () => {
    data.residuos.trabajos.push({
      id,
      title: document.getElementById('m_title').value,
      year: document.getElementById('m_year').value,
      client: document.getElementById('m_client').value,
      desc: document.getElementById('m_desc').value,
      image: document.getElementById('m_image').value,
      principal: document.getElementById('m_principal').checked
    });
    saveData();
    renderResiduos();
    showToast('Trabajo de residuos agregado');
  });
}

function editResiduo(id) {
  const t = data.residuos.trabajos.find(x => x.id === id);
  if (!t) return;
  openModal('Editar Trabajo de Residuos', residuoFormHtml(t), () => {
    t.title = document.getElementById('m_title').value;
    t.year = document.getElementById('m_year').value;
    t.client = document.getElementById('m_client').value;
    t.desc = document.getElementById('m_desc').value;
    t.image = document.getElementById('m_image').value;
    t.principal = document.getElementById('m_principal').checked;
    saveData();
    renderResiduos();
    showToast('Trabajo actualizado');
  });
}

function deleteResiduo(id) {
  confirmDelete('¿Seguro que querés eliminar este trabajo?', () => {
    data.residuos.trabajos = data.residuos.trabajos.filter(x => x.id !== id);
    saveData();
    renderResiduos();
    showToast('Trabajo eliminado');
  });
}

function residuoFormHtml(t = {}) {
  return `
    <div class="form-field">
      <label>Título del trabajo</label>
      <input type="text" id="m_title" value="${escapeHtml(t.title || '')}">
    </div>
    <div class="form-field">
      <label>Año / Período</label>
      <input type="text" id="m_year" value="${escapeHtml(t.year || '')}">
    </div>
    <div class="form-field">
      <label>Cliente</label>
      <input type="text" id="m_client" value="${escapeHtml(t.client || '')}">
    </div>
    <div class="form-field">
      <label>Descripción</label>
      <textarea id="m_desc" rows="4">${escapeHtml(t.desc || '')}</textarea>
    </div>
    ${imageUploadHtml('m_image', t.image)}
    <div class="form-field" style="flex-direction:row; align-items:center; gap:10px;">
      <input type="checkbox" id="m_principal" ${t.principal ? 'checked' : ''} style="width:auto; margin-bottom:0;">
      <label for="m_principal" style="margin-bottom:0; cursor:pointer;">Trabajo principal (Mostrar en inicio)</label>
    </div>
  `;
}

// ============================
// PROYECTOS
// ============================
function renderProyectos() {
  const container = document.getElementById('proyectosContainer');
  container.innerHTML = data.proyectos.map(p => {
    const servicioNames = (p.servicioIds || []).map(sid => {
      const s = data.servicios.find(x => x.id === sid);
      return s ? escapeHtml(s.title) : null;
    }).filter(Boolean);
    const servicioTags = servicioNames.length > 0 
      ? `<div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:6px;">${servicioNames.map(n => `<span style="font-size:0.7rem;padding:3px 8px;background:rgba(240,180,0,0.12);border:1px solid rgba(240,180,0,0.25);color:var(--yellow);border-radius:2px;font-family:var(--font-display);text-transform:uppercase;letter-spacing:0.05em;">${n}</span>`).join('')}</div>`
      : '';
    return `
    <div class="admin-item">
      <div class="admin-item__header">
        <span class="admin-item__number">${escapeHtml(p.year || '')}</span>
        <div class="admin-item__actions">
          <button class="admin-item__btn" onclick="editProyecto(${p.id})" title="Editar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="admin-item__btn admin-item__btn--delete" onclick="deleteProyecto(${p.id})" title="Eliminar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
          </button>
        </div>
      </div>
      <h3>${escapeHtml(p.title)}</h3>
      <p>${escapeHtml(p.desc)}</p>
      <div class="admin-item__meta">
        <span>Cliente: ${escapeHtml(p.client || '')}</span>
        ${p.featured ? '<span style="color:var(--yellow);margin-left:10px;">★ Destacado</span>' : ''}
        ${p.principal ? '<span style="color:var(--yellow);margin-left:10px;">◆ Principal</span>' : ''}
      </div>
      ${servicioTags}
      ${p.image ? `<div class="image-preview" style="margin-top:12px;"><img src="${escapeHtml(p.image)}" alt=""></div>` : ''}
    </div>
  `}).join('');
}

function getSelectedServicioIds() {
  return Array.from(document.querySelectorAll('.m_servicio_cb:checked')).map(cb => Number(cb.value));
}

function addProyecto() {
  const id = getNextId(data.proyectos);
  openModal('Agregar Proyecto', proyectoFormHtml(), () => {
    data.proyectos.push({
      id,
      title: document.getElementById('m_title').value,
      year: document.getElementById('m_year').value,
      client: document.getElementById('m_client').value,
      desc: document.getElementById('m_desc').value,
      ubicacion: document.getElementById('m_ubicacion').value,
      superficie: document.getElementById('m_superficie').value,
      unidades: document.getElementById('m_unidades').value,
      featured: document.getElementById('m_featured').checked,
      principal: document.getElementById('m_principal').checked,
      image: document.getElementById('m_image').value,
      servicioIds: getSelectedServicioIds()
    });
    saveData();
    renderProyectos();
    showToast('Proyecto agregado');
  });
}

function editProyecto(id) {
  const p = data.proyectos.find(x => x.id === id);
  if (!p) return;
  openModal('Editar Proyecto', proyectoFormHtml(p), () => {
    p.title = document.getElementById('m_title').value;
    p.year = document.getElementById('m_year').value;
    p.client = document.getElementById('m_client').value;
    p.desc = document.getElementById('m_desc').value;
    p.ubicacion = document.getElementById('m_ubicacion').value;
    p.superficie = document.getElementById('m_superficie').value;
    p.unidades = document.getElementById('m_unidades').value;
    p.featured = document.getElementById('m_featured').checked;
    p.principal = document.getElementById('m_principal').checked;
    p.image = document.getElementById('m_image').value;
    p.servicioIds = getSelectedServicioIds();
    saveData();
    renderProyectos();
    showToast('Proyecto actualizado');
  });
}

function deleteProyecto(id) {
  confirmDelete('¿Seguro que querés eliminar este proyecto?', () => {
    data.proyectos = data.proyectos.filter(x => x.id !== id);
    saveData();
    renderProyectos();
    showToast('Proyecto eliminado');
  });
}

function proyectoFormHtml(p = {}) {
  const selectedIds = p.servicioIds || [];
  const serviciosCheckboxes = data.servicios.map(s => {
    const checked = selectedIds.includes(s.id) ? 'checked' : '';
    return `
      <label style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);cursor:pointer;transition:border-color 0.2s;font-size:0.9rem;color:var(--text-secondary);">
        <input type="checkbox" class="m_servicio_cb" value="${s.id}" ${checked} style="width:auto;margin:0;">
        ${escapeHtml(s.title)}
      </label>
    `;
  }).join('');

  return `
    <div class="form-field">
      <label>Título</label>
      <input type="text" id="m_title" value="${escapeHtml(p.title || '')}">
    </div>
    <div class="form-field">
      <label>Año / Período</label>
      <input type="text" id="m_year" value="${escapeHtml(p.year || '')}">
    </div>
    <div class="form-field">
      <label>Cliente</label>
      <input type="text" id="m_client" value="${escapeHtml(p.client || '')}">
    </div>
    <div class="form-field">
      <label>Descripción</label>
      <textarea id="m_desc" rows="3">${escapeHtml(p.desc || '')}</textarea>
    </div>
    <div class="form-field">
      <label>Ubicación</label>
      <input type="text" id="m_ubicacion" value="${escapeHtml(p.ubicacion || '')}">
    </div>
    <div class="form-field">
      <label>Superficie</label>
      <input type="text" id="m_superficie" value="${escapeHtml(p.superficie || '')}">
    </div>
    <div class="form-field">
      <label>Unidades</label>
      <input type="text" id="m_unidades" value="${escapeHtml(p.unidades || '')}">
    </div>
    ${imageUploadHtml('m_image', p.image)}
    <div class="form-field">
      <label>Servicios realizados</label>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:4px;">
        ${serviciosCheckboxes}
      </div>
    </div>
    <div class="form-field" style="display:flex;align-items:center;gap:10px;">
      <input type="checkbox" id="m_featured" ${p.featured ? 'checked' : ''} style="width:auto;">
      <label for="m_featured" style="margin:0;">Proyecto destacado</label>
    </div>
    <div class="form-field" style="display:flex;align-items:center;gap:10px;">
      <input type="checkbox" id="m_principal" ${p.principal ? 'checked' : ''} style="width:auto;">
      <label for="m_principal" style="margin:0;">Proyecto principal (Mostrar en inicio)</label>
    </div>
  `;
}

// ============================
// EQUIPOS
// ============================
function renderEquipos() {
  const container = document.getElementById('equiposContainer');
  container.innerHTML = data.equipos.map(eq => `
    <div class="admin-item">
      <div class="admin-item__header">
        <span class="admin-item__number">#${String(eq.id).padStart(2,'0')}</span>
        <div class="admin-item__actions">
          <button class="admin-item__btn" onclick="editEquipo(${eq.id})" title="Editar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="admin-item__btn admin-item__btn--delete" onclick="deleteEquipo(${eq.id})" title="Eliminar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
          </button>
        </div>
      </div>
      <h3>${escapeHtml(eq.title)}</h3>
      <p>${escapeHtml(eq.desc)}</p>
    </div>
  `).join('');
}

function addEquipo() {
  const id = getNextId(data.equipos);
  openModal('Agregar Equipo', equipoFormHtml(), () => {
    data.equipos.push({
      id,
      title: document.getElementById('m_title').value,
      desc: document.getElementById('m_desc').value,
      image: document.getElementById('m_image').value
    });
    saveData();
    renderEquipos();
    showToast('Equipo agregado');
  });
}

function editEquipo(id) {
  const eq = data.equipos.find(x => x.id === id);
  if (!eq) return;
  openModal('Editar Equipo', equipoFormHtml(eq), () => {
    eq.title = document.getElementById('m_title').value;
    eq.desc = document.getElementById('m_desc').value;
    eq.image = document.getElementById('m_image').value;
    saveData();
    renderEquipos();
    showToast('Equipo actualizado');
  });
}

function deleteEquipo(id) {
  confirmDelete('¿Seguro que querés eliminar este equipo?', () => {
    data.equipos = data.equipos.filter(x => x.id !== id);
    saveData();
    renderEquipos();
    showToast('Equipo eliminado');
  });
}

function equipoFormHtml(eq = {}) {
  return `
    <div class="form-field">
      <label>Nombre</label>
      <input type="text" id="m_title" value="${escapeHtml(eq.title || '')}">
    </div>
    <div class="form-field">
      <label>Descripción / Función</label>
      <textarea id="m_desc" rows="3">${escapeHtml(eq.desc || '')}</textarea>
    </div>
    ${imageUploadHtml('m_image', eq.image)}
  `;
}

// ============================
// MAQUINARIA
// ============================
function renderMaquinaria() {
  const container = document.getElementById('maquinariaContainer');
  container.innerHTML = (data.maquinaria || []).map(m => `
    <div class="admin-item">
      <div class="admin-item__header">
        <span class="admin-item__number">ID: ${m.id}</span>
        <div class="admin-item__actions">
          <button class="admin-item__btn" onclick="editMaquinaria(${m.id})" title="Editar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="admin-item__btn admin-item__btn--delete" onclick="deleteMaquinaria(${m.id})" title="Eliminar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
          </button>
        </div>
      </div>
      <h3>${escapeHtml(m.title)}</h3>
      <div class="admin-item__meta" style="margin-top:8px;">
        <span>Categoría asignada (Equipo): ${escapeHtml(getEquipoName(m.equipoId))}</span>
      </div>
    </div>
  `).join('');
}

function getEquipoName(equipoId) {
  const eq = data.equipos.find(e => String(e.id) === String(equipoId));
  return eq ? eq.title : 'Desconocida';
}

function addMaquinaria() {
  if (!data.maquinaria) data.maquinaria = [];
  const id = getNextId(data.maquinaria);
  openModal('Agregar Maquinaria', maquinariaFormHtml(), () => {
    data.maquinaria.push({
      id,
      title: document.getElementById('m_maq_title').value,
      image: document.getElementById('m_maq_image').value,
      equipoId: document.getElementById('m_maq_equipoId').value
    });
    saveData();
    renderMaquinaria();
    showToast('Maquinaria agregada');
  });
}

function editMaquinaria(id) {
  const m = data.maquinaria.find(x => x.id === id);
  if (!m) return;
  openModal('Editar Maquinaria', maquinariaFormHtml(m), () => {
    m.title = document.getElementById('m_maq_title').value;
    m.image = document.getElementById('m_maq_image').value;
    m.equipoId = document.getElementById('m_maq_equipoId').value;
    saveData();
    renderMaquinaria();
    showToast('Maquinaria actualizada');
  });
}

function deleteMaquinaria(id) {
  confirmDelete('¿Seguro que querés eliminar esta maquinaria?', () => {
    data.maquinaria = data.maquinaria.filter(x => x.id !== id);
    saveData();
    renderMaquinaria();
    showToast('Maquinaria eliminada');
  });
}

function maquinariaFormHtml(m = {}) {
  const options = data.equipos.map(eq => `<option value="${eq.id}" ${String(m.equipoId) === String(eq.id) ? 'selected' : ''}>${escapeHtml(eq.title)}</option>`).join('');
  return `
    <div class="form-field">
      <label>Nombre del modelo / unidad</label>
      <input type="text" id="m_maq_title" value="${escapeHtml(m.title || '')}" placeholder="Ej: Caterpillar 320">
    </div>
    ${imageUploadHtml('m_maq_image', m.image)}
    <div class="form-field">
      <label>Categoría (Equipo)</label>
      <select id="m_maq_equipoId">
        <option value="">-- Seleccionar categoría --</option>
        ${options}
      </select>
    </div>
  `;
}

// ============================
// CLIENTES
// ============================
function renderClientes() {
  const container = document.getElementById('clientesContainer');
  container.innerHTML = data.clientes.map(c => `
    <div class="admin-item" style="padding:18px 24px;">
      <div class="admin-item__header" style="margin-bottom:0;">
        <div style="display:flex;align-items:center;gap:12px;">
          ${c.image ? `<img src="${escapeHtml(c.image)}" alt="" style="width:40px;height:40px;object-fit:contain;border-radius:4px;background:rgba(255,255,255,0.05);">` : ''}
          <h3 style="margin:0;">${escapeHtml(c.name)}</h3>
        </div>
        <div class="admin-item__actions">
          <button class="admin-item__btn" onclick="editCliente(${c.id})" title="Editar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="admin-item__btn admin-item__btn--delete" onclick="deleteCliente(${c.id})" title="Eliminar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function addCliente() {
  openModal('Agregar Cliente', `
    <div class="form-field">
      <label>Nombre del cliente</label>
      <input type="text" id="m_name" value="">
    </div>
    ${imageUploadHtml('m_image', '')}
  `, () => {
    const id = getNextId(data.clientes);
    data.clientes.push({ id, name: document.getElementById('m_name').value, image: document.getElementById('m_image').value });
    saveData();
    renderClientes();
    showToast('Cliente agregado');
  });
}

function editCliente(id) {
  const c = data.clientes.find(x => x.id === id);
  if (!c) return;
  openModal('Editar Cliente', `
    <div class="form-field">
      <label>Nombre del cliente</label>
      <input type="text" id="m_name" value="${escapeHtml(c.name)}">
    </div>
    ${imageUploadHtml('m_image', c.image)}
  `, () => {
    c.name = document.getElementById('m_name').value;
    c.image = document.getElementById('m_image').value;
    saveData();
    renderClientes();
    showToast('Cliente actualizado');
  });
}

function deleteCliente(id) {
  confirmDelete('¿Seguro que querés eliminar este cliente?', () => {
    data.clientes = data.clientes.filter(x => x.id !== id);
    saveData();
    renderClientes();
    showToast('Cliente eliminado');
  });
}

// ============================
// CONTACTO
// ============================
function renderContacto() {
  document.getElementById('contactDireccion').value = data.contacto.direccion || '';
  document.getElementById('contactTelefono').value = data.contacto.telefono || '';
  document.getElementById('contactWhatsapp').value = data.contacto.whatsapp || '';
  document.getElementById('contactWhatsappLink').value = data.contacto.whatsappLink || '';
  document.getElementById('contactEmail').value = data.contacto.email || '';
  document.getElementById('contactRut').value = data.contacto.rut || '';
}

function saveContacto() {
  data.contacto = {
    direccion: document.getElementById('contactDireccion').value,
    telefono: document.getElementById('contactTelefono').value,
    whatsapp: document.getElementById('contactWhatsapp').value,
    whatsappLink: document.getElementById('contactWhatsappLink').value,
    email: document.getElementById('contactEmail').value,
    rut: document.getElementById('contactRut').value
  };
  saveData();
  showToast('Contacto actualizado');
}

// ============================
// EXPORT / IMPORT
// ============================
document.getElementById('btnExport').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `transvial_backup_${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Datos exportados');
});

document.getElementById('btnImport').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const imported = JSON.parse(ev.target.result);
      data = imported;
      saveData();
      renderAll();
      showToast('Datos importados correctamente (local + nube)');
    } catch (err) {
      alert('Error al importar: archivo inválido');
    }
  };
  reader.readAsText(file);
  e.target.value = '';
});

// ============================
// UTILS
// ============================
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

// ============================
// CONFIRM DELETE MODAL
// ============================
let pendingDeleteCallback = null;

function confirmDelete(message, callback) {
  pendingDeleteCallback = callback;
  document.getElementById('confirmMsg').textContent = message;
  document.getElementById('confirmOverlay').style.display = 'flex';
  document.getElementById('confirmYes').onclick = function() {
    document.getElementById('confirmOverlay').style.display = 'none';
    if (pendingDeleteCallback) {
      pendingDeleteCallback();
      pendingDeleteCallback = null;
    }
  };
}

function cancelDelete() {
  document.getElementById('confirmOverlay').style.display = 'none';
  pendingDeleteCallback = null;
}

// ============================
// IMAGE UPLOAD (Supabase Storage)
// ============================
async function uploadImageToSupabase(file, dropzoneEl) {
  if (!supabaseClient) {
    alert('Error: Supabase no está conectado.');
    return null;
  }
  
  const spinner = document.createElement('div');
  spinner.className = 'upload-spinner';
  spinner.innerHTML = `
    <div class="upload-spinner__icon"></div>
    <div class="upload-spinner__text">Subiendo...</div>
  `;
  dropzoneEl.appendChild(spinner);

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabaseClient.storage
      .from('imagenes')
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (error) throw error;

    const { data: publicData } = supabaseClient.storage
      .from('imagenes')
      .getPublicUrl(filePath);

    return publicData.publicUrl;
  } catch (error) {
    console.error('Upload Error:', error);
    alert('Error al subir: ' + error.message);
    return null;
  } finally {
    spinner.remove();
  }
}

function imageUploadHtml(inputId, currentUrl = '') {
  return `
    <div class="form-field full">
      <label>IMAGEN (Arrastra o selecciona)</label>
      <input type="hidden" id="${inputId}" value="${escapeHtml(currentUrl)}">
      <div class="image-upload-zone" data-target="${inputId}">
        <input type="file" accept="image/*" class="image-upload-input">
        <div class="image-upload-zone__content">
          <svg class="image-upload-zone__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          <span class="image-upload-zone__text">Arrastra una imagen aquí o <strong>selecciona archivo</strong></span>
        </div>
      </div>
      <div class="image-preview ${currentUrl ? '' : 'image-preview--empty'}" id="preview_${inputId}">
        ${currentUrl ? `<img src="${escapeHtml(currentUrl)}" alt="Preview">` : 'Sin imagen'}
      </div>
    </div>
  `;
}

document.addEventListener('dragover', (e) => {
  const dropzone = e.target.closest('.image-upload-zone');
  if (dropzone) { e.preventDefault(); dropzone.classList.add('dragover'); }
});

document.addEventListener('dragleave', (e) => {
  const dropzone = e.target.closest('.image-upload-zone');
  if (dropzone) { e.preventDefault(); dropzone.classList.remove('dragover'); }
});

document.addEventListener('drop', async (e) => {
  const dropzone = e.target.closest('.image-upload-zone');
  if (dropzone) {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageSelection(e.dataTransfer.files[0], dropzone);
    }
  }
});

document.addEventListener('change', async (e) => {
  if (e.target.classList.contains('image-upload-input')) {
    const dropzone = e.target.closest('.image-upload-zone');
    if (e.target.files && e.target.files.length > 0) {
      handleImageSelection(e.target.files[0], dropzone);
    }
  }
});

async function handleImageSelection(file, dropzone) {
  if (!file.type.startsWith('image/')) {
    alert('Por favor selecciona un archivo de imagen válido.');
    return;
  }
  const targetId = dropzone.dataset.target;
  const url = await uploadImageToSupabase(file, dropzone);
  if (url) {
    document.getElementById(targetId).value = url;
    const previewContainer = document.getElementById(`preview_${targetId}`);
    previewContainer.className = 'image-preview';
    previewContainer.innerHTML = `<img src="${escapeHtml(url)}" alt="Preview">`;
    showToast('Imagen subida exitosamente');
  }
}
