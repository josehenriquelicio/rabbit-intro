# docs: https://hub.docker.com/r/fluent/fluentd
FROM node:10.16.0-alpine

# Current dir
WORKDIR /opt/app

# Install Curl for get http data in source

# Copy config to fluentd
COPY . /opt/app

RUN yarn

CMD [ "node", "receivers/receive_logs_topic.js" ]
