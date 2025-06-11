/**
 * MOTEUR PROLOG COMPLET POUR SYSTÈME EXPERT
 * Implémentation des 6 modules du terminal à conteneurs
 * 
 * Module 1: Accostage
 * Module 2: Déchargement  
 * Module 3: Cour
 * Module 4: Douane
 * Module 5: Chargement
 * Module 6: Sortie
 */

class CompletePrologEngine {
    constructor() {
        this.facts = new Map();
        this.rules = new Map();
        this.dynamicFacts = new Map();
        this.simulationResults = {};
        this.initializeKnowledgeBase();
        console.log('🧠 Moteur Prolog complet initialisé avec 6 modules');
    }

    initializeKnowledgeBase() {
        this.initializePortFacts();
        this.initializeAllModules();
    }

    /**
     * FAITS DU PORT - Base de connaissances statique
     */
    initializePortFacts() {
        // Quais disponibles
        this.addFact('quai', [
            ['quai1', 350, 14],
            ['quai2', 350, 12], 
            ['quai3', 200, 10]
        ]);

        // Portiques STS
        this.addFact('portique', [
            ['portique1', 50, 'disponible'],
            ['portique2', 50, 'disponible'],
            ['portique3', 40, 'occupe'],
            ['portique4', 30, 'occupe']
        ]);

        // Zones de stockage
        this.addFact('zone_stockage', [
            ['bloc1', 'export', 80, 'non'],
            ['bloc2', 'import', 90, 'non'],
            ['bloc3', 'transbordement', 100, 'non'],
            ['bloc4', 'refrigere', 50, 'oui'],
            ['bloc5', 'dangereux', 60, 'non']
        ]);

        // Grues RTG
        this.addFact('grue_rtg', [
            ['rtg1', 25, 'disponible'],
            ['rtg2', 25, 'disponible'],
            ['rtg3', 20, 'occupe'],
            ['rtg4', 20, 'occupe']
        ]);

        // Véhicules internes
        this.addFact('vehicule', [
            ['tracteur1', 'tracteur', 'disponible'],
            ['tracteur2', 'tracteur', 'occupe'],
            ['agv1', 'agv', 'disponible'],
            ['agv2', 'agv', 'disponible']
        ]);

        // Transitaires
        this.addFact('transitaire', [
            ['transitaire1', 'disponible'],
            ['transitaire2', 'disponible'],
            ['transitaire3', 'occupe']
        ]);

        // Transporteurs
        this.addFact('transporteur', [
            ['camion1', 'camion', 'disponible', 2],
            ['camion2', 'camion', 'disponible', 2],
            ['camion3', 'camion', 'occupe', 2],
            ['wagon1', 'wagon', 'disponible', 20],
            ['wagon2', 'wagon', 'occupe', 20]
        ]);

        // Portes du port
        this.addFact('porte', [
            ['porte1', 'disponible', 0],
            ['porte2', 'disponible', 2],
            ['porte3', 'congeste', 6]
        ]);

        console.log('📊 Base de connaissances du port initialisée');
    }

    /**
     * INITIALISATION DE TOUS LES MODULES
     */
    initializeAllModules() {
        this.initializeModule1(); // Accostage
        this.initializeModule2(); // Déchargement
        this.initializeModule3(); // Cour
        this.initializeModule4(); // Douane
        this.initializeModule5(); // Chargement
        this.initializeModule6(); // Sortie
    }

