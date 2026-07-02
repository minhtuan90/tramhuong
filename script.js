document.addEventListener('DOMContentLoaded', () => {
    initSlider();
    initCountdown();
    initAccordion();
    generateFakeReviews();
    startFakeOrdersToast();
    loadCart();
});

// --- Slider Logic ---
function initSlider() {
    const track = document.getElementById('slider-track');
    const dotsContainer = document.getElementById('slider-dots');
    const slides = document.querySelectorAll('.slide');
    let currentIndex = 0;
    
    // Create dots
    slides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (idx === 0) dot.classList.add('active');
        dotsContainer.appendChild(dot);
    });
    const dots = document.querySelectorAll('.dot');

    // Simple auto slide
    setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach(d => d.classList.remove('active'));
        dots[currentIndex].classList.add('active');
    }, 3000);
}

// --- Countdown Timer ---
function initCountdown() {
    let time = 4 * 3600 + 59 * 60 + 59; // 4:59:59
    const timerElements = document.querySelectorAll('.time-box');
    
    setInterval(() => {
        if (time <= 0) time = 24 * 3600; // reset
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
        { name: "V***📚", avatar: "V", text: "nhận hàng xong là phải quay lại feedback cho shop liền, đóng gọi hàng nó có tâm gì đâu á; vòng thơm nhẹ, rất ưng.", imgs: ['assets/images/rev-1.webp', 'assets/images/rev-2.webp'] },
        { name: "D***u V***", avatar: "D", text: "Hàng nhận nhanh ạ. Vòng đẹp nha, có 1 mùi hương nhẹ. Thích nhất chai dầu tặng kèm ạ mùi dễ chịu. Đóng gói cẩn thận", imgs: ['assets/images/rev-3.webp', 'assets/images/rev-4.webp'] },
        { name: "Nguyễn T***.", avatar: "N", text: "Đã mua lần 2 tặng mẹ, shop tư vấn nhiệt tình, giao hàng nhanh. Cho shop 5 sao nhé.", imgs: [] },
        { name: "Trần M***", avatar: "T", text: "Sản phẩm tốt, đúng mô tả. Đeo lên tay nhìn rất sang. Mùi trầm dịu nhẹ thoang thoảng.", imgs: ['assets/images/rev-5.webp'] }
    ];
    
    const list = document.getElementById('review-list');
    reviewData.forEach(r => {
        let imgsHtml = '';
        if (r.imgs.length > 0) {
            imgsHtml = `<div class="review-images">` + r.imgs.map(src => `<img src="${src}" loading="lazy">`).join('') + `</div>`;
        }
        
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
                ${imgsHtml}
            </div>
        `;
        list.insertAdjacentHTML('beforeend', html);
    });
}

// --- Fake Live Orders (CRO) ---
function startFakeOrdersToast() {
    const names = ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C", "Phạm Thị D", "Hoàng Văn E"];
    const container = document.getElementById('toast-container');
    
    setInterval(() => {
        if(Math.random() > 0.6) return; // Randomize appearance
        const name = names[Math.floor(Math.random() * names.length)];
        const time = Math.floor(Math.random() * 10) + 1;
        
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<img src="assets/images/product-1.webp"> <span><strong>${name}</strong> vừa đặt mua 1 Combo (${time} phút trước)</span>`;
        
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    }, 8000);
}

// --- Cart & Checkout Modals ---
let cartCount = 0;
const price = 126840;

function openCart() {
    document.getElementById('cart-overlay').classList.add('active');
    document.getElementById('cart-sidebar').classList.add('active');
}
function closeCart() {
    document.getElementById('cart-overlay').classList.remove('active');
    document.getElementById('cart-sidebar').classList.remove('active');
}

function openCheckout() {
    closeCart();
    document.getElementById('checkout-overlay').classList.add('active');
    document.getElementById('checkout-modal').classList.add('active');
    // TikTok Pixel Event
    if(window.ttq) ttq.track('InitiateCheckout');
}
function openCheckoutFromCart() {
    if(cartCount === 0) { alert('Giỏ hàng trống!'); return; }
    openCheckout();
}
function closeCheckout() {
    document.getElementById('checkout-overlay').classList.remove('active');
    document.getElementById('checkout-modal').classList.remove('active');
}

function changeQty(delta) {
    const input = document.getElementById('checkout-qty');
    let val = parseInt(input.value) + delta;
    if (val < 1) val = 1;
    input.value = val;
}

function openChat() {
    alert("Chuyển hướng đến Zalo/Messenger...");
}

function loadCart() {
    // Mock local storage load
    cartCount = 1; 
    document.getElementById('cart-badge').innerText = cartCount;
    document.getElementById('cart-body').innerHTML = `
        <div style="display:flex; gap:10px; border-bottom:1px solid #eee; padding-bottom:10px;">
            <img src="assets/images/product-1.webp" width="60" style="border-radius:4px;">
            <div>
                <h4 style="font-size:13px;">Combo 1 Vòng 108 Hạt + Dầu</h4>
                <div style="color:#ee4d2d; font-weight:bold; margin-top:5px;">126.840đ</div>
                <div style="font-size:12px; color:#777;">SL: 1</div>
            </div>
        </div>
    `;
    document.getElementById('cart-total-price').innerText = "126.840đ";
}

// --- Form Submit & Google Apps Script ---
document.getElementById('checkout-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const btn = document.getElementById('submit-order-btn');
    btn.innerText = "ĐANG XỬ LÝ...";
    btn.disabled = true;

    const orderData = {
        name: document.getElementById('cus-name').value,
        phone: document.getElementById('cus-phone').value,
        address: document.getElementById('cus-address').value,
        province: document.getElementById('cus-province').value,
        district: document.getElementById('cus-district').value,
        ward: document.getElementById('cus-ward').value,
        note: document.getElementById('cus-note').value,
        product: "Combo Vòng Trầm Hương 108 Hạt",
        price: 126840,
        quantity: document.getElementById('checkout-qty').value
    };

    // Google App Script Web App URL
    const scriptURL = 'YOUR_GOOGLE_SCRIPT_URL_HERE'; // Thay link API thật vào đây
    
    // Gửi mock thành công ngay lập tức để mô phỏng
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
        document.getElementById('checkout-form').reset();
        
        // Save to local storage for Admin dashboard mock
        let orders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
        orderData.time = new Date().toLocaleString();
        orders.push(orderData);
        localStorage.setItem('mockOrders', JSON.stringify(orders));

    }, 1500);

    /* MỞ COMMENT ĐOẠN NÀY ĐỂ KẾT NỐI VỚI GOOGLE SHEETS THỰC TẾ
    fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    })
    .then(response => { 
        // handle success 
    })
    .catch(error => { 
        // handle error 
    });
    */
});

function closeSuccess() {
    document.getElementById('success-overlay').classList.remove('active');
    document.getElementById('success-modal').classList.remove('active');
}
