FROM node:16-alpine

WORKDIR /app
COPY ./public /app/public
COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json

RUN npm install

COPY ./src /app/src


EXPOSE 3000

CMD ["npm", "start"]
