// --- Slider Logic ---
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

let slideInterval = setInterval(nextSlide, 4000);

const bannerContainer = document.querySelector('#intro-banner');
if (bannerContainer) {
    bannerContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
    bannerContainer.addEventListener('mouseleave', () => slideInterval = setInterval(nextSlide, 4000));
}

updateSlider();


// --- Cart & Checkout System ---
let cart = [];

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    updateCartUI();
    
    // Chota sa notification ya visual feedback
    showToast(`${name} added to cart!`);
}

function updateCartUI() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElements.forEach(el => el.textContent = totalItems);
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-5 right-5 bg-juiceDarkGreen text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl z-50 transition-all duration-300 animate-bounce';
    toast.innerHTML = `<i class="fa-solid fa-check-circle mr-2 text-juiceLime"></i> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

function toggleCartModal() {
    const modal = document.getElementById('cartModal');
    if (!modal) return;
    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
        renderCartItems();
    } else {
        modal.classList.add('hidden');
    }
}

function renderCartItems() {
    const container = document.getElementById('cartItemsContainer');
    const totalPriceEl = document.getElementById('cartTotalPrice');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `<p class="text-gray-500 text-xs text-center py-8">Your cart is empty.</p>`;
        if (totalPriceEl) totalPriceEl.textContent = 'Rs. 0';
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach((item, index) => {
        let itemTotal = item.price * item.quantity;
        total += itemTotal;
        html += `
            <div class="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div>
                    <h4 class="font-bold text-xs text-gray-900">${item.name}</h4>
                    <p class="text-[10px] text-gray-500">Rs. ${item.price} x ${item.quantity}</p>
                </div>
                <div class="flex items-center gap-3">
                    <span class="font-black text-xs text-juiceGreen">Rs. ${itemTotal}</span>
                    <button onclick="removeFromCart(${index})" class="text-red-500 hover:text-red-700 text-xs p-1 cursor-pointer"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    if (totalPriceEl) totalPriceEl.textContent = `Rs. ${total}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
    renderCartItems();
}

function checkoutOrder(event) {
    event.preventDefault();
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const name = document.getElementById('custName').value;
    const phone = document.getElementById('custPhone').value;
    const address = document.getElementById('custAddress').value;

    let orderSummary = `*New Online Order - Juice 4 Fun*%0A`;
    orderSummary += `*Name:* ${name}%0A`;
    orderSummary += `*Phone:* ${phone}%0A`;
    orderSummary += `*Address:* ${address}%0A%0A*Items:*%0A`;

    let total = 0;
    cart.forEach(item => {
        orderSummary += `- ${item.name} (x${item.quantity}) : Rs. ${item.price * item.quantity}%0A`;
        total += item.price * item.quantity;
    });

    orderSummary += `%0A*Total Bill: Rs. ${total}*`;

    // WhatsApp par order bhejne ke liye (Aap yahan apna number change kar sakte hain)
    const whatsappUrl = `https://wa.me/923362457409?text=${orderSummary}`;
    window.open(whatsappUrl, '_blank');
}
