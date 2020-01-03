docker-build:
	docker build -t rtradetech/ens-app:latest .
	docker image push rtradetech/ens-app:latest