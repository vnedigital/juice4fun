let currentIndex = 0;
const totalSlides = 6;
const track = document.getElementById('sliderTrack');
const dots = document.querySelectorAll('.dot-indicator');

function updateSlider() {
    if (!track) return;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((dot, index) => {
        if(index === currentIndex) {
            dot.classList.remove('bg-white/50');
            dot.classList.add('bg-white', 'w-6');
        } else {
            dot.classList.remove('bg-white', 'w-6');
            dot.classList.add('bg-white/50', 'w-3');
        }
    });
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlider();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlider();
}

function currentSlide(index) {
    currentIndex = index;
    updateSlider();
}

// Auto slide every 4 seconds
let slideInterval = setInterval(nextSlide, 4000);

// Pause auto-slide on hover
const bannerContainer = document.querySelector('#intro-banner');
if (bannerContainer) {
    bannerContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
    bannerContainer.addEventListener('mouseleave', () => slideInterval = setInterval(nextSlide, 4000));
}

// Initial call
updateSlider();
