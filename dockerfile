# 使用官方 Node.js 镜像
FROM node:18

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install --legacy-peer-deps

# 复制项目文件
COPY . .

# 构建前端应用
RUN npm run build --legacy-peer-deps

# 暴露应用端口
EXPOSE 3000
# 启动应用
CMD ["serve", "-s", "dist", "-l", "3000"]
