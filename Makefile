docker-build:
	docker build $(OPTFLAGS) -t ensdomains/ens-app:latest .
	docker image push ensdomains/ens-app:latest

