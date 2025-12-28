// Pricing Toggle Logic
const billingSwitch = document.getElementById('billing-switch');
const monthlyPrices = document.querySelectorAll('.monthly-price');
const annualPrices = document.querySelectorAll('.annual-price');
const annualInfos = document.querySelectorAll('.annual-info');

if (billingSwitch) {
  billingSwitch.addEventListener('change', () => {
    const isAnnual = billingSwitch.checked;

    monthlyPrices.forEach(el => el.style.display = isAnnual ? 'none' : 'block');
    annualPrices.forEach(el => el.style.display = isAnnual ? 'block' : 'none');
    annualInfos.forEach(el => el.style.display = isAnnual ? 'block' : 'none');
  });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const headerOffset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  });
});

// Intersection Observer for Fade-in Animations
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
  observer.observe(el);
});

const style = document.createElement('style');
style.innerHTML = `
    .fade-in {
      opacity: 0;
      animation: none;
      transform: translateY(20px);
      transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    .fade-in.visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
document.head.appendChild(style);

// Infinite Carousel Logic
const slider = document.querySelector('.app-slider');
// Get original slides
const originalSlides = Array.from(document.querySelectorAll('.app-slide'));
const originalCount = originalSlides.length;

// Clone ALL slides and append them to ensure we have enough buffer
originalSlides.forEach(slide => {
  const clone = slide.cloneNode(true);
  clone.classList.add('clone');
  slider.appendChild(clone);
});

// Re-query all slides
let allSlides = document.querySelectorAll('.app-slide');
let currentSlide = 0;
const intervalTime = 2500; // Increased slightly for better UX
let autoScrollInterval;
let isTransitioning = false;

function getCenterPosition(slide) {
  if (!slide) return 0;
  return slide.offsetLeft - (slider.clientWidth / 2) + (slide.clientWidth / 2);
}

function highlightCenterSlide() {
  const sliderCenter = slider.scrollLeft + slider.clientWidth / 2;
  let closestSlide = null;
  let minDiff = Infinity;

  allSlides.forEach((slide) => {
    const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
    const diff = Math.abs(sliderCenter - slideCenter);

    if (diff < minDiff) {
      minDiff = diff;
      closestSlide = slide;
    }
  });

  allSlides.forEach(s => s.classList.remove('active'));
  if (closestSlide) {
    closestSlide.classList.add('active');
  }
}

// Initial Highlight
setTimeout(highlightCenterSlide, 500);

// Sync active class on scroll
slider.addEventListener('scroll', highlightCenterSlide);

function nextSlide() {
  if (isTransitioning) return;
  isTransitioning = true;

  currentSlide++;

  // Smooth scroll to next
  const targetSlide = allSlides[currentSlide];

  // Check if we need to loop back BEFORE scrolling if we are at the end
  // But for smooth "infinite" feel, we scroll to clone, THEN jump back.

  if (currentSlide >= allSlides.length) {
    // Safety reset if somehow out of bounds
    currentSlide = 0;
  }

  slider.scrollTo({
    left: getCenterPosition(targetSlide),
    behavior: 'smooth'
  });

  // Reset logic after transition
  setTimeout(() => {
    // If we are overlapping the original set with clones
    if (currentSlide >= originalCount) {
      // Calculate where we are relative to the clones
      const relativeIndex = currentSlide % originalCount;

      // Instant jump back to the original slide
      currentSlide = relativeIndex;

      slider.scrollTo({
        left: getCenterPosition(allSlides[currentSlide]),
        behavior: 'auto' // 'auto' is instant in most browsers vs 'smooth'
      });
    }
    isTransitioning = false;
  }, 600); // Match CSS transition time
}

function startAutoScroll() {
  clearInterval(autoScrollInterval); // Prevent duplicates
  autoScrollInterval = setInterval(nextSlide, intervalTime);
}

startAutoScroll();

// Pause on interact
slider.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
slider.addEventListener('touchstart', () => clearInterval(autoScrollInterval)); // Mobile support

slider.addEventListener('mouseleave', startAutoScroll);
slider.addEventListener('touchend', startAutoScroll);


