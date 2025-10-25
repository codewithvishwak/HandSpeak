// ✅ Page Tear Effect
let isTearing = false;

function createRealisticPaperTearEffect() {
  const tearContainer = document.getElementById('tearContainer');
  
  if (!tearContainer || isTearing) {
    console.warn('⚠️ Tear container not found or already tearing');
    return;
  }

  isTearing = true;
  console.log('📄 Starting realistic paper tear effect...');

  // Add active class to trigger animations
  tearContainer.classList.add('active');

  // Create dust particles
  createDustParticles();

  // Navigate after tear animation completes
  setTimeout(() => {
    const btnStart = document.querySelector('.btn-start');
    const href = btnStart ? btnStart.getAttribute('href') : 'login.html';
    console.log('🔗 Navigating to:', href);
    window.location.href = href;
  }, 1200); // Match animation duration
}

function createDustParticles() {
  const tearContainer = document.getElementById('tearContainer');
  if (!tearContainer) return;

  // Create 20-30 dust particles
  const particleCount = 25;
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  for (let i = 0; i < particleCount; i++) {
    const dust = document.createElement('div');
    dust.className = 'tear-dust';

    // Random direction and distance
    const angle = (Math.random() * Math.PI * 2);
    const distance = Math.random() * 200 + 50;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance + Math.random() * 100;

    dust.style.left = centerX + 'px';
    dust.style.top = centerY + 'px';
    dust.style.setProperty('--tx', tx + 'px');
    dust.style.setProperty('--ty', ty + 'px');
    dust.style.setProperty('--delay', (Math.random() * 0.2) + 's');

    tearContainer.appendChild(dust);

    // Remove particle after animation
    setTimeout(() => {
      dust.remove();
    }, 1200);
  }
}

// ✅ Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎬 Landing page loaded');

  const btnStart = document.querySelector('.btn-start');
  // ensure tear container exists
  let tearContainer = document.getElementById('tearContainer');
  if (!tearContainer) {
    tearContainer = document.createElement('div');
    tearContainer.id = 'tearContainer';
    document.body.appendChild(tearContainer);
  }

  if (btnStart) {
    console.log('✅ Start button found');

    // Replace direct navigation with tear animation then navigate
    btnStart.addEventListener('click', (e) => {
      e.preventDefault();
      if (isTearing) return; // debounce repeated clicks
      console.log('🖱️ Start button clicked - starting tear effect');
      createRealisticPaperTearEffect();
    });

    console.log('✅ Click handler attached to button (uses tear effect)');
  } else {
    console.warn('⚠️ Start button not found');
  }
});

// ✅ Handle window resize
window.addEventListener('resize', () => {
  // Window resize handler
});

// ✅ Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ✅ Mouse Parallax Effect on Logo
document.addEventListener('mousemove', (e) => {
  const logo = document.querySelector('.logo-container');
  if (logo) {
    const x = (window.innerWidth / 2 - e.pageX) / 20;
    const y = (window.innerHeight / 2 - e.pageY) / 20;
    
    logo.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg) scale(1.05)`;
  }
});

// Reset on mouse leave
document.addEventListener('mouseleave', () => {
  const logo = document.querySelector('.logo-container');
  if (logo) {
    logo.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)';
    logo.style.transition = 'transform 0.6s ease';
  }
});

// ✅ Console Welcome Message
console.log('%c🖐🏻 Welcome to HandSpeak! 🖐🏻', 'color: #00fff2; font-size: 20px; font-weight: bold;');
console.log('%cBridge communication with sign language to speech', 'color: #FFD700; font-size: 14px;');
console.log('%cClick START NOW to login', 'color: #00ff00; font-size: 12px;');