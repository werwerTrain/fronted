pipeline {
    agent any
    stages {
        stage('拉取前端') {
            steps {
                git branch: 'sxq', url: 'https://github.com/werwerTrain/fronted.git'
                echo '拉取成功'
            }
        }
        stage('构建运行前端镜像'){
            steps{
                bat '''
                    docker stop frontend
                    docker rm frontend
                    docker rmi frontend
                    docker build -t frontend -f dockerfile .
                    docker run --name frontend frontend
                '''
                echo '构建成功'
            }
            
        }
        stage('部署到k8s'){
            steps{
                bat 'kubectl apply -f k8s/frontend-deployment.yaml'
                bat 'kubectl apply -f k8s/frontend-service.yaml'
                echo '部署成功'
                
            }
        }
    }
}
