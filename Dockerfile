FROM node:carbon

# Create app dir
#WORKDIR /user/src/app

# Install deps
COPY package.json package-lock.json ./

RUN npm install

# Copy source files
COPY . .

CMD ["node", "index.js"]

