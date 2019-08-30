FROM node:10.16.3-stretch-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
  build-essential vim curl sudo gnupg gnupg1 gnupg2 apt-transport-https

# install yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add - \
  && echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list \
  && sudo apt-get update && sudo apt-get install -y yarn

WORKDIR /webgl-sandbox
COPY . .