FROM node:latest
MAINTAINER Yannic Kilcher
ADD web/web.tar.gz /home/web/
WORKDIR /home/web/bundle
RUN cd programs/server && npm install --production
EXPOSE 80
ENV MONGO_URL=mongodb://mongo:27017/wat
ENV ROOT_URL=http://localhost:80/wat
ENV PORT=80
CMD ["node", "main.js"]
