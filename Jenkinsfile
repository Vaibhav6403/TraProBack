pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'  // clean install dependencies
            }
        }

        stage('Deploy & Restart Server') {
            steps {
                sh '''
                pm2 restart backend || pm2 start npm --name backend -- start
                pm2 save
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Backend pipeline succeeded!'
        }
        failure {
            echo '❌ Backend pipeline failed!'
        }
    }
}
