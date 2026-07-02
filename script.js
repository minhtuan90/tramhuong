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
        
        if(counterText) {
            counterText.innerText = (currentIndex + 1) + '/' + slides.length;
        }
    }, 3000);
}

// --- Countdown Timer ---
function initCountdown() {
    let time = 00 * 3600 + 19 * 60 + 59; 
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

// --- Accordion ---
function initAccordion() {
    const items = document.querySelectorAll('.accordion-item');
    items.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            items.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.icon').innerText = '+';
            });
            if (!isActive) {
                item.classList.add('active');
                item.querySelector('.icon').innerText = '-';
            }
        });
    });
}

// --- Fake Reviews ---
function generateFakeReviews() {
    const reviewData = [
        { name: "V***📚", avatar: "V", text: "nhận hàng xong là phải quay lại feedback cho shop liền, đóng gọi hàng nó có tâm gì đâu á; vòng thơm nhẹ, rất ưng.", imgs: [] },
        { name: "D***u V***", avatar: "D", text: "Hàng nhận nhanh ạ. Vòng đẹp nha, có 1 mùi hương nhẹ.", imgs: [] }
    ];
    
    const list = document.getElementById('review-list');
    if(!list) return;

    reviewData.forEach(r => {
        const html = `
            <div class="review-item">
                <div class="review-user">
                    <div class="avatar">${r.avatar}</div>
                    <div class="user-info">
                        <div class="name">${r.name}</div>
                        <div class="stars">⭐⭐⭐⭐⭐</div>
                    </div>
                </div>
                <div class="review-text">${r.text}</div>
            </div>
        `;
        list.insertAdjacentHTML('beforeend', html);
    });
}

// --- Fake Live Orders (Toast) ---
function startFakeOrdersToast() {
    const names = ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C"];
    const container = document.getElementById('toast-container');
    if(!container) return;

    setInterval(() => {
        if(Math.random() > 0.6) return; 
        const name = names[Math.floor(Math.random() * names.length)];
        const time = Math.floor(Math.random() * 10) + 1;
        
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<span><strong>${name}</strong> vừa đặt mua 1 Combo (${time} phút trước)</span>`;
        
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    }, 8000);
}

// --- Checkout Modal Logic ---
function openCheckout() {
    const overlay = document.getElementById('checkout-overlay');
    const modal = document.getElementById('checkout-modal');
    if(overlay && modal) {
        overlay.classList.add('active');
        modal.classList.add('active');
    }
}

function closeCheckout() {
    document.getElementById('checkout-overlay').classList.remove('active');
    document.getElementById('checkout-modal').classList.remove('active');
}

function changeQty(delta) {
    const input = document.getElementById('checkout-qty');
    if(!input) return;
    let val = parseInt(input.value) + delta;
    if (val < 1) val = 1;
    input.value = val;
}

function openChat() {
    alert("Chuyển hướng đến Zalo/Messenger...");
}

// --- Form Submit ---
const checkoutForm = document.getElementById('checkout-form');
if(checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = document.getElementById('submit-order-btn');
        btn.innerText = "ĐANG XỬ LÝ...";
        btn.disabled = true;

        // Đã cập nhật lại để khớp với HTML mới
        const orderData = {
            name: document.getElementById('cus-name').value,
            phone: document.getElementById('cus-phone').value,
            address: document.getElementById('cus-address').value,
            product: "1 vòng trầm hương 108 Hạt",
            price: 179000,
            quantity: document.getElementById('checkout-qty').value
        };

        const scriptURL = 'https://script.google.com/macros/s/AKfycbxfl5ZSnKRMLiLQxe-M_DgZW7hljLHS_L3qhLTRGF4n8Em1fDeC7qvwj_KyqORUbOZy/exec'; // Thay link API thật vào đây
        
        setTimeout(() => {
            if(window.ttq) {
                ttq.track('CompletePayment');
                ttq.track('Lead');
            }
            closeCheckout();
            document.getElementById('success-overlay').classList.add('active');
            document.getElementById('success-modal').classList.add('active');
            btn.innerText = "XÁC NHẬN ĐẶT HÀNG";
            btn.disabled = false;
            checkoutForm.reset();
            
            // Xử lý lưu mộc cho Admin (nếu bạn vẫn dùng trang Admin tĩnh)
            let orders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
            orderData.time = new Date().toLocaleString();
            orders.push(orderData);
            localStorage.setItem('mockOrders', JSON.stringify(orders));

        }, 1500);
    });
}
