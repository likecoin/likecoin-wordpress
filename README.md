# LikeCoin WordPress Plugin

[![WordPress plugin downloads](https://img.shields.io/wordpress/plugin/dt/likecoin.svg)](https://wordpress.org/plugins/likecoin/)
[![WordPress plugin rating](https://img.shields.io/wordpress/plugin/r/likecoin.svg)](https://wordpress.org/plugins/likecoin/)
[![WordPress plugin version](https://img.shields.io/wordpress/plugin/v/likecoin.svg)](https://wordpress.org/plugins/likecoin/)
[![WordPress version tested](https://img.shields.io/wordpress/v/likecoin.svg)](https://wordpress.org/plugins/likecoin/)
[![CircleCI](https://circleci.com/gh/likecoin/likecoin-wordpress.svg?style=svg)](https://circleci.com/gh/likecoin/likecoin-wordpress)
[![Greenkeeper badge](https://badges.greenkeeper.io/likecoin/likecoin-wordpress.svg)](https://greenkeeper.io/)

Integrates Liker ID functionality into your own WordPress site.

## Development Setup

The suggested way of development environment is docker based. This guide will
assume you have Docker Community Edition 18+ installed. Please download at
[https://store.docker.com](https://store.docker.com) and follow the
installation instruction.

``` bash
# Build the docker images, run it for the first time or you have dependency updates
docker-compose build

# Run the dev env
docker-compose up

# Install nodejs dependencies
# npm install
```

## JavaScript Development
Auto rebuild script in dev mode. Only one javascript component can be run at a time.
``` bash
# DePub metabox for classic editor
npm run dev:admin:metabox

# LikeCoin plugin admin setting pages
npm run dev:admin-settings

# DePub Editor sidebar for Gutenberg
npm run dev:sidebar
```


## Lint
TODO: we are running these command in host, should switch to docker-based test command

Run PHP sniffer for PHP lint
``` bash
# Install composer if not exists
# brew install composer

# Install dependencies
composer install

# Install WordPress PHP Coding standard
cd vendors
git clone -b master https://github.com/WordPress-Coding-Standards/WordPress-Coding-Standards.git ./wpcs
./bin/phpcs --config-set installed_paths `pwd`/wpcs
cd ..

# Run phpcs
./vendor/bin/phpcs likecoin --standard=WordPress --extensions=php

# or, run phpcbf for autofix
./vendor/bin/phpcbf likecoin --standard=WordPress --extensions=php
```

Run Eslint and Stylelint for javascript lint
``` bash
# run eslint and stylelint
npm run lint
```

## Production

Javascript files need to be transpile using wp-script

``` bash
# Run wp-script/webpack
npm run build
```
