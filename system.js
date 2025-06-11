/**
 * INTERFACE SYSTÈME EXPERT COMPLET
 * Gestion des interactions utilisateur et exécution des simulations
 */

// Variables globales
let selectedModules = ['module1', 'module2', 'module3', 'module4', 'module5', 'module6'];
let currentSimulation = null;
let simulationStep = 0;
let isSimulationRunning = false;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Interface système expert initialisée');
    
    initializeInterface();
    setupEventListeners();
    validateForm();
    
    console.log('✅ Système prêt pour simulation');
});

/**
 * INITIALISATION DE L'INTERFACE
 */
function initializeInterface() {
    initMobileMenu();
    initModuleToggles();
    initFormValidation();
    initLogConsole();
    updateProgress(0, 'Système initialisé et prêt');
}

/**
 * CONFIGURATION DES ÉCOUTEURS D'ÉVÉNEMENTS
 */
function setupEventListeners() {
    // Validation en temps réel des champs
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', validateForm);
        input.addEventListener('change', validateForm);
    });
    
    // Gestion des pourcentages de cargaison
    const percentInputs = ['percentImport', 'percentExport', 'percentTransbord'];
    percentInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', updatePercentages);
        }
    });
    
    // Smooth scrolling pour les liens d'ancrage
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

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
                toggleMenu();
            }
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
            toggleMenu();
        }
    });
}

/**
 * GESTION DES MODULES
 */
function initModuleToggles() {
    const toggles = document.querySelectorAll('.module-toggle input[type="checkbox"]');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const moduleNumber = this.id.replace('module', '');
            const moduleId = `module${moduleNumber}`;
            
            if (this.checked) {
                if (!selectedModules.includes(moduleId)) {
                    selectedModules.push(moduleId);
                }
                addLog('info', `Module ${moduleNumber} activé`);
            } else {
                selectedModules = selectedModules.filter(m => m !== moduleId);
                addLog('warning', `Module ${moduleNumber} désactivé`);
            }
            
            updateModuleCount();
        });
    });
    
    updateModuleCount();
}

function updateModuleCount() {
    const count = selectedModules.length;
    addLog('info', `${count} module(s) sélectionné(s) pour la simulation`);
}

/**
 * VALIDATION DU FORMULAIRE
 */
function initFormValidation() {
    // Configuration des validations
    const validationRules = {
        shipName: { required: true, minLength: 2 },
        shipLength: { required: true, min: 50, max: 400 },
        shipDraft: { required: true, min: 5, max: 20 },
        containerCount: { required: true, min: 100, max: 20000 }
    };
    
    // Appliquer les validations
    Object.entries(validationRules).forEach(([fieldId, rules]) => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', () => validateField(field, rules));
            field.addEventListener('blur', () => validateField(field, rules));
        }
    });
}

function validateField(field, rules) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    if (rules.required && !value) {
        isValid = false;
        errorMessage = 'Ce champ est requis';
    } else if (rules.minLength && value.length < rules.minLength) {
        isValid = false;
        errorMessage = `Minimum ${rules.minLength} caractères`;
    } else if (rules.min && parseFloat(value) < rules.min) {
        isValid = false;
        errorMessage = `Valeur minimum: ${rules.min}`;
    } else if (rules.max && parseFloat(value) > rules.max) {
        isValid = false;
        errorMessage = `Valeur maximum: ${rules.max}`;
    }
    
    // Mise à jour de l'apparence
    if (isValid) {
        field.style.borderColor = 'var(--success-color)';
        field.title = '';
    } else {
        field.style.borderColor = 'var(--danger-color)';
        field.title = errorMessage;
    }
    
    return isValid;
}

function validateForm() {
    const requiredFields = ['shipName', 'shipLength', 'shipDraft', 'containerCount'];
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !field.value.trim()) {
            isValid = false;
        }
    });
    
    // Valider les pourcentages
    const totalPercent = getTotalPercentage();
    if (Math.abs(totalPercent - 100) > 0.1) {
        isValid = false;
    }
    
    // Activer/désactiver les boutons
    const buttons = document.querySelectorAll('.control-buttons .btn');
    buttons.forEach(button => {
        button.disabled = !isValid || isSimulationRunning;
        if (!isValid) {
            button.style.opacity = '0.5';
            button.style.cursor = 'not-allowed';
        } else {
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
        }
    });
    
    return isValid;
}

/**
 * GESTION DES POURCENTAGES
 */
