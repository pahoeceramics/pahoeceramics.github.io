// js/main.js — Pahoe Cerámica, Galápagos
//
// DATA ARCHITECTURE (for adding pieces in the future):
//   collections[] → pieces[] → photos[]
//
// To add a NEW PIECE to a collection:
//   1. Drop its optimized photos into  images/pieces/full/  (max 1600px WebP, e.g. coral-14.webp)
//      and its thumbnail into          images/pieces/thumb/ (max 1000px JPG).
//   2. Add one entry to that collection's "pieces" array:
//        piece('coral', 'Cuenco', 7, ['coral-14'])
//      (type + automatic roman numeral, photos in gallery order — first photo is the grid cover)
//
// To add a new collection: copy a collection block, give it a unique id, and list its pieces.

// 0. Contact Configuration — update these when the artist's real contact is ready
const contactInfo = {
  email: 'pahoeceramics@gmail.com',          // artist email
  whatsapp: '5939XXXXXXXX',                // country code + number, no + or spaces (e.g. '593991234567')
  defaultSubject: 'Consulta de Pieza',
  defaultMessage: 'Hola, me interesa consultar sobre una pieza de Pahoe.'
};

// WhatsApp buttons stay hidden until a real number replaces the placeholder above
const whatsappReady = /^[0-9]{10,15}$/.test(contactInfo.whatsapp);

// 1. Image paths — optimized web photos (originals live in "_originals - do not upload")
const IMG_FULL = './images/pieces/full/';
const IMG_THUMB = './images/pieces/thumb/';

const ROMAN = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV'];

// Build one photo object
function photo(file) {
  return { full: IMG_FULL + file + '.webp', thumb: IMG_THUMB + file + '.webp' };
}

// Build one piece: named by type + roman numeral, photos in gallery order (first = cover)
function piece(collectionId, type, num, files) {
  return {
    id: `${collectionId}-p${num}`,
    name: `${type} ${ROMAN[num - 1]}`,
    type: type,
    photos: files.map(photo)
  };
}

const collections = [
  {
    id: 'volcan',
    name: 'Volcán',
    tagline: 'Ceniza · Jarrón Raku',
    description: 'Piezas oscuras y texturizadas, inspiradas en la lava fresca y el origen geológico del archipiélago.',
    coverImage: IMG_THUMB + 'volcan-1.webp',
    pieces: [
      piece('volcan', 'Ceniza — Jarrón Raku', 1, ['volcan-1', 'volcan-2', 'volcan-3', 'volcan-4'])
    ]
  },
  {
    id: 'coral',
    name: 'Coral',
    tagline: 'Arrecifes de Galápagos',
    description: 'Inspirados en corales y arrecifes de Galápagos. Un universo natural, único, lleno de texturas y formas orgánicas. Los tonos de su exterior contrastan con el delicado azul, rindiendo homenaje a las mágicas aguas de las islas.',
    coverImage: IMG_THUMB + 'coral-3.webp',
    pieces: [
      piece('coral', 'Vaso', 1, ['coral-6', 'coral-1', 'coral-13', 'coral-11']),  // vaso percebe (4 vistas)
      piece('coral', 'Plato', 1, ['coral-3', 'coral-5', 'coral-4']),               // plato azul (3 vistas)
      piece('coral', 'Cuenco', 1, ['coral-2', 'coral-10']),                        // cuenco bol
      piece('coral', 'Plato', 2, ['coral-8', 'coral-9']),
      piece('coral', 'Cuenco', 2, ['coral-12', 'coral-7'])
    ]
  },
  {
    id: 'arenas',
    name: 'Arenas',
    tagline: 'Memoria de las costas',
    description: 'Arenas es una exploración de las texturas, los colores y las formas de la naturaleza: una manera de llevar a la cerámica la memoria de las costas de Galápagos. Su superficie rugosa refleja la belleza natural de las playas.',
    coverImage: IMG_THUMB + 'arena-3.webp',
    pieces: [
      piece('arenas', 'Plato', 1, ['arena-1', 'arena-2', 'arena-13']),              // plato borde grueso dorado (3 vistas)
      piece('arenas', 'Plato', 2, ['arena-3', 'arena-7', 'arena-9']),               // plato celadón (3 vistas)
      piece('arenas', 'Plato', 3, ['arena-4', 'arena-8', 'arena-12', 'arena-5', 'arena-11']), // plato flor (5 vistas)
      piece('arenas', 'Cuenco', 1, ['arena-6', 'arena-10'])
    ]
  },
  {
    id: 'muelle',
    name: 'Muelle',
    tagline: 'El punto de partida',
    description: 'El punto de partida de una exploración donde se encuentran piezas utilitarias con los límites de la arcilla, y todo lo que proyectan las islas en ellas.',
    coverImage: IMG_THUMB + 'muelle-3.webp',
    pieces: [
      piece('muelle', 'El Pulpo del Muelle', 1, ['muelle-1', 'muelle-2', 'muelle-3', 'muelle-4', 'muelle-5', 'muelle-6'])
    ]
  }
];

// 2. Intro Animation Cleanup
window.addEventListener('load', () => {
  const overlay = document.getElementById('intro-overlay');
  if (overlay) {
    setTimeout(() => { overlay.style.display = 'none'; }, 4500);
  }
});

