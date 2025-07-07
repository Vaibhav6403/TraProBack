pipeline {
    agent any

    environment {
        // Can be unset or development during install and test
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                // Install all dependencies for build/test
                bat 'npm ci'
            }
        }

        // stage('Test') {
        //     steps {
        //         bat 'npm test'  // or your test script
        //     }
        // }

        stage('Build') {
            steps {
                // If you have a build step, e.g. tsc or babel
                // Otherwise, skip this stage
                bat 'npm run build'
            }
        }

        // stage('Deploy') {
        //     steps {
        //         // Example: deploy script, or start server, or docker build & push
        //         // You might want to set NODE_ENV=production here
        //         bat 'set NODE_ENV=production && npm run start'
        //     }
        // }
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
