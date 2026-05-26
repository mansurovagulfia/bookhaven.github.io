
// ПЕРЕКЛЮЧЕНИЕ ТЕМЫ С СОХРАНЕНИЕМ 

const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-toggle__icon');
const body = document.body;

// Проверяем сохранённую тему или используем 'light' по умолчанию
const currentTheme = localStorage.getItem('theme') || 'light';
body.classList.add(`${currentTheme}-theme`);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark-theme');
    body.classList.remove('light-theme', 'dark-theme');
    
    if (isDark) {
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
        updateThemeIcon('dark');
    } else {
        body.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
        updateThemeIcon('light');
    }
});

function updateThemeIcon(theme) {
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}


// ФУНКЦИОНАЛ КОРЗИНЫ

const cartToggle = document.getElementById('cartToggle');
const cartSidebar = document.getElementById('cartSidebar');
const cartClose = document.getElementById('cartClose');
const cartContent = document.getElementById('cartContent');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const overlay = document.getElementById('overlay');
const buyButtons = document.querySelectorAll('.book-card__btn');

// Массив для хранения товаров в корзине
let cart = [];

// Загружаем корзину из localStorage
const savedCart = localStorage.getItem('cart');
if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCart();
}

// Открыть корзину
cartToggle.addEventListener('click', () => {
    cartSidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
});

// Закрыть корзину
function closeCart() {
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

cartClose.addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);

// Добавить книгу в корзину
buyButtons.forEach(button => {
    button.addEventListener('click', function() {
        const bookId = this.dataset.bookId;
        const bookTitle = this.dataset.bookTitle;
        const bookPrice = parseInt(this.dataset.bookPrice);
        
        // Проверяем, есть ли уже книга в корзине
        const existingItem = cart.find(item => item.id === bookId);
        
        if (existingItem) {
            // Книга уже в корзине - показываем сообщение
            alert('Эта книга уже в корзине!');
        } else {
            // Добавляем новую книгу в корзину
            const bookItem = {
                id: bookId,
                title: bookTitle,
                price: bookPrice,
                image: this.closest('.book-card').querySelector('.book-card__image').src
            };
            
            cart.push(bookItem);
            saveCart();
            updateCart();
            
            // Меняем текст кнопки
            this.textContent = 'В корзине';
            this.classList.remove('btn--success');
            this.classList.add('btn--primary');
            this.disabled = true;
            
            // Показываем боковую панель корзины
            cartSidebar.classList.add('active');
            overlay.classList.add('active');
        }
    });
});

// Удалить товар из корзины
function removeFromCart(bookId) {
    cart = cart.filter(item => item.id !== bookId);
    saveCart();
    updateCart();
    
    // Сбрасываем кнопку "Купить"
    const buyButton = document.querySelector(`[data-book-id="${bookId}"]`);
    if (buyButton) {
        buyButton.textContent = 'Купить';
        buyButton.classList.remove('btn--primary');
        buyButton.classList.add('btn--success');
        buyButton.disabled = false;
    }
}

// Сохраняем корзину в localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Обновляем интерфейс корзины
function updateCart() {
    // Обновляем счётчик товаров
    cartCount.textContent = cart.length;
    
    // Обновляем содержимое корзины
    if (cart.length === 0) {
        cartContent.innerHTML = '<p class="cart-sidebar__empty">Корзина пуста</p>';
        cartTotal.textContent = '0 ₽';
    } else {
        let total = 0;
        let cartHTML = '';
        
        cart.forEach(item => {
            total += item.price;
            cartHTML += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}" class="cart-item__image">
                    <div class="cart-item__info">
                        <h4 class="cart-item__title">${item.title}</h4>
                        <p class="cart-item__price">${item.price.toLocaleString()} ₽</p>
                        <button class="cart-item__remove" onclick="removeFromCart('${item.id}')">
                            Удалить из корзины
                        </button>
                    </div>
                </div>
            `;
        });
        
        cartContent.innerHTML = cartHTML;
        cartTotal.textContent = `${total.toLocaleString()} ₽`;
    }
}


// ОБРАБОТКА ФОРМЫ ОБРАТНОЙ СВЯЗИ

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Получаем данные формы
    const formData = new FormData(this);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        message: formData.get('message')
    };
    
    // Выводим в консоль 
    console.log('=== ФОРМА ОБРАТНОЙ СВЯЗИ ===');
    console.log('Имя:', data.name);
    console.log('Email:', data.email);
    console.log('Телефон:', data.phone);
    console.log('Сообщение:', data.message);
    console.log('===========================');
    
    // Показываем сообщение об успехе
    alert('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.');
    
    // Очищаем форму
    this.reset();
});


// ПЛАВНАЯ ПРОКРУТКА ДЛЯ ССЫЛОК НАВИГАЦИИ

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // Закрываем мобильное меню, если открыто
            if (cartSidebar.classList.contains('active')) {
                closeCart();
            }
        }
    });
});


// ЭФФЕКТ ПРИ ПРОКРУТКЕ ШАПКИ

const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 2px 20px var(--shadow)';
    } else {
        header.style.boxShadow = '0 2px 10px var(--shadow)';
    }
});


// АНИМАЦИЯ ПРИ ПРОКРУТКЕ (дополнительно)

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Наблюдаем за всеми карточками
document.querySelectorAll('.book-card, .features__item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});


// МОБИЛЬНАЯ ВЕРСИЯ
const phoneInput = document.getElementById('phone');

phoneInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 0) {
        if (value[0] === '7' || value[0] === '8') {
            value = value.substring(1);
        }
        
        let formattedValue = '+7';
        
        if (value.length > 0) {
            formattedValue += ' (' + value.substring(0, 3);
        }
        if (value.length >= 3) {
            formattedValue += ') ' + value.substring(3, 6);
        }
        if (value.length >= 6) {
            formattedValue += '-' + value.substring(6, 8);
        }
        if (value.length >= 8) {
            formattedValue += '-' + value.substring(8, 10);
        }
        
        e.target.value = formattedValue;
    }
});