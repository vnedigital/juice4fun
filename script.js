// --- CART STATE & MANAGEMENT ---
let cart = [];

function toggleCartModal() {
    const modal = document.getElementById('cartModal');
    modal.classList.toggle('hidden');
    if (!modal.classList.contains('hidden')) {
        updateCartUI();
    }
}

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    updateCartCount();
    
    // Optional visual feedback for adding items
    const cartBtns = document.querySelectorAll('.cart-count');
    cartBtns.forEach(el => {
        el.classList.add('scale-125', 'bg-juiceLime');
        setTimeout(() => {
            el.classList.remove('scale-125', 'bg-juiceLime');
        }, 300);
    });
}

function updateCartCount() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = totalCount;
    });
}

function changeQuantity(name, amount) {
    const item = cart.find(i => i.name === name);
    if (item) {
        item.quantity += amount;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.name !== name);
        }
    }
    updateCartCount();
    updateCartUI();
}

function updateCartUI() {
    const container = document.getElementById('cartItemsContainer');
    const totalPriceEl = document.getElementById('cartTotalPrice');
    
    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = `<p class="text-gray-500 text-xs text-center py-6">Your cart is currently empty.</p>`;
        totalPriceEl.textContent = 'Rs. 0';
        return;
    }

    let totalPrice = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs';
        itemDiv.innerHTML = `
            <div class="flex-1 pr-2">
                <h5 class="font-bold text-gray-900">${item.name}</h5>
                <span class="text-juiceGreen font-semibold">Rs. ${item.price} x ${item.quantity}</span>
            </div>
            <div class="flex items-center space-x-2">
                <button type="button" onclick="changeQuantity('${item.name}', -1)" class="w-7 h-7 bg-white border border-gray-200 rounded-lg flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 cursor-pointer">-</button>
                <span class="font-bold w-4 text-center">${item.quantity}</span>
                <button type="button" onclick="changeQuantity('${item.name}', 1)" class="w-7 h-7 bg-white border border-gray-200 rounded-lg flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 cursor-pointer">+</button>
            </div>
        `;
        container.appendChild(itemDiv);
    });

    totalPriceEl.textContent = `Rs. ${totalPrice}`;
}

function checkoutOrder(event) {
    event.preventDefault();

    if (cart.length === 0) {
        alert('Please add items to your cart before checking out.');
        return;
    }

    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const address = document.getElementById('custAddress').value.trim();

    let orderSummary = `*New Online Order - Juice 4 Fun*%0A`;
    orderSummary += `----------------------------------%0A`;
    orderSummary += `*Name:* ${name}%0A`;
    orderSummary += `*Phone:* ${phone}%0A`;
    orderSummary += `*Address/Branch:* ${address}%0A`;
    orderSummary += `----------------------------------%0A`;
    orderSummary += `*Items Ordered:*%0A`;

    let total = 0;
    cart.forEach(item => {
        let sub = item.price * item.quantity;
        total += sub;
        orderSummary += `- ${item.name} x ${item.quantity} = Rs. ${sub}%0A`;
    });

    orderSummary += `----------------------------------%0A`;
    orderSummary += `*Total Amount:* Rs. ${total}%0A`;

    // Business WhatsApp Number (0336-2457409 formatted for international link: 923362457409)
    const whatsappNumber = '923362457409';
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${orderSummary}`;

    window.open(whatsappURL, '_blank');
}


// --- BANNER SLIDER LOGIC ---
let currentSlideIndex = 0;
const sliderTrack = document.getElementById('sliderTrack');
const totalSlides = sliderTrack ? sliderTrack.children.length : 0;
let slideInterval;

function updateSlider() {
    if (!sliderTrack) return;
    sliderTrack.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    
    // Update indicator dots
    document.querySelectorAll('.dot-indicator').forEach((dot, index) => {
        if (index === currentSlideIndex) {
            dot.classList.remove('bg-black/30');
            dot.classList.add('bg-juiceGreen', 'w-6');
        } else {
            dot.classList.remove('bg-juiceGreen', 'w-6');
            dot.classList.add('bg-black/30');
        }
    });
}

function nextSlide() {
    currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
    updateSlider();
    resetTimer();
}

function prevSlide() {
    currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
    updateSlider();
    resetTimer();
}

function currentSlide(index) {
    currentSlideIndex = index;
    updateSlider();
    resetTimer();
}

function startTimer() {
    slideInterval = setInterval(nextSlide, 4500); // Auto slide every 4.5 seconds
}

function resetTimer() {
    clearInterval(slideInterval);
    startTimer();
}

// Initialize Slider on Load
document.addEventListener('DOMContentLoaded', () => {
    if (totalSlides > 0) {
        updateSlider();
        startTimer();
    }
});
