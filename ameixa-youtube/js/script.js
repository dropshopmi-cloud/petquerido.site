// Flag para controlar se os links jÃƒÆ’Ã‚Â¡ foram configurados
let linksConfigured = false;

function setupLinks() {
    if (linksConfigured) return;

    if (typeof MONTHLY_REFILLS_LINK !== 'undefined' && 
        typeof BEST_VALUE_LINK !== 'undefined' && 
        typeof MOST_POPULAR_LINK !== 'undefined') {

        function preserveParams(element, newHref) {
            if (!element) return;
            if (element.dataset.processed === 'true') return;

            try {
                const currentUrl = new URL(window.location.href); // Pegando da URL atual da pÃ¡gina
                const finalUrl = new URL(newHref);

                // Copia todos os parÃ¢metros da URL atual
                currentUrl.searchParams.forEach((value, key) => {
                    finalUrl.searchParams.set(key, value);
                });

                element.href = finalUrl.toString();
                element.dataset.processed = 'true';
            } catch (error) {
                console.error('Erro ao processar link:', error);
            }
        }

        ['1', '2', '3'].forEach(suffix => {
            const monthlyElement = document.getElementById('monthlyLink' + suffix);
            if (monthlyElement) preserveParams(monthlyElement, MONTHLY_REFILLS_LINK);
            
            const bestValueElement = document.getElementById('bestValueLink' + suffix);
            if (bestValueElement) preserveParams(bestValueElement, BEST_VALUE_LINK);
            
            const popularElement = document.getElementById('popularLink' + suffix);
            if (popularElement) preserveParams(popularElement, MOST_POPULAR_LINK);
        });

        // Atualiza todos os links da pÃ¡gina
        const allLinks = document.querySelectorAll('a[href]');
        allLinks.forEach(link => {
            try {
                const href = link.getAttribute('href');
                // Apenas processa links absolutos e internos (nÃ£o Ã¢ncoras ou javascript)
                if (href && !href.startsWith('javascript:') && !href.startsWith('#') && !link.dataset.processed) {
                    const currentUrl = new URL(window.location.href);
                    const finalUrl = new URL(link.href, currentUrl.origin);

                    currentUrl.searchParams.forEach((value, key) => {
                        finalUrl.searchParams.set(key, value);
                    });

                    link.href = finalUrl.toString();
                    link.dataset.processed = 'true';
                }
            } catch (error) {
                console.error('Erro ao processar link global:', error);
            }
        });

        linksConfigured = true;
    }
}



let animationStarted = false;


function startPulseAnimation() {
    if (animationStarted) return; 
    
    animationStarted = true;
    const btns = document.querySelectorAll('.best-value-btn');
    
    btns.forEach(btn => {
        // Adiciona transiÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o suave
        btn.style.transition = 'transform 1s ease-in-out';
        
        // Inicia a animaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o
        setInterval(() => {
            btn.style.transform = 'scale(1.05)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 1000);
        }, 2000);
    });
}


const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && 
            mutation.attributeName === 'style' && 
            !linksConfigured) {
            setupLinks();
            startPulseAnimation();
        }
    });
});


window.addEventListener('load', () => {
    const elementoOculto = document.getElementById('elementoOculto');
    if (elementoOculto) {
        observer.observe(elementoOculto, {
            attributes: true,
            subtree: true,
            childList: true
        });
    }
    
    
    setupLinks();
    startPulseAnimation();
});


