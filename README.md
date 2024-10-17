**start frontend with "npm start dev"**\
Dokerfile for frontend:\
FROM node:16

RUN mkdir /FRONT
COPY . /FRONT

WORKDIR /FRONT
RUN npm install

EXPOSE 5173
CMD ["npm", "run", "dev"]
\
\
\
**backend with "./back" in python**\
Dokerfile for backend:\
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

EXPOSE 83

CMD ["python3", "."]


Настроить в файле config.json адрес сервера бэка и закинуть env c ссылкой на mongo db