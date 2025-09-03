# Web3Press WordPress Plugin By LikeCoin

[![WordPress plugin downloads](https://img.shields.io/wordpress/plugin/dt/likecoin.svg)](https://wordpress.org/plugins/likecoin/)
[![WordPress plugin rating](https://img.shields.io/wordpress/plugin/r/likecoin.svg)](https://wordpress.org/plugins/likecoin/)
[![WordPress plugin version](https://img.shields.io/wordpress/plugin/v/likecoin.svg)](https://wordpress.org/plugins/likecoin/)
[![WordPress version tested](https://img.shields.io/wordpress/v/likecoin.svg)](https://wordpress.org/plugins/likecoin/)
[![CircleCI](https://circleci.com/gh/likecoin/likecoin-wordpress.svg?style=svg)](https://circleci.com/gh/likecoin/likecoin-wordpress)
[![Greenkeeper badge](https://badges.greenkeeper.io/likecoin/likecoin-wordpress.svg)](https://greenkeeper.io/)

## Important Migration Notice

**This plugin is transitioning from liker.land to 3ook.com** - the next evolution of decentralized bookstore technology.

### What's Changing:
- **Read-Only State**: The plugin will enter read-only mode during the migration preparation
- **No More NFT Publishing**: All publish to ISCN and NFT functions have been removed
- **Widget Migration**: LikeCoin buttons and NFT widgets will migrate to 3ook.com widgets
- **New Features**: Display book collections from 3ook.com or recommend specific books

### What Still Works:
- Control display settings for LikeCoin buttons and NFT widgets
- Update ISCN ID and Arweave ID for posts
- Assign Liker ID to site or post (will be removed in next version)
- Internet Archive integration and payment pointer functions

### About 3ook.com:
3ook.com is a decentralized bookstore running on EVM blockchain - the next evolution of liker.land. Like its predecessor, it focuses on empowering creators and building decentralized communities around content.

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
npm run dev:admin:settings

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
