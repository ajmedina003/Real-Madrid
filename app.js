// ======================= app.js =======================
// Chicos: lógica del "Hacer pedido" para playeras del Real Madrid.
// Lee el formulario, calcula total (modelo * cantidad + extras + envío)
// y muestra un resumen. Está escrito paso a paso y con comentarios.

/** Utilidad: formatea a moneda MXN */
function toMXN(num) {
  return Number(num || 0).toLocaleString('es-MX', {
    style: 'currency',
    currency: 'MXN'
  });
}

/** Utilidad: toma precio desde data-precio (en selects/checks) */
function getPrecioFromDataset(el) {
  const raw = el?.dataset?.precio;
  return raw ? Number(raw) : 0;
}

document.addEventListener('DOMContentLoaded', () => {
  // Referencias a elementos que usaremos:
  const form = document.getElementById('formPedido');
  const outNombre = document.getElementById('outNombre');
  const outLista = document.getElementById('outLista');
  const outTotal = document.getElementById('outTotal');
  const btnConfirmar = document.getElementById('btnConfirmar');
  const confirmNombre = document.getElementById('confirmNombre');

  // Toast UX (aviso corto)
  const toastBtn = document.getElementById('btnToast');
  const toastEl = document.getElementById('toastAviso');
  const toast = bootstrap.Toast.getOrCreateInstance(toastEl);
  toastBtn?.addEventListener('click', () => toast.show());

  // ======= Lógica del formulario de pedido =======
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita recargar la página

    // 1) Leemos campos base
    const nombre = document.getElementById('nombreCliente').value.trim();
    const selModelo = document.getElementById('selModelo');
    const selTalla = document.getElementById('selTalla');
    const selColor = document.getElementById('selColor');
    const cantidad = Number(document.getElementById('inpCantidad').value || 0);

    // Validación mínima
    if (!nombre || !selModelo.value || !selTalla.value || !selColor.value || cantidad < 1) {
      alert('Completa nombre, modelo, talla, color y cantidad (mínimo 1).');
      return;
    }

    // 2) Precio base del modelo
    const optModelo = selModelo.options[selModelo.selectedIndex];
    const precioModelo = getPrecioFromDataset(optModelo);
    let total = precioModelo * cantidad;

    // 3) Extras
    const chkNombreNumero = document.getElementById('chkNombreNumero');
    const chkParcheLiga = document.getElementById('chkParcheLiga');

    const extrasSeleccionados = [];
    if (chkNombreNumero.checked) {
      total += getPrecioFromDataset(chkNombreNumero) * cantidad;
      extrasSeleccionados.push('Nombre y número');
    }
    if (chkParcheLiga.checked) {
      total += getPrecioFromDataset(chkParcheLiga) * cantidad;
      extrasSeleccionados.push('Parche de liga');
    }

    // 4) Personalización opcional
    const inpNombre = document.getElementById('inpNombre').value.trim();
    const inpNumero = document.getElementById('inpNumero').value.trim();

    // 5) Envío e instrucciones
    const selEnvio = document.getElementById('selEnvio');
    const optEnvio = selEnvio.options[selEnvio.selectedIndex];
    const costoEnvio = getPrecioFromDataset(optEnvio);
    total += costoEnvio;

    const txtInstr = document.getElementById('txtInstrucciones').value.trim();

    // 6) Mostrar resumen del pedido
    outNombre.textContent = nombre;
    outLista.innerHTML = `
      <li><strong>Modelo:</strong> ${selModelo.value} — ${toMXN(precioModelo)} c/u × ${cantidad}</li>
      <li><strong>Talla:</strong> ${selTalla.value}</li>
      <li><strong>Color:</strong> ${selColor.value}</li>
      <li><strong>Extras:</strong> ${extrasSeleccionados.length ? extrasSeleccionados.join(', ') : 'Ninguno'}</li>
      ${inpNombre || inpNumero ? `<li><strong>Personalización:</strong> ${inpNombre ? 'Nombre: ' + inpNombre : ''}${inpNumero ? ' | Número: ' + inpNumero : ''}</li>` : ''}
      <li><strong>Envío:</strong> ${selEnvio.value} — ${toMXN(costoEnvio)}</li>
      ${txtInstr ? `<li><strong>Instrucciones:</strong> ${txtInstr}</li>` : ''}
    `;
    outTotal.textContent = toMXN(total);

    // 7) Activar botón de confirmación
    btnConfirmar.disabled = false;
    confirmNombre.textContent = nombre;
  });

  // ======= Resetear formulario =======
  form.addEventListener('reset', () => {
    setTimeout(() => {
      outNombre.textContent = '—';
      outLista.innerHTML = '<li class="text-muted">Aún no has generado tu pedido.</li>';
      outTotal.textContent = '$0';
      btnConfirmar.disabled = true;
    }, 0);
  });
});

