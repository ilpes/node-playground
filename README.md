# Node Playground

## Setup & Installation

Clone this repository anywhere on your machine

```bash
$ git clone git@github.com:ilpes/node-playground.git
$ cd node-playground

# Set up the desired ports for the services and edit the `.env` file.
$ cp env-example .env
```

### Build image
```bash
$ docker-compose build
```

### Install dependencies
```bash
$ docker-compose run --rm node npm install
```

### Database
Migrate and seed the database
```bash
$ docker-compose run --rm node npm run db:migrate
$ docker-compose run --rm node npm run db:seed
```

## Run the project
Start a development server
```bash
$ docker-compose run --rm -p 3000:3000 node npm run dev
```
Make changes to your code and navigate to http://localhost:3000/quartz-movement-what-is-a-quartz-watch-and-how-does-it-work in your browser to preview your site.

## Build the project
```bash
$ docker-compose run --rm -p 3000:3000 node npm run start
```
Navigate to http://localhost:3000/quartz-movement-what-is-a-quartz-watch-and-how-does-it-work in your browser.

### Tests
```bash
$ docker-compose run --rm node npm run test
```
