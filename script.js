const projects = [
  {
    title: 'Landing Page Premium',
    category: 'frontend',
    description: 'Página responsiva com visual moderno, animações suaves e foco em conversão.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    repo: 'https://github.com/',
    deploy: '#',
    price: 'Sob consulta'
  },
  {
    title: 'API de Pedidos',
    category: 'backend',
    description: 'API para cadastro, listagem e controle de pedidos com estrutura escalável.',
    tags: ['Node.js', 'REST', 'SQL'],
    repo: 'https://github.com/',
    deploy: '#',
    price: 'Sob consulta'
  },
  {
    title: 'Dashboard Full Stack',
    category: 'fullstack',
    description: 'Painel completo com interface, autenticação, dados e deploy pronto.',
    tags: ['Frontend', 'Backend', 'Deploy'],
    repo: 'https://github.com/',
    deploy: '#',
    price: 'Sob consulta'
  },
  {
    title: 'Pipeline DevOps',
    category: 'devops',
    description: 'Automação de build, testes e publicação para acelerar entregas.',
    tags: ['CI/CD', 'Docker', 'Git'],
    repo: 'https://github.com/',
    deploy: '#',
    price: 'Sob consulta'
  }
];

const reviews = [
  'Interface bonita, rápida e pronta para apresentar o projeto.',
  'Organização impecável e experiência com cara de produto real.',
  'A proposta em formato de loja deixou o portfólio muito mais memorável.'
];

const cart = [];
const typingWords = ['Frontend', 'Backend', 'APIs', 'Banco de Dados', 'Deploy'];
let typingIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const target = document.getElementById('typingText');
  if (!target) return;

  const word = typingWords[typingIndex];
  target.textContent = word.slice(0, charIndex);

  if (!deleting && charIndex < word.length) {
    charIndex += 1;
    setTimeout(typeLoop, 90);
    return;
  }

  if (!deleting && charIndex === word.length) {
    deleting = true;
    setTimeout(typeLoop, 1100);
    return;
  }

  if (deleting && charIndex > 0) {
    charIndex -= 1;
    setTimeout(typeLoop, 45);
    return;
  }

  deleting = false;
  typingIndex = (typingIndex + 1) % typingWords.length;
  setTimeout(typeLoop, 200);
}

function showSite() {
  document.body.classList.add('loaded');
  document.querySelectorAll('.reveal').forEach((element) => {
    element.classList.add('visible');
  });
}

function renderProjects(filter = 'all') {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter((project) => project.category === filter);

  grid.innerHTML = filteredProjects.map((project) => {
    const index = projects.indexOf(project);
    return `
      <article class="product-card reveal visible" data-project-index="${index}">
        <div class="product-preview"></div>
        <div class="product-meta">
          <span class="category-pill">${project.category}</span>
          <span class="price">${project.price}</span>
        </div>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="tags">${project.tags.map((tag) => `<span>${tag}</span>`).join('')}</div>
        <div class="card-actions">
          <button class="btn ghost details-btn" type="button" data-project-index="${index}">Detalhes</button>
          <button class="btn primary add-cart" type="button" data-project-index="${index}">Adicionar</button>
        </div>
      </article>
    `;
  }).join('');
}

function renderReviews() {
  const track = document.getElementById('reviewTrack');
  if (!track) return;

  track.innerHTML = reviews.map((review) => `
    <article class="review-card">
      <div class="stars">★★★★★</div>
      <blockquote>“${review}”</blockquote>
      <cite>Cliente verificado</cite>
    </article>
  `).join('');
}

function renderCart() {
  const cartItems = document.getElementById('cartItems');
  const cartCount = document.getElementById('cartCount');
  if (!cartItems || !cartCount) return;

  cartCount.textContent = String(cart.length);

  if (cart.length === 0) {
    cartItems.classList.add('empty');
    cartItems.textContent = 'Seu carrinho está vazio. Adicione projetos da vitrine.';
    return;
  }

  cartItems.classList.remove('empty');
  cartItems.innerHTML = cart.map((project, index) => `
    <div class="cart-item">
      <span>${project.title}</span>
      <button type="button" data-remove-index="${index}">Remover</button>
    </div>
  `).join('');
}

function openProjectModal(project) {
  const modal = document.getElementById('projectModal');
  if (!modal) return;

  document.getElementById('modalCategory').textContent = project.category;
  document.getElementById('modalTitle').textContent = project.title;
  document.getElementById('modalDescription').textContent = project.description;
  document.getElementById('modalTags').innerHTML = project.tags.map((tag) => `<span>${tag}</span>`).join('');
  document.getElementById('modalRepo').href = project.repo;
  document.getElementById('modalDeploy').href = project.deploy;

  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeProjectModal() {
  document.getElementById('projectModal')?.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

function setupNavigation() {
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  menuToggle?.addEventListener('click', () => {
    const isOpen = mainNav?.classList.toggle('open') ?? false;
    document.body.classList.toggle('menu-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

function setupFilters() {
  document.querySelectorAll('.filter-btn').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      renderProjects(button.dataset.filter || 'all');
    });
  });
}

function setupTheme() {
  document.getElementById('themeToggle')?.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isLight) {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  });
}

function setupCart() {
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const addButton = target.closest('.add-cart');
    if (addButton) {
      const project = projects[Number(addButton.dataset.projectIndex)];
      if (project) {
        cart.push(project);
        renderCart();
      }
      return;
    }

    const detailsButton = target.closest('.details-btn');
    if (detailsButton) {
      const project = projects[Number(detailsButton.dataset.projectIndex)];
      if (project) openProjectModal(project);
      return;
    }

    const removeButton = target.closest('[data-remove-index]');
    if (removeButton) {
      cart.splice(Number(removeButton.dataset.removeIndex), 1);
      renderCart();
    }
  });
}

function setupModal() {
  document.querySelectorAll('[data-close-modal]').forEach((element) => {
    element.addEventListener('click', closeProjectModal);
  });
}

function setupCoupon() {
  document.getElementById('copyCoupon')?.addEventListener('click', async () => {
    await navigator.clipboard?.writeText('CONTRATA10');
  });

  document.getElementById('applyCoupon')?.addEventListener('click', () => {
    const couponCode = document.getElementById('couponCode')?.value.trim().toUpperCase();
    const couponMessage = document.getElementById('couponMessage');
    if (!couponMessage) return;
    couponMessage.textContent = couponCode === 'CONTRATA10'
      ? 'Cupom aplicado: resposta rápida desbloqueada.'
      : 'Cupom inválido.';
  });
}

function setupProgress() {
  document.querySelectorAll('.progress').forEach((progress) => {
    const bar = progress.querySelector('span');
    if (bar instanceof HTMLElement) {
      bar.style.width = `${progress.dataset.progress || 0}%`;
    }
  });
}

function setupForm() {
  document.getElementById('contactForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = document.getElementById('formStatus');
    if (status) status.textContent = 'Pedido recebido! Em breve entrarei em contato.';
    event.currentTarget.reset();
  });
}

function setupFooterYear() {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
}

window.addEventListener('load', showSite);
document.addEventListener('DOMContentLoaded', () => {
  renderProjects();
  renderReviews();
  renderCart();
  setupNavigation();
  setupFilters();
  setupTheme();
  setupCart();
  setupModal();
  setupCoupon();
  setupProgress();
  setupForm();
  setupFooterYear();
  typeLoop();
});