function updatePercentages() {
    const percentImport = parseFloat(document.getElementById('percentImport').value) || 0;
    const percentExport = parseFloat(document.getElementById('percentExport').value) || 0;
    const percentTransbord = parseFloat(document.getElementById('percentTransbord').value) || 0;
    
    const total = percentImport + percentExport + percentTransbord;
    
    // Mise à jour visuelle
    const inputs = [
        document.getElementById('percentImport'),
        document.getElementById('percentExport'),
        document.getElementById('percentTransbord')
    ];
    
    inputs.forEach(input => {
        if (Math.abs(total - 100) <= 0.1) {
            input.style.borderColor = 'var(--success-color)';
        } else {
            input.style.borderColor = 'var(--warning-color)';
        }
    });
    
    if (Math.abs(total - 100) > 0.1) {
        addLog('warning', `Total pourcentages: ${total.toFixed(1)}% (doit être 100%)`);
    }
}

function getTotalPercentage() {
    const percentImport = parseFloat(document.getElementById('percentImport').value) || 0;
    const percentExport = parseFloat(document.getElementById('percentExport').value) || 0;
    const percentTransbord = parseFloat(document.getElementById('percentTransbord').value) || 0;
    
    return percentImport + percentExport + percentTransbord;
}

/**
 * CONSOLE DE LOG
 */
function initLogConsole() {
    addLog('info', '🚢 Système Expert Terminal à Conteneurs initialisé');
    addLog('info', '📊 Base de connaissances chargée (6 modules disponibles)');
    addLog('success', '✅ Prêt pour simulation');
}

