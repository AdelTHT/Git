pipeline {
  agent any
  tools { nodejs 'NodeJS-24' }

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

    stage('Debug') {
      steps {
        echo "JOB=${env.JOB_NAME} BRANCH_NAME=${env.BRANCH_NAME} GIT_BRANCH=${env.GIT_BRANCH}"
      }
    }

    stage('Install Dependencies') {
      steps {
        bat 'node -v & npm -v'
        bat 'npm ci || npm install'
      }
    }

    stage('Run Tests') {
      steps { bat 'npm test' }
      post { always { junit 'reports/junit.xml' } }
    }

    stage('Code Quality Check') {
      steps { bat 'npx eslint src --ext .js' }
    }

    stage('Build') {
      steps {
        bat 'npm run build'
        bat 'dir dist'
      }
    }

    stage('Security Scan') {
      steps { bat 'cmd /c npm audit --audit-level=high || exit /b 0' }
    }

    /* ====== Déploiements conditionnels pour job Pipeline simple ====== */

    stage('Deploy to Staging') {
     /* when {
        anyOf {
          expression { env.BRANCH_NAME == 'develop' }
          expression { env.GIT_BRANCH == 'origin/develop' || env.GIT_BRANCH == 'refs/heads/develop' }
        }
      }*/
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
      /*when {
        anyOf {
          expression { env.BRANCH_NAME == 'main' }
          expression { env.GIT_BRANCH == 'origin/main' || env.GIT_BRANCH == 'refs/heads/main' }
        }
      }*/
      steps {
        echo 'Déploiement production (copie locale)...'
        bat '''
          powershell -NoProfile -ExecutionPolicy Bypass ^
            if (Test-Path "%DEPLOY_DIR%") { ^
              Copy-Item -Recurse -Force "%DEPLOY_DIR%" ("%DEPLOY_DIR%_backup_" + (Get-Date -f yyyyMMdd_HHmmss)) ^
            }
        '''
        bat '''
          powershell -NoProfile -ExecutionPolicy Bypass ^
            New-Item -ItemType Directory -Force "%DEPLOY_DIR%" | Out-Null
        '''
        bat 'robocopy dist "%DEPLOY_DIR%" /MIR >NUL'
        bat 'dir "%DEPLOY_DIR%"'
      }
    }

    stage('Health Check') {
      steps { echo 'Health check (ex. curl http://localhost:3000/health si serveur lancé)' }
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
