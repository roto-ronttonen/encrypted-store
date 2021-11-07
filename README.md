# Starting

## Requirements

- Unix system (if on windows sh scripts wont work, but they aren't very complex doe)
- Docker

## TLDR

Generate certificates with `gen-certs.sh`

then run `start.prod.sh`

go to https://localhost

## Starting

Running `start.prod.sh` will init a docker swarm and deploy 3 containers.

Running `start.dev.sh` will start the stack with docker-compose with volumes mapped to folders for hmr.

## Certificates

Https wont work without certificates so run `gen-certs.sh`.
If you don't trust me about this you can find your own way around the certificates. Anyways project root should have a folder `certs` with 2 files: `server.crt` and `server.key`

Follow this to trust certificate on firefox https://javorszky.co.uk/2019/11/06/get-firefox-to-trust-your-self-signed-certificates/

## Cleanup

`cleanup.prod.sh` will leave swarm mode and remove all containers associated with the swarm.
