// ==========================================
// 1. CÁC HÀM GIAO DIỆN (UI) - ĐẢM BẢO NÚT BẤM HOẠT ĐỘNG
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
}

function changeQty(delta) {
    const input = document.getElementById('checkout-qty');
    if (!input) return;
    let val = parseInt(input.value) + delta;
    input.value = val < 1 ? 1 : val;
}

// ==========================================
// 2. KHỞI TẠO CÁC HIỆU ỨNG KHI TRANG TẢI XONG
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Slider
    const track = document.getElementById('slider-track');
    const slides = document.querySelectorAll('.slide');
    if(track && slides.length > 0) {
        let index = 0;
        setInterval(() => {
            index = (index + 1) % slides.length;
            track.style.transform = `translateX(-${index * 100}%)`;
        }, 3000);
    }

    // Accordion
    document.querySelectorAll('.accordion-header').forEach(btn => {
        btn.addEventListener('click', function() {
            this.parentElement.classList.toggle('active');
        });
    });
});

// ==========================================
// 3. XỬ LÝ GỬI ĐƠN HÀNG VỀ GOOGLE SHEETS
// ==========================================
const checkoutForm = document.getElementById('checkout-form');
if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Chặn việc tải lại trang
        
        const btn = document.getElementById('submit-order-btn');
        btn.innerText = "ĐANG XỬ LÝ...";
        btn.disabled = true;

        // Đóng gói dữ liệu bằng FormData (Cách an toàn nhất)
        const data = new FormData();
        data.append('name', document.getElementById('cus-name').value);
        data.append('phone', document.getElementById('cus-phone').value);
        data.append('address', document.getElementById('cus-address').value);
        data.append('product', "Vòng trầm hương 108 Hạt");
        data.append('price', "179000");
        data.append('quantity', document.getElementById('checkout-qty').value);

        // 👉 DÁN LINK CỦA BẠN VÀO ĐÂY:
        const scriptURL = 'THAY_LINK_EXEC_CỦA_BẠN_VÀO_ĐÂY';

        // Gửi lệnh POST
        fetch(scriptURL, {
            method: 'POST',
            body: data,
            mode: 'no-cors' // Bỏ qua lỗi bảo mật trình duyệt
        })
        .then(() => {
            // Hiển thị thành công
            closeCheckout();
            document.getElementById('success-overlay').classList.add('active');
            document.getElementById('success-modal').classList.add('active');
            
            // Đặt lại form
            btn.innerText = "XÁC NHẬN ĐẶT HÀNG";
            btn.disabled = false;
            checkoutForm.reset();
        })
        .catch(err => {
            console.error("Lỗi:", err);
            alert("Có lỗi xảy ra, vui lòng thử lại!");
            btn.innerText = "XÁC NHẬN ĐẶT HÀNG";
            btn.disabled = false;
        });
    });
}