    /**
     * MODULE 1 - ACCOSTAGE
     */
    initializeModule1() {
        // Règle 1: Compatibilité quai
        this.addRule('module1', 'quai_compatible', (navire) => {
            const longueur = this.getDynamicFact('longueur', navire);
            const tirant = this.getDynamicFact('tirant_eau', navire);
            const quais = this.getFact('quai');
            
            for (let quai of quais) {
                const [nom, longueurQuai, tirantQuai] = quai;
                if (longueurQuai >= longueur && tirantQuai >= tirant) {
                    return { success: true, quai: nom, message: `Quai ${nom} compatible` };
                }
            }
            return { success: false, message: 'Aucun quai compatible disponible' };
        });

        // Règle 2: Conditions météo
        this.addRule('module1', 'peut_accoster', (navire) => {
            const meteo = this.getDynamicFact('meteo', navire);
            if (meteo === 'defavorable') {
                return { success: false, message: 'Conditions météorologiques défavorables' };
            }
            return { success: true, message: 'Conditions météo favorables à l\'accostage' };
        });

        // Règle 3: Priorité navire
        this.addRule('module1', 'priorite_navire', (navire) => {
            const evp = this.getDynamicFact('conteneurs', navire);
            const priority = this.getDynamicFact('priority', navire) || 'normale';
            
            let score = evp / 1000;
            if (priority === 'haute') score *= 1.5;
            if (priority === 'urgente') score *= 2;
            
            return { success: true, score: Math.round(score), message: `Score priorité: ${Math.round(score)}` };
        });

        console.log('⚓ Module 1 (Accostage) initialisé');
    }

    /**
     * MODULE 2 - DÉCHARGEMENT
     */
    initializeModule2() {
        // Règle 1: Attribution portique
        this.addRule('module2', 'portique_disponible', (navire) => {
            const portiques = this.getFact('portique');
            const disponibles = portiques.filter(p => p[2] === 'disponible');
            
            if (disponibles.length === 0) {
                return { success: false, message: 'Aucun portique disponible' };
            }
            
            const portique = disponibles[0];
            return { 
                success: true, 
                portique: portique[0], 
                capacite: portique[1],
                message: `Portique ${portique[0]} assigné (${portique[1]} EVP/h)` 
            };
        });

        // Règle 2: Temps déchargement
        this.addRule('module2', 'temps_dechargement', (navire) => {
            const evp = this.getDynamicFact('conteneurs', navire);
            const portique = this.queryRule('module2', 'portique_disponible', navire);
            
            if (!portique.success) {
                return { success: false, message: 'Impossible de calculer sans portique' };
            }
            
            const temps = Math.ceil(evp / portique.capacite);
            return { 
                success: true, 
                temps: temps, 
                message: `Temps estimé: ${temps} heures` 
            };
        });

        // Règle 3: Inspection conteneurs
        this.addRule('module2', 'inspecter_conteneurs', (navire) => {
            const evp = this.getDynamicFact('conteneurs', navire);
            const cargoType = this.getDynamicFact('cargoType', navire);
            
            let inspections = Math.floor(evp * 0.1); // 10% des conteneurs
            if (cargoType === 'dangereuse') inspections = Math.floor(evp * 0.3);
            if (cargoType === 'refrigeree') inspections = Math.floor(evp * 0.15);
            
            return { 
                success: true, 
                inspections: inspections,
                message: `${inspections} conteneurs à inspecter` 
            };
        });

        console.log('🏗️ Module 2 (Déchargement) initialisé');
    }

    /**
     * MODULE 3 - COUR
     */
    initializeModule3() {
        // Règle 1: Zone compatible
        this.addRule('module3', 'zone_compatible', (conteneur) => {
            const destination = conteneur.destination || 'import';
            const type = conteneur.type || 'standard';
            const zones = this.getFact('zone_stockage');
            
            for (let zone of zones) {
                const [id, typeZone, capacite, connexion] = zone;
                
                if (capacite <= 0) continue;
                
                if (type === 'refrigere' && connexion !== 'oui') continue;
                if (type === 'dangereux' && typeZone !== 'dangereux') continue;
                if (type === 'standard' && typeZone === destination) {
                    return { 
                        success: true, 
                        zone: id, 
                        capacite: capacite,
                        message: `Zone ${id} assignée (${capacite} places)` 
                    };
                }
            }
            
            return { success: false, message: 'Aucune zone compatible disponible' };
        });

        // Règle 2: Grue RTG disponible
        this.addRule('module3', 'grue_disponible', () => {
            const grues = this.getFact('grue_rtg');
            const disponibles = grues.filter(g => g[2] === 'disponible');
            
            if (disponibles.length === 0) {
                return { success: false, message: 'Aucune grue RTG disponible' };
            }
            
            const grue = disponibles[0];
            return { 
                success: true, 
                grue: grue[0], 
                capacite: grue[1],
                message: `Grue ${grue[0]} assignée (${grue[1]} EVP/h)` 
            };
        });

        // Règle 3: Hauteur empilage
        this.addRule('module3', 'hauteur_valide', (zone, position) => {
            // Simulation simple - hauteur max 5
            const hauteurActuelle = Math.floor(Math.random() * 3) + 1;
            const hauteurMax = 5;
            
            if (hauteurActuelle >= hauteurMax) {
                return { success: false, message: 'Hauteur maximale atteinte' };
            }
            
            return { 
                success: true, 
                hauteur: hauteurActuelle + 1,
                message: `Position ${position} niveau ${hauteurActuelle + 1}` 
            };
        });

        console.log('📦 Module 3 (Cour) initialisé');
    }

