// --- DATABASE: 4 Flagship Cake Items ---
const menuDB = [
    { id: 1, name: "প্রিমিয়াম চকলেট ফাজ কেক", price: 850, img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=500&auto=format&fit=crop" },
    { id: 2, name: "রেড ভেলভেট চিজকেক", price: 1200, img: "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?q=80&w=500&auto=format&fit=crop" },
    { id: 3, name: "ভ্যানিলা স্ট্রবেরি ডিলাইট", price: 750, img: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=500&auto=format&fit=crop" },
    { id: 4, name: "ব্ল্যাক ফরেস্ট ক্লাসিক", price: 950, img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=500&auto=format&fit=crop" }
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
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    dateInput.value = today;

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
    
    if(hour < 12) g.innerText = "শুভ সকাল, মিষ্টিমুখ হোক কেক দিয়ে! 🍰";
    else if(hour < 17) g.innerText = "শুভ দুপুর, সেরা স্বাদের কেক এখানে! 🎂";
    else g.innerText = "শুভ সন্ধ্যা, আজকের সেলিব্রেশন চলুক! ✨";
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
                <p style="font-size:12px; color:#888; margin-bottom:15px;">১ম শ্রেণীর উপকরণে তৈরি ফ্রেশ বেকড কেক।</p>
                <button class="add-btn" onclick="addToCart(${item.id})">
                    <i class="fas fa-cart-plus"></i> অর্ডার করুন
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

    document.getElementById('cart-badge').innerText = totalQty;
    document.getElementById('floatQty').innerText = totalQty;
    document.getElementById('floatTotal').innerText = `৳${subtotal}`;
    
    const bar = document.getElementById('floatBar');
    totalQty > 0 ? bar.classList.add('active') : bar.classList.remove('active');

    renderCartList();
    calculateBill();
}

function renderCartList() {
    const list = document.getElementById('cartList');
    const form = document.getElementById('formWrapper');
    const footer = document.getElementById('checkFooter');

    if(cart.length === 0) {
        list.innerHTML = `<div style="text-align:center; padding:40px;"><i class="fas fa-birthday-cake" style="font-size:50px; color:#eee; margin-bottom:15px;"></i><p>আপনার ঝুড়িটি খালি!</p></div>`;
        form.style.display = 'none';
        footer.style.display = 'none';
        return;
    }

    form.style.display = 'block';
    footer.style.display = 'block';

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
    
    document.getElementById('subTotal').innerText = `৳${sub}`;
    document.getElementById('shipCharge').innerText = `৳${ship}`;
    document.getElementById('grandTotal').innerText = `৳${sub + ship}`;
}

// --- UI HELPERS ---
function toggleDrawer() {
    document.getElementById('cartDrawer').classList.toggle('open');
    const overlay = document.getElementById('overlay');
    overlay.style.display = overlay.style.display === 'block' ? 'none' : 'block';
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
    const cakeText = document.getElementById('cakeText').value || "নেই";
    const area = document.getElementById('area').options[document.getElementById('area').selectedIndex].text;

    if(!name || !phone || !address || !date) {
        alert("দয়া করে তারকা চিহ্নিত (*) সকল ঘর পূরণ করুন।");
        return;
    }

    let itemText = "";
    cart.forEach(item => {
        itemText += `• ${item.name} (${item.qty} টি) - ৳${item.price * item.qty}%0A`;
    });

    const sub = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const ship = parseInt(document.getElementById('area').value);
    const total = sub + ship;

    const message = `*নতুন কেক অর্ডার (CakeVilla)*%0A--------------------------%0A*কাস্টমার ডিটেইলস:*%0Aনাম: ${name}%0Aফোন: ${phone}%0Aঠিকানা: ${address}%0Aতারিখ: ${date}%0Aএরিয়া: ${area}%0A--------------------------%0A*কেকের উপরের লেখা:*%0A_${cakeText}_%0A--------------------------%0A*অর্ডার করা আইটেম:*%0A${itemText}--------------------------%0A*সাবটোটাল: ৳${sub}*%0A*ডেলিভারি চার্জ: ৳${ship}*%0A*সর্বমোট বিল: ৳${total}*%0A--------------------------%0A_কেকভিলা ওয়েবসাইট থেকে প্রেরিত_`;

    const waURL = `https://wa.me/8801686195607?text=${message}`;
    window.open(waURL, '_blank');
}