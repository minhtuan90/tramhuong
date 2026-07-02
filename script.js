// ==========================================
// 1. KHỞI TẠO TẤT CẢ KHI TẢI TRANG
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Dùng try-catch để nếu 1 hàm lỗi, các nút bấm khác không bị chết lây
    try { initSlider(); } catch(e) { console.error("Lỗi Slider:", e); }
    try { initCountdown(); } catch(e) { console.error("Lỗi Timer:", e); }
    try { initAccordion(); } catch(e) { console.error("Lỗi Accordion:", e); }
    try { generateFakeReviews(); } catch(e) { console.error("Lỗi Review:", e); }
    try { startFakeOrdersToast(); } catch(e) { console.error("Lỗi Toast:", e); }
});

// ==========================================
// 2. CÁC NÚT BẤM VÀ MENU GIAO DIỆN (UI)
// ==========================================
function openCheckout() {
    const overlay = document.getElementById('checkout-overlay');
    const modal = document.getElementById('checkout-modal');
    if(overlay) overlay.classList.add('active');
    if(modal) modal.classList.add('active');
}

function closeCheckout() {
    const overlay = document.getElementById('checkout-overlay');
    const modal = document.getElementById('checkout-modal');
    if(overlay) overlay.classList.remove('active');
    if(modal) modal.classList.remove('active');
}

function closeSuccess() {
    const sOverlay = document.getElementById('success-overlay');
    const sModal = document.getElementById('success-modal');
    if(sOverlay) sOverlay.classList.remove('active');
    if(sModal) sModal.classList.remove('active');
    
    // Đảm bảo Form mua hàng cũng đóng lại
    closeCheckout();
}

function changeQty(delta) {
    const input = document.getElementById('checkout-qty');
    if (!input) return;
    let val = parseInt(input.value) + delta;
    input.value = val < 1 ? 1 : val;
}

function openChat() {
    alert("Đang chuyển hướng đến Zalo/Messenger...");
}

// ==========================================
// 3. CÁC TÍNH NĂNG BỔ TRỢ (CHẠY NGẦM)
// ==========================================
function initSlider() {
    const track = document.getElementById('slider-track');
    const slides = document.querySelectorAll('.slide');
    const counterText = document.getElementById('image-counter-text');
    if(!track || slides.length === 0) return;
    
    let index = 0;
    setInterval(() => {
        index = (index + 1) % slides.length;
        track.style.transform = `translateX(-${index * 100}%)`;
        if(counterText) counterText.innerText = (index + 1) + '/' + slides.length;
    }, 3000);
}

function initCountdown() {
    let time = 19 * 60 + 59; 
    const boxes = document.querySelectorAll('.time-box');
    if(boxes.length < 3) return;

    setInterval(() => {
        if (time <= 0) time = 24 * 3600; 
        time--;
        const h = Math.floor(time / 3600);
        const m = Math.floor((time % 3600) / 60);
        const s = time % 60;
        
        boxes[0].innerText = h.toString().padStart(2, '0');
        boxes[1].innerText = m.toString().padStart(2, '0');
        boxes[2].innerText = s.toString().padStart(2, '0');
    }, 1000);
}

function initAccordion() {
    const items = document.querySelectorAll('.accordion-item');
    items.forEach(item => {
        const header = item.querySelector('.accordion-header');
        if(header) {
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                // Đóng tất cả
                items.forEach(i => {
                    i.classList.remove('active');
                    const icon = i.querySelector('.icon');
                    if(icon) icon.innerText = '+';
                });
                // Mở cái vừa bấm
                if (!isActive) {
                    item.classList.add('active');
                    const icon = item.querySelector('.icon');
                    if(icon) icon.innerText = '-';
                }
            });
        }
    });
}

function generateFakeReviews() {
    const reviewData = [
        { name: "V***📚", avatar: "V", text: "nhận hàng xong là phải quay lại feedback cho shop liền, đóng gói hàng có tâm; vòng thơm nhẹ, rất ưng.", imgs: [] },
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
            </div>`;
        list.insertAdjacentHTML('beforeend', html);
    });
}

function startFakeOrdersToast() {
    const names = ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C", "Phạm Thị D"];
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

// ==========================================
// 4. XỬ LÝ GỬI ĐƠN HÀNG VỀ GOOGLE SHEETS
// ==========================================
const checkoutForm = document.getElementById('checkout-form');
if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault(); 
        
        const btn = document.getElementById('submit-order-btn');
        if(btn) { btn.innerText = "ĐANG XỬ LÝ..."; btn.disabled = true; }

        // Đóng gói dữ liệu bằng FormData (An toàn, không lỗi JSON)
       const checkoutForm = document.getElementById('checkout-form');
if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault(); 
        
        const btn = document.getElementById('submit-order-btn');
        if(btn) { btn.innerText = "ĐANG XỬ LÝ..."; btn.disabled = true; }

        // ĐỔI SANG URLSearchParams ĐỂ GOOGLE CHẮC CHẮN ĐỌC ĐƯỢC
        const data = new URLSearchParams();
        data.append('name', document.getElementById('cus-name').value);
        data.append('phone', document.getElementById('cus-phone').value);
        data.append('address', document.getElementById('cus-address').value);
        data.append('product', "Vòng trầm hương 108 Hạt");
        data.append('price', "179000");
        
        const qtyInput = document.getElementById('checkout-qty');
        data.append('quantity', qtyInput ? qtyInput.value : 1);

        // 👉 ĐẢM BẢO LINK NÀY LÀ LINK MỚI NHẤT CỦA BẠN
        const scriptURL = 'https://script.google.com/macros/s/AKfycbwRi0gDFQgXDkZLY5ethhg-1NGT3He-SZW06xtrg9Et-2H8S0fQK7GsNEN4xN9ZexJ2Iw/exec';

        // Gửi lệnh POST
        fetch(scriptURL, {
            method: 'POST',
            body: data,
            mode: 'no-cors' // Vẫn giữ no-cors để không bị chặn
        })
        .then(() => {
            closeCheckout();
            const sOverlay = document.getElementById('success-overlay');
            const sModal = document.getElementById('success-modal');
            if(sOverlay) sOverlay.classList.add('active');
            if(sModal) sModal.classList.add('active');
            
            if(btn) { btn.innerText = "XÁC NHẬN ĐẶT HÀNG"; btn.disabled = false; }
            checkoutForm.reset();
        })
        .catch(err => {
            console.error("Lỗi gửi đơn:", err);
            alert("Có lỗi xảy ra, vui lòng thử lại!");
            if(btn) { btn.innerText = "XÁC NHẬN ĐẶT HÀNG"; btn.disabled = false; }
        });
    });
}
