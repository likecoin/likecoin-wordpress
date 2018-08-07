# LikeCoin WordPress Plugin

Integrates LikeCoin ID functionality into your own WordPress site.

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
