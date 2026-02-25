// --- DATABASE: 4 Flagship FastFood Items ---
const menuDB = [
    { id: 1, name: "ডাবল চিজ বিফ বার্গার", price: 350, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500&auto=format&fit=crop" },
    { id: 2, name: "চিকেন সুপ্রিম পিৎজা (১০ ইঞ্চি)", price: 750, img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500&auto=format&fit=crop" },
    { id: 3, name: "মচমচে চিকেন উইংস (৮ পিস)", price: 280, img: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=500&auto=format&fit=crop" },
    { id: 4, name: "পেরিপেরি লার্জ ফ্রাইস", price: 150, img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=500&auto=format&fit=crop" }
];

let cart = [];

// --- INITIALIZATION ---
window.addEventListener('DOMContentLoaded', () => {
    // FAQ Logic
    document.querySelectorAll('.faq-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            trigger.parentElement.classList.toggle('active');
        });
    });

    // Date Picker Restriction (No Past Dates)
    const dateInput = document.getElementById('delDate');
    if(dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
        dateInput.value = today;
    }

    // Load Menu
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if(preloader) preloader.style.display = 'none';
        renderMenu(menuDB);
        setGreeting();
    }, 1000);
});

function setGreeting() {
    const hour = new Date().getHours();
    const g = document.getElementById('greeting');
    if(!g) return;
    
    if(hour < 12) g.innerText = "শুভ সকাল, গরম গরম নাস্তা হোক FoodVilla-তে! 🍔";
    else if(hour < 17) g.innerText = "শুভ দুপুর, দুপুরের লাঞ্চে চলুক পিৎজা! 🍕";
    else g.innerText = "শুভ সন্ধ্যা, আড্ডায় থাকুক ক্রিসপি চিকেন! 🍗";
}

// --- RENDER FUNCTIONS ---
function renderMenu(data) {
    const grid = document.getElementById('menuGrid');
    if(!grid) return;
    
    grid.innerHTML = data.map(item => `
        <div class="product-card animate__animated animate__fadeIn">
            <div class="product-img-wrapper">
                <img src="${item.img}" class="product-img" alt="${item.name}">
                <div class="price-tag">৳${item.price}</div>
            </div>
            <div class="product-info">
                <h3>${item.name}</h3>
                <p style="font-size:12px; color:#888; margin-bottom:15px;">প্রিমিয়াম সস ও ফ্রেশ উপাদানে তৈরি সেরা ফাস্ট ফুড।</p>
                <button class="add-btn" onclick="addToCart(${item.id})">
                    <i class="fas fa-cart-plus"></i> অ্যাড করুন
                </button>
            </div>
        </div>
    `).join('');
}

// --- CART LOGIC ---
function addToCart(id) {
    const product = menuDB.find(p => p.id === id);
    const inCart = cart.find(c => c.id === id);

    if(inCart) {
        inCart.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    if(navigator.vibrate) navigator.vibrate(50);
    updateUI();
    
    // Auto open drawer on first add
    if(cart.length === 1) toggleDrawer();
}

function updateQty(id, delta) {
    const item = cart.find(i => i.id === id);
    item.qty += delta;
    if(item.qty < 1) cart = cart.filter(i => i.id !== id);
    updateUI();
}

function updateUI() {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const badge = document.getElementById('cart-badge');
    const fQty = document.getElementById('floatQty');
    const fTotal = document.getElementById('floatTotal');

    if(badge) badge.innerText = totalQty;
    if(fQty) fQty.innerText = totalQty;
    if(fTotal) fTotal.innerText = `৳${subtotal}`;
    
    const bar = document.getElementById('floatBar');
    if(bar) {
        totalQty > 0 ? bar.classList.add('active') : bar.classList.remove('active');
    }

    renderCartList();
    calculateBill();
}

function renderCartList() {
    const list = document.getElementById('cartList');
    const form = document.getElementById('formWrapper');
    const footer = document.getElementById('checkFooter');

    if(!list) return;

    if(cart.length === 0) {
        list.innerHTML = `<div style="text-align:center; padding:40px;"><i class="fas fa-hamburger" style="font-size:50px; color:#eee; margin-bottom:15px;"></i><p>আপনার ঝুড়িটি খালি!</p></div>`;
        if(form) form.style.display = 'none';
        if(footer) footer.style.display = 'none';
        return;
    }

    if(form) form.style.display = 'block';
    if(footer) footer.style.display = 'block';

    list.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.img}">
            <div style="flex:1">
                <div style="font-weight:700; font-size:14px;">${item.name}</div>
                <div style="color:var(--brand); font-weight:800; font-size:14px;">৳${item.price * item.qty}</div>
            </div>
            <div class="qty-controls">
                <i class="fas fa-minus" onclick="updateQty(${item.id}, -1)"></i>
                <span style="font-weight:800">${item.qty}</span>
                <i class="fas fa-plus" onclick="updateQty(${item.id}, 1)"></i>
            </div>
        </div>
    `).join('');
}

function calculateBill() {
    const sub = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const ship = parseInt(document.getElementById('area').value) || 0;
    
    const subEl = document.getElementById('subTotal');
    const shipEl = document.getElementById('shipCharge');
    const grandEl = document.getElementById('grandTotal');

    if(subEl) subEl.innerText = `৳${sub}`;
    if(shipEl) shipEl.innerText = `৳${ship}`;
    if(grandEl) grandEl.innerText = `৳${sub + ship}`;
}

// --- UI HELPERS ---
function toggleDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('overlay');
    if(drawer) drawer.classList.toggle('open');
    if(overlay) {
        overlay.style.display = (overlay.style.display === 'block') ? 'none' : 'block';
    }
}

function filterMenu() {
    const query = document.getElementById('searchBox').value.toLowerCase();
    const filtered = menuDB.filter(item => item.name.toLowerCase().includes(query));
    renderMenu(filtered);
}

// --- CHECKOUT LOGIC (WhatsApp) ---
function sendToWhatsApp() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const date = document.getElementById('delDate').value;
    const time = document.getElementById('delTime').value;
    const areaSelect = document.getElementById('area');
    const areaText = areaSelect.options[areaSelect.selectedIndex].text;

    if(!name || !phone || !address || !date) {
        alert("দয়া করে নাম, ফোন, ঠিকানা এবং তারিখ পূরণ করুন।");
        return;
    }

    let itemText = "";
    cart.forEach(item => {
        itemText += `• ${item.name} (${item.qty} টি) - ৳${item.price * item.qty}%0A`;
    });

    const sub = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const ship = parseInt(areaSelect.value) || 0;
    const total = sub + ship;

    const message = `*নতুন ফাস্ট ফুড অর্ডার (FoodVilla)*%0A--------------------------%0A*কাস্টমার ডিটেইলস:*%0Aনাম: ${name}%0Aফোন: ${phone}%0Aঠিকানা: ${address}%0Aতারিখ: ${date}%0Aসময়: ${time}%0Aএরিয়া: ${areaText}%0A--------------------------%0A*অর্ডার করা আইটেম:*%0A${itemText}--------------------------%0A*সাবটোটাল: ৳${sub}*%0A*ডেলিভারি চার্জ: ৳${ship}*%0A*সর্বমোট বিল: ৳${total}*%0A--------------------------%0A_ফুডভিলা ওয়েবসাইট থেকে প্রেরিত_`;

    const waURL = `https://wa.me/8801700000000?text=${message}`; // এখানে আপনার নাম্বার বসান
    window.open(waURL, '_blank');
}