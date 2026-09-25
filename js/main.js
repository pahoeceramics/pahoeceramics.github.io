// js/main.js

// 0. Contact Configuration — update these when the artist's real contact is ready
const contactInfo = {
  email: 'fio@pahoeceramics.com',          // artist email
  whatsapp: '5939XXXXXXXX',                // country code + number, no + or spaces
  defaultSubject: 'Consulta de Pieza',
  defaultMessage: 'Hola, me interesa consultar sobre una pieza de Pahoe.'
};

// 1. Collections Data
// To add a new collection: duplicate a block below and fill id, name, description, coverImage, and items.
// To add items to a collection: append objects to that collection's items array.
const collections = [
  {
    id: 'volcanica',
    name: 'Colección Volcánica',
    description: 'Piezas oscuras y texturizadas, inspiradas en la lava fresca y el origen geológico del archipiélago.',
    coverImage: './images/textures/roca2.jpg',
    items: [
      {
        id: 'v1',
        name: 'Colección Ola: Plato Principal',
        category: 'Platos',
        price: 'Consultar',
        image: './images/textures/roca2.jpg',
        description: 'Plato de cerámica de alta temperatura, esmaltado en tonos arena. Ideal para cenas íntimas.'
      },
      {
        id: 'v2',
        name: 'Taza Galápagos',
        category: 'Tazas',
        price: 'Consultar',
        image: './images/textures/roca3.jpg',
        description: 'Taza ergonómica con textura de arcilla natural en el exterior y esmalte suave en el interior.'
      },
      {
        id: 'v3',
        name: 'Set de Cóctel Volcánico',
        category: 'Piezas Únicas',
        price: 'Consultar',
        image: './images/textures/roca1.jpg',
        description: 'Juego de 4 vasos bajos, inspirados en las formaciones rocosas de Isla Isabela.'
      }
    ]
  },
  {
    id: 'mineral',
    name: 'Colección Mineral',
    description: 'Tonos tierra y óxido que capturan la erosión del tiempo sobre la roca madre.',
    coverImage: './images/textures/roca3.jpg',
    items: [
      {
        id: 'm1',
        name: 'Cuenco de Arcilla Cruda',
        category: 'Cuencos',
        price: 'Consultar',
        image: './images/textures/roca3.jpg',
        description: 'Cuenco mediano con acabado mate en tonos óxido, perfecto para frutas o decoración.'
      },
      {
        id: 'm2',
        name: 'Jarra Erosión',
        category: 'Jarrones',
        price: 'Consultar',
        image: './images/textures/roca1.jpg',
        description: 'Jarra esculpida a mano con textura erosionada y esmalte translúcido interior.'
      }
    ]
  },
  {
    id: 'oceanica',
    name: 'Colección Oceánica',
    description: 'Formas suaves y esmaltes que evocan la calma del mar y la espuma de las olas galapagueñas.',
    coverImage: './images/textures/roca1.jpg',
    items: [
      {
        id: 'o1',
        name: 'Taza Ola Suave',
        category: 'Tazas',
        price: 'Consultar',
        image: './images/textures/roca1.jpg',
        description: 'Taza de paredes finas con esmalte en tonos gris ceniza y azul neutro.'
      },
      {
        id: 'o2',
        name: 'Plato de Mareas',
        category: 'Platos',
        price: 'Consultar',
        image: './images/textures/roca2.jpg',
        description: 'Plato irregular con borde ondulado que recuerda la línea de la orilla.'
      }
    ]
  }
];

// 2. Intro Animation Cleanup
window.addEventListener('load', () => {
  const overlay = document.getElementById('intro-overlay');
  if (overlay) {
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 4500);
  }
});

// 3. Render Collections List (Colecciones page)
function renderCollectionsList() {
  const grid = document.getElementById('collections-grid');
  if (!grid) return;

  grid.innerHTML = collections.map(collection => `
    <a href="#" onclick="openCollection('${collection.id}'); return false;" class="collection-card" style="background-image: url('${collection.coverImage}')">
      <div class="collection-info">
        <h3>${collection.name}</h3>
        <p>${collection.description}</p>
      </div>
    </a>
  `).join('');
}

// 4. Render Collection Detail (single collection page)
function renderCollectionDetail(collectionId) {
  const collection = collections.find(c => c.id === collectionId);
  if (!collection) return;

  const header = document.getElementById('collection-detail-header');
  const grid = document.getElementById('collection-items-grid');

  if (header) {
    header.innerHTML = `
      <h2>${collection.name}</h2>
      <div class="divider"></div>
      <p>${collection.description}</p>
    `;
  }

  if (grid) {
    grid.innerHTML = collection.items.map(item => `
      <div class="product-card" onclick="openModal('${item.id}', '${collection.id}')">
        <img src="${item.image}" alt="${item.name}" class="product-img">
        <div class="product-info">
          <h3>${item.name}</h3>
          <p>${item.category}</p>
        </div>
      </div>
    `).join('');
  }
}

function openCollection(collectionId) {
  renderCollectionDetail(collectionId);
  navigateTo('collection-detail');
}

// 5. Modal Logic
const modal = document.getElementById('product-modal');
const closeBtn = document.querySelector('.modal-close');

function openModal(itemId, collectionId) {
  const collection = collections.find(c => c.id === collectionId);
  if (!collection) return;

  const item = collection.items.find(i => i.id === itemId);
  if (!item) return;

  document.getElementById('modal-img').src = item.image;
  document.getElementById('modal-img').alt = item.name;
  document.getElementById('modal-category').textContent = item.category;
  document.getElementById('modal-title').textContent = item.name;
  document.getElementById('modal-desc').textContent = item.description;
  document.getElementById('modal-price').textContent = item.price;

  const subject = encodeURIComponent(`Consulta sobre: ${item.name}`);
  const message = encodeURIComponent(`Hola, me interesa consultar sobre: ${item.name}`);
  document.getElementById('modal-email-btn').href = `mailto:${contactInfo.email}?subject=${subject}`;
  document.getElementById('modal-whatsapp-btn').href = `https://wa.me/${contactInfo.whatsapp}?text=${message}`;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

if (closeBtn) closeBtn.addEventListener('click', closeModal);
if (modal) modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

// 6. Wire Contact page links from the central config
function wireContactLinks() {
  const emailBtn = document.getElementById('contact-email-btn');
  const whatsappBtn = document.getElementById('contact-whatsapp-btn');

  if (emailBtn) {
    emailBtn.href = `mailto:${contactInfo.email}?subject=${encodeURIComponent(contactInfo.defaultSubject)}`;
  }
  if (whatsappBtn) {
    whatsappBtn.href = `https://wa.me/${contactInfo.whatsapp}?text=${encodeURIComponent(contactInfo.defaultMessage)}`;
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderCollectionsList();
  wireContactLinks();
});
