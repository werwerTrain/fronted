# 使用Node.js官方镜像作为构建阶段
FROM node:14 AS build

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json并安装依赖
COPY package*.json ./
RUN npm install

# 复制项目文件并构建
COPY . .
RUN npm run build

# 使用nginx作为发布阶段的基础镜像
FROM nginx:alpine

# 将构建的文件复制到nginx的html目录
COPY --from=build /app/dist /usr/share/nginx/html

# 暴露nginx默认端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]
