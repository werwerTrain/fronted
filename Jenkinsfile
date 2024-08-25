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
                // 查找并停止旧的容器
                powershell '''
                $containers = docker ps -q --filter "ancestor=frontend:latest"
                foreach ($container in $containers) {
                    Write-Output "Stopping container $container"
                    docker stop $container
                }

                $allContainers = docker ps -a -q --filter "ancestor=frontend:latest"
                foreach ($container in $allContainers) {
                    Write-Output "Removing container $container"
                    docker rm $container
                }
                '''
                bat 'docker rmi -f frontend:latest'
                // 构建前端 Docker 镜像
                bat 'docker build -t frontend -f dockerfile .'
                echo '构建成功'
            }
        }
        
        stage('部署到k8s'){
            steps{
                bat '''
                kubectl delete -f k8s/frontend-deployment.yaml
                kubectl apply -f k8s/frontend-deployment.yaml
                kubectl apply -f k8s/frontend-service.yaml
                '''
                echo '部署成功'
            }
        }
    }
}
