FROM node:10.19.0-alpine as builder

# Create app directory
WORKDIR /usr

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

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
CMD [ "npm", "run", "start:prod" ]