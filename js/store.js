const catalogoEl = document.getElementById('catalogo');
const buscadorEl = document.getElementById('buscador');
const filtroCategoriaEl = document.getElementById('filtroCategoria');

const modalProducto = document.getElementById('modalProducto');
const cerrarModalBtn = document.getElementById('cerrarModal');
const modalImg = document.getElementById('modalImg');
const modalCategoria = document.getElementById('modalCategoria');
const modalTitulo = document.getElementById('modalTitulo');
const modalPrecio = document.getElementById('modalPrecio');
const modalWhatsapp = document.getElementById('modalWhatsapp');


let productos = obtenerProductos();

function renderizarCatalogo(lista) {
    catalogoEl.innerHTML = '';

    if (lista.length === 0) {
        catalogoEl.innerHTML = '<p>No se encontraron productos.</p>';
        return;
    }

    lista.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${prod.imagen}" alt="${prod.nombre}">
            <div class="card-body">
                <span class="badge">${prod.categoria}</span>
                <h3>${prod.nombre}</h3>
                <p class="precio">$${Number(prod.precio).toLocaleString('es-AR')}</p>
            </div>
        `;
        card.addEventListener('click', () => abrirModalProducto(prod));
        catalogoEl.appendChild(card);
    });
}
function abrirModalProducto(prod) {
    if (!modalProducto) return;

    modalImg.src = prod.imagen;
    modalImg.alt = prod.nombre;
    modalCategoria.textContent = prod.categoria;
    modalTitulo.textContent = prod.nombre;
    modalPrecio.textContent = `$${Number(prod.precio).toLocaleString('es-AR')}`;
   

    if (modalWhatsapp) {
        const tel = typeof telefonoFerreteria !== 'undefined' ? telefonoFerreteria : '5493756431680';
        const texto = `Hola! necesito saber sobre: ${prod.nombre} `;
        modalWhatsapp.href = `https://wa.me/${tel}?text=${encodeURIComponent(texto)}`;
    }

    modalProducto.classList.add('activo');
    modalProducto.setAttribute('aria-hidden', 'false');
}

function cerrarModalProducto() {
    if (!modalProducto) return;
    modalProducto.classList.remove('activo');
    modalProducto.setAttribute('aria-hidden', 'true');
}

if (cerrarModalBtn) {
    cerrarModalBtn.addEventListener('click', cerrarModalProducto);
}

if (modalProducto) {
    modalProducto.addEventListener('click', (e) => {
        if (e.target === modalProducto) {
            cerrarModalProducto();
        }
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        cerrarModalProducto();
    }
});


function filtrarProductos() {
    const texto = buscadorEl.value.toLowerCase();
    const categoria = filtroCategoriaEl.value;

    const filtrados = productos.filter(prod => {
        const coincideTexto = prod.nombre.toLowerCase().includes(texto);
        const coincideCat = categoria === 'Todas' || prod.categoria === categoria;
        return coincideTexto && coincideCat;
    });

    renderizarCatalogo(filtrados);
}

buscadorEl.addEventListener('input', filtrarProductos);
filtroCategoriaEl.addEventListener('change', filtrarProductos);

// Carga inicial
renderizarCatalogo(productos);


// --- CARRUSEL ---
const slidesContainer = document.getElementById('carruselSlides');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const dotsContainer = document.getElementById('carruselDots');
const carruselEl = document.querySelector('.carrusel');

if (slidesContainer && btnPrev && btnNext && dotsContainer) {
    const totalSlides = slidesContainer.children.length;
    let indiceActual = 0;
    let intervaloAuto;

    // Crear puntos indicadores
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carrusel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Ir a diapositiva ${i + 1}`);
        dot.addEventListener('click', () => {
            irADiapositiva(i);
            reiniciarAutoPlay();
        });
        dotsContainer.appendChild(dot);
    }

    const dots = Array.from(dotsContainer.children);

    function irADiapositiva(index) {
        indiceActual = (index + totalSlides) % totalSlides;
        slidesContainer.style.transform = `translateX(-${indiceActual * 100}%)`;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === indiceActual);
        });
    }

    function siguiente() {
        irADiapositiva(indiceActual + 1);
    }

    function anterior() {
        irADiapositiva(indiceActual - 1);
    }

    function iniciarAutoPlay() {
        intervaloAuto = setInterval(siguiente, 5000);
    }

    function reiniciarAutoPlay() {
        clearInterval(intervaloAuto);
        iniciarAutoPlay();
    }

    btnNext.addEventListener('click', () => {
        siguiente();
        reiniciarAutoPlay();
    });

    btnPrev.addEventListener('click', () => {
        anterior();
        reiniciarAutoPlay();
    });

    if (carruselEl) {
        carruselEl.addEventListener('mouseenter', () => clearInterval(intervaloAuto));
        carruselEl.addEventListener('mouseleave', iniciarAutoPlay);
    }

    iniciarAutoPlay();
}