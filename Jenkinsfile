pipeline {
  agent any
  tools { nodejs 'node24' }

  environment {
    APP_NAME   = 'mon-app-js'
    DEPLOY_DIR = 'C:\\deploy\\mon-app'
    JEST_JUNIT_OUTPUT = 'reports\\junit.xml'
    CI = 'true'
  }

  options { timestamps(); disableConcurrentBuilds() }

  stages {
    stage('Checkout') {
      steps {
        echo 'Récupération du code source...'
        checkout scm
      }
    }

    stage('Install Dependencies') {
      steps {
        echo 'Installation des dépendances Node.js...'
        bat 'node -v & npm -v'
        bat 'npm ci || npm install'
      }
    }

    stage('Run Tests') {
      steps {
        echo 'Exécution des tests...'
        bat 'npm test'
      }
      post {
        always {
          junit 'reports/junit.xml'
        }
      }
    }

    stage('Code Quality Check') {
      steps {
        echo 'Lint JavaScript...'
        // nécessite eslint installé (voir "À faire avant")
        bat 'npx eslint src --ext .js'
      }
    }

    stage('Build') {
      steps {
        echo 'Construction de l\'application...'
        bat 'npm run build'
        bat 'dir dist'
      }
    }

    stage('Security Scan') {
      steps {
        echo 'Analyse npm audit (non bloquante si warning)...'
        bat 'cmd /c npm audit --audit-level=high || exit /b 0'
      }
    }

    stage('Deploy to Staging') {
      when { branch 'develop' }
      steps {
        echo 'Déploiement staging (copie locale)...'
        bat '''
          powershell -NoProfile -ExecutionPolicy Bypass ^
            New-Item -ItemType Directory -Force C:\\staging\\%APP_NAME% | Out-Null
        '''
        bat 'robocopy dist C:\\staging\\%APP_NAME% /MIR >NUL'
      }
    }

    stage('Deploy to Production') {
      when { branch 'main' }
      steps {
        echo 'Déploiement production (copie locale)...'
        // Sauvegarde de la version précédente
        bat '''
          powershell -NoProfile -ExecutionPolicy Bypass ^
            if (Test-Path "%DEPLOY_DIR%") { ^
              Copy-Item -Recurse -Force "%DEPLOY_DIR%" ("%DEPLOY_DIR%_backup_" + (Get-Date -f yyyyMMdd_HHmmss)) ^
            }
        '''
        // Déploiement
        bat '''
          powershell -NoProfile -ExecutionPolicy Bypass ^
            New-Item -ItemType Directory -Force "%DEPLOY_DIR%" | Out-Null
        '''
        bat 'robocopy dist "%DEPLOY_DIR%" /MIR >NUL'
        bat 'dir "%DEPLOY_DIR%"'
      }
    }

    stage('Health Check') {
      steps {
        echo 'Health check (ex: vérifier un endpoint si app servie)...'
        // ici, simple trace. Si tu sers l’app avec server.js, on peut curl http://localhost:3000/health
      }
    }
  }

  post {
    always {
      echo 'Nettoyage léger du workspace...'
      bat 'rmdir /S /Q staging 2>nul || exit /b 0'
    }
    success { echo 'Pipeline exécuté avec succès !' }
    unstable { echo 'Build instable.' }
    failure { echo 'Le pipeline a échoué.' }
  }
}
