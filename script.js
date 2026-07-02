document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo các tính năng
    try { initSlider(); } catch(e) {}
    try { initCountdown(); } catch(e) { console.error("Lỗi Timer:", e); }
    try { initAccordion(); } catch(e) { console.error("Lỗi Accordion:", e); }
});

// --- Logic Gửi đơn hàng (Đã tối ưu) ---
const checkoutForm = document.getElementById('checkout-form');
if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const btn = document.getElementById('submit-order-btn');
        btn.innerText = "ĐANG GỬI ĐƠN...";
        btn.disabled = true;

        const orderData = {
            name: document.getElementById('cus-name').value,
            phone: document.getElementById('cus-phone').value,
            address: document.getElementById('cus-address').value,
            product: "1 vòng trầm hương 108 Hạt",
            price: 179000,
            quantity: document.getElementById('checkout-qty').value
        };

        // Dán LINK_EXEC_CỦA_BẠN_VÀO_ĐÂY (Cái link có đuôi /exec)
        const scriptURL = 'LINK_EXEC_CỦA_BẠN_VÀO_ĐÂY'; 

        var xhr = new XMLHttpRequest();
        xhr.open('POST', scriptURL);
        xhr.setRequestHeader('Content-Type', 'text/plain');
        
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                // Đóng form và hiện thông báo thành công dù kết quả thế nào
                closeCheckout();
                document.getElementById('success-overlay').classList.add('active');
                document.getElementById('success-modal').classList.add('active');
                
                btn.innerText = "XÁC NHẬN ĐẶT HÀNG";
                btn.disabled = false;
                checkoutForm.reset();
            }
        };
        xhr.send(JSON.stringify(orderData));
    });
}

// --- Các hàm hỗ trợ UI ---
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
    setInterval(() => {
        time--;
        const m = Math.floor(time / 60);
        const s = time % 60;
        boxes[1].innerText = m.toString().padStart(2, '0');
        boxes[2].innerText = s.toString().padStart(2, '0');
    }, 1000);
}

function initAccordion() {
    document.querySelectorAll('.accordion-header').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.parentElement.classList.toggle('active');
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
}

function changeQty(delta) {
    const input = document.getElementById('checkout-qty');
    let val = parseInt(input.value) + delta;
    input.value = val < 1 ? 1 : val;
}

function openChat() { alert("Đang chuyển tới Zalo..."); }
