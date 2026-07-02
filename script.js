// ==========================================
// 1. CÁC HÀM GIAO DIỆN CHÍNH
// ==========================================
function openCheckout() {
    const overlay = document.getElementById('checkout-overlay');
    const modal = document.getElementById('checkout-modal');
    if(overlay) overlay.classList.add('active');
    if(modal) modal.classList.add('active');

    // BÁO CÁO TIKTOK: KHÁCH HÀNG BẮT ĐẦU MỞ FORM MUA
    if (typeof ttq !== 'undefined') {
        ttq.track('InitiateCheckout');
    }
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

function openChat() {
    alert("Đang chuyển hướng đến Zalo/Messenger...");
}

// ==========================================
// 2. KHỞI TẠO HIỆU ỨNG (Menu, Slider, Timer)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    try { initAccordion(); } catch(e) { console.error(e); }
    try { initSlider(); } catch(e) { console.error(e); }
    try { initCountdown(); } catch(e) { console.error(e); }
});

// HÀM MENU FAQ (PHIÊN BẢN CHUẨN TRỊ LỖI BỊ CSS CHE KHUẤT)
function initAccordion() {
    // 1. Bắt thẳng vào thẻ bọc ngoài cùng của từng câu hỏi
    const items = document.querySelectorAll('.accordion-item');
    
    items.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        const icon = item.querySelector('.icon');
        
        if (header && content) {
            // Ẩn nội dung khi mới tải trang
            content.style.display = 'none';
            
            header.addEventListener('click', function(e) {
                e.preventDefault(); 
                
                // Kiểm tra xem menu đang đóng hay mở
                const isOpen = content.style.display === 'block';

                // Tùy chọn: Tự động đóng các câu hỏi khác khi mở câu hỏi này
                items.forEach(otherItem => {
                    const otherContent = otherItem.querySelector('.accordion-content');
                    const otherIcon = otherItem.querySelector('.icon');
                    if (otherContent) {
                        otherContent.style.display = 'none';
                        otherItem.style.height = 'auto'; 
                        otherItem.classList.remove('active');
                        if (otherIcon) otherIcon.innerText = '+';
                    }
                });

                // Bật/tắt câu hỏi hiện tại
                if (!isOpen) {
                    content.style.display = 'block';
                    // Ép thẻ cha bung chiều cao và tràn viền để không che chữ
                    item.style.height = 'auto';
                    item.style.overflow = 'visible';
                    item.classList.add('active');
                    if (icon) icon.innerText = '-'; 
                } else {
                    content.style.display = 'none';
                    item.classList.remove('active');
                    if (icon) icon.innerText = '+'; 
                }
            });
        }
    });
}

                    // ĐÓNG MENU
                    content.style.display = 'none';
                    content.classList.remove('active');
                    if (icon) icon.innerText = '+'; 
                }
            });
        }
    });
}

function initSlider() {
    const track = document.getElementById('slider-track');
    const slides = document.querySelectorAll('.slide');
    if(!track || slides.length === 0) return;
    
    let index = 0;
    setInterval(() => {
        index = (index + 1) % slides.length;
        track.style.transform = `translateX(-${index * 100}%)`;
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
// 3. XỬ LÝ ĐẶT HÀNG QUA GOOGLE SHEETS
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

        const name = nameNode ? nameNode.value : "";
        const phone = phoneNode ? phoneNode.value : "";
        const address = addressNode ? addressNode.value : "";
        const qty = qtyNode ? qtyNode.value : 1;

        // 👉 DÁN LẠI LINK API GOOGLE APPS SCRIPT CỦA BẠN VÀO ĐÂY:
        const scriptURL = 'https://script.google.com/macros/s/AKfycbwRi0gDFQgXDkZLY5ethhg-1NGT3He-SZW06xtrg9Et-2H8S0fQK7GsNEN4xN9ZexJ2Iw/exec';
        
        const finalURL = `${scriptURL}?name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}&address=${encodeURIComponent(address)}&product=VongTram&price=179000&quantity=${qty}`;

        fetch(finalURL, { method: 'GET', mode: 'no-cors' })
        .then(() => {
            closeCheckout();
            const sOverlay = document.getElementById('success-overlay');
            const sModal = document.getElementById('success-modal');
            if(sOverlay) sOverlay.classList.add('active');
            if(sModal) sModal.classList.add('active');
            
            if(btn) { btn.innerText = "XÁC NHẬN ĐẶT HÀNG"; btn.disabled = false; }
            checkoutForm.reset();

            // BÁO CÁO TIKTOK: MUA HÀNG THÀNH CÔNG
            if (typeof ttq !== 'undefined') {
                ttq.track('CompletePayment', {
                    content_name: 'Vòng trầm hương 108 Hạt', 
                    value: 179000,                           
                    currency: 'VND'                          
                });
            }
        })
        .catch(err => {
            alert("Lỗi kết nối. Vui lòng thử lại!");
            if(btn) { btn.innerText = "XÁC NHẬN ĐẶT HÀNG"; btn.disabled = false; }
        });
    });
}
