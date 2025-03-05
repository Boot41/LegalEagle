.DEFAULT_GOAL:=run
.PHONY=fmt vet tidy build 
fmt:
	go fmt ./...
vet: fmt
	go vet ./...
tidy: vet
	go mod tidy
build: tidy
	go build