document.addEventListener("DOMContentLoaded", function() {
    /* ConfiguraÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o inicial */
    var elementoOculto = document.getElementById('elementoOculto');
    var SECONDS_TO_DISPLAY = 0;
    var elementoJaMostrado = false;
    
    // Pegar o tempo do data-show-delay
    if (elementoOculto) {
        SECONDS_TO_DISPLAY = parseInt(elementoOculto.getAttribute('data-show-delay')) || 0;
    } else {
        return;
    }

    // Chave ÃƒÆ’Ã‚Âºnica para localStorage baseada no tempo definido
    var storageKey = 'elementoMostrado_' + SECONDS_TO_DISPLAY;
    
    /* FunÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o para mostrar o elemento */
    function showHiddenElement() {
        if (elementoJaMostrado) return;
        
        elementoOculto.style.display = "block";
        elementoOculto.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start'
        });
        
        elementoJaMostrado = true;
        
        // Salvar no localStorage que o elemento jÃƒÆ’Ã‚Â¡ foi mostrado
        try {
            localStorage.setItem(storageKey, 'true');
        } catch (e) {
            // Em caso de erro com localStorage (ex: modo privativo), apenas ignora
        }
    }

    /* Monitorar o tempo do vÃƒÆ’Ã‚Â­deo */
    function startWatchVideoProgress() {
        if (typeof smartplayer === 'undefined' || !smartplayer.instances || !smartplayer.instances.length) {
            setTimeout(startWatchVideoProgress, 1000);
            return;
        }

        const player = smartplayer.instances[0];
        
        if (!player.video) {
            setTimeout(startWatchVideoProgress, 1000);
            return;
        }

        // Adicionar listener para timeupdate
        player.on('timeupdate', () => {
            if (player.video.currentTime >= SECONDS_TO_DISPLAY) {
                showHiddenElement();
            }
        });

        // Adicionar listener para play e verificar tempo inicial
        player.on('play', () => {
            if (player.video.currentTime >= SECONDS_TO_DISPLAY) {
                showHiddenElement();
            }
        });
    }

    // Verificar se o elemento jÃƒÆ’Ã‚Â¡ foi mostrado anteriormente
    try {
        if (localStorage.getItem(storageKey) === 'true') {
            showHiddenElement();
        }
    } catch (e) {
        // Em caso de erro com localStorage, continua normalmente
    }

    // Iniciar monitoramento
    setTimeout(startWatchVideoProgress, 1000);
});

document.addEventListener('DOMContentLoaded', () => {
    const faqToggles = document.querySelectorAll('.faq-toggle');
    if (faqToggles) {
        faqToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const answer = toggle.nextElementSibling;
                const icon = toggle.querySelector('svg');
                
                if (answer && icon) {
                    answer.classList.toggle('hidden');
                    icon.classList.toggle('rotate-180');
                }
            });
        });
    }
    
    updatePublicationDate(); 
    updateViewerCount();
    startCountdown();
});

//new
function updatePublicationDate() {
    const date = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    const formattedDate = `${dayName}, ${day}  ${monthName} ${year}`;
    
    // Update all elements with the publication-date class
    const dateElements = document.querySelectorAll('.publication-date');
    dateElements.forEach(element => {
        element.textContent = formattedDate;
    });
}


function updateViewerCount() {
    let num = 400;
    let increment = Math.floor(Math.random() * 2) + 2;
    let timer;
    
    const pessoasElement = document.getElementById('pessoasAssistindo');
    if (!pessoasElement) return; // Exit if element doesn't exist
    
    if (timer) {
        clearInterval(timer);
    }
    
    pessoasElement.textContent = num;
    
    timer = setInterval(function() {
        num += increment;
        pessoasElement.textContent = num;
        if (num >= 1500) {
            num = 602;
        }
        increment = Math.floor(Math.random() * 2) + 2;
    }, 2000);
}

function startCountdown() {
    const countdownElements = document.querySelectorAll('.countdown-timer');
    if (!countdownElements.length) return;

    countdownElements.forEach(countdownElement => {
        // Only start if the element is visible
        if (window.getComputedStyle(countdownElement).display === 'none') return;

        // Store timer in element's dataset to manage multiple instances
        if (countdownElement.dataset.timer) {
            clearInterval(parseInt(countdownElement.dataset.timer));
        }

        let minutes = 16;
        let seconds = 42;

        function updateDisplay() {
            const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            countdownElement.textContent = formattedTime;
        }

        const timer = setInterval(() => {
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(timer);
                    minutes = 16;
                    seconds = 42;
                    updateDisplay();
                    startCountdown(); // Restart countdown
                    return;
                }
                minutes--;
                seconds = 59;
            } else {
                seconds--;
            }
            updateDisplay();
        }, 1000);

        countdownElement.dataset.timer = timer;
        updateDisplay();
    });
}

// FAQ Toggle functionality
function toggleFAQ(id) {
    const answer = document.querySelector(`#faq-${id}`);
    const icon = document.querySelector(`#faq-icon-${id}`);
    
    if (answer.classList.contains('hidden')) {
        answer.classList.remove('hidden');
        answer.classList.add('block');
        icon.classList.remove('fa-plus');
        icon.classList.add('fa-minus');
    } else {
        answer.classList.add('hidden');
        answer.classList.remove('block');
        icon.classList.add('fa-plus');
        icon.classList.remove('fa-minus');
    }
}