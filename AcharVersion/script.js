// --- DATABASE: 3 Special Pickles ---
        const menuDB = [
    { 
        id: 1, 
        name: "আমের স্পেশাল কাশ্মীরি আচার", 
        price: 280, 
        img: "https://images.unsplash.com/photo-1598512752271-33f913a5af13?q=80&w=400&auto=format&fit=crop" 
    },
    { 
        id: 2, 
        name: "মশলাদার ঘরোয়া রসুনের আচার", 
        price: 250, 
        img: "https://images.unsplash.com/photo-1621460249210-675668ceae1b?q=80&w=400&auto=format&fit=crop" 
    },
    { 
        id: 3, 
        name: "টক-ঝাল-মিষ্টি চালতার আচার", 
        price: 220, 
        img: "https://images.unsplash.com/photo-1634502577660-f19500078833?q=80&w=400&auto=format&fit=crop" 
    },
    { 
        id: 4, 
        name: "ঝাল লঙ্কার মুখরোচক আচার", 
        price: 180, 
        img: "https://images.unsplash.com/photo-1588165171080-c89acfa5ee83?q=80&w=400&auto=format&fit=crop" 
    }
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

            // Load Menu with Preloader
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
            
            if(hour < 12) g.innerText = "শুভ সকাল, আচারের স্বাদে কাটুক দিন! ☀️";
            else if(hour < 17) g.innerText = "শুভ দুপুর, খাবারের সাথে একটু আচার হোক! 🏺";
            else g.innerText = "শুভ সন্ধ্যা, চটপটে আচারের খোঁজে? ✨";
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
                        <p style="font-size:12px; color:#888; margin-bottom:15px;">১০০% কেমিক্যাল মুক্ত এবং খাঁটি সরিষার তেলে তৈরি।</p>
                        <button class="add-btn" onclick="addToCart(${item.id})">
                            <i class="fas fa-cart-plus"></i> ঝুড়িতে যোগ করুন
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

            // Badges & Floating Bar
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
                list.innerHTML = `
                    <div style="text-align:center; padding:40px;">
                        <i class="fas fa-box-open" style="font-size:50px; color:#eee; margin-bottom:15px;"></i>
                        <p>আপনার ঝুড়িটি এখন খালি!</p>
                    </div>`;
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
            const areaSelect = document.getElementById('area');
            const ship = areaSelect ? parseInt(areaSelect.value) : 60;
            
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

        // --- CHECKOUT LOGIC (WHATSAPP) ---
        function sendToWhatsApp() {
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const address = document.getElementById('address').value;
            const areaElem = document.getElementById('area');
            const areaText = areaElem.options[areaElem.selectedIndex].text;

            if(!name || !phone || !address) {
                alert("অর্ডার সম্পূর্ণ করতে নাম, ফোন নম্বর এবং ঠিকানা দিন।");
                return;
            }

            let itemText = "";
            cart.forEach(item => {
                itemText += `• ${item.name} (${item.qty} টি) - ৳${item.price * item.qty}%0A`;
            });

            const sub = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
            const ship = parseInt(areaElem.value);
            const total = sub + ship;

            const message = `*নতুন আচারের অর্ডার (FoodVilla)*%0A--------------------------%0A*কাস্টমার ডিটেইলস:*%0Aনাম: ${name}%0Aফোন: ${phone}%0Aঠিকানা: ${address}%0Aএলাকা: ${areaText}%0A--------------------------%0A*অর্ডার করা আইটেম:*%0A${itemText}--------------------------%0A*সাবটোটাল: ৳${sub}*%0A*ডেলিভারি চার্জ: ৳${ship}*%0A*সর্বমোট বিল: ৳${total}*%0A--------------------------%0A_ফুডভিলা আচার_`;

            const waURL = `https://wa.me/8801700000000?text=${message}`; // এখানে আপনার নম্বর বসান
            window.open(waURL, '_blank');
        }