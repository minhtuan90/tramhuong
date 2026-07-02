const checkoutForm = document.getElementById('checkout-form');
if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = document.getElementById('submit-order-btn');
        btn.innerText = "ĐANG XỬ LÝ...";
        btn.disabled = true;

        // Lấy dữ liệu từ form
        const name = document.getElementById('cus-name').value;
        const phone = document.getElementById('cus-phone').value;
        const address = document.getElementById('cus-address').value;
        const qty = document.getElementById('checkout-qty').value;

        // Link Web App (Dán link /exec của bạn vào đây)
        const scriptURL = 'https://script.google.com/macros/s/AKfycbwRi0gDFQgXDkZLY5ethhg-1NGT3He-SZW06xtrg9Et-2H8S0fQK7GsNEN4xN9ZexJ2Iw/exec';
        
        // Tạo URL có chứa dữ liệu
        const finalURL = `${scriptURL}?name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}&address=${encodeURIComponent(address)}&product=VongTram&price=179000&quantity=${qty}`;

        fetch(finalURL)
        .then(() => {
            closeCheckout();
            document.getElementById('success-overlay').classList.add('active');
            document.getElementById('success-modal').classList.add('active');
            btn.innerText = "XÁC NHẬN ĐẶT HÀNG";
            btn.disabled = false;
            checkoutForm.reset();
        })
        .catch(err => {
            alert("Có lỗi xảy ra, vui lòng thử lại!");
            btn.innerText = "XÁC NHẬN ĐẶT HÀNG";
            btn.disabled = false;
        });
    });
}
