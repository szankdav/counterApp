FROM node:18.20.1-alpine
WORKDIR /counterApp
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD [ "npm", "start" ]