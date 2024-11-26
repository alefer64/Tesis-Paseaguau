pipeline {
  agent {
    docker { image 'node:16-alpine' }
  }
    stages {
      
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }
        
        stage('Build Image') {
            steps {
                script {
                    sh "docker build . paseaguau:${BUILD_NUMBER}"
                }
            }
        }
        }
        
    }

    post {
        success {
        }
        failure {
          
        }
        always {

        }
    }
} 
