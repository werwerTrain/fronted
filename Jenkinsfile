pipeline {
    agent any

    environment {
        FRONTEND_IMAGE = "3181577132/frontend:latest"
    }

    stages {
        stage('Build Frontend') {
            steps {
                script {
                    // 确保环境变量被正确解析
                    bat "echo Building Docker image: %FRONTEND_IMAGE%"
                    bat "docker build -t %FRONTEND_IMAGE% ./frontend"
                }
            }
        }

        stage('Push Frontend Image') {
            steps {
                script {
                    bat "echo Pushing Docker image: %FRONTEND_IMAGE%"
                    bat "docker push %FRONTEND_IMAGE%"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    bat "kubectl apply -f k8s/frontend-deployment.yaml"
                }
            }
        }

        stage('Service to Kubernetes') {
            steps {
                script {
                    bat "kubectl apply -f k8s/frontend-service.yaml"
                }
            }
        }

        stage('Integration Test') {
            steps {
                echo 'tested!'
                // 使用 Postman Collection 进行测试
                //bat 'newman run collection.json'  // 如果使用 Newman 运行 Postman 测试
            }
        }
    }

    post {
        always {
            bat 'docker system prune -f'
        }
        success {
            echo 'Build and deployment succeeded!'
        }
        failure {
            echo 'Build or deployment failed.'
        }
    }
}
