pipeline {
    agent any
    stages {
        stage('拉取前端') {
            steps {
                git branch: 'sxq', url: 'https://github.com/werwerTrain/fronted.git'
                echo '拉取成功'
            }
        }
        stage('删除k8s中旧deploy'){
            steps{
                bat '''
                kubectl delete -f k8s/frontend-deployment.yaml
                kubectl delete -f k8s/frontend-service.yaml
                '''
            }
        }
        stage('构建运行前端镜像'){
            steps{
                // 查找并停止旧的容器
                powershell '''
                $containers = docker ps -q --filter "ancestor=qiuer0121/frontend:latest"
                foreach ($container in $containers) {
                    Write-Output "Stopping container $container"
                    docker stop $container
                }

                $allContainers = docker ps -a -q --filter "ancestor=qiuer0121/frontend:latest"
                foreach ($container in $allContainers) {
                    Write-Output "Removing container $container"
                    docker rm $container
                }
                '''
                bat 'docker rmi -f qiuer0121/frontend:latest'
                // 构建前端 Docker 镜像
                bat 'docker build -t qiuer0121/frontend -f dockerfile .'
                echo '构建成功'
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                        bat '''
                        echo 20050121Rabbit| docker login -u qiuer0121 --password-stdin
                        docker push qiuer0121/frontend:latest
                        '''
                }
            }
        }
        
        stage('部署到k8s'){
            steps{
                bat '''
                kubectl apply -f k8s/frontend-deployment.yaml
                kubectl apply -f k8s/frontend-service.yaml
                '''
                echo '部署成功'
            }
        }
    }

    post {
        always {
            // 这里可以添加一些清理步骤，例如清理工作目录或通知
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
