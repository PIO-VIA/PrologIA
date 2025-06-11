/**
 * JAVASCRIPT POUR LA PAGE DES RÈGLES PROLOG
 * Gestion des interactions, navigation et fonctionnalités de copie
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('📚 Page des règles Prolog chargée');
    
    // Initialisation des composants
    initMobileMenu();
    initSmoothScrolling();
    initCodeBlocks();
    initNavigation();
    initSearchFunctionality();
    
    console.log('✅ Interface des règles initialisée');
});

/**
 * MENU MOBILE
 */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');

    function toggleMenu() {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        
        if (mobileMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    if (hamburger) hamburger.addEventListener('click', toggleMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', toggleMenu);

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
            } else {
                toggleMenu();
            }
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            toggleMenu();
        }
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
            toggleMenu();
        }
    });

    console.log('📱 Menu mobile des règles initialisé');
}

/**
 * NAVIGATION FLUIDE
 */
function initSmoothScrolling() {
    // Navigation dans les liens d'ancrage
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 100; // Compensation navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Effet de highlight sur la section ciblée
                highlightSection(targetElement);
            }
        });
    });
    
    console.log('📜 Navigation fluide initialisée');
}

/**
 * HIGHLIGHT TEMPORAIRE D'UNE SECTION
 */
function highlightSection(element) {
    element.style.transform = 'scale(1.02)';
    element.style.boxShadow = '0 25px 50px rgba(102, 126, 234, 0.3)';
    element.style.transition = 'all 0.3s ease';
    
    setTimeout(() => {
        element.style.transform = 'scale(1)';
        element.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
    }, 1500);
}

/**
 * GESTION DES BLOCS DE CODE
 */
function initCodeBlocks() {
    // Animation d'apparition des blocs de code
    observeCodeBlocks();
    
    // Gestion des numéros de ligne (optionnel)
    addLineNumbers();
    
    // Amélioration de la lisibilité
    enhanceCodeReadability();
    
    console.log('💻 Blocs de code initialisés');
}

/**
 * OBSERVER POUR ANIMER LES BLOCS DE CODE
 */
