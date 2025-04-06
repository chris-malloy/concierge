SHELL := /bin/bash

# Declare all phony targets (Remove format targets)
.PHONY: test test/backend test/frontend dev watch all lint lint/backend lint/frontend

# List of targets the `readme` target should call before generating the readme
export README_DEPS ?= docs/github-action.md

# Uses the official Cloud Posse URL for fetching.
-include $(shell curl -sSL -o .build-harness "https://cloudposse.tools/build-harness"; echo .build-harness)

export COMPOSE_BAKE=true
export BACKEND_HOST_PORT=8090
export MSSQL_SA_PASSWORD=root123!

# --- Default Target --- 
all: lint test
	@echo "--- Concierge test run complete ---"

# --- Linting --- 
lint: lint/backend lint/frontend
	@echo "--- Linting complete ---"

lint/backend:
	@echo "--- Linting Backend (.NET Format) --- "
	# Verify formatting without making changes
	dotnet format backend/Concierge.Api/Concierge.Api.csproj --verify-no-changes
	dotnet format backend/Concierge.Api.Tests/Concierge.Api.Tests.csproj --verify-no-changes

lint/frontend:
	@echo "--- Linting Frontend (ESLint via make) --- "
	$(MAKE) -C frontend lint # Assumes frontend/Makefile has a 'lint' target running 'npm run lint'

# --- Backend Tests --- 
test/backend:
	@echo "--- Running Backend Tests --- "
	$(MAKE) -C backend test

# --- Frontend Tests --- 
test/frontend:
	@echo "--- Running Frontend Tests --- "
	$(MAKE) -C frontend test

# --- All Tests --- 
test: test/backend test/frontend
	@echo "--- Concierge test run complete ---"

dev:
	@echo "--- Using host port $(BACKEND_HOST_PORT) for backend ---"
	export BACKEND_HOST_PORT=$(BACKEND_HOST_PORT)
	echo "--- Starting Backend (Docker Compose) --- "
	docker-compose -f deployment/docker-compose.yml up -d --build
	@echo "--- Starting Frontend Dev Server --- "
	$(MAKE) -C frontend dev BACKEND_HOST_PORT=$(BACKEND_HOST_PORT)

dev/frontend:
	@echo "--- Starting Frontend Dev Server --- "
	$(MAKE) -C frontend dev

dev/backend:
	@echo "--- Starting Backend (Docker Compose) --- "
	docker-compose -f deployment/docker-compose.yml up -d --build
	docker compose -f deployment/docker-compose.yml logs --follow

watch:
	$(MAKE) -C frontend watch