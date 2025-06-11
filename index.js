/**
 * JAVASCRIPT POUR LA PAGE D'ACCUEIL
 * Gestion des animations, interactions et menu responsive
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚢 Page d\'accueil du Système Expert chargée');
    
    // Initialisation des composants
    createParticles();
    initMobileMenu();
    initScrollAnimations();
    initModuleCards();
    initSmoothScrolling();
    initNavbarEffects();
    
    console.log('✅ Tous les composants initialisés');
});

/**
 * Création des particules animées en arrière-plan
 */
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 60;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Taille aléatoire
        const size = Math.random() * 6 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Position horizontale aléatoire
        particle.style.left = Math.random() * 100 + '%';
        
        // Délai d'animation aléatoire
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 15 + 20) + 's';
        
        // Opacité aléatoire
        particle.style.opacity = Math.random() * 0.5 + 0.2;
        
        particlesContainer.appendChild(particle);
    }
    
    console.log(`🌟 ${particleCount} particules créées`);
}

/**
 * Initialisation du menu mobile responsive
 */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');

    function toggleMenu() {
        const isActive = hamburger.classList.contains('active');
        
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        
        // Bloquer le scroll du body
        if (!isActive) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    // Event listeners
    hamburger.addEventListener('click', toggleMenu);
    menuOverlay.addEventListener('click', toggleMenu);

    // Fermer le menu lors du clic sur un lien
    mobileLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                toggleMenu();
                
                setTimeout(() => {
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }, 300);
            }
        });
    });

    // Fermer avec Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Fermer automatiquement si la fenêtre devient plus large
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
            toggleMenu();
        }
    });

    console.log('📱 Menu mobile initialisé');
}

/**
 * Initialisation des animations au scroll
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animation spéciale pour les cartes de modules
                if (entry.target.classList.contains('modules-grid')) {
                    animateModuleCards(entry.target);
                }
                
                // Animation pour les étapes du processus
                if (entry.target.classList.contains('process-flow')) {
                    animateProcessSteps(entry.target);
                }
                
                // Animation pour les statistiques
                if (entry.target.classList.contains('stats-grid')) {
                    animateStats(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observer tous les éléments animables
    const animatedElements = document.querySelectorAll(
        '.modules-grid, .process-flow, .tech-grid, .stats-grid, .module-card, .tech-card, .stat-card'
    );
    
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    console.log('🎬 Animations au scroll initialisées');
}

/**
 * Animation des cartes de modules
 */
function animateModuleCards(container) {
    const cards = container.querySelectorAll('.module-card');
    
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.animation = `fadeInUp 0.6s ease-out forwards`;
            card.style.animationDelay = `${index * 0.1}s`;
        }, index * 100);
    });
}

/**
 * Animation des étapes du processus
 */
function animateProcessSteps(container) {
    const steps = container.querySelectorAll('.process-step');
    const arrows = container.querySelectorAll('.process-arrow');
    
    steps.forEach((step, index) => {
        setTimeout(() => {
            step.style.animation = `slideInLeft 0.6s ease-out forwards`;
        }, index * 200);
    });
    
    arrows.forEach((arrow, index) => {
        setTimeout(() => {
            arrow.style.animation = `fadeInUp 0.4s ease-out forwards`;
        }, (index + 1) * 200 + 100);
    });
}

/**
 * Animation des statistiques avec compteur
 */
function animateStats(container) {
    const statNumbers = container.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const finalValue = stat.textContent;
        let currentValue = 0;
        const increment = finalValue.includes('+') ? 1 : (finalValue === '100%' ? 2 : 0.2);
        const duration = 2000;
        const stepTime = duration / (parseInt(finalValue) / increment);
        
        stat.textContent = '0';
        
        const counter = setInterval(() => {
            currentValue += increment;
            if (currentValue >= parseInt(finalValue)) {
                stat.textContent = finalValue;
                clearInterval(counter);
            } else {
                stat.textContent = Math.floor(currentValue) + (finalValue.includes('+') ? '+' : (finalValue.includes('%') ? '%' : ''));
            }
        }, stepTime);
    });
}

/**
 * Initialisation des interactions avec les cartes de modules
 */
function initModuleCards() {
    const moduleCards = document.querySelectorAll('.module-card');
    
    moduleCards.forEach((card, index) => {
        // Effet de hover amélioré
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) rotateX(5deg)';
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            
            // Animer l'icône
            const icon = this.querySelector('.module-icon');
            if (icon) {
                icon.style.transform = 'scale(1.15) rotate(10deg)';
            }
            
            // Effet de parallaxe sur les tags
            const tags = this.querySelectorAll('.feature-tag');
            tags.forEach((tag, tagIndex) => {
                setTimeout(() => {
                    tag.style.transform = 'translateY(-2px)';
                }, tagIndex * 50);
            });
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0deg)';
            
            const icon = this.querySelector('.module-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
            
            const tags = this.querySelectorAll('.feature-tag');
            tags.forEach(tag => {
                tag.style.transform = 'translateY(0)';
            });
        });
        
        // Clic pour montrer plus d'infos (effet temporaire)
        card.addEventListener('click', function() {
            showModuleInfo(index + 1);
        });
    });
    
    console.log('🎯 Interactions des cartes de modules initialisées');
}

/**
 * Affiche des informations supplémentaires sur un module
 */
function showModuleInfo(moduleNumber) {
    const moduleInfo = {
        1: {
            title: "Module Accostage",
            description: "Gestion intelligente de l'attribution des quais avec prise en compte des contraintes météorologiques et physiques.",
            features: ["Attribution automatique des quais", "Vérification tirant d'eau", "Gestion priorités", "Contrôle météo"]
        },
        2: {
            title: "Module Déchargement", 
            description: "Optimisation du déchargement avec portiques STS et enregistrement automatique dans le TOS.",
            features: ["Portiques STS automatiques", "Inspection conteneurs", "Enregistrement TOS", "Transport AGV"]
        },
        3: {
            title: "Module Cour",
            description: "Empilage stratégique dans les zones de stockage avec gestion des grues RTG.",
            features: ["Grues RTG optimisées", "Zones spécialisées", "Empilage intelligent", "Zones électrifiées"]
        },
        4: {
            title: "Module Douane",
            description: "Traitement automatisé des formalités douanières avec interface CAMCIS.",
            features: ["Interface CAMCIS", "Vérification documents", "Inspections aléatoires", "Transitaires"]
        },
        5: {
            title: "Module Chargement",
            description: "Préparation et chargement optimisé des conteneurs d'export avec stabilité du navire.",
            features: ["Plan de chargement", "Stabilité navire", "Vérification scellés", "Priorité export"]
        },
        6: {
            title: "Module Sortie",
            description: "Gestion des flux de sortie avec transport terrestre et contrôle des portes.",
            features: ["Transport terrestre", "Contrôle portes", "Gestion congestion", "Suivi temps réel"]
        }
    };
    
    const info = moduleInfo[moduleNumber];
    if (info) {
        // Effet de notification temporaire
        showNotification(`📋 ${info.title}`, info.description);
    }
}

/**
 * Affiche une notification temporaire
 */
function showNotification(title, message) {
    // Supprimer notification existante
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
    `;
    
    // Styles CSS inline pour la notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        padding: 20px;
        border-radius: 15px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.2);
        max-width: 350px;
        z-index: 10000;
        transform: translateX(400px);
        transition: all 0.3s ease;
        cursor: pointer;
    `;
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Supprimer après 4 secondes ou au clic
    const removeNotification = () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    };
    
    notification.addEventListener('click', removeNotification);
    setTimeout(removeNotification, 4000);
}

/**
 * Initialisation du scroll fluide pour les liens d'ancrage
 */
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Compensation navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    console.log('📜 Scroll fluide initialisé');
}

/**
 * Effets de la navbar au scroll
 */
function initNavbarEffects() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        // Changer l'opacité de la navbar selon le scroll
        if (currentScrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.15)';
            navbar.style.backdropFilter = 'blur(30px)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.1)';
            navbar.style.backdropFilter = 'blur(20px)';
        }
        
        // Masquer/afficher la navbar selon la direction du scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
    
    console.log('🔝 Effets navbar initialisés');
}

/**
 * Effet de parallaxe pour le hero
 */
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
}

/**
 * Animation des boutons CTA
 */
function initCTAAnimations() {
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
            
            // Effet de vague
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.remove();
                }
            }, 600);
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

/**
 * Initialisation des effets de hover avancés
 */
function initAdvancedHoverEffects() {
    // Effet 3D sur les cartes tech
    const techCards = document.querySelectorAll('.tech-card');
    
    techCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });
}

// Animation CSS additionnelle pour les ripples
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .notification h4 {
        margin: 0 0 10px 0;
        color: #2c3e50;
        font-size: 1.1em;
    }
    
    .notification p {
        margin: 0;
        color: #7f8c8d;
        font-size: 0.9em;
        line-height: 1.4;
    }
`;
document.head.appendChild(rippleStyle);

// Initialisation avancée au chargement complet
window.addEventListener('load', function() {
    initParallaxEffect();
    initCTAAnimations();
    initAdvancedHoverEffects();
    
    console.log('🎨 Effets avancés initialisés');
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`⚡ Page chargée en ${loadTime}ms`);
        }, 0);
    });
}

console.log('🚀 JavaScript de la page d\'accueil initialisé');