    /**
     * MODULE 4 - DOUANE
     */
    initializeModule4() {
        // Règle 1: Vérification documents
        this.addRule('module4', 'verifier_documents', (conteneur) => {
            // Simulation - 95% des documents valides
            const validite = Math.random() > 0.05;
            
            if (!validite) {
                return { success: false, message: 'Documents invalides ou manquants' };
            }
            
            return { success: true, message: 'Documents CAMCIS validés' };
        });

        // Règle 2: Inspection requise
        this.addRule('module4', 'requiert_inspection', (conteneur) => {
            const type = conteneur.type || 'standard';
            const etat = conteneur.etat || 'intact';
            
            // Inspection obligatoire pour dangereux ou endommagé
            if (type === 'dangereux' || etat === 'endommage' || etat === 'fuite') {
                return { 
                    success: true, 
                    inspection: true,
                    message: 'Inspection physique obligatoire' 
                };
            }
            
            // Inspection aléatoire 10%
            const aleatoire = Math.random() < 0.1;
            return { 
                success: true, 
                inspection: aleatoire,
                message: aleatoire ? 'Inspection aléatoire requise' : 'Pas d\'inspection requise' 
            };
        });

        // Règle 3: Transitaire assigné
        this.addRule('module4', 'assigner_transitaire', () => {
            const transitaires = this.getFact('transitaire');
            const disponibles = transitaires.filter(t => t[1] === 'disponible');
            
            if (disponibles.length === 0) {
                return { success: false, message: 'Aucun transitaire disponible' };
            }
            
            const transitaire = disponibles[0];
            return { 
                success: true, 
                transitaire: transitaire[0],
                message: `Transitaire ${transitaire[0]} assigné` 
            };
        });

        console.log('🛂 Module 4 (Douane) initialisé');
    }

    /**
     * MODULE 5 - CHARGEMENT
     */
    initializeModule5() {
        // Règle 1: Conteneur éligible chargement
        this.addRule('module5', 'conteneur_eligible', (conteneur) => {
            const destination = conteneur.destination;
            const documents = conteneur.documents || true;
            const taxes = conteneur.taxes || true;
            const scelles = conteneur.scelles || true;
            
            if (destination !== 'export' && destination !== 'transbordement') {
                return { success: false, message: 'Destination non éligible au chargement' };
            }
            
            if (!documents || !taxes || !scelles) {
                return { success: false, message: 'Documents, taxes ou scellés non conformes' };
            }
            
            return { success: true, message: 'Conteneur éligible au chargement' };
        });

        // Règle 2: Plan de chargement
        this.addRule('module5', 'plan_chargement', (navire) => {
            const evpTotal = this.getDynamicFact('conteneurs', navire);
            const cargoType = this.getDynamicFact('cargoType', navire);
            
            // Calcul stabilité selon type cargo
            let priorite = 1;
            if (cargoType === 'dangereux') priorite = 4;
            if (cargoType === 'refrigeree') priorite = 2;
            
            const tempsChargement = Math.ceil(evpTotal / 100); // 100 EVP/h
            
            return { 
                success: true, 
                priorite: priorite,
                temps: tempsChargement,
                message: `Plan chargement: priorité ${priorite}, ${tempsChargement}h estimées` 
            };
        });

        // Règle 3: Capacité navire
        this.addRule('module5', 'capacite_navire', (navire) => {
            const evpActuel = this.getDynamicFact('conteneurs', navire);
            const evpMax = evpActuel * 1.2; // 20% de marge
            const evpRestant = evpMax - evpActuel;
            
            return { 
                success: evpRestant > 0, 
                capacite: evpRestant,
                message: evpRestant > 0 ? `${evpRestant} EVP disponibles` : 'Navire à capacité maximale' 
            };
        });

        console.log('🚛 Module 5 (Chargement) initialisé');
    }

