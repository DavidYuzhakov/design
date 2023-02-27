"use strict"

// Burger menu
const isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return (
            isMobile.Android() ||
            isMobile.BlackBerry() ||
            isMobile.iOS() ||
            isMobile.Opera() ||
            isMobile.Windows());
    }
};  

if (isMobile.any()) {
    document.body.classList.add('_touch');

    const menuArrows = document.querySelectorAll('.nav__arrow');
    if (menuArrows.length > 0) {
        menuArrows.forEach(menuArrow => {
            menuArrow.addEventListener("click", function(e) {
                menuArrow.parentElement.classList.toggle('_active');
            });
        });
    }

} else {
    document.body.classList.add('_pc');
}


const menuBurger = document.querySelector(".burger");
const menuNav = document.querySelector(".nav");

if (menuBurger) {
    menuBurger.addEventListener("click", () => {
        document.body.classList.toggle("_lock");
        menuBurger.classList.toggle("active");
        menuNav.classList.toggle("active");
    });
}


// Прокрутка при клике
const menuLinks = document.querySelectorAll('[data-goto]');

if (menuLinks.length > 0) {
    for (let index = 0; index < menuLinks.length; index++) {
        const menuLink = menuLinks[index];
        menuLink.addEventListener("click", onMenuLinkClick)
    }

    function onMenuLinkClick(e) {
        const menuLink = e.target;
        if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
            const gotoBlock = document.querySelector(menuLink.dataset.goto);
            const gotoBlockValue = gotoBlock.getBoundingClientRect().top + scrollY - document.querySelector('header').offsetHeight;

            if (menuBurger.classList.contains("active")) {
                document.body.classList.remove("_lock");
                menuBurger.classList.remove("active");
                menuNav.classList.remove("active");
            }

            window.scrollTo({
                top: gotoBlockValue,
                behavior: "smooth",
            });
            e.preventDefault();
        }
    }
}


// Fixed Header
const header = document.querySelector('.header');
const intro = document.querySelector('.intro');
const headerH = header.offsetHeight;
const introH = intro.offsetHeight;

// if (document.documentElement.clientWidth > 770) {
    window.addEventListener("scroll", () => {
        let scrollDistance = window.scrollY;
    
        if (scrollDistance > introH - 70) {
            header.classList.add('header--fixed');
        } else {
            header.classList.remove('header--fixed');
        }
    });



// Reviews slider
const swiper = new Swiper('.swiper-container', {
    grabCursor: true,

    initialSlide: 1,

    spaceBetween: 30,

    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  });


// Form
document.addEventListener('DOMContentLoaded', function() {
    const form = document.forms.main;
    form.addEventListener('submit', formSend);

    async function formSend(e) {
        e.preventDefault();

        let error = formValidate(form)

    }

    function formValidate (form) {
        let error = 0;
        let formReq = document.querySelectorAll('._req');

        for(let index = 0; index < formReq.length; index++) {
            const input = formReq[index];
            formRemoveError(input);

            if (input.classList.contains('_email')) {
                if (emailTest(input)) {
                    formAddError(input);
                    error++;
                }
            } else {
                if (input.value === "") {
                    formAddError(input);
                    error++;
                }
            }
        }
    }

    function formAddError(input) {
        input.classList.add("_error");
    }

    function formRemoveError(input) {
        input.classList.remove("_error");
    }

    function emailTest(input) {
        return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
    }

});


// Popup
const popupLinks = document.querySelectorAll('._popup-link');
const body = document.querySelector('body');
const lockPadding = document.querySelectorAll('._lock-padding'); //для фиксированных объектах

let unlock = true;

const timeout = 800;

if (popupLinks.length > 0) {
    for (let index = 0; index < popupLinks.length; index++) {
        const popupLink = popupLinks[index];
        popupLink.addEventListener("click", function(e) {
            const popupName = popupLink.getAttribute('href').replace('#', '');
            const curentPopup = document.getElementById(popupName);
            poupOpen(curentPopup);
            e.preventDefault();    
        });
    }
}

const popupCloseIcon = document.querySelectorAll('._close-popup');

if (popupCloseIcon.length > 0) {
    popupCloseIcon.forEach(el => {
        el.addEventListener('click', function (e) {
            popupClose(el.closest('.popup'));
            e.preventDefault();
        });
    });
}

function poupOpen(curentPopup) {
    if (curentPopup && unlock) {
        const popupActive  = document.querySelector('.popup._open');
        if (popupActive) {
            popupClose(popupActive, false);
        } else {
            bodyLock();
        }
        curentPopup.classList.add('_open');
        curentPopup.addEventListener("click", function (e) {
            if (!e.target.closest('.popup__content')) {
                popupClose(e.target.closest('.popup'));
            }
        });
    }
}

function popupClose(popupActive, doUnlock = true) {
    if (unlock) {
        popupActive.classList.remove('_open');
        if (doUnlock) {
            bodyUnLock();
        }
    }
}

function bodyLock() {
    const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
    if (lockPaddingValue.length > 0) {
        for (let index = 0; index < lockPadding.length; index++) {
            const el = lockPadding[index];
            el.style.paddingRight = lockPaddingValue;
        }
    }

    body.style.paddingRight = lockPaddingValue;
    body.classList.add('_lock');

    unlock = false;
    setTimeout(() => {
        unlock = true;
    }, timeout);
}

function bodyUnLock() {
    setTimeout(function() {
        if (lockPadding.length > 0) {
            for (let index = 0; index < lockPadding.length; index++) {
                const el = lockPadding[index];
                el.style.paddingRight = '0px';
            }
        }
        body.style.paddingRight = '0px';
        body.classList.remove('_lock');
    }, timeout);

    unlock = false;
    setTimeout(function() {
        unlock = true;
    }, timeout)
}

document.addEventListener('keydown', function (e) {
    if (e.key === "Escape") {
        const popupActive = document.querySelector('.popup._open');
        popupClose(popupActive);
    }
});