function addLog(type, message) {
    const logContent = document.getElementById('logContent');
    if (!logContent) return;
    
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${type}`;
    
    const icons = {
        'info': 'ℹ️',
        'success': '✅',
        'warning': '⚠️',
        'error': '❌',
        'processing': '⚙️'
    };
    
    logEntry.innerHTML = `
        <span class="timestamp">${timestamp}</span>
        <span class="message">${icons[type] || '•'} ${message}</span>
    `;
    
    logContent.appendChild(logEntry);
    logContent.scrollTop = logContent.scrollHeight;
    
    // Limiter le nombre d'entrées
    const entries = logContent.querySelectorAll('.log-entry');
    if (entries.length > 100) {
        logContent.removeChild(entries[0]);
    }
}

function clearLog() {
    const logContent = document.getElementById('logContent');
    if (logContent) {
        logContent.innerHTML = '';
        addLog('info', 'Console effacée');
    }
}

function toggleLog() {
    const logConsole = document.getElementById('logConsole');
    if (logConsole) {
        const isHidden = logConsole.style.display === 'none';
        logConsole.style.display = isHidden ? 'block' : 'none';
        addLog('info', isHidden ? 'Console affichée' : 'Console masquée');
    }
}

/**
 * COLLECTE DES DONNÉES DU FORMULAIRE
 */
function collectFormData() {
    return {
        nom: document.getElementById('shipName').value.trim(),
        longueur: parseInt(document.getElementById('shipLength').value),
        tirant: parseFloat(document.getElementById('shipDraft').value),
        conteneurs: parseInt(document.getElementById('containerCount').value),
        cargoType: document.getElementById('cargoType').value,
        percentImport: parseFloat(document.getElementById('percentImport').value),
        percentExport: parseFloat(document.getElementById('percentExport').value),
        percentTransbord: parseFloat(document.getElementById('percentTransbord').value),
        meteo: document.getElementById('weather').value,
        priority: document.getElementById('priority').value,
        arrivalTime: document.getElementById('arrivalTime').value
    };
}

/**
 * MISE À JOUR DE LA BARRE DE PROGRESSION
 */
function updateProgress(percentage, text) {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }
    
    if (progressText) {
        progressText.textContent = text;
    }
}

/**
 * SIMULATION COMPLÈTE
 */
async function executeFullSimulation() {
    if (isSimulationRunning) return;
    
    if (!validateForm()) {
        addLog('error', 'Veuillez corriger les erreurs du formulaire');
        return;
    }
    
    if (selectedModules.length === 0) {
        addLog('error', 'Aucun module sélectionné');
        return;
    }
    
    isSimulationRunning = true;
    validateForm(); // Refresh button states
    
    addLog('processing', 'Démarrage de la simulation complète...');
    updateProgress(0, 'Initialisation...');
    
    try {
        const shipData = collectFormData();
        addLog('info', `Navire: ${shipData.nom} (${shipData.longueur}m, ${shipData.conteneurs} EVP)`);
        
        // Afficher la section résultats
        const resultsContainer = document.getElementById('results');
        if (resultsContainer) {
            resultsContainer.classList.remove('hidden');
            resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // Exécuter la simulation
        updateProgress(10, 'Assertion des faits...');
        await delay(500);
        
        const results = prologEngine.simulateShip(shipData);
        currentSimulation = results;
        
        // Afficher les résultats module par module
        let progress = 20;
        const moduleNames = {
            'module1': 'Accostage',
            'module2': 'Déchargement', 
            'module3': 'Cour',
            'module4': 'Douane',
            'module5': 'Chargement',
            'module6': 'Sortie'
        };
        
        const modulesResults = document.getElementById('modulesResults');
        if (modulesResults) {
            modulesResults.innerHTML = '';
        }
        
        for (const moduleId of selectedModules) {
            updateProgress(progress, `Exécution ${moduleNames[moduleId]}...`);
            addLog('processing', `Exécution du module ${moduleNames[moduleId]}`);
            
            await delay(800);
            
            if (results[moduleId]) {
                displayModuleResult(moduleId, moduleNames[moduleId], results[moduleId]);
                addLog('success', `Module ${moduleNames[moduleId]} terminé`);
            }
            
            progress += (60 / selectedModules.length);
        }
        
        // Générer le tableau de bord
        updateProgress(85, 'Génération du tableau de bord...');
        await delay(500);
        generateSummaryDashboard(results);
        
        updateProgress(100, 'Simulation terminée avec succès');
        addLog('success', '🎉 Simulation complète terminée');
        
    } catch (error) {
        addLog('error', `Erreur simulation: ${error.message}`);
        updateProgress(0, 'Erreur lors de la simulation');
    } finally {
        isSimulationRunning = false;
        validateForm(); // Refresh button states
    }
}

/**
 * SIMULATION ÉTAPE PAR ÉTAPE
 */
async function executeStepByStep() {
    if (isSimulationRunning) return;
    
    if (!validateForm()) {
        addLog('error', 'Veuillez corriger les erreurs du formulaire');
        return;
    }
    
    addLog('info', 'Mode étape par étape activé');
    
    // Pour l'instant, on lance la simulation complète mais avec plus de détails
    await executeFullSimulation();
}

/**
 * RÉINITIALISATION
 */
function resetSimulation() {
    if (isSimulationRunning) {
        addLog('warning', 'Impossible de réinitialiser pendant une simulation');
        return;
    }
    
    // Réinitialiser le formulaire
    document.querySelectorAll('input, select').forEach(input => {
        if (input.type === 'checkbox') {
            input.checked = true;
        } else if (input.type === 'number') {
            input.value = input.defaultValue || '';
        } else {
            input.value = input.defaultValue || '';
        }
        input.style.borderColor = '';
        input.title = '';
    });
    
    // Réinitialiser les modules sélectionnés
    selectedModules = ['module1', 'module2', 'module3', 'module4', 'module5', 'module6'];
    
    // Masquer les résultats
    const resultsContainer = document.getElementById('results');
    if (resultsContainer) {
        resultsContainer.classList.add('hidden');
    }
    
    // Réinitialiser la progression
    updateProgress(0, 'Système réinitialisé');
    
    // Vider les résultats
    const modulesResults = document.getElementById('modulesResults');
    if (modulesResults) {
        modulesResults.innerHTML = '';
    }
    
    const summaryDashboard = document.getElementById('summaryDashboard');
    if (summaryDashboard) {
        summaryDashboard.innerHTML = '';
    }
    
    currentSimulation = null;
    
    addLog('info', '🔄 Système réinitialisé');
    validateForm();
}

/**
 * AFFICHAGE DES RÉSULTATS D'UN MODULE
 */
function displayModuleResult(moduleId, moduleName, moduleResult) {
    const modulesResults = document.getElementById('modulesResults');
    if (!modulesResults) return;
    
    const moduleDiv = document.createElement('div');
    moduleDiv.className = 'module-result';
    moduleDiv.id = `result-${moduleId}`;
    
    // En-tête du module
    const statusClass = `status-${moduleResult.status}`;
    const statusText = {
        'success': '✅ Succès',
        'warning': '⚠️ Avertissement',
        'error': '❌ Erreur',
        'processing': '⚙️ Traitement...'
    };
    
    moduleDiv.innerHTML = `
        <div class="module-result-header">
            <h3>${getModuleIcon(moduleId)} ${moduleName}</h3>
            <div class="module-status ${statusClass}">
                ${statusText[moduleResult.status] || moduleResult.status}
            </div>
        </div>
        <div class="module-result-content">
            <div class="prolog-queries">
                <h4>🔍 Requêtes Prolog Exécutées</h4>
                <div class="queries-list" id="queries-${moduleId}">
                    ${generateQueriesHTML(moduleResult.queries || [])}
                </div>
            </div>
            <div class="module-actions">
                <button class="btn-small" onclick="showModuleDetails('${moduleId}', '${moduleName}')">
                    📋 Détails
                </button>
                <button class="btn-small" onclick="rerunModule('${moduleId}')">
                    🔄 Relancer
                </button>
            </div>
        </div>
    `;
    
    modulesResults.appendChild(moduleDiv);
    
    // Animation d'apparition
    setTimeout(() => {
        moduleDiv.style.animation = 'fadeInUp 0.5s ease-out';
    }, 100);
}

function getModuleIcon(moduleId) {
    const icons = {
        'module1': '⚓',
        'module2': '🏗️',
        'module3': '📦',
        'module4': '🛂',
        'module5': '🚛',
        'module6': '🚪'
    };
    return icons[moduleId] || '⚙️';
}

function generateQueriesHTML(queries) {
    if (!queries || queries.length === 0) {
        return '<div class="query-item"><div class="query-text">Aucune requête exécutée</div></div>';
    }
    
    return queries.map(query => `
        <div class="query-item">
            <div class="query-text">${query.query}</div>
            <div class="query-result result-${query.type}">
                ${getResultIcon(query.type)} ${query.result}
            </div>
            ${query.message ? `<div class="query-message">${query.message}</div>` : ''}
        </div>
    `).join('');
}

function getResultIcon(type) {
    const icons = {
        'success': '✅',
        'warning': '⚠️',
        'error': '❌',
        'info': 'ℹ️'
    };
    return icons[type] || '•';
}

/**
 * TABLEAU DE BORD RÉCAPITULATIF
 */
function generateSummaryDashboard(results) {
    const summaryDashboard = document.getElementById('summaryDashboard');
    if (!summaryDashboard) return;
    
    // Calculer les statistiques
    let totalQueries = 0;
    let successfulQueries = 0;
    let warnings = 0;
    let errors = 0;
    let successfulModules = 0;
    
    Object.values(results).forEach(moduleResult => {
        if (moduleResult.queries) {
            totalQueries += moduleResult.queries.length;
            moduleResult.queries.forEach(query => {
                if (query.type === 'success') successfulQueries++;
                if (query.type === 'warning') warnings++;
                if (query.type === 'error') errors++;
            });
        }
        if (moduleResult.status === 'success') successfulModules++;
    });
    
    const successRate = totalQueries > 0 ? Math.round((successfulQueries / totalQueries) * 100) : 0;
    
    summaryDashboard.innerHTML = `
        <h3>📊 Tableau de Bord de la Simulation</h3>
        <div class="dashboard-grid">
            <div class="dashboard-card">
                <div class="value">${selectedModules.length}</div>
                <div class="label">Modules Exécutés</div>
            </div>
            <div class="dashboard-card">
                <div class="value">${successfulModules}</div>
                <div class="label">Modules Réussis</div>
            </div>
            <div class="dashboard-card">
                <div class="value">${totalQueries}</div>
                <div class="label">Requêtes Totales</div>
            </div>
            <div class="dashboard-card">
                <div class="value">${successRate}%</div>
                <div class="label">Taux de Succès</div>
            </div>
            <div class="dashboard-card">
                <div class="value">${warnings}</div>
                <div class="label">Avertissements</div>
            </div>
            <div class="dashboard-card">
                <div class="value">${errors}</div>
                <div class="label">Erreurs</div>
            </div>
        </div>
        <div class="dashboard-summary">
            <h4>🎯 Résumé Exécutif</h4>
            <p>${generateExecutiveSummary(results, successRate)}</p>
        </div>
    `;
}

function generateExecutiveSummary(results, successRate) {
    const shipData = collectFormData();
    
    if (successRate >= 90) {
        return `✅ Simulation excellente pour ${shipData.nom}. Tous les processus logistiques sont optimaux. Le navire peut être traité efficacement avec ${shipData.conteneurs} EVP.`;
    } else if (successRate >= 70) {
        return `⚠️ Simulation satisfaisante pour ${shipData.nom}. Quelques optimisations sont possibles mais les opérations peuvent se dérouler normalement.`;
    } else {
        return `❌ Simulation révèle des problèmes significatifs pour ${shipData.nom}. Une révision des procédures est recommandée avant traitement.`;
    }
}

/**
 * ACTIONS SUR LES MODULES
 */
function showModuleDetails(moduleId, moduleName) {
    if (!currentSimulation || !currentSimulation[moduleId]) {
        addLog('warning', `Aucun détail disponible pour ${moduleName}`);
        return;
    }
    
    const moduleResult = currentSimulation[moduleId];
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    const modalOverlay = document.getElementById('modalOverlay');
    
    if (modalTitle) modalTitle.textContent = `Détails - ${moduleName}`;
    
    if (modalContent) {
        modalContent.innerHTML = `
            <div class="module-details">
                <h4>📊 Statistiques</h4>
                <ul>
                    <li><strong>Statut:</strong> ${moduleResult.status}</li>
                    <li><strong>Requêtes exécutées:</strong> ${moduleResult.queries ? moduleResult.queries.length : 0}</li>
                    <li><strong>Succès:</strong> ${moduleResult.queries ? moduleResult.queries.filter(q => q.type === 'success').length : 0}</li>
                    <li><strong>Avertissements:</strong> ${moduleResult.queries ? moduleResult.queries.filter(q => q.type === 'warning').length : 0}</li>
                    <li><strong>Erreurs:</strong> ${moduleResult.queries ? moduleResult.queries.filter(q => q.type === 'error').length : 0}</li>
                </ul>
                
                <h4>🔍 Détail des Requêtes</h4>
                <div class="detailed-queries">
                    ${generateDetailedQueriesHTML(moduleResult.queries || [])}
                </div>
            </div>
        `;
    }
    
    if (modalOverlay) {
        modalOverlay.classList.add('active');
    }
}

function generateDetailedQueriesHTML(queries) {
    if (!queries || queries.length === 0) {
        return '<p>Aucune requête disponible</p>';
    }
    
    return queries.map((query, index) => `
        <div class="detailed-query-item">
            <h5>Requête ${index + 1}</h5>
            <p><strong>Query:</strong> <code>${query.query}</code></p>
            <p><strong>Résultat:</strong> <span class="result-${query.type}">${query.result}</span></p>
            <p><strong>Type:</strong> ${query.type}</p>
            ${query.message ? `<p><strong>Message:</strong> ${query.message}</p>` : ''}
        </div>
    `).join('');
}

function rerunModule(moduleId) {
    if (isSimulationRunning) {
        addLog('warning', 'Simulation en cours, impossible de relancer un module');
        return;
    }
    
    addLog('processing', `Relancement du module ${moduleId}`);
    
    // Pour l'instant, on affiche juste un message
    // Dans une implémentation complète, on relancerait juste ce module
    setTimeout(() => {
        addLog('success', `Module ${moduleId} relancé`);
    }, 1000);
}

function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
    }
}

/**
 * FONCTIONS D'EXPORT
 */
function exportToJSON() {
    if (!currentSimulation) {
        addLog('warning', 'Aucune simulation à exporter');
        return;
    }
    
    if (prologEngine && typeof prologEngine.exportToJSON === 'function') {
        prologEngine.exportToJSON();
        addLog('success', 'Rapport JSON exporté');
    } else {
        addLog('error', 'Fonction d\'export JSON non disponible');
    }
}

function exportToPDF() {
    if (!currentSimulation) {
        addLog('warning', 'Aucune simulation à exporter');
        return;
    }
    
    // Simulation de génération PDF
    addLog('processing', 'Génération du rapport PDF...');
    
    setTimeout(() => {
        addLog('success', 'Rapport PDF généré (simulation)');
        // Dans une implémentation réelle, on utiliserait une bibliothèque comme jsPDF
    }, 2000);
}

function exportToCSV() {
    if (!currentSimulation) {
        addLog('warning', 'Aucune simulation à exporter');
        return;
    }
    
    if (prologEngine && typeof prologEngine.exportToCSV === 'function') {
        prologEngine.exportToCSV();
        addLog('success', 'Rapport CSV exporté');
    } else {
        addLog('error', 'Fonction d\'export CSV non disponible');
    }
}

/**
 * UTILITAIRES
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Gestion des erreurs globales
window.addEventListener('error', function(event) {
    addLog('error', `Erreur JavaScript: ${event.message}`);
    console.error('Erreur capturée:', event);
});

// Gestion de la fermeture de la modal avec Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Click en dehors de la modal pour fermer
document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('modal-overlay')) {
        closeModal();
    }
});

console.log('🔧 Interface système expert entièrement chargée');