FROM node:16

RUN mkdir /FRONT
COPY . /FRONT

WORKDIR /FRONT
RUN npm install

EXPOSE 8086
CMD ["npm", "run", "dev"]