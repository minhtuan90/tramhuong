// ==========================================
// 1. CÁC HÀM GIAO DIỆN CHÍNH (NÚT BẤM, MODAL)
// ==========================================
function openCheckout() {
    const overlay = document.getElementById('checkout-overlay');
    const modal = document.getElementById('checkout-modal');
    if(overlay) overlay.classList.add('active');
    if(modal) modal.classList.add('active');

    // Báo cáo TikTok: Khách bấm nút mua hàng
    if (typeof ttq !== 'undefined') ttq.track('InitiateCheckout');
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
    closeCheckout();
}

function changeQty(delta) {
    const input = document.getElementById('checkout-qty');
    if (!input) return;
    let val = parseInt(input.value) + delta;
    input.value = val < 1 ? 1 : val;
}

// ==========================================
// 2. KHỞI TẠO TỰ ĐỘNG KHI TẢI TRANG
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Dùng try-catch để an toàn tuyệt đối, 1 cái lỗi không làm liệt cái khác
    try { initAccordion(); } catch(e) { console.error("Lỗi FAQ:", e); }
    try { initSlider(); } catch(e) { console.error("Lỗi Slider:", e); }
    try { initCountdown(); } catch(e) { console.error("Lỗi Countdown:", e); }
});

// ==========================================
// 3. HÀM MENU FAQ (CHUYÊN NGHIỆP - FIX LỖI ẨN CHỮ)
// ==========================================
function initAccordion() {
    // Tiêm CSS quyền lực cao nhất vào web để ép hiện chữ
    if (!document.getElementById('faq-safe-css')) {
        const style = document.createElement('style');
        style.id = 'faq-safe-css';
        style.innerHTML = `
            .accordion-content { display: none !important; transition: all 0.3s ease; }
            .accordion-content.hien-chu { 
                display: block !important; 
                height: auto !important; 
                opacity: 1 !important; 
                visibility: visible !important;
                margin-top: 10px !important;
            }
        `;
        document.head.appendChild(style);
    }

    const items = document.querySelectorAll('.accordion-item');
    if(items.length === 0) return;

    items.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        
        if (header && content) {
            header.addEventListener('click', function(e) {
                e.preventDefault();
                
                const icon = header.querySelector('.icon');
                const isClosed = !content.classList.contains('hien-chu');

                // Đóng tất cả các menu khác
                document.querySelectorAll('.accordion-content').forEach(c => {
                    c.classList.remove('hien-chu');
                });
                document.querySelectorAll('.accordion-header .icon').forEach(i => {
                    i.innerText = '+';
                });

                // Mở menu được click
                if (isClosed) {
                    content.classList.add('hien-chu');
                    if(icon) icon.innerText = '-';
                }
            });
        }
    });
}

// ==========================================
// 4. SLIDER VÀ ĐẾM NGƯỢC
// ==========================================
function initSlider() {
    const track = document.getElementById('slider-track');
    const slides = document.querySelectorAll('.slide');
    if(!track || slides.length === 0) return;
    
    let index = 0;
    setInterval(() => {
        index = (index + 1) % slides.length;
        track.style.transform = 'translateX(-' + (index * 100) + '%)';
    }, 3000);
}

function initCountdown() {
    let time = 19 * 60 + 59; 
    const boxes = document.querySelectorAll('.time-box');
    if(boxes.length < 3) return;

    setInterval(() => {
        if (time <= 0) time = 24 * 3600; 
        time--;
        boxes[0].innerText = Math.floor(time / 3600).toString().padStart(2, '0');
        boxes[1].innerText = Math.floor((time % 3600) / 60).toString().padStart(2, '0');
        boxes[2].innerText = (time % 60).toString().padStart(2, '0');
    }, 1000);
}

// ==========================================
// 5. GỬI ĐƠN HÀNG VỀ GOOGLE SHEETS
// ==========================================
const checkoutForm = document.getElementById('checkout-form');
if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault(); 
        
        const btn = document.getElementById('submit-order-btn');
        if(btn) { btn.innerText = "ĐANG GỬI ĐƠN..."; btn.disabled = true; }

        const nameNode = document.getElementById('cus-name');
        const phoneNode = document.getElementById('cus-phone');
        const addressNode = document.getElementById('cus-address');
        const qtyNode = document.getElementById('checkout-qty');

        const name = nameNode ? nameNode.value : "Khách";
        const phone = phoneNode ? phoneNode.value : "Trống";
        const address = addressNode ? addressNode.value : "Trống";
        const qty = qtyNode ? qtyNode.value : 1;

        // 👉 CHỈ CẦN DÁN LINK GOOGLE SCRIPT CỦA BẠN VÀO DÒNG DƯỚI ĐÂY:
        const scriptURL = 'https://script.google.com/macros/s/AKfycbwRi0gDFQgXDkZLY5ethhg-1NGT3He-SZW06xtrg9Et-2H8S0fQK7GsNEN4xN9ZexJ2Iw/exec';
        
        const finalURL = scriptURL + '?name=' + encodeURIComponent(name) + '&phone=' + encodeURIComponent(phone) + '&address=' + encodeURIComponent(address) + '&product=VongTram&price=179000&quantity=' + qty;

        fetch(finalURL, { method: 'GET', mode: 'no-cors' })
        .then(() => {
            closeCheckout();
            const sOverlay = document.getElementById('success-overlay');
            const sModal = document.getElementById('success-modal');
            if(sOverlay) sOverlay.classList.add('active');
            if(sModal) sModal.classList.add('active');
            
            if(btn) { btn.innerText = "XÁC NHẬN ĐẶT HÀNG"; btn.disabled = false; }
            checkoutForm.reset();

            // Báo cáo TikTok Pixel: Hoàn tất thanh toán
            if (typeof ttq !== 'undefined') {
                ttq.track('CompletePayment', {
                    content_name: 'Vòng trầm hương 108 Hạt', 
                    value: 179000,                           
                    currency: 'VND'                          
                });
            }
        })
        .catch(err => {
            alert("Lỗi kết nối. Vui lòng kiểm tra mạng và thử lại!");
            if(btn) { btn.innerText = "XÁC NHẬN ĐẶT HÀNG"; btn.disabled = false; }
        });
    });
}