// 3. Render Collections List (Colecciones page)
function renderCollectionsList() {
  const grid = document.getElementById('collections-grid');
  if (!grid) return;

  grid.innerHTML = collections.map(collection => `
    <a href="#" onclick="openCollection('${collection.id}'); return false;" class="collection-card" style="background-image: url('${collection.coverImage}')">
      <div class="collection-info">
        <span class="collection-count">${collection.pieces.length} ${collection.pieces.length === 1 ? 'pieza' : 'piezas'}</span>
        <h3>${collection.name}</h3>
        <p class="collection-tagline">${collection.tagline}</p>
        <p>${collection.description}</p>
      </div>
    </a>
  `).join('');
}

// 4. Render Collection Detail — ONE card per piece (cover = best shot)
let currentCollection = null;

function renderCollectionDetail(collectionId) {
  const collection = collections.find(c => c.id === collectionId);
  if (!collection) return;
  currentCollection = collection;

  const header = document.getElementById('collection-detail-header');
  const grid = document.getElementById('collection-items-grid');

  if (header) {
    header.innerHTML = `
      <h2>${collection.name}</h2>
      <p class="detail-tagline">${collection.tagline}</p>
      <div class="divider"></div>
      <p>${collection.description}</p>
    `;
  }

  if (grid) {
    grid.innerHTML = collection.pieces.map((pieceItem, index) => {
      const cover = pieceItem.photos[0];
      const views = pieceItem.photos.length;
      return `
      <div class="product-card" onclick="openLightbox(${index})">
        <div class="product-img-wrap">
          <img src="${cover.thumb}" alt="${collection.name} — ${pieceItem.name}" class="product-img" loading="lazy">
          <div class="product-overlay"><span>Ver pieza</span></div>
          ${views > 1 ? `<span class="product-views">${views} fotos</span>` : ''}
        </div>
        <div class="product-info">
          <h3>${pieceItem.name}</h3>
          <p>${pieceItem.type}</p>
        </div>
      </div>
    `;
    }).join('');
  }
}

function openCollection(collectionId) {
  renderCollectionDetail(collectionId);
  navigateTo('collection-detail');
}

// 5. Lightbox Gallery — navigates through the photos of ONE piece
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lightbox-img');
const lbTitle = document.getElementById('lightbox-title');
const lbMeta = document.getElementById('lightbox-meta');
const lbCounter = document.getElementById('lightbox-counter');
let currentPiece = null;
let lbIndex = 0;

function openLightbox(pieceIndex) {
  if (!lightbox || !currentCollection) return;
  currentPiece = currentCollection.pieces[pieceIndex];
  if (!currentPiece) return;
  lbIndex = 0;
  updateLightbox();
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
  document.addEventListener('keydown', handleLbKeys);
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = 'auto';
  document.removeEventListener('keydown', handleLbKeys);
}

function updateLightbox() {
  const photos = currentPiece.photos;
  const current = photos[lbIndex];

  // Fade-out/fade-in transition
  lbImg.classList.add('switching');
  const preloaded = new Image();
  preloaded.onload = () => {
    lbImg.src = current.full;
    lbImg.alt = `${currentCollection.name} — ${currentPiece.name}`;
    lbImg.classList.remove('switching');
  };
  preloaded.src = current.full;

  lbTitle.textContent = currentPiece.name;
  const viewLabel = photos.length > 1 ? ` · Vista ${ROMAN[lbIndex]}` : '';
  lbMeta.textContent = `${currentCollection.name} · ${currentPiece.type}${viewLabel}`;
  lbCounter.textContent = `${lbIndex + 1} / ${photos.length}`;

  // Preload neighbours for instant arrow navigation
  [1, -1].forEach(step => {
    const neighbour = photos[(lbIndex + step + photos.length) % photos.length];
    const img = new Image();
    img.src = neighbour.full;
  });

  // WhatsApp inquiry for this exact piece (hidden until a real number is set)
  const waBtn = document.getElementById('lightbox-whatsapp');
  if (waBtn) {
    if (whatsappReady) {
      const message = encodeURIComponent(`Hola, me interesa consultar sobre: ${currentPiece.name} (${currentCollection.name}, Pahoe).`);
      waBtn.href = `https://wa.me/${contactInfo.whatsapp}?text=${message}`;
    } else {
      waBtn.style.display = 'none';
    }
  }
}

function lbNext() {
  if (!currentPiece) return;
  lbIndex = (lbIndex + 1) % currentPiece.photos.length;
  updateLightbox();
}

function lbPrev() {
  if (!currentPiece) return;
  lbIndex = (lbIndex - 1 + currentPiece.photos.length) % currentPiece.photos.length;
  updateLightbox();
}

function handleLbKeys(e) {
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') lbNext();
  if (e.key === 'ArrowLeft') lbPrev();
}

// Close on backdrop click
if (lightbox) {
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  const closeBtn = document.getElementById('lightbox-close');
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  const nextBtn = document.getElementById('lightbox-next');
  const prevBtn = document.getElementById('lightbox-prev');
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); lbNext(); });
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); lbPrev(); });

  // Swipe support (touch devices)
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) { dx < 0 ? lbNext() : lbPrev(); }
  }, { passive: true });
}

// 6. Wire Contact page links from the central config
function wireContactLinks() {
  const emailBtn = document.getElementById('contact-email-btn');
  const whatsappBtn = document.getElementById('contact-whatsapp-btn');

  if (emailBtn) {
    emailBtn.href = `mailto:${contactInfo.email}?subject=${encodeURIComponent(contactInfo.defaultSubject)}`;
  }
  if (whatsappBtn) {
    if (whatsappReady) {
      whatsappBtn.href = `https://wa.me/${contactInfo.whatsapp}?text=${encodeURIComponent(contactInfo.defaultMessage)}`;
    } else {
      whatsappBtn.style.display = 'none';
    }
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderCollectionsList();
  wireContactLinks();
});
