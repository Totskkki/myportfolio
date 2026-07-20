document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Smooth Scrolling & Close mobile menu on click
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close menu if open
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });

    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    const htmlElement = document.documentElement;

    const enableDarkMode = () => {
        htmlElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    };

    const disableDarkMode = () => {
        htmlElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    };

    // Check saved theme or system preference
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            if (htmlElement.classList.contains('dark')) {
                disableDarkMode();
            } else {
                enableDarkMode();
            }
        });
    }

    // Header Scroll Effect & ScrollSpy equivalent
    const header = document.querySelector('header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Header styling on scroll
        if (window.scrollY > 10) {
            header.classList.add('shadow-sm', 'bg-white/90', 'dark:bg-gray-950/90', 'backdrop-blur-md');
            header.classList.remove('bg-transparent', 'py-4');
            header.classList.add('py-3');
        } else {
            header.classList.remove('shadow-sm', 'bg-white/90', 'dark:bg-gray-950/90', 'backdrop-blur-md', 'py-3');
            header.classList.add('bg-transparent', 'py-4');
        }

        // Active Link Highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= (sectionTop - 250)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('text-indigo-600', 'dark:text-indigo-400');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('text-indigo-600', 'dark:text-indigo-400');
            }
        });
    });

    // Typed.js Initialization
    const typedTextElement = document.getElementById('typed-text');
    if (typedTextElement) {
        new Typed('#typed-text', {
            strings: ['Software Developer', 'Creative Thinker', 'Problem Solver'],
            typeSpeed: 80,
            backSpeed: 40,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }

    // Set Current Year in Footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Contact Form Submission (Netlify Forms via AJAX)
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formStatus = document.getElementById('form-status');

    if (contactForm && submitBtn && formStatus) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Clear previous status
            formStatus.classList.add('hidden');
            formStatus.className = 'mb-6 hidden px-4 py-3 rounded-xl text-sm font-medium text-center';

            // Disable submit button & show loading state
            submitBtn.disabled = true;
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="bi bi-hourglass-split animate-spin"></i> Sending...';

            const myForm = e.target;
            const formData = new FormData(myForm);

            try {
                const response = await fetch("/", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams(formData).toString(),
                });

                if (response.ok) {
                    showStatus('Message sent successfully! Thank you.', 'success');
                    contactForm.reset();
                } else {
                    showStatus('Failed to send message. Please try again.', 'error');
                }
            } catch (err) {
                console.error('Submission error:', err);
                showStatus('Unable to connect to the server. Please check your network.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });

        function showStatus(message, type) {
            formStatus.textContent = message;
            formStatus.classList.remove('hidden');
            if (type === 'success') {
                formStatus.classList.add('bg-green-100', 'text-green-800', 'dark:bg-green-900/30', 'dark:text-green-300');
            } else {
                formStatus.classList.add('bg-red-100', 'text-red-800', 'dark:bg-red-900/30', 'dark:text-red-300');
            }
            formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});
