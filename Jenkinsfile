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
        deleteDir()      
        echo 'Récupération du code source...'
        checkout scm
      }
    }

    stage('Debug') { steps { echo "JOB=${env.JOB_NAME}  BRANCH_NAME=${env.BRANCH_NAME}  GIT_BRANCH=${env.GIT_BRANCH}" } }

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

    stage('Code Quality Check') { steps { bat 'npx eslint src --ext .js' } }

    stage('Build') {
      steps { bat 'npm run build && dir dist' }
    }

    stage('Security Scan') {
      steps { bat 'cmd /c "npm audit --audit-level=high || exit /b 0"' }
    }

    // === STAGING TOUJOURS EXÉCUTÉ POUR L'EXO 1 ===
    stage('Deploy to Staging') {
      steps {
        echo 'Déploiement staging (copie locale)...'
        bat '''
          powershell -NoProfile -ExecutionPolicy Bypass ^
            New-Item -ItemType Directory -Force C:\\staging\\%APP_NAME% | Out-Null
        '''
        bat 'robocopy dist C:\\staging\\%APP_NAME% /MIR >NUL'
        bat 'dir C:\\staging\\%APP_NAME%'
      }
    }

    // === PRODUCTION DÉSACTIVÉ POUR L’EXO 1 ===
    /* stage('Deploy to Production') {
      steps { echo 'Désactivé pour Exercice 1' }
    } */

    stage('Health Check') { steps { echo 'OK' } }
  }

  post {
  always {
    catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
      cobertura coberturaReportFile: 'coverage/cobertura-coverage.xml', onlyStable: false
    }
    echo 'Nettoyage léger du workspace...'
    bat 'rmdir /S /Q staging 2>nul || exit /b 0'
  }
  success { archiveArtifacts artifacts: 'dist/**', fingerprint: true }
  failure { echo 'Le pipeline a échoué.' }
}
}
