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
                    docker stop frontend-container
                    docker rm frontend-container
                    docker rmi luluplum/frontend:latest
                    docker build -t luluplum/frontend -f dockerfile .
                '''
                echo '构建成功'
            }
            
        }
        stage('部署到k8s'){
            steps{
                bat '''
                    kubectl delete deployment frontend-deployment -n default
                    kubectl apply -f k8s/frontend-deployment.yaml
                    kubectl apply -f k8s/frontend-service.yaml
                '''
                echo '部署成功'
                
            }
        }
    }
}
