docker-build:
	docker build $(OPTFLAGS) -t rtradetech/ens-app:latest .
	docker image push rtradetech/ens-app:latest