    /**
     * MODULE 6 - SORTIE
     */
    initializeModule6() {
        // Règle 1: Conteneur éligible sortie
        this.addRule('module6', 'conteneur_eligible_sortie', (conteneur) => {
            const destination = conteneur.destination;
            const clearance = conteneur.clearance || true;
            
            if (destination !== 'import') {
                return { success: false, message: 'Seuls les conteneurs import peuvent sortir' };
            }
            
            if (!clearance) {
                return { success: false, message: 'Clearance douanière non obtenue' };
            }
            
            return { success: true, message: 'Conteneur autorisé à sortir' };
        });

        // Règle 2: Transporteur disponible
        this.addRule('module6', 'transporteur_disponible', () => {
            const transporteurs = this.getFact('transporteur');
            const disponibles = transporteurs.filter(t => t[2] === 'disponible' && t[3] > 0);
            
            if (disponibles.length === 0) {
                return { success: false, message: 'Aucun transporteur disponible' };
            }
            
            const transporteur = disponibles[0];
            return { 
                success: true, 
                transporteur: transporteur[0],
                type: transporteur[1],
                capacite: transporteur[3],
                message: `${transporteur[1]} ${transporteur[0]} assigné (${transporteur[3]} conteneurs)` 
            };
        });

        // Règle 3: Porte disponible
        this.addRule('module6', 'porte_disponible', () => {
            const portes = this.getFact('porte');
            const disponibles = portes.filter(p => p[1] === 'disponible' && p[2] < 5);
            
            if (disponibles.length === 0) {
                return { success: false, message: 'Toutes les portes sont congestionnées' };
            }
            
            const porte = disponibles[0];
            return { 
                success: true, 
                porte: porte[0],
                congestion: porte[2],
                message: `Porte ${porte[0]} disponible (${porte[2]} conteneurs en attente)` 
            };
        });

        console.log('🚪 Module 6 (Sortie) initialisé');
    }

    /**
     * MÉTHODES UTILITAIRES
     */
    addFact(predicate, data) {
        this.facts.set(predicate, data);
    }

    getFact(predicate) {
        return this.facts.get(predicate) || [];
    }

    addRule(module, predicate, func) {
        if (!this.rules.has(module)) {
            this.rules.set(module, new Map());
        }
        this.rules.get(module).set(predicate, func);
    }

    queryRule(module, predicate, ...args) {
        const moduleRules = this.rules.get(module);
        if (!moduleRules) return { success: false, message: `Module ${module} non trouvé` };
        
        const rule = moduleRules.get(predicate);
        if (!rule) return { success: false, message: `Règle ${predicate} non trouvée` };
        
        try {
            return rule(...args);
        } catch (error) {
            return { success: false, message: `Erreur d'exécution: ${error.message}` };
        }
    }

    setDynamicFact(predicate, entity, value) {
        const key = `${predicate}_${entity}`;
        this.dynamicFacts.set(key, value);
    }

    getDynamicFact(predicate, entity = '') {
        const key = entity ? `${predicate}_${entity}` : predicate;
        return this.dynamicFacts.get(key);
    }

    clearDynamicFacts(entity = null) {
        if (entity) {
            // Supprimer tous les faits d'une entité spécifique
            for (let key of this.dynamicFacts.keys()) {
                if (key.endsWith(`_${entity}`)) {
                    this.dynamicFacts.delete(key);
                }
            }
        } else {
            // Tout supprimer
            this.dynamicFacts.clear();
        }
    }

