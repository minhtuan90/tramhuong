// ==========================================
// 1. ĐIỀU KHIỂN GIAO DIỆN (MỞ/ĐÓNG MODAL)
// ==========================================
function openCheckout() {
    const overlay = document.getElementById('checkout-overlay');
    const modal = document.getElementById('checkout-modal');
    if (overlay) overlay.classList.add('active');
    if (modal) modal.classList.add('active');

    // TikTok Pixel: Báo cáo bắt đầu điền thông tin mua hàng
    if (typeof ttq !== 'undefined') ttq.track('InitiateCheckout');
}

function closeCheckout() {
    const overlay = document.getElementById('checkout-overlay');
    const modal = document.getElementById('checkout-modal');
    if (overlay) overlay.classList.remove('active');
    if (modal) modal.classList.remove('active');
}

function closeSuccess() {
    const sOverlay = document.getElementById('success-overlay');
    const sModal = document.getElementById('success-modal');
    if (sOverlay) sOverlay.classList.remove('active');
    if (sModal) sModal.classList.remove('active');
    closeCheckout();
}

function changeQty(delta) {
    const input = document.getElementById('checkout-qty');
    if (!input) return;
    let val = parseInt(input.value) + delta;
    input.value = val < 1 ? 1 : val;
}

function openChat() {
    alert("Hệ thống đang kết nối đến tổng đài hỗ trợ Zalo...");
}

// ==========================================
// 2. TỰ ĐỘNG KHỞI TẠO CÁC HIỆU ỨNG KHI TRANG SẴN SÀNG
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    try { initAccordion(); } catch(e) { console.error("FAQ Error:", e); }
    try { initSlider(); } catch(e) { console.error("Slider Error:", e); }
    try { initCountdown(); } catch(e) { console.error("Countdown Error:", e); }
});

// HÀM FAQ ĐÃ ĐƯỢC ÉP KIỂU HIỂN THỊ CHỐNG XUNG ĐỘT CSS
function initAccordion() {
    if (!document.getElementById('faq-injected-css')) {
        const style = document.createElement('style');
        style.id = 'faq-injected-css';
        style.innerHTML = `
            .accordion-content { display: none !important; transition: all 0.2s ease; }
            .accordion-content.show-active { 
                display: block !important; 
                height: auto !important; 
                opacity: 1 !important; 
                visibility: visible !important;
                margin-top: 8px !important;
            }
        `;
        document.head.appendChild(style);
    }

    const items = document.querySelectorAll('.accordion-item');
    items.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        
        if (header && content) {
            header.onclick = function(e) {
                e.preventDefault();
                const icon = header.querySelector('.icon');
                const isOpening = !content.classList.contains('show-active');

                // Đóng hết các ô câu hỏi khác
                document.querySelectorAll('.accordion-content').forEach(c => c.classList.remove('show-active'));
                document.querySelectorAll('.accordion-header .icon').forEach(i => i.innerText = '+');

                // Mở câu hỏi được chọn
                if (isOpening) {
                    content.classList.add('show-active');
                    if (icon) icon.innerText = '-';
                }
            };
        }
    });
}

function initSlider() {
    const track = document.getElementById('slider-track');
    const slides = document.querySelectorAll('.slide');
    const counter = document.getElementById('image-counter-text');
    if (!track || slides.length === 0) return;
    
    let index = 0;
    setInterval(() => {
        index = (index + 1) % slides.length;
        track.style.transform = 'translateX(-' + (index * 100) + '%)';
        if (counter) counter.innerText = (index + 1) + '/' + slides.length;
    }, 3000);
}

function initCountdown() {
    let time = 19 * 60 + 59; 
    const boxes = document.querySelectorAll('.time-box');
    if (boxes.length < 3) return;

    setInterval(() => {
        if (time <= 0) time = 24 * 3600; 
        time--;
        boxes[0].innerText = Math.floor(time / 3600).toString().padStart(2, '0');
        boxes[1].innerText = Math.floor((time % 3600) / 60).toString().padStart(2, '0');
        boxes[2].innerText = (time % 60).toString().padStart(2, '0');
    }, 1000);
}

// ==========================================
// 3. XỬ LÝ ĐẶT HÀNG GỬI VỀ GOOGLE SHEETS
// ==========================================
const checkoutForm = document.getElementById('checkout-form');
if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault(); 
        
        const btn = document.getElementById('submit-order-btn');
        if (btn) { btn.innerText = "ĐANG XỬ LÝ..."; btn.disabled = true; }

        const name = document.getElementById('cus-name').value;
        const phone = document.getElementById('cus-phone').value;
        const address = document.getElementById('cus-address').value;
        const qty = document.getElementById('checkout-qty').value;

        // 🛑 BẠN HÃY DÁN LINK WEB APP CHUẨN CỦA BẠN VÀO ĐÂY
        const scriptURL = 'https://script.google.com/macros/s/AKfycbwRi0gDFQgXDkZLY5ethhg-1NGT3He-SZW06xtrg9Et-2H8S0fQK7GsNEN4xN9ZexJ2Iw/exec';
        
        const finalURL = scriptURL + '?name=' + encodeURIComponent(name) + '&phone=' + encodeURIComponent(phone) + '&address=' + encodeURIComponent(address) + '&product=VongTram&price=179000&quantity=' + qty;

        fetch(finalURL, { method: 'GET', mode: 'no-cors' })
        .then(() => {
            closeCheckout();
            const sOverlay = document.getElementById('success-overlay');
            const sModal = document.getElementById('success-modal');
            if (sOverlay) sOverlay.classList.add('active');
            if (sModal) sModal.classList.add('active');
            
            if (btn) { btn.innerText = "XÁC NHẬN ĐẶT HÀNG"; btn.disabled = false; }
            checkoutForm.reset();

            // TikTok Pixel: Báo cáo chuyển đổi mua hàng thành công (CompletePayment)
            if (typeof ttq !== 'undefined') {
                ttq.track('CompletePayment', {
                    content_name: 'Vòng trầm hương 108 Hạt', 
                    value: 179000,                           
                    currency: 'VND'                          
                });
            }
        })
        .catch(err => {
            alert("Lỗi kết nối mạng, dữ liệu tạm thời chưa được gửi. Vui lòng kiểm tra và thử lại!");
            if (btn) { btn.innerText = "XÁC NHẬN ĐẶT HÀNG"; btn.disabled = false; }
        });
    });
}
