(function () {
    var WORKER_URL = 'https://traffic-solo-leads.axxx1616.workers.dev';

    var style = document.createElement('style');
    style.textContent = `
        .consult-overlay {
            position: fixed;
            inset: 0;
            background-color: rgba(0, 0, 0, 0.75);
            backdrop-filter: blur(4px);
            z-index: 2000;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .consult-overlay.open {
            display: flex;
        }

        .consult-modal {
            position: relative;
            width: 100%;
            max-width: 480px;
            max-height: 90vh;
            overflow-y: auto;
            background-color: #111;
            border: 1px solid rgba(0, 200, 83, 0.3);
            border-radius: 20px;
            padding: 2.5rem;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 200, 83, 0.1);
        }

        .consult-modal-close {
            position: absolute;
            top: 1.25rem;
            right: 1.25rem;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background-color: rgba(0, 200, 83, 0.1);
            border: 1px solid rgba(0, 200, 83, 0.3);
            color: #00C853;
            font-size: 1.2rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }

        .consult-modal-close:hover {
            background-color: rgba(0, 200, 83, 0.2);
            transform: rotate(90deg);
        }

        .consult-modal h2 {
            font-size: 1.6rem;
            font-weight: 800;
            margin-bottom: 0.5rem;
            padding-right: 2rem;
        }

        .consult-modal .consult-subtitle {
            color: #a0a0a0;
            font-size: 0.95rem;
            margin-bottom: 1.5rem;
        }

        .consult-urgency {
            background-color: rgba(0, 200, 83, 0.1);
            border: 1px solid rgba(0, 200, 83, 0.4);
            border-radius: 12px;
            padding: 0.75rem 1rem;
            text-align: center;
            color: #00C853;
            font-weight: 600;
            font-size: 0.85rem;
            margin-bottom: 1.5rem;
        }

        .consult-group {
            margin-bottom: 1.1rem;
        }

        .consult-group label {
            display: block;
            margin-bottom: 0.4rem;
            color: #c0c0c0;
            font-weight: 500;
            font-size: 0.9rem;
        }

        .consult-group input,
        .consult-group select {
            width: 100%;
            padding: 0.85rem 1rem;
            background-color: #1a1a1a;
            border: 1px solid rgba(0, 200, 83, 0.3);
            border-radius: 10px;
            color: #e0e0e0;
            font-family: 'Inter', sans-serif;
            font-size: 0.95rem;
            transition: all 0.3s ease;
        }

        .consult-group input:focus,
        .consult-group select:focus {
            outline: none;
            border-color: #00C853;
            background-color: #222;
            box-shadow: 0 0 0 3px rgba(0, 200, 83, 0.15);
        }

        .consult-phone-group {
            display: flex;
            gap: 0.5rem;
        }

        .consult-phone-group select {
            width: auto;
            flex: 0 0 105px;
            padding: 0.85rem 0.4rem;
        }

        .consult-phone-group input {
            flex: 1;
        }

        .consult-submit {
            width: 100%;
            padding: 1rem;
            background-color: #00C853;
            color: #0a0a0a;
            border: none;
            border-radius: 100px;
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 0.5rem;
            box-shadow: 0 8px 25px rgba(0, 200, 83, 0.3);
        }

        .consult-submit:hover {
            background-color: #00E64D;
            transform: translateY(-2px);
        }

        .consult-submit:disabled {
            background-color: #666;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        .consult-message {
            text-align: center;
            margin-top: 1rem;
            padding: 0.85rem;
            border-radius: 10px;
            display: none;
            font-size: 0.9rem;
        }

        .consult-message.success {
            background-color: rgba(0, 200, 83, 0.2);
            color: #00C853;
            border: 1px solid rgba(0, 200, 83, 0.4);
            display: block;
        }

        .consult-message.error {
            background-color: rgba(220, 50, 50, 0.2);
            color: #ff6b6b;
            border: 1px solid rgba(220, 50, 50, 0.4);
            display: block;
        }
    `;
    document.head.appendChild(style);

    var overlay = document.createElement('div');
    overlay.className = 'consult-overlay';
    overlay.innerHTML = `
        <div class="consult-modal">
            <button type="button" class="consult-modal-close" aria-label="Закрити">&times;</button>
            <h2>Отримайте консультацію</h2>
            <p class="consult-subtitle">Залиште номер — менеджер зв'яжеться з вами протягом робочого дня.</p>
            <div class="consult-urgency">🔥 Безкоштовний аудит та консультація — для перших 10 заявок цього місяця</div>
            <form id="consultForm" novalidate>
                <div class="consult-group">
                    <label for="consultName">Ваше ім'я</label>
                    <input type="text" id="consultName" placeholder="Максим Петренко">
                </div>
                <div class="consult-group">
                    <label for="consultEmail">Email</label>
                    <input type="email" id="consultEmail" placeholder="maksym@kompaniya.com">
                </div>
                <div class="consult-group">
                    <label for="consultPhone">Телефон *</label>
                    <div class="consult-phone-group">
                        <select id="consultPhoneCountry" aria-label="Код країни">
                            <option value="380" data-len="9" selected>🇺🇦 +380</option>
                            <option value="48" data-len="9">🇵🇱 +48</option>
                            <option value="49" data-len="11">🇩🇪 +49</option>
                            <option value="1" data-len="10">🇺🇸 +1</option>
                            <option value="44" data-len="10">🇬🇧 +44</option>
                            <option value="420" data-len="9">🇨🇿 +420</option>
                            <option value="421" data-len="9">🇸🇰 +421</option>
                            <option value="40" data-len="9">🇷🇴 +40</option>
                            <option value="370" data-len="8">🇱🇹 +370</option>
                            <option value="371" data-len="8">🇱🇻 +371</option>
                            <option value="372" data-len="8">🇪🇪 +372</option>
                            <option value="373" data-len="8">🇲🇩 +373</option>
                            <option value="34" data-len="9">🇪🇸 +34</option>
                            <option value="39" data-len="10">🇮🇹 +39</option>
                            <option value="33" data-len="9">🇫🇷 +33</option>
                            <option value="31" data-len="9">🇳🇱 +31</option>
                            <option value="972" data-len="9">🇮🇱 +972</option>
                            <option value="995" data-len="9">🇬🇪 +995</option>
                        </select>
                        <input type="tel" id="consultPhone" inputmode="numeric" autocomplete="tel-national" placeholder="501234567" maxlength="9" required>
                    </div>
                </div>
                <div class="consult-group">
                    <label for="consultBusiness">Вид бізнесу</label>
                    <select id="consultBusiness">
                        <option value="">Оберіть тип бізнесу</option>
                        <option value="ecommerce">E-commerce (магазин)</option>
                        <option value="saas">SaaS / Програмне забезпечення</option>
                        <option value="services">Послуги (консалтинг, аутсорсинг)</option>
                        <option value="education">Онлайн освіта / курси</option>
                        <option value="b2b">B2B Виробництво / орт</option>
                        <option value="other">Інше</option>
                    </select>
                </div>
                <div class="consult-group">
                    <label for="consultBudget">Бюджет на рекламу</label>
                    <select id="consultBudget">
                        <option value="">Оберіть діапазон</option>
                        <option value="1000-5000">$1,000 - $5,000/місяць</option>
                        <option value="5000-10000">$5,000 - $10,000/місяць</option>
                        <option value="10000+">$10,000+/місяць</option>
                    </select>
                </div>
                <button type="submit" class="consult-submit">Отримати консультацію</button>
                <div class="consult-message" id="consultMessage"></div>
            </form>
        </div>
    `;
    document.body.appendChild(overlay);

    var phoneInput = overlay.querySelector('#consultPhone');
    var phoneCountry = overlay.querySelector('#consultPhoneCountry');
    var form = overlay.querySelector('#consultForm');
    var message = overlay.querySelector('#consultMessage');
    var submitBtn = overlay.querySelector('.consult-submit');

    function currentPhoneLength() {
        return parseInt(phoneCountry.selectedOptions[0].dataset.len, 10);
    }

    function maskPhoneInput() {
        var len = currentPhoneLength();
        phoneInput.maxLength = len;
        phoneInput.placeholder = '5'.padEnd(len, '0');
        phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, len);
    }

    phoneInput.addEventListener('input', maskPhoneInput);
    phoneCountry.addEventListener('change', maskPhoneInput);
    maskPhoneInput();

    function openConsultModal() {
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeConsultModal() {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    window.openConsultModal = openConsultModal;
    window.closeConsultModal = closeConsultModal;

    overlay.querySelector('.consult-modal-close').addEventListener('click', closeConsultModal);
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeConsultModal();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay.classList.contains('open')) closeConsultModal();
    });

    document.querySelectorAll('.js-open-consult').forEach(function (el) {
        el.addEventListener('click', function (e) {
            e.preventDefault();
            openConsultModal();
        });
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var name = overlay.querySelector('#consultName').value.trim();
        var email = overlay.querySelector('#consultEmail').value.trim();
        var phoneDigits = phoneInput.value.trim();
        var expectedLen = currentPhoneLength();
        var phone = '+' + phoneCountry.value + phoneDigits;
        var business = overlay.querySelector('#consultBusiness').value;
        var budget = overlay.querySelector('#consultBudget').value;

        if (!phoneDigits) {
            message.textContent = 'Будь ласка, вкажіть номер телефону';
            message.className = 'consult-message error';
            return;
        }

        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            message.textContent = 'Введіть коректну email адресу';
            message.className = 'consult-message error';
            return;
        }

        if (phoneDigits.length !== expectedLen) {
            message.textContent = 'Номер має містити ' + expectedLen + ' цифр після коду країни';
            message.className = 'consult-message error';
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Надсилання...';

        fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name, email: email, phone: phone, business: business, budget: budget })
        })
            .then(function (res) {
                if (!res.ok) throw new Error('Request failed');
                return res.json();
            })
            .then(function () {
                message.textContent = '✓ Дякуємо! Ми отримали вашу заявку. Менеджер зв\'яжеться з вами найближчим часом.';
                message.className = 'consult-message success';
                form.reset();
                maskPhoneInput();
                setTimeout(closeConsultModal, 2500);
            })
            .catch(function () {
                message.textContent = 'Не вдалося надіслати заявку. Спробуйте ще раз або напишіть нам у Telegram.';
                message.className = 'consult-message error';
            })
            .finally(function () {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Отримати консультацію';
            });
    });
})();
