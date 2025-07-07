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
                bat 'npm ci'  // Or 'npm install'
            }
        }

        stage('Start Server') {
            steps {
                // Optional: run locally or SSH into EC2
                bat 'npm start'
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
