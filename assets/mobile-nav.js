(function () {
    var header = document.querySelector('header');
    var nav = header && header.querySelector('nav');
    if (!header || !nav) return;

    var style = document.createElement('style');
    style.textContent = `
        .burger-btn {
            display: none;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 5px;
            width: 32px;
            height: 32px;
            padding: 0;
            background: transparent;
            border: none;
            cursor: pointer;
            z-index: 1101;
        }

        .burger-btn span {
            display: block;
            width: 100%;
            height: 2px;
            background-color: #00C853;
            border-radius: 2px;
            transition: transform 0.3s ease, opacity 0.3s ease;
        }

        .burger-btn.open span:nth-child(1) {
            transform: translateY(7px) rotate(45deg);
        }

        .burger-btn.open span:nth-child(2) {
            opacity: 0;
        }

        .burger-btn.open span:nth-child(3) {
            transform: translateY(-7px) rotate(-45deg);
        }

        .nav-backdrop {
            position: fixed;
            inset: 0;
            background-color: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(2px);
            z-index: 999;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease;
        }

        .nav-backdrop.open {
            opacity: 1;
            visibility: visible;
        }

        @media (max-width: 768px) {
            .burger-btn {
                display: flex;
            }

            header nav {
                position: fixed;
                top: 0;
                right: 0;
                height: 100vh;
                width: min(78vw, 320px);
                margin: 0;
                background-color: #0d0d0d;
                border-left: 1px solid rgba(0, 200, 83, 0.25);
                box-shadow: -10px 0 40px rgba(0, 0, 0, 0.5);
                flex-direction: column;
                align-items: flex-start;
                justify-content: center;
                gap: 1.75rem;
                padding: 6rem 2.25rem 2rem;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                z-index: 1100;
            }

            header nav.nav-open {
                transform: translateX(0);
            }

            header nav a {
                font-size: 1rem;
            }

            header nav a.cta-button {
                margin-top: 0.5rem;
            }
        }
    `;
    document.head.appendChild(style);

    var burger = document.createElement('button');
    burger.type = 'button';
    burger.className = 'burger-btn';
    burger.setAttribute('aria-label', 'Меню');
    burger.setAttribute('aria-expanded', 'false');
    burger.innerHTML = '<span></span><span></span><span></span>';
    nav.parentNode.insertBefore(burger, nav);

    var backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    header.appendChild(backdrop);

    function closeNav() {
        nav.classList.remove('nav-open');
        burger.classList.remove('open');
        backdrop.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    function openNav() {
        nav.classList.add('nav-open');
        burger.classList.add('open');
        backdrop.classList.add('open');
        burger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    burger.addEventListener('click', function () {
        if (nav.classList.contains('nav-open')) {
            closeNav();
        } else {
            openNav();
        }
    });

    backdrop.addEventListener('click', closeNav);

    nav.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeNav();
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) closeNav();
    });
})();
