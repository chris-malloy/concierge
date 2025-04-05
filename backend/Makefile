BACKEND_DIR := $(shell pwd)/backend

all: test
	@echo "backend tests complete...""

test:
	@echo "backend tests starting..."
	dotnet test $(BACKEND_DIR)/Concierge.Api.Tests/Concierge.Api.Tests.csproj
	@echo "backend tests complete..."
