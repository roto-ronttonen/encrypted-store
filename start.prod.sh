docker swarm init
docker build ./apps/api -t encrypted-file-storage-api
docker build ./apps/web -t encrypted-file-storage-web
docker stack deploy --compose-file docker-compose.yml encrypted-file-storage