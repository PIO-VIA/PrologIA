# 🚢 Système Expert - Gestion Logistique Terminal à Conteneurs

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Prolog](https://img.shields.io/badge/Prolog-Expert%20System-red.svg)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)
![License](https://img.shields.io/badge/license-Academic-green.svg)

**Intelligence Artificielle complète pour la Planification Portuaire**

---

## 📋 Description

Ce projet implémente un **système expert complet basé sur Prolog** pour automatiser la gestion logistique d'un **Terminal à Conteneurs** au Port Autonome de Kribi (Cameroun). Le système intègre **6 modules interconnectés** couvrant l'ensemble du processus logistique portuaire.

### 🎯 Objectifs
- ✅ **Automatiser** l'ensemble des processus logistiques portuaires
- ✅ **Optimiser** l'utilisation des ressources (quais, portiques, grues, véhicules)
- ✅ **Intégrer** tous les acteurs (douane, transitaires, transporteurs)
- ✅ **Garantir** la sécurité et la conformité réglementaire
- ✅ **Démontrer** l'application pratique de l'IA en logistique complexe

## 🛠️ Technologies Utilisées

| Technologie | Usage | Détails |
|-------------|-------|---------|
| 🧠 **Prolog** | Moteur d'inférence | 6 modules avec règles expertes |
| ⚡ **JavaScript ES6+** | Interface & logique | Interaction temps réel |
| 🎨 **CSS3** | Design moderne | Glassmorphism & animations |
| 📱 **HTML5** | Structure responsive | Multi-plateforme |
| 🔧 **Modular Architecture** | Organisation | Séparation des responsabilités |

## 📁 Structure du Projet

```
systeme-expert-complet/
├── 📄 index.html              # Page d'accueil avec présentation
├── 🖥️ system.html             # Interface système expert principal
├── 📚 rules.html              # Documentation règles Prolog complètes
├── 🎨 styles.css              # Styles page d'accueil
├── 🎨 system.css              # Styles interface système
├── 🎨 rules.css               # Styles page règles Prolog
├── ⚡ index.js                # JavaScript page d'accueil
├── ⚡ system.js               # JavaScript interface système
├── ⚡ rules.js                # JavaScript page règles
├── 🧠 prolog-complete.js      # Moteur Prolog complet (6 modules)
└── 📖 README.md               # Documentation (ce fichier)
```

## ⚡ Installation Rapide

### Prérequis
- 🌐 Navigateur web moderne (Chrome, Firefox, Safari, Edge)
- 📁 Aucune installation supplémentaire requise

### 🚀 Démarrage

```bash
# 1. Télécharger tous les fichiers
# 2. S'assurer que tous les fichiers sont dans le même dossier
# 3. Ouvrir index.html dans le navigateur
```

**Ou double-cliquer sur `index.html`**

## 🎯 Les 6 Modules du Système

### ⚓ Module 1 - Accostage
- **Objectif** : Planification et attribution des quais
- **Fonctionnalités** :
  - Attribution automatique selon la taille du navire
  - Vérification contraintes météorologiques
  - Gestion des priorités (EVP, urgence)
  - Contrôle tirant d'eau vs profondeur

**Exemple de règles Prolog :**
```prolog
quai_compatible(Navire, Quai) :-
    longueur(Navire, L),
    tirant_eau(Navire, T),
    quai(Quai, LongueurQuai, TirantQuai),
    L =< LongueurQuai,
    T =< TirantQuai.
```

### 🏗️ Module 2 - Déchargement
- **Objectif** : Optimisation du déchargement Ship-to-Shore
- **Fonctionnalités** :
  - Attribution des portiques STS
  - Calcul temps de déchargement
  - Inspection automatique des conteneurs
  - Enregistrement TOS

### 📦 Module 3 - Cour (Stockage)
- **Objectif** : Empilage intelligent dans les zones de stockage
- **Fonctionnalités** :
  - Sélection zones compatibles (import/export/transbordement)
  - Gestion grues RTG
  - Zones électrifiées (conteneurs réfrigérés)
  - Optimisation hauteur empilage (max 5)

### 🛂 Module 4 - Douane
- **Objectif** : Traitement administratif et contrôles douaniers
- **Fonctionnalités** :
  - Interface CAMCIS (simulation)
  - Vérification documents
  - Inspections physiques (obligatoires + aléatoires)
  - Gestion transitaires

### 🚛 Module 5 - Chargement
- **Objectif** : Préparation et chargement export/transbordement
- **Fonctionnalités** :
  - Plan de chargement optimisé
  - Vérification éligibilité conteneurs
  - Gestion stabilité navire
  - Contrôle scellés et documents

### 🚪 Module 6 - Sortie
- **Objectif** : Transport terrestre et contrôle des flux
- **Fonctionnalités** :
  - Attribution transporteurs (camions/wagons)
  - Gestion portes du port
  - Contrôle congestion
  - Clearance finale

## 🚀 Guide d'Utilisation

### 📖 Navigation du Site

Le site comprend **3 pages principales** interconnectées :

1. **🏠 Page d'Accueil** (`index.html`) - Présentation et vue d'ensemble
2. **🖥️ Système Expert** (`system.html`) - Interface de simulation interactive  
3. **📚 Documentation** (`rules.html`) - Règles Prolog complètes

**Navigation fluide :**
- Tous les liens dans la navbar et menus
- Boutons d'action directs sur chaque page
- Navigation responsive mobile avec menu hamburger
- Liens contextuels dans les footers

### 1. 🏠 Page d'Accueil (`index.html`)

La page d'accueil présente le projet avec :
- **Présentation générale** du système expert
- **Détails des 6 modules** avec fonctionnalités
- **Architecture technique** et technologies
- **Statistiques** du système
- **Accès direct** au système expert

**Navigation :**
- Menu responsive avec hamburger mobile
- Sections : Modules, Processus, Technologie, Démonstration
- Boutons d'accès au système expert
- **🔗 Liens directs :** Vers system.html et rules.html

### 2. 🖥️ Interface Système (`system.html`)

L'interface principale offre :

#### A. Sélection des Modules
- **Checkboxes interactives** pour chaque module
- **Activation/désactivation** selon les besoins
- **Compteur** de modules sélectionnés

#### B. Configuration de la Simulation
```
🚢 Données du Navire :
- Nom, longueur, tirant d'eau
- Nombre de conteneurs (EVP)

📦 Configuration Cargaison :
- Type principal (générale, réfrigérée, dangereuse, mixte)
- Répartition % (Import/Export/Transbordement)

🌤️ Conditions Opérationnelles :
- Météo (favorable/moyenne/défavorable)
- Priorité (normale/haute/urgente)
- Heure d'arrivée
```

#### C. Exécution de la Simulation
**3 modes disponibles :**
1. **🚀 Simulation Complète** - Tous les modules d'un coup
2. **📝 Étape par Étape** - Module par module avec détails
3. **🔄 Réinitialisation** - Remise à zéro complète

#### D. Résultats Détaillés
- **Barre de progression** temps réel
- **Résultats par module** avec requêtes Prolog
- **Tableau de bord** avec statistiques globales
- **Console Prolog** avec logs détaillés

#### E. Export des Résultats
- **📄 JSON** - Données structurées
- **📑 PDF** - Rapport formaté (simulation)
- **📊 CSV** - Données tabulaires

### 3. 📚 Documentation Règles (`rules.html`)

La page de documentation technique présente :

#### A. Navigation Intelligente
- **Menu rapide** vers chaque module
- **Navigation fluide** avec scroll animé
- **Indicateur de section active** au scroll
- **Recherche intégrée** (Ctrl+F) dans toutes les règles

#### B. Base de Connaissances Complète
- **💾 Faits du Port** : Infrastructure, ressources, contraintes
- **⚓ Module 1** : Règles d'accostage et attribution quais
- **🏗️ Module 2** : Règles de déchargement et portiques STS
- **📦 Module 3** : Règles de stockage et grues RTG
- **🛂 Module 4** : Règles douanières et CAMCIS
- **🚛 Module 5** : Règles de chargement et stabilité
- **🚪 Module 6** : Règles de sortie et transport terrestre

#### C. Fonctionnalités Avancées
- **📋 Copie en un clic** de chaque bloc de règles
- **🎨 Coloration syntaxique** Prolog automatique
- **🔍 Recherche intelligente** dans tout le code
- **📊 Statistiques** de la base de connaissances
- **♿ Raccourcis clavier** pour navigation rapide

#### D. Format des Règles
Chaque module présente :
```prolog
% Commentaires explicatifs détaillés
regle_principale(Parametres) :-
    condition1(Parametres),
    condition2(Parametres),
    action_resultante(Parametres).

% Gestion des cas d'exception
regle_fallback(Parametres) :-
    \+ regle_principale(Parametres),
    action_alternative(Parametres).
```

## 🧠 Architecture Prolog

### Base de Connaissances

**Faits du Port :**
```prolog
% Quais disponibles
quai(quai1, 350, 14).
quai(quai2, 350, 12).
quai(quai3, 200, 10).

% Portiques STS
portique(portique1, 50, disponible).
portique(portique2, 50, disponible).

% Zones de stockage
zone_stockage(bloc4, refrigere, 50, oui).
zone_stockage(bloc5, dangereux, 60, non).
```

**Règles d'Inférence (exemples) :**
```prolog
% Module 1 - Compatibilité quai
quai_compatible(Navire, Quai) :-
    navire_specs(Navire, Longueur, Tirant),
    quai_specs(Quai, LongueurMax, TirantMax),
    Longueur =< LongueurMax,
    Tirant =< TirantMax.

% Module 2 - Temps déchargement
temps_dechargement(Navire, Temps) :-
    conteneurs(Navire, EVP),
    portique_assigne(Navire, Portique),
    capacite_portique(Portique, CapaciteH),
    Temps is ceil(EVP / CapaciteH).

% Module 4 - Inspection requise
requiert_inspection(Conteneur) :-
    (cargo_type(Conteneur, dangereux);
     etat_conteneur(Conteneur, endommage);
     inspection_aleatoire(Conteneur)).
```

### Moteur d'Inférence JavaScript

Le moteur simule Prolog avec :
- **Map des faits** statiques et dynamiques
- **Règles fonctionnelles** pour chaque module
- **Mécanisme de requête** avec pattern matching
- **Gestion d'état** pour les simulations

## 📊 Exemples d'Utilisation

### Exemple 1 : Porte-conteneurs Standard ✅

**Configuration :**
```
Navire: MSC Kristina
Longueur: 320m
Conteneurs: 3500 EVP
Cargo: Marchandise générale
Météo: Favorable
```

**Résultats attendus :**
- ✅ **Module 1** : Quai1 assigné (350m compatible)
- ✅ **Module 2** : Portique1 + Portique2 (70h déchargement)
- ✅ **Module 3** : Blocs export/import selon répartition
- ✅ **Module 4** : Documents CAMCIS validés
- ✅ **Module 5** : Plan chargement optimisé
- ✅ **Module 6** : Transport terrestre organisé

### Exemple 2 : Navire Réfrigéré ❄️

**Configuration :**
```
Navire: Maersk Cool
Longueur: 280m
Conteneurs: 2000 EVP
Cargo: Marchandise réfrigérée
```

**Spécificités :**
- ⚡ **Zone électrifiée** requise (Bloc4)
- 🔍 **Inspections renforcées** (15% conteneurs)
- 📋 **Documents spéciaux** pour réfrigérés
- 🚛 **Transport prioritaire** pour maintenir chaîne froid

### Exemple 3 : Marchandise Dangereuse ⚠️

**Configuration :**
```
Navire: Dangerous Cargo
Conteneurs: 1500 EVP
Cargo: Marchandise dangereuse
```

**Procédures spéciales :**
- 🚨 **Sécurité renforcée** obligatoire
- 🔍 **Inspection 100%** des conteneurs
- 📍 **Zone dédiée** (Bloc5 seulement)
- 🛂 **Notification douanes** automatique

## 🔧 Fonctionnalités Avancées

### Interface Responsive
- **Design adaptatif** mobile/desktop
- **Menu hamburger** pour mobile
- **Animations fluides** CSS3
- **Glassmorphism** effet moderne

### Validation Intelligente
- **Validation temps réel** des formulaires
- **Contrôle cohérence** pourcentages (total = 100%)
- **Alertes visuelles** erreurs et succès
- **Messages d'aide** contextuels

### Console Prolog Interactive
- **Logs temps réel** de toutes les opérations
- **Types de messages** (info, succès, warning, erreur)
- **Historique complet** avec timestamps
- **Contrôles** (effacer, masquer/afficher)

### Documentation Règles Avancée
- **🔍 Recherche intelligente** dans toutes les règles
- **📋 Copie en un clic** de chaque bloc de code
- **🎨 Coloration syntaxique** Prolog automatique
- **🧭 Navigation fluide** avec indicateur de section active

### Raccourcis Clavier
| Raccourci | Action | Page |
|-----------|--------|------|
| `Ctrl + F` | Recherche dans les règles | rules.html |
| `Ctrl + 1-6` | Navigation directe vers Module 1-6 | rules.html |
| `Escape` | Fermer notifications/modals | Toutes |
| `Enter` | Valider recherche | rules.html |

### Système de Modalités
- **Détails modules** avec statistiques
- **Requêtes détaillées** avec explications
- **Actions rapides** (relancer module)
- **Navigation fluide** avec Escape

## 🚧 Améliorations Futures

### Fonctionnalités Techniques
- [ ] 🔄 **Intégration API** TOS réels
- [ ] 🤖 **Machine Learning** pour optimisations
- [ ] 📡 **WebSocket** pour temps réel
- [ ] 💾 **Base de données** persistante
- [ ] 🔐 **Authentification** utilisateurs

### Modules Supplémentaires
- [ ] 📈 **Analytics** et reporting avancé
- [ ] 🌡️ **IoT Sensors** monitoring environnemental
- [ ] 📱 **App mobile** pour opérateurs terrain
- [ ] 🗺️ **Cartographie 3D** du terminal
- [ ] ⚖️ **Optimisation énergétique**

### Intelligence Artificielle
- [ ] 🧠 **Deep Learning** prédiction trafic
- [ ] 🔮 **Prédiction pannes** équipements
- [ ] 📊 **Optimisation multi-objectifs**
- [ ] 🎯 **Recommandations adaptatives**

## 📚 Références Académiques

### Contexte Pédagogique
- **École** : École Nationale Supérieure Polytechnique de Yaoundé
- **Cours** : Système Formel et Intelligence Artificielle
- **Semestre** : Second semestre 2025
- **Objectif** : Démonstration pratique des systèmes experts

### Avantages Pédagogiques
**🏠 Page d'Accueil :**
- Vue d'ensemble du projet et de ses enjeux
- Compréhension des processus logistiques
- Motivation par la complexité du domaine réel

**📚 Page des Règles :**
- Apprentissage de la syntaxe Prolog
- Compréhension des règles d'inférence
- Analyse de la modélisation des connaissances
- Exemples concrets de programmation logique

**🖥️ Interface Système :**
- Validation des concepts théoriques
- Expérimentation avec paramètres réels
- Observation du moteur d'inférence en action
- Analyse des résultats et optimisations

### Sources d'Inspiration
- **Port de Kribi** : Étude de cas réel (Cameroun)
- **Standards internationaux** : OMI, ISO 28000
- **Opérateurs logistiques** : Maersk, CMA CGM, DP World
- **Systèmes TOS** : Navis N4, Kalmar TLS

## 🛡️ Limitations et Avertissements

### Simulation vs Réalité
⚠️ **Ce système est une démonstration académique** :
- Les règles sont simplifiées par rapport à la réalité
- Les données de performance sont simulées
- L'interface CAMCIS est fictive
- Les temps de traitement sont accélérés

### Utilisation Recommandée
✅ **Idéal pour** :
- Formation et démonstration
- Prototypage de systèmes experts
- Étude de cas pédagogiques
- Validation de concepts IA

❌ **Non recommandé pour** :
- Utilisation en production réelle
- Prise de décisions critiques
- Gestion opérationnelle effective

## 🤝 Contribution

### Suggestions d'Amélioration
- 🐛 **Signaler des bugs** via issues
- 💡 **Proposer des fonctionnalités**
- 📖 **Améliorer la documentation**
- 🎨 **Optimiser l'interface**

### Code de Conduite
- Respecter le contexte académique
- Maintenir la qualité du code
- Documenter les modifications
- Tester avant soumission


---

## 📄 Licence

**Licence Académique** - Usage éducatif et recherche uniquement

© 2025 École Nationale Supérieure Polytechnique de Yaoundé. Tous droits réservés.

---

**🚢 Bon voyage dans l'univers de l'Intelligence Artificielle appliquée à la logistique portuaire !**