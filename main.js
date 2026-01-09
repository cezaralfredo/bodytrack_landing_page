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
if (slider) {
  const originalSlides = Array.from(document.querySelectorAll('.app-slide'));
  const originalCount = originalSlides.length;

  // Clone slides: prepend and append for seamless infinite loop
  // Append clones at the end
  originalSlides.forEach(slide => {
    const clone = slide.cloneNode(true);
    clone.classList.add('clone');
    slider.appendChild(clone);
  });

  // Prepend clones at the beginning
  originalSlides.slice().reverse().forEach(slide => {
    const clone = slide.cloneNode(true);
    clone.classList.add('clone');
    slider.insertBefore(clone, slider.firstChild);
  });

  // Re-query all slides after cloning
  let allSlides = document.querySelectorAll('.app-slide');
  const totalSlides = allSlides.length;

  // Start at the first "real" slide (after prepended clones)
  let currentIndex = originalCount;
  const intervalTime = 2500;
  let autoScrollInterval;
  let isTransitioning = false;

  function getSlidePosition(index) {
    const slide = allSlides[index];
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

  function scrollToIndex(index, smooth = true) {
    slider.scrollTo({
      left: getSlidePosition(index),
      behavior: smooth ? 'smooth' : 'auto'
    });
  }

  function nextSlide() {
    if (isTransitioning) return;
    isTransitioning = true;

    currentIndex++;
    scrollToIndex(currentIndex, true);

    setTimeout(() => {
      // If we've scrolled past the original slides into the appended clones
      if (currentIndex >= originalCount * 2) {
        // Jump back to the corresponding original slide instantly
        currentIndex = originalCount;
        scrollToIndex(currentIndex, false);
      }
      isTransitioning = false;
    }, 500);
  }

  function handleManualScroll() {
    if (isTransitioning) return;

    const scrollLeft = slider.scrollLeft;
    const firstRealSlidePos = getSlidePosition(originalCount);
    const lastRealSlidePos = getSlidePosition(originalCount * 2 - 1);
    const prependedSlidesEndPos = getSlidePosition(originalCount - 1);

    // If scrolled into prepended clones area
    if (scrollLeft < firstRealSlidePos - slider.clientWidth / 2) {
      // Calculate which clone we're at and jump to corresponding real slide
      const slideWidth = allSlides[0].offsetWidth + 32; // 32 = gap
      const overscroll = firstRealSlidePos - scrollLeft;
      const slidesFromStart = Math.floor(overscroll / slideWidth);
      currentIndex = originalCount * 2 - 1 - slidesFromStart;
      scrollToIndex(currentIndex, false);
    }
    // If scrolled into appended clones area beyond the real slides
    else if (scrollLeft > lastRealSlidePos + slider.clientWidth / 2) {
      currentIndex = originalCount;
      scrollToIndex(currentIndex, false);
    }
  }

  // Initialize: scroll to first real slide
  setTimeout(() => {
    scrollToIndex(currentIndex, false);
    highlightCenterSlide();
  }, 100);

  // Sync active class on scroll
  slider.addEventListener('scroll', highlightCenterSlide);
  slider.addEventListener('scrollend', handleManualScroll);

  function startAutoScroll() {
    clearInterval(autoScrollInterval);
    autoScrollInterval = setInterval(nextSlide, intervalTime);
  }

  startAutoScroll();

  // Pause on interact
  slider.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
  slider.addEventListener('touchstart', () => clearInterval(autoScrollInterval));

  slider.addEventListener('mouseleave', startAutoScroll);
  slider.addEventListener('touchend', startAutoScroll);
}
