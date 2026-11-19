const STORAGE_KEY = 'ferreteria_db';

// Productos iniciales para que la tienda no arranque vacía
const productosIniciales = [
    {
        id: 1700000001,
        nombre: 'Taladro Percutor 650W',
        categoria: 'Herramientas Eléctricas',
        precio: 68500,
        imagen: 'https://placehold.co/300x200/e2e8f0/1e293b?text=Taladro+650W'
    },
    {
        id: 1700000002,
        nombre: 'Martillo Galponero Mango Fibra',
        categoria: 'Herramientas Manuales',
        precio: 12400,
        imagen: 'https://placehold.co/300x200/e2e8f0/1e293b?text=Martillo'
    },
    {
        id: 1700000003,
        nombre: 'Llave Térmica Bipolar 2x20A',
        categoria: 'Electricidad',
        precio: 9800,
        imagen: 'https://placehold.co/300x200/e2e8f0/1e293b?text=Termica+2x20A'
    }
];

function obtenerProductos() {
    const datos = localStorage.getItem(STORAGE_KEY);
    if (!datos) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(productosIniciales));
        return productosIniciales;
    }
    return JSON.parse(datos);
}

function guardarProductos(lista) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

// Convierte y redimensiona la imagen a Base64 para no saturar localStorage
function procesarImagen(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 400; // Ancho máximo en píxeles
                const scaleSize = MAX_WIDTH / img.width;
                canvas.width = MAX_WIDTH;
                canvas.height = img.height * scaleSize;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                // Comprime a JPEG al 70% de calidad
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
        };
        reader.onerror = (error) => reject(error);
    });
}