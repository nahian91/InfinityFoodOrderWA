        // --- DATABASE: 4 Flagship Items ---
        const menuDB = [
            { id: 1, name: "শাহী মাটন কাচ্চি বিরিয়ানি", price: 350, img: "https://images.unsplash.com/photo-1697276063790-a68a966b12f7?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
            { id: 2, name: "স্পেশাল চিকেন দম বিরিয়ানি", price: 250, img: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500" },
            { id: 3, name: "পুরাতন ঢাকার বিফ তেহারি", price: 220, img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500" },
            { id: 4, name: "দেশি চিকেন রোস্ট (স্পেশাল)", price: 150, img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=500" }
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
                document.getElementById('preloader').style.display = 'none';
                renderMenu(menuDB);
                setGreeting();
            }, 1000);
        });

        function setGreeting() {
            const hour = new Date().getHours();
            const g = document.getElementById('greeting');
            if(hour < 12) g.innerText = "শুভ সকাল, ভোজনরসিক! 👋";
            else if(hour < 17) g.innerText = "শুভ দুপুর, ভোজনরসিক! 🍛";
            else g.innerText = "শুভ সন্ধ্যা, ভোজনরসিক! ✨";
        }

        // --- RENDER FUNCTIONS ---
        function renderMenu(data) {
            const grid = document.getElementById('menuGrid');
            grid.innerHTML = data.map(item => `
                <div class="product-card animate__animated animate__fadeIn">
                    <div class="product-img-wrapper">
                        <img src="${item.img}" class="product-img" alt="${item.name}">
                        <div class="price-tag">৳${item.price}</div>
                    </div>
                    <div class="product-info">
                        <h3>${item.name}</h3>
                        <p style="font-size:12px; color:#888; margin-bottom:15px;">প্রিমিয়াম স্বাদ এবং স্বাস্থ্যসম্মত প্যাকেজিং।</p>
                        <button class="add-btn" onclick="addToCart(${item.id})">
                            <i class="fas fa-plus-circle"></i> ঝুড়িতে যোগ করুন
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
                list.innerHTML = `<div style="text-align:center; padding:40px;"><i class="fas fa-shopping-cart" style="font-size:50px; color:#eee; margin-bottom:15px;"></i><p>আপনার ঝুড়িটি খালি!</p></div>`;
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
            const ship = parseInt(document.getElementById('area').value);
            
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

        // --- CHECKOUT LOGIC ---
        function sendToWhatsApp() {
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const address = document.getElementById('address').value;
            const date = document.getElementById('delDate').value;
            const time = document.getElementById('delTime').value;
            const area = document.getElementById('area').options[document.getElementById('area').selectedIndex].text;

            if(!name || !phone || !address || !date) {
                alert("দয়া করে তারকা চিহ্নিত (*) সকল ঘর পূরণ করুন।");
                return;
            }

            let itemText = "";
            cart.forEach(item => {
                itemText += `• ${item.name} (${item.qty} টি) - ৳${item.price * item.qty}%0A`;
            });

            const sub = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
            const ship = parseInt(document.getElementById('area').value);
            const total = sub + ship;

            const message = `*নতুন অর্ডার (FoodVilla)*%0A--------------------------%0A*কাস্টমার ডিটেইলস:*%0Aনাম: ${name}%0Aফোন: ${phone}%0Aঠিকানা: ${address}%0Aতারিখ: ${date}%0Aসময় স্লট: ${time}%0Aএরিয়া: ${area}%0A--------------------------%0A*অর্ডার করা আইটেম:*%0A${itemText}--------------------------%0A*সাবটোটাল: ৳${sub}*%0A*ডেলিভারি চার্জ: ৳${ship}*%0A*সর্বমোট বিল: ৳${total}*%0A--------------------------%0A_ফুডভিলা ওয়েবসাইট থেকে প্রেরিত_`;

            const waURL = `https://wa.me/8801686195607?text=${message}`;
            window.open(waURL, '_blank');
        }