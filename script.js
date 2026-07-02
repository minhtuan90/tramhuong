document.addEventListener('DOMContentLoaded', () => {
    try { initSlider(); } catch(e) { console.error("Lỗi Slider:", e); }
    try { initCountdown(); } catch(e) { console.error("Lỗi Timer:", e); }
    try { initAccordion(); } catch(e) { console.error("Lỗi Accordion:", e); }
    try { generateFakeReviews(); } catch(e) { console.error("Lỗi Review:", e); }
    try { startFakeOrdersToast(); } catch(e) { console.error("Lỗi Toast:", e); }
});

// --- Slider Logic ---
function initSlider() {
    const track = document.getElementById('slider-track');
    const slides = document.querySelectorAll('.slide');
    const counterText = document.getElementById('image-counter-text');
    let currentIndex = 0;
    if(!track || slides.length === 0) return;
    setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        if(counterText) counterText.innerText = (currentIndex + 1) + '/' + slides.length;
    }, 3000);
}

// --- Countdown Timer ---
function initCountdown() {
    let time = 0 * 3600 + 19 * 60 + 59; 
    const timerElements = document.querySelectorAll('.time-box');
    if(timerElements.length < 3) return;
    setInterval(() => {
        if (time <= 0) time = 24 * 3600; 
        time--;
        const h = Math.floor(time / 3600);
        const m = Math.floor((time % 3600) / 60);
        const s = time % 60;
        timerElements[0].innerText = h.toString().padStart(2, '0');
        timerElements[1].innerText = m.toString().padStart(2, '0');
        timerElements[2].innerText = s.toString().padStart(2, '0');
    }, 1000);
}

// --- Các hàm hỗ trợ ---
function initAccordion() {
    const items = document.querySelectorAll('.accordion-item');
    items.forEach(item => {
        item.querySelector('.accordion-header').addEventListener('click', () => {
            item.classList.toggle('active');
            item.querySelector('.icon').innerText = item.classList.contains('active') ? '-' : '+';
        });
    });
}

function openCheckout() {
    document.getElementById('checkout-overlay').classList.add('active');
    document.getElementById('checkout-modal').classList.add('active');
}

function closeCheckout() {
    document.getElementById('checkout-overlay').classList.remove('active');
    document.getElementById('checkout-modal').classList.remove('active');
}

function closeSuccess() {
    document.getElementById('success-overlay').classList.remove('active');
    document.getElementById('success-modal').classList.remove('active');
    document.getElementById('checkout-overlay').classList.remove('active');
    document.getElementById('checkout-modal').classList.remove('active');
}

function changeQty(delta) {
    const input = document.getElementById('checkout-qty');
    let val = parseInt(input.value) + delta;
    if (val < 1) val = 1;
    input.value = val;
}

function openChat() { alert("Chuyển hướng đến Zalo/Messenger..."); }

// --- Form Submit (Đã sửa lỗi cấu trúc) ---
const checkoutForm = document.getElementById('checkout-form');
if(checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = document.getElementById('submit-order-btn');
        btn.innerText = "ĐANG XỬ LÝ...";
        btn.disabled = true;

        const orderData = {
            name: document.getElementById('cus-name').value,
            phone: document.getElementById('cus-phone').value,
            address: document.getElementById('cus-address').value,
            product: "1 vòng trầm hương 108 Hạt",
            price: 179000,
            quantity: document.getElementById('checkout-qty').value
        };

        const scriptURL = 'https://script.google.com/macros/s/AKfycbwRi0gDFQgXDkZLY5ethhg-1NGT3He-SZW06xtrg9Et-2H8S0fQK7GsNEN4xN9ZexJ2Iw/exec';

        fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        })
        .then(() => console.log("Đã gửi đơn hàng!"))
        .catch(err => console.error("Lỗi:", err))
        .finally(() => {
            btn.innerText = "XÁC NHẬN ĐẶT HÀNG";
            btn.disabled = false;
            closeCheckout();
            document.getElementById('success-overlay').classList.add('active');
            document.getElementById('success-modal').classList.add('active');
            checkoutForm.reset();
        });
    });
}