    /**
     * SIMULATION COMPLÈTE D'UN NAVIRE
     */
    simulateShip(shipData) {
        const navireId = shipData.nom.toLowerCase().replace(/\s+/g, '_');
        
        // Nettoyer les anciens faits
        this.clearDynamicFacts(navireId);
        
        // Asserter les nouveaux faits
        this.setDynamicFact('longueur', navireId, shipData.longueur);
        this.setDynamicFact('tirant_eau', navireId, shipData.tirant);
        this.setDynamicFact('conteneurs', navireId, shipData.conteneurs);
        this.setDynamicFact('cargoType', navireId, shipData.cargoType);
        this.setDynamicFact('meteo', navireId, shipData.meteo);
        this.setDynamicFact('priority', navireId, shipData.priority);
        this.setDynamicFact('percentImport', navireId, shipData.percentImport);
        this.setDynamicFact('percentExport', navireId, shipData.percentExport);
        this.setDynamicFact('percentTransbord', navireId, shipData.percentTransbord);
        
        const results = {};
        
        // Exécuter tous les modules sélectionnés
        const modules = ['module1', 'module2', 'module3', 'module4', 'module5', 'module6'];
        
        modules.forEach(module => {
            results[module] = this.executeModule(module, navireId, shipData);
        });
        
        this.simulationResults = results;
        return results;
    }

    /**
     * EXÉCUTION D'UN MODULE SPÉCIFIQUE
     */
    executeModule(moduleId, navireId, shipData) {
        const results = {
            queries: [],
            summary: {},
            status: 'processing'
        };

        try {
            switch (moduleId) {
                case 'module1':
                    results.queries = this.executeModule1Queries(navireId);
                    break;
                case 'module2':
                    results.queries = this.executeModule2Queries(navireId);
                    break;
                case 'module3':
                    results.queries = this.executeModule3Queries(navireId, shipData);
                    break;
                case 'module4':
                    results.queries = this.executeModule4Queries(navireId, shipData);
                    break;
                case 'module5':
                    results.queries = this.executeModule5Queries(navireId, shipData);
                    break;
                case 'module6':
                    results.queries = this.executeModule6Queries(navireId, shipData);
                    break;
                default:
                    results.status = 'error';
                    results.message = `Module ${moduleId} non reconnu`;
            }

            // Déterminer le statut global
            const hasErrors = results.queries.some(q => q.type === 'error');
            const hasWarnings = results.queries.some(q => q.type === 'warning');
            
            if (hasErrors) {
                results.status = 'error';
            } else if (hasWarnings) {
                results.status = 'warning';
            } else {
                results.status = 'success';
            }

        } catch (error) {
            results.status = 'error';
            results.message = error.message;
        }

        return results;
    }

    /**
     * EXÉCUTION DES REQUÊTES MODULE 1
     */
    executeModule1Queries(navireId) {
        const queries = [];
        
        // Compatibilité quai
        const quaiResult = this.queryRule('module1', 'quai_compatible', navireId);
        queries.push({
            query: `?- quai_compatible(${navireId}, Quai).`,
            result: quaiResult.success ? `Quai = ${quaiResult.quai}` : 'false',
            type: quaiResult.success ? 'success' : 'error',
            message: quaiResult.message
        });

        // Conditions météo
        const meteoResult = this.queryRule('module1', 'peut_accoster', navireId);
        queries.push({
            query: `?- peut_accoster(${navireId}).`,
            result: meteoResult.success ? 'true' : 'false',
            type: meteoResult.success ? 'success' : 'warning',
            message: meteoResult.message
        });

        // Priorité
        const prioriteResult = this.queryRule('module1', 'priorite_navire', navireId);
        queries.push({
            query: `?- priorite_navire(${navireId}, Score).`,
            result: `Score = ${prioriteResult.score}`,
            type: 'info',
            message: prioriteResult.message
        });

        return queries;
    }

    /**
     * EXÉCUTION DES REQUÊTES MODULE 2
     */
    executeModule2Queries(navireId) {
        const queries = [];
        
        // Portique disponible
        const portiqueResult = this.queryRule('module2', 'portique_disponible', navireId);
        queries.push({
            query: `?- portique_disponible(${navireId}, Portique).`,
            result: portiqueResult.success ? `Portique = ${portiqueResult.portique}` : 'false',
            type: portiqueResult.success ? 'success' : 'error',
            message: portiqueResult.message
        });

        if (portiqueResult.success) {
            // Temps déchargement
            const tempsResult = this.queryRule('module2', 'temps_dechargement', navireId);
            queries.push({
                query: `?- temps_dechargement(${navireId}, Temps).`,
                result: `Temps = ${tempsResult.temps} heures`,
                type: 'info',
                message: tempsResult.message
            });
        }

        // Inspection conteneurs
        const inspectionResult = this.queryRule('module2', 'inspecter_conteneurs', navireId);
        queries.push({
            query: `?- inspecter_conteneurs(${navireId}, Nombre).`,
            result: `Nombre = ${inspectionResult.inspections}`,
            type: 'info',
            message: inspectionResult.message
        });

        return queries;
    }

