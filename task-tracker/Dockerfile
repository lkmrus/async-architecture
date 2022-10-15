FROM node:15.10-alpine
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm i
COPY . .
RUN npm run build
ENV NODE_ENV=production
CMD ["npm", "run", "start"]
