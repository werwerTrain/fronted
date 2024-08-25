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
                    bat '''
                    CONTAINERS=$(docker ps -q --filter "ancestor=frontend:latest")
                    if [ -n "$CONTAINERS" ]; then
                        docker stop $CONTAINERS
                    fi
                    '''

                // 删除停止的容器
                    bat '''
                    CONTAINERS=$(docker ps -a -q --filter "ancestor=frontend:latest")
                    if [ -n "$CONTAINERS" ]; then
                        docker rm $CONTAINERS
                    fi
                    '''
                    bat '''
                    docker rmi -f frontend:latest || true
                    '''
                    // 构建前端 Docker 镜像
                    bat 'docker build -t frontend -f doockerfile .'
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
