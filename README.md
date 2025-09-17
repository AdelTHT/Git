# CI/CD avec Jenkins — Compte Rendu et Pratique
**Auteur : Adel TAHANOUT**

> **Contexte d’évaluation** — Dépôt GitHub attendu avec :
> 1) Compte rendu d’installation Jenkins, 2) Plugins Jenkins, 3) Déploiement d’une app sur **Jenkins**. Format **Markdown** + **Mermaid** (schémas).

---

## 1. Corrections du TP fourni 

>  **Erreur dans le TP** : *« Java : Jenkins nécessite Java 8 ou supérieur (recommandé : Java 11 ou 17) »*
>
>  **Correction** : Jenkins LTS actuel **exige Java 17** (ou **21**). Java 8/11 ne sont **plus supportés**.
>
>  **Précision Windows** : pendant l’installation .msi, si l’écran « Service Logon Credentials » apparaît, un compte **LocalSystem** suffit pour un usage local ; pour un usage réseau, utiliser un **compte utilisateur** ayant le droit *Log on as a service*.

---

## 2. Environnement de test
- OS : Windows 10/11 x64
- Navigateur : Edge/Chrome
- Java : **JDK 17** 
- Jenkins : **LTS** 

---

## 3. Installation de Java (Windows)

### 3.1 Vérifier/installer
```cmd
where java
java -version
```
---

## 4. Installation de Jenkins (Windows .msi)

### 4.1 Téléchargement
- `https://www.jenkins.io/download/` (Windows, **.msi**)

### 4.2 Assistant d’installation
1. Accepter la licence, dossier par défaut : `C:\Program Files\Jenkins`.
2. Sélection **Java** : pointer le répertoire **JDK 17** (`C:\Program Files\Java\jdk-17\`).

### 4.3 Démarrage & déverrouillage
- Ouvrir : `http://localhost:8080`
- Mot de passe initial :
```cmd
# Un des deux chemins (selon version MSI)
type "%ProgramData%\Jenkins\.jenkins\secrets\initialAdminPassword"
```
- Choisir **Install suggested plugins**, puis créer un utilisateur.

---

## 5. Vérifications & gestion du service Jenkins

```cmd
# Service Windows
services.msc   # Rechercher "Jenkins"
sc query jenkins
net stop jenkins & net start jenkins
```

**Port** : 8080 par défaut.


Changer de port (mode WAR ponctuel) :
```cmd
java -jar jenkins.war --httpPort=9090
```

---

## 6. Plugins Jenkins recommandés

- **Pipeline**  
- **Git plugin**  
- **NodeJS plugin**  
- **Email Extension plugin**  
- **Workspace Cleanup plugin**  
- **Build Timeout plugin**

Installation :  
*Gérer Jenkins* → *Gérer les plugins* → *Disponible* → rechercher et installer les plugins ci-dessus.

---

## 7. Configuration globale Jenkins

- **Node.js** :  
  *Gérer Jenkins* → *Global Tool Configuration*  
  Ajouter NodeJS (ex : NodeJS-18, installation automatique cochée).

- **Git** :  
  Vérifier que Git est bien configuré dans *Global Tool Configuration*.

---

## 8. Création et configuration du job Pipeline

1. **Nouveau job**  
   - *Nouvel item* → *Pipeline* → Nommer (ex : `mon-app-js-pipeline`)

2. **Configuration du pipeline**  
   - Définition : *Pipeline script from SCM*  
   - SCM : *Git*  
   - Repository URL : `https://github.com/AdelTHT/Git.git`  
   - Branch Specifier : `*/main`  
   - Script Path : `Jenkinsfile`

3. **Triggers**  
   - *Build Triggers* : GitHub hook trigger for GITScm polling  
   - *Poll SCM* : `H/5 * * * *` (toutes les 5 minutes)

---

## 9. Structure du projet JavaScript

```
mon-app-js/
├── src/
│   ├── index.html
│   ├── app.js
│   ├── styles.css
│   └── utils.js
├── tests/
│   └── app.test.js
├── package.json
├── Jenkinsfile
├── server.js
└── README.md
```

---

## 10. Exemple de Jenkinsfile (pipeline complet)

Voir le fichier `Jenkinsfile` du projet pour un pipeline complet :  
- Checkout
- Install dependencies
- Run tests (avec rapport JUnit)
- Lint/qualité
- Build
- Audit sécurité
- Déploiement staging (branche develop)
- Déploiement production (branche main)
- Health check
- Archivage artefacts
- Notifications email

---

## 11. Exercices pratiques à valider

- [x] Premier déploiement (build sur main)
- [x] Gestion des branches (déploiement staging sur develop)
- [x] Tests unitaires (pipeline échoue si test KO)
- [x] Archivage des artefacts
- [x] Notification email (à configurer dans Jenkins, voir section Pipeline Jenkins)
- [x] Couverture de code (Cobertura/Jest, à activer dans Jenkins et package.json)
- [ ] (Optionnel) Notification Slack

---

## 12. Questions de compréhension

1. Différence entre `npm install` et `npm ci` ?
2. Pourquoi utiliser `when` dans le pipeline ?
3. Utilité des blocs `post` ?
4. Pourquoi faire un backup avant déploiement ?

---

## 13. Commandes utiles Jenkins CLI

```cmd
# Déclencher un build
java -jar jenkins-cli.jar -s http://localhost:8080 build "mon-app-js-pipeline"

# Voir les logs
java -jar jenkins-cli.jar -s http://localhost:8080 console "mon-app-js-pipeline" -f

# Lister les jobs
java -jar jenkins-cli.jar -s http://localhost:8080
```
