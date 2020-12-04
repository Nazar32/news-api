# News-api

#### Steps to run app local
You can run app with docker or without it

1. Docker way

* Install [docker](https://docs.docker.com/engine/install/) if you have not done it yet
* Go to the project root folder 
* Build docker image `docker build --tag news-api .`
* Run docker image `docker run -p 3001:3001 -e PORT=3001 -d news-api`
* Application is running on http://localhost:3001


2. Without docker way

* Install [nodejs](https://nodejs.org/uk/download/) if you have not done it yet
* Go to the project root folder
* Run `npm i --only=production`
* Run `npm start`
* Application is running on http://localhost:3001