    /**
     * EXÉCUTION DES REQUÊTES MODULE 3
     */
    executeModule3Queries(navireId, shipData) {
        const queries = [];
        
        // Simuler quelques conteneurs
        const nbConteneurs = Math.min(5, Math.floor(shipData.conteneurs / 1000));
        
        for (let i = 1; i <= nbConteneurs; i++) {
            const conteneur = {
                id: `conteneur${i}`,
                destination: i <= 2 ? 'import' : (i <= 4 ? 'export' : 'transbordement'),
                type: shipData.cargoType === 'mixte' ? 'standard' : shipData.cargoType
            };

            // Zone compatible
            const zoneResult = this.queryRule('module3', 'zone_compatible', conteneur);
            queries.push({
                query: `?- zone_compatible(${conteneur.id}, Zone).`,
                result: zoneResult.success ? `Zone = ${zoneResult.zone}` : 'false',
                type: zoneResult.success ? 'success' : 'warning',
                message: zoneResult.message
            });
        }

        // Grue disponible
        const grueResult = this.queryRule('module3', 'grue_disponible');
        queries.push({
            query: `?- grue_disponible(Grue).`,
            result: grueResult.success ? `Grue = ${grueResult.grue}` : 'false',
            type: grueResult.success ? 'success' : 'error',
            message: grueResult.message
        });

        return queries;
    }

    /**
     * EXÉCUTION DES REQUÊTES MODULE 4
     */
    executeModule4Queries(navireId, shipData) {
        const queries = [];
        
        // Simuler quelques conteneurs
        const nbConteneurs = Math.min(3, Math.floor(shipData.conteneurs / 1500));
        
        for (let i = 1; i <= nbConteneurs; i++) {
            const conteneur = {
                id: `conteneur${i}`,
                type: shipData.cargoType === 'mixte' ? 'standard' : shipData.cargoType,
                etat: Math.random() > 0.9 ? 'endommage' : 'intact'
            };

            // Vérification documents
            const docsResult = this.queryRule('module4', 'verifier_documents', conteneur);
            queries.push({
                query: `?- verifier_documents(${conteneur.id}).`,
                result: docsResult.success ? 'true' : 'false',
                type: docsResult.success ? 'success' : 'error',
                message: docsResult.message
            });

            // Inspection requise
            const inspResult = this.queryRule('module4', 'requiert_inspection', conteneur);
            queries.push({
                query: `?- requiert_inspection(${conteneur.id}).`,
                result: inspResult.inspection ? 'true' : 'false',
                type: inspResult.inspection ? 'warning' : 'info',
                message: inspResult.message
            });
        }

        // Transitaire
        const transitaireResult = this.queryRule('module4', 'assigner_transitaire');
        queries.push({
            query: `?- assigner_transitaire(Transitaire).`,
            result: transitaireResult.success ? `Transitaire = ${transitaireResult.transitaire}` : 'false',
            type: transitaireResult.success ? 'success' : 'warning',
            message: transitaireResult.message
        });

        return queries;
    }

