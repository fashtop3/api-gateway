FROM node:10.19.0-alpine as builder

# Create app directory
WORKDIR /usr/app

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/app/node_modules/.bin:$PATH
ENV SHELL=/bin/sh

RUN npm install pm2@latest -g

#COPY package.json /usr/src/app/package.json
COPY package*.json ./

RUN npm install --silent
# If you are building your code for production
#RUN NODE_ENV=production npm ci
#RUN npm ci --only=production

# The instructions for second stage
#FROM node:10.19.0-alpine
#
#WORKDIR /usr/src
#COPY --from=builder /usr/src/node_modules .

COPY . .

EXPOSE 8080
CMD [ "pm2",  "start", "ecosystem.config.js", "--no-daemon" ]
#CMD [ "npm", "run", "start:prod" ]