FROM node:22
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
ENV MONGO_URI=mongodb://root:root@mongo:27017/express-api?authSource=admin
ENV JWT_SECRET_KEY=123456789
ENV PORT=3005
RUN mkdir -p /usr/src/app/uploads
COPY . .
EXPOSE 3005
CMD ["npm","start"]