    /**
     * EXÉCUTION DES REQUÊTES MODULE 5
     */
    executeModule5Queries(navireId, shipData) {
        const queries = [];
        
        // Plan de chargement
        const planResult = this.queryRule('module5', 'plan_chargement', navireId);
        queries.push({
            query: `?- plan_chargement(${navireId}, Plan).`,
            result: `Priorité = ${planResult.priorite}, Temps = ${planResult.temps}h`,
            type: 'info',
            message: planResult.message
        });

        // Capacité navire
        const capaciteResult = this.queryRule('module5', 'capacite_navire', navireId);
        queries.push({
            query: `?- capacite_navire(${navireId}, Capacite).`,
            result: capaciteResult.success ? `Capacité = ${capaciteResult.capacite} EVP` : 'Capacité max atteinte',
            type: capaciteResult.success ? 'success' : 'warning',
            message: capaciteResult.message
        });

        // Simuler quelques conteneurs export
        const nbExport = Math.floor(shipData.conteneurs * (shipData.percentExport / 100) / 1000);
        
        for (let i = 1; i <= Math.min(3, nbExport); i++) {
            const conteneur = {
                id: `export_conteneur${i}`,
                destination: 'export',
                documents: Math.random() > 0.05,
                taxes: Math.random() > 0.03,
                scelles: Math.random() > 0.02
            };

            const eligibleResult = this.queryRule('module5', 'conteneur_eligible', conteneur);
            queries.push({
                query: `?- conteneur_eligible(${conteneur.id}).`,
                result: eligibleResult.success ? 'true' : 'false',
                type: eligibleResult.success ? 'success' : 'error',
                message: eligibleResult.message
            });
        }

        return queries;
    }

    /**
     * EXÉCUTION DES REQUÊTES MODULE 6
     */
    executeModule6Queries(navireId, shipData) {
        const queries = [];
        
        // Transporteur disponible
        const transporteurResult = this.queryRule('module6', 'transporteur_disponible');
        queries.push({
            query: `?- transporteur_disponible(Transporteur).`,
            result: transporteurResult.success ? `Transporteur = ${transporteurResult.transporteur}` : 'false',
            type: transporteurResult.success ? 'success' : 'error',
            message: transporteurResult.message
        });

        // Porte disponible
        const porteResult = this.queryRule('module6', 'porte_disponible');
        queries.push({
            query: `?- porte_disponible(Porte).`,
            result: porteResult.success ? `Porte = ${porteResult.porte}` : 'false',
            type: porteResult.success ? 'success' : 'warning',
            message: porteResult.message
        });

        // Simuler quelques conteneurs import
        const nbImport = Math.floor(shipData.conteneurs * (shipData.percentImport / 100) / 1000);
        
        for (let i = 1; i <= Math.min(3, nbImport); i++) {
            const conteneur = {
                id: `import_conteneur${i}`,
                destination: 'import',
                clearance: Math.random() > 0.05
            };

            const eligibleResult = this.queryRule('module6', 'conteneur_eligible_sortie', conteneur);
            queries.push({
                query: `?- conteneur_eligible_sortie(${conteneur.id}).`,
                result: eligibleResult.success ? 'true' : 'false',
                type: eligibleResult.success ? 'success' : 'error',
                message: eligibleResult.message
            });
        }

        return queries;
    }

    /**
     * GÉNÉRATION DU RAPPORT COMPLET
     */
    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            modules: Object.keys(this.simulationResults).length,
            summary: {
                total_queries: 0,
                successful_queries: 0,
                warnings: 0,
                errors: 0
            },
            details: this.simulationResults
        };

        // Calculer les statistiques
        Object.values(this.simulationResults).forEach(module => {
            if (module.queries) {
                report.summary.total_queries += module.queries.length;
                module.queries.forEach(query => {
                    if (query.type === 'success') report.summary.successful_queries++;
                    if (query.type === 'warning') report.summary.warnings++;
                    if (query.type === 'error') report.summary.errors++;
                });
            }
        });

        return report;
    }

    /**
     * EXPORT EN DIFFÉRENTS FORMATS
     */
    exportToJSON() {
        const report = this.generateReport();
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `simulation_rapport_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    exportToCSV() {
        const report = this.generateReport();
        let csv = 'Module,Query,Result,Type,Message\n';
        
        Object.entries(report.details).forEach(([moduleId, moduleData]) => {
            if (moduleData.queries) {
                moduleData.queries.forEach(query => {
                    csv += `${moduleId},"${query.query}","${query.result}",${query.type},"${query.message}"\n`;
                });
            }
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `simulation_rapport_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Instance globale
let prologEngine;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    prologEngine = new CompletePrologEngine();
    console.log('🚢 Moteur Prolog complet prêt pour simulation');
});