function observeCodeBlocks() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideInLeft 0.6s ease-out forwards';
                
                // Animation en cascade pour les blocs dans la même section
                const allCodeBlocks = entry.target.closest('.rules-section')?.querySelectorAll('.code-block');
                if (allCodeBlocks) {
                    allCodeBlocks.forEach((block, index) => {
                        setTimeout(() => {
                            block.style.animation = 'slideInLeft 0.4s ease-out forwards';
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    const codeBlocks = document.querySelectorAll('.code-block');
    codeBlocks.forEach(block => {
        observer.observe(block);
    });
}

/**
 * AJOUTER DES NUMÉROS DE LIGNE (OPTIONNEL)
 */
function addLineNumbers() {
    const codeBlocks = document.querySelectorAll('.code-block pre code');
    
    codeBlocks.forEach(block => {
        const lines = block.textContent.split('\n');
        if (lines.length > 3) { // Seulement pour les blocs de plus de 3 lignes
            const numberedContent = lines.map((line, index) => {
                if (line.trim() === '' && index === lines.length - 1) return ''; // Ignore dernière ligne vide
                const lineNumber = (index + 1).toString().padStart(2, ' ');
                return `<span class="line-number">${lineNumber}</span>${line}`;
            }).join('\n');
            
            block.innerHTML = numberedContent;
        }
    });
}

/**
 * AMÉLIORER LA LISIBILITÉ DU CODE
 */
function enhanceCodeReadability() {
    const codeBlocks = document.querySelectorAll('.code-block pre code');
    
    codeBlocks.forEach(block => {
        let content = block.innerHTML;
        
        // Coloration des commentaires Prolog
        content = content.replace(/(% .+)/g, '<span class="prolog-comment">$1</span>');
        
        // Coloration des prédicats principaux
        content = content.replace(/^([a-zA-Z_][a-zA-Z0-9_]*)\(/gm, '<span class="prolog-predicate">$1</span>(');
        
        // Coloration des opérateurs
        content = content.replace(/(:-|->|;|,|\.|!)/g, '<span class="prolog-operator">$1</span>');
        
        // Coloration des mots-clés
        content = content.replace(/\b(write|nl|assertz|retract|findall|member|length|is|true|false|fail)\b/g, '<span class="prolog-keyword">$1</span>');
        
        block.innerHTML = content;
    });

    // Ajouter les styles pour la coloration
    addSyntaxHighlightingStyles();
}

/**
 * AJOUTER LES STYLES DE COLORATION SYNTAXIQUE
 */
function addSyntaxHighlightingStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .line-number {
            color: #6a9955;
            margin-right: 15px;
            user-select: none;
        }
        
        .prolog-comment {
            color: #6a9955;
            font-style: italic;
        }
        
        .prolog-predicate {
            color: #dcdcaa;
            font-weight: bold;
        }
        
        .prolog-operator {
            color: #c586c0;
            font-weight: bold;
        }
        
        .prolog-keyword {
            color: #569cd6;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);
}

/**
 * FONCTIONNALITÉ DE COPIE
 */
function copyCode(button) {
    const codeBlock = button.closest('.code-block');
    const code = codeBlock.querySelector('pre code');
    
    if (!code) {
        showNotification('❌ Erreur lors de la copie', 'error');
        return;
    }
    
    // Extraire le texte sans les balises HTML
    const textContent = code.textContent || code.innerText;
    
    // Méthode moderne (Clipboard API)
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textContent).then(() => {
            showCopySuccess(button);
        }).catch(() => {
            fallbackCopy(textContent, button);
        });
    } else {
        // Méthode de fallback
        fallbackCopy(textContent, button);
    }
}

/**
 * MÉTHODE DE COPIE FALLBACK
 */
function fallbackCopy(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '-9999px';
    textArea.style.left = '-9999px';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopySuccess(button);
    } catch (err) {
        showNotification('❌ Erreur lors de la copie', 'error');
    } finally {
        document.body.removeChild(textArea);
    }
}

/**
 * AFFICHER LE SUCCÈS DE LA COPIE
 */
function showCopySuccess(button) {
    const originalText = button.textContent;
    button.textContent = '✅ Copié !';
    button.style.background = '#28a745';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 2000);
    
    showNotification('📋 Code copié dans le presse-papiers', 'success');
}

/**
 * SYSTÈME DE NOTIFICATIONS
 */
function showNotification(message, type = 'info') {
    // Supprimer notification existante
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Styles inline pour la notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        font-weight: 500;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Supprimer après 3 secondes
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

/**
 * NAVIGATION AMÉLIORÉE
 */
function initNavigation() {
    // Créer un indicateur de section active
    createSectionIndicator();
    
    // Mettre à jour l'indicateur au scroll
    window.addEventListener('scroll', updateActiveSection);
    
    // Animation des éléments de navigation
    animateNavItems();
    
    console.log('🧭 Navigation améliorée initialisée');
}

/**
 * CRÉER L'INDICATEUR DE SECTION ACTIVE
 */
function createSectionIndicator() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.05)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

/**
 * METTRE À JOUR LA SECTION ACTIVE AU SCROLL
 */
function updateActiveSection() {
    const sections = document.querySelectorAll('.rules-section[id]');
    const navItems = document.querySelectorAll('.nav-item');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
            currentSection = section.id;
        }
    });
    
    // Mettre à jour les éléments de navigation
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === `#${currentSection}`) {
            item.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))';
            item.style.borderColor = 'var(--primary-color)';
        } else {
            item.style.background = '';
            item.style.borderColor = '';
        }
    });
}

/**
 * ANIMER LES ÉLÉMENTS DE NAVIGATION
 */
function animateNavItems() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

/**
 * FONCTIONNALITÉ DE RECHERCHE (SIMPLE)
 */
function initSearchFunctionality() {
    // Créer une barre de recherche
    createSearchBar();
    
    // Ajouter raccourci clavier Ctrl+F
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            focusSearchBar();
        }
    });
    
    console.log('🔍 Fonctionnalité de recherche initialisée');
}

/**
 * CRÉER LA BARRE DE RECHERCHE
 */