// ================== Actividades DOM (Banner, Testimonios, Contacto) ==================
document.addEventListener('DOMContentLoaded', () => {
  // -------- Actividad 1: Banner --------
  const banner = document.getElementById('banner');
  const btnPromo = document.getElementById('btnPromo');
  btnPromo?.addEventListener('click', () => {
    banner.classList.remove('bg-dark', 'bg-primary', 'bg-success', 'bg-info', 'bg-danger', 'bg-warning');
    banner.classList.add('bg-warning', 'text-dark');
    banner.classList.remove('text-white');
  });

  // -------- Actividad 2: Testimonios --------
  const vipItems = document.getElementsByClassName('testimonio-vip');
  for (const item of vipItems) {
    item.classList.add('text-primary');
  }

  // Todos los párrafos en rojo
  const allParagraphs = document.getElementsByTagName('p');
  for (const p of allParagraphs) {
    p.classList.add('text-danger');
  }

  // -------- Actividad 3: Formulario de contacto --------
  const firstTextInput = document.querySelector('#formContacto input[type="text"]');
  firstTextInput?.classList.add('bg-success', 'bg-opacity-10');

  const contactoButtons = document.querySelectorAll('#formContacto button');
  contactoButtons.forEach(btn => {
    btn.classList.remove('btn-primary', 'btn-outline-secondary');
    btn.classList.add('btn-danger');
  });

  const nombreInputs = document.getElementsByName('nombre');
  if (nombreInputs.length > 0) {
    const nombreInput = nombreInputs[0];
    nombreInput.classList.add('text-warning');
    const label = document.querySelector('label[for="cNombre"]');
    label?.classList.add('text-warning');
  }
});

// ======= WhatsApp flotante =======
document.addEventListener('DOMContentLoaded', () => {
  const waBtn = document.querySelector('.whatsapp-float');
  if (!waBtn) return;

  // Mensaje según hora
  const h = new Date().getHours();
  const enHorario = h >= 9 && h < 18;
  const msg = enHorario ? '¡Respondo ahora!' : 'Fuera de horario, te contesto pronto';
  waBtn.title = `WhatsApp — ${msg}`;
  waBtn.setAttribute('aria-label', `Chatea por WhatsApp — ${msg}`);

  const telefono = '527221234567';
  const texto = encodeURIComponent('Hola, vengo del sitio del Real Madrid Store. Me interesa una playera.');
  waBtn.href = `https://wa.me/${telefono}?text=${texto}`;

  // Mostrar tras scroll
  const UMBRAL = 300;
  const toggleWA = () => {
    if (window.scrollY > UMBRAL) {
      waBtn.classList.add('show');
    } else {
      waBtn.classList.remove('show');
    }
  };
  toggleWA();
  window.addEventListener('scroll', toggleWA, { passive: true });
});
// ===================== /app.js =======================
// ======= Efecto degradado HSL interactivo con mouse =======
document.addEventListener('mousemove', (e) => {
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;

  // Paleta base: tonos de azul, blanco y dorado (Real Madrid)
  const h1 = 220; // azul
  const h2 = 45;  // dorado
  const s1 = 90;
  const s2 = 100;
  const l1 = 55;
  const l2 = 65;

  // Interpolar entre colores según posición del mouse
  const h = h1 + (h2 - h1) * x;
  const s = s1 + (s2 - s1) * y;
  const l = l1 + (l2 - l1) * (x + y) / 2;

  // Aplicar gradiente al fondo del body
  document.body.style.background = `
    linear-gradient(135deg,
      hsl(${h}, ${s}%, ${l}%),
      hsl(${(h + 40) % 360}, ${Math.max(70, s - 20)}%, ${Math.min(90, l + 10)}%)
    )
  `;
  document.body.style.transition = 'background 0.2s ease';
});
