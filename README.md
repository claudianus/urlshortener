## What is URL Shortener
This is a node.js fullstack web application that shorten long urls
## How to install and host on your server (Ubuntu 18.04)
Install node.js if you haven't installed node.js yet
```bash
# https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions
$ curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
$ sudo apt-get install -y nodejs
``` 


First of all you need to download this repo
```bash
$ git clone https://github.com/claudianus/urlshortener.git
$ cd urlshortener
```

At this moment you must rename or copy '.env.example' file to '.env' and modify the values in the file to suit your environment

```bash
$ cp .env.example .env
$ vim .env
```

Then install dependencies and setup database..
*You don't need to install any database server software like mysql, mariadb because this app use sqlite by default*

```bash
$ npm install
$ node ace migration:run --force
```

and start the app (server)

```bash
# start the server but if you're in production pm2(http://pm2.keymetrics.io/) is recommended
$ npm start
```

That's it