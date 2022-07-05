# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#non-root-user
FROM node:16.15.0-alpine AS development

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

RUN mkdir /opt/app && chown node:node /opt/app
WORKDIR /opt/app

USER node
COPY --chown=node:node package.json ./
RUN npm install --no-optional && npm cache clean --force

################
## PRODUCTION ## TODO, not functional anymore !!!!!
################
# Build another image named production
FROM node:16.15.0-alpine AS production

# Set node env to prod
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Set Working Directory
WORKDIR /usr/src/app

# Copy all from development stage
COPY --from=development /usr/src/app/ .

EXPOSE 8080

# Run app
CMD [ "node", "dist/main" ]

# Example Commands to build and run the dockerfile
# docker build -t thomas-nest .
# docker run thomas-nest