function createSearchBar() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <div class="search-box">
            <input type="text" id="searchInput" placeholder="🔍 Rechercher dans les règles... (Ctrl+F)">
            <button onclick="clearSearch()" id="clearSearch" style="display: none;">✕</button>
        </div>
        <div id="searchResults"></div>
    `;
    
    // Insérer après le header
    const header = document.querySelector('.header');
    header.parentNode.insertBefore(searchContainer, header.nextSibling);
    
    // Styles pour la barre de recherche
    const searchStyles = document.createElement('style');
    searchStyles.textContent = `
        .search-container {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            margin-bottom: 30px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .search-box {
            position: relative;
            display: flex;
            align-items: center;
        }
        
        #searchInput {
            width: 100%;
            padding: 15px 20px;
            border: 2px solid var(--border-color);
            border-radius: 50px;
            font-size: 1.1em;
            transition: all 0.3s ease;
            background: white;
        }
        
        #searchInput:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        #clearSearch {
            position: absolute;
            right: 15px;
            background: none;
            border: none;
            font-size: 1.2em;
            cursor: pointer;
            color: var(--light-color);
            padding: 5px;
            border-radius: 50%;
            transition: all 0.3s ease;
        }
        
        #clearSearch:hover {
            background: var(--light-gray);
            color: var(--dark-color);
        }
        
        #searchResults {
            margin-top: 15px;
            font-size: 0.9em;
            color: var(--light-color);
        }
        
        .search-highlight {
            background: yellow;
            padding: 2px 4px;
            border-radius: 3px;
            font-weight: bold;
        }
    `;
    document.head.appendChild(searchStyles);
    
    // Ajouter la fonctionnalité de recherche
    const searchInput = document.getElementById('searchInput');
    const clearButton = document.getElementById('clearSearch');
    
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        if (query.length > 2) {
            performSearch(query);
            clearButton.style.display = 'block';
        } else {
            clearSearch();
        }
    });
}

/**
 * EFFECTUER LA RECHERCHE
 */
function performSearch(query) {
    const codeBlocks = document.querySelectorAll('.code-block pre code');
    const sections = document.querySelectorAll('.rules-section h2');
    let resultsCount = 0;
    
    // Nettoyer les anciens highlights
    clearHighlights();
    
    // Rechercher dans les blocs de code
    codeBlocks.forEach(block => {
        const text = block.textContent;
        if (text.toLowerCase().includes(query.toLowerCase())) {
            highlightText(block, query);
            resultsCount++;
        }
    });
    
    // Rechercher dans les titres de sections
    sections.forEach(section => {
        const text = section.textContent;
        if (text.toLowerCase().includes(query.toLowerCase())) {
            highlightText(section, query);
            resultsCount++;
        }
    });
    
    // Afficher les résultats
    const resultsDiv = document.getElementById('searchResults');
    if (resultsCount > 0) {
        resultsDiv.textContent = `${resultsCount} résultat(s) trouvé(s) pour "${query}"`;
        resultsDiv.style.color = 'var(--success-color)';
    } else {
        resultsDiv.textContent = `Aucun résultat pour "${query}"`;
        resultsDiv.style.color = 'var(--danger-color)';
    }
}

/**
 * SURLIGNER LE TEXTE
 */
function highlightText(element, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    const originalHTML = element.innerHTML;
    const highlightedHTML = originalHTML.replace(regex, '<span class="search-highlight">$1</span>');
    element.innerHTML = highlightedHTML;
}

/**
 * NETTOYER LES HIGHLIGHTS
 */
function clearHighlights() {
    const highlights = document.querySelectorAll('.search-highlight');
    highlights.forEach(highlight => {
        const parent = highlight.parentNode;
        parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
        parent.normalize();
    });
}

/**
 * EFFACER LA RECHERCHE
 */
function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearButton = document.getElementById('clearSearch');
    const resultsDiv = document.getElementById('searchResults');
    
    searchInput.value = '';
    clearButton.style.display = 'none';
    resultsDiv.textContent = '';
    clearHighlights();
}

/**
 * FOCUS SUR LA BARRE DE RECHERCHE
 */
function focusSearchBar() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.focus();
        searchInput.select();
    }
}

/**
 * AMÉLIORATION DE L'ACCESSIBILITÉ
 */
function initAccessibility() {
    // Ajouter des raccourcis clavier
    document.addEventListener('keydown', function(e) {
        // Ctrl + 1-6 pour naviguer vers les modules
        if (e.ctrlKey && e.key >= '1' && e.key <= '6') {
            e.preventDefault();
            const moduleId = `module${e.key}`;
            const moduleSection = document.getElementById(moduleId);
            if (moduleSection) {
                moduleSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                highlightSection(moduleSection);
            }
        }
        
        // Échap pour fermer les notifications
        if (e.key === 'Escape') {
            const notification = document.querySelector('.notification');
            if (notification) {
                notification.click();
            }
        }
    });
    
    console.log('♿ Fonctionnalités d accessibilité initialisées') ;
}

/**
 * INITIALISATION FINALE
 */
window.addEventListener('load', function() {
    initAccessibility();
    
    // Performance monitoring
    if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`⚡ Page des règles chargée en ${loadTime}ms`);
    }
    
    // Message de bienvenue
    setTimeout(() => {
        showNotification('📚 Bienvenue dans la documentation Prolog !', 'info');
    }, 1000);
});

// Exposition des fonctions globales
window.copyCode = copyCode;
window.clearSearch = clearSearch;

console.log('🔧 JavaScript des règles Prolog entièrement chargé');