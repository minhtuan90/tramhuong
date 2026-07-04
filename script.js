// ==========================================
// 1. ĐIỀU KHIỂN GIAO DIỆN (MỞ/ĐÓNG MODAL)
// ==========================================
function openCheckout() {
    const overlay = document.getElementById('checkout-overlay');
    const modal = document.getElementById('checkout-modal');
    if (overlay) overlay.classList.add('active');
    if (modal) modal.classList.add('active');
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

function openChat() { alert("Hệ thống đang kết nối đến Zalo..."); }

// ==========================================
// 2. KHỞI TẠO TỰ ĐỘNG KHI TẢI TRANG
// ==========================================
function startWeb() {
    try { initAccordion(); } catch(e) {}
    try { initSlider(); } catch(e) {}
    try { initCountdown(); } catch(e) {}
    try { initLocationAPI(); } catch(e) { console.error("Lỗi API API:", e); }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startWeb);
} else {
    startWeb(); 
}

// ==========================================
// 3. API LẤY TỈNH / THÀNH PHỐ / QUẬN HUYỆN
// ==========================================
function initLocationAPI() {
    const provSelect = document.getElementById('cus-province');
    const distSelect = document.getElementById('cus-district');
    const wardSelect = document.getElementById('cus-ward');
    if (!provSelect) return;

    // Tải danh sách Tỉnh/Thành
    fetch('https://provinces.open-api.vn/api/p/')
        .then(res => res.json())
        .then(data => {
            data.forEach(item => {
                let opt = document.createElement('option');
                opt.value = item.code;
                opt.text = item.name;
                opt.setAttribute('data-name', item.name);
                provSelect.appendChild(opt);
            });
        }).catch(err => console.log("Lỗi tải tỉnh:", err));

    // Khi chọn Tỉnh -> Tải Quận/Huyện
    provSelect.addEventListener('change', function(e) {
        const provCode = e.target.value;
        distSelect.innerHTML = '<option value="">Chọn Quận / Huyện</option>';
        wardSelect.innerHTML = '<option value="">Chọn Phường / Xã</option>';
        distSelect.disabled = true; wardSelect.disabled = true;

        if (provCode) {
            fetch(`https://provinces.open-api.vn/api/p/${provCode}?depth=2`)
                .then(res => res.json())
                .then(data => {
                    data.districts.forEach(item => {
                        let opt = document.createElement('option');
                        opt.value = item.code;
                        opt.text = item.name;
                        opt.setAttribute('data-name', item.name);
                        distSelect.appendChild(opt);
                    });
                    distSelect.disabled = false;
                });
        }
    });

    // Khi chọn Quận/Huyện -> Tải Phường/Xã
    distSelect.addEventListener('change', function(e) {
        const distCode = e.target.value;
        wardSelect.innerHTML = '<option value="">Chọn Phường / Xã</option>';
        wardSelect.disabled = true;

        if (distCode) {
            fetch(`https://provinces.open-api.vn/api/d/${distCode}?depth=2`)
                .then(res => res.json())
                .then(data => {
                    data.wards.forEach(item => {
                        let opt = document.createElement('option');
                        opt.value = item.code;
                        opt.text = item.name;
                        opt.setAttribute('data-name', item.name);
                        wardSelect.appendChild(opt);
                    });
                    wardSelect.disabled = false;
                });
        }
    });
}

// ==========================================
// 4. HÀM MENU FAQ
// ==========================================
function initAccordion() {
    if (!document.getElementById('faq-injected-css-v2')) {
        const style = document.createElement('style');
        style.id = 'faq-injected-css-v2';
        style.innerHTML = `
            .accordion { display: block !important; height: auto !important; }
            .accordion-item { display: block !important; height: auto !important; min-height: fit-content !important; overflow: visible !important; position: relative !important; }
            .accordion-header { background-color: #fff !important; position: relative !important; z-index: 2 !important; }
            .accordion-content { display: none !important; }
            .accordion-content.show-active { display: block !important; height: auto !important; max-height: none !important; padding: 10px 0 20px 0 !important; opacity: 1 !important; visibility: visible !important; }
            .accordion-content.show-active p { display: block !important; white-space: normal !important; word-wrap: break-word !important; line-height: 1.6 !important; color: #333 !important; margin: 0 !important; }
        `;
        document.head.appendChild(style);
    }
    const items = document.querySelectorAll('.accordion-item');
    items.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        if (header && content) {
            header.onclick = function(e) {
                e.preventDefault(); e.stopPropagation(); 
                const icon = header.querySelector('.icon');
                const isOpening = !content.classList.contains('show-active');
                document.querySelectorAll('.accordion-content').forEach(c => c.classList.remove('show-active'));
                document.querySelectorAll('.accordion-header .icon').forEach(i => i.innerText = '+');
                if (isOpening) { content.classList.add('show-active'); if (icon) icon.innerText = '-'; }
            };
        }
    });
}

// ==========================================
// 5. SLIDER VÀ ĐẾM NGƯỢC
// ==========================================
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
    }, 5000);
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
// 6. GỬI DATA VỀ GOOGLE SHEETS VÀ CHUYỂN TRANG
// ==========================================
const checkoutForm = document.getElementById('checkout-form');
if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault(); 
        const btn = document.getElementById('submit-order-btn');
        if (btn) { btn.innerText = "ĐANG XỬ LÝ..."; btn.disabled = true; }

        const name = document.getElementById('cus-name').value;
        const phone = document.getElementById('cus-phone').value;
        
        // GỘP CHUỖI ĐỊA CHỈ TỪ 4 Ô:
        const provSelect = document.getElementById('cus-province');
        const distSelect = document.getElementById('cus-district');
        const wardSelect = document.getElementById('cus-ward');
        
        const provName = provSelect.options[provSelect.selectedIndex]?.getAttribute('data-name') || "";
        const distName = distSelect.options[distSelect.selectedIndex]?.getAttribute('data-name') || "";
        const wardName = wardSelect.options[wardSelect.selectedIndex]?.getAttribute('data-name') || "";
        const street = document.getElementById('cus-address').value;

        // Định dạng thành: Số nhà, Phường, Quận, Tỉnh
        const fullAddress = `${street}, ${wardName}, ${distName}, ${provName}`;
        const qty = document.getElementById('checkout-qty').value;

        // 🛑 LINK GOOGLE SCRIPT CỦA BẠN:
        const scriptURL = 'https://script.google.com/macros/s/AKfycbwRi0gDFQgXDkZLY5ethhg-1NGT3He-SZW06xtrg9Et-2H8S0fQK7GsNEN4xN9ZexJ2Iw/exec';
        
        const finalURL = scriptURL + '?name=' + encodeURIComponent(name) + '&phone=' + encodeURIComponent(phone) + '&address=' + encodeURIComponent(fullAddress) + '&product=VongTram&price=179000&quantity=' + qty;

        fetch(finalURL, { method: 'GET', mode: 'no-cors' })
        .then(() => {
            window.location.href = "thankyou.html";
        })
        .catch(err => {
            alert("Lỗi kết nối mạng. Vui lòng kiểm tra và thử lại!");
            if (btn) { btn.innerText = "XÁC NHẬN ĐẶT HÀNG"; btn.disabled = false; }
        });
    });
}
