# Use uma imagem base com Node.js
FROM node:18

# Crie e defina o diretório de trabalho
WORKDIR /usr/src/app

# Copie os arquivos do projeto para o container
COPY package*.json ./
RUN npm install
COPY . .

# Exponha a porta em que o aplicativo estará ouvindo
EXPOSE 3000

# Comando para iniciar o aplicativo
CMD [ "node", "index.js" ]