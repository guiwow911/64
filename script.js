(() => {
  const body = document.body;
  const header = document.querySelector('[data-header]');
  const menuToggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.main-nav');

  const setScrolledHeader = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 22);
  };

  setScrolledHeader();
  window.addEventListener('scroll', setScrolledHeader, { passive: true });

  const closeMenu = () => {
    body.classList.remove('menu-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  };

  menuToggle?.addEventListener('click', () => {
    const open = body.classList.toggle('menu-open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  navigation?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px' });

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const tabs = document.querySelectorAll('.timeline-tab');
  const timelineItems = document.querySelectorAll('.timeline-item');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const period = tab.dataset.period;
      tabs.forEach((item) => {
        const selected = item === tab;
        item.classList.toggle('active', selected);
        item.setAttribute('aria-selected', String(selected));
      });

      timelineItems.forEach((item) => {
        const visible = period === 'all' || item.dataset.period === period;
        item.classList.toggle('is-hidden', !visible);
      });
    });
  });

  const candleForm = document.querySelector('[data-candle-form]');
  const candleCount = document.querySelector('[data-candle-count]');
  const candleContainer = document.querySelector('[data-candles]');
  const formStatus = document.querySelector('.form-status');
  const storageKey = 'memory-archive-candle-count';
  const baseCandleCount = 64;

  let savedCount = Number.parseInt(window.localStorage.getItem(storageKey) || '', 10);
  if (!Number.isFinite(savedCount) || savedCount < baseCandleCount) savedCount = baseCandleCount;

  const renderCandles = () => {
    if (!candleContainer) return;
    candleContainer.innerHTML = '';
    const visualCount = Math.min(34, Math.max(22, Math.round(savedCount / 2.2)));
    for (let index = 0; index < visualCount; index += 1) {
      const candle = document.createElement('span');
      candle.className = 'candle';
      candle.style.animationDelay = `${(index % 6) * -0.32}s`;
      candleContainer.appendChild(candle);
    }
  };

  const updateCandleCount = () => {
    if (candleCount) candleCount.textContent = savedCount.toLocaleString('zh-CN');
    renderCandles();
  };

  updateCandleCount();

  candleForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = candleForm.querySelector('input');
    const memory = input?.value.trim() || '';
    if (!memory) {
      if (formStatus) formStatus.textContent = '先写下一个词，或只点亮一盏无名的灯。';
      input?.focus();
      return;
    }

    savedCount += 1;
    window.localStorage.setItem(storageKey, String(savedCount));
    updateCandleCount();
    if (formStatus) formStatus.textContent = `“${memory}”已经被放进这盏灯里。`;
    if (input) {
      input.value = '';
      input.blur();
    }
  });
})();
