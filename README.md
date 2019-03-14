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
# Build the docker images, run it for the first time or you have dependency
# updates
docker-compose build
```

## Test

``` bash
# TODO: switch to a docker-based test command
./vendor/bin/phpcs likecoin --standard=WordPress --extensions=php
npm run test
```
