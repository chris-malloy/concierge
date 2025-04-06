SHELL := /bin/bash

# Declare all phony targets (Remove format targets)
.PHONY: test test-backend test-frontend dev watch all lint lint-backend lint-frontend

# List of targets the `readme` target should call before generating the readme
export README_DEPS ?= docs/github-action.md

export BACKEND_HOST_PORT=8090

# Uses the official Cloud Posse URL for fetching.
-include $(shell curl -sSL -o .build-harness "https://cloudposse.tools/build-harness"; echo .build-harness)

# --- Default Target --- 
all: test # Make 'all' depend on the combined 'test' target
	@echo "--- Concierge test run complete ---"

# --- Linting --- 
lint: lint/backend lint/frontend
	@echo "--- Linting complete ---"


lint/frontend:
	@echo "--- Linting Frontend (ESLint via make) --- "
	$(MAKE) -C frontend lint # Assumes frontend/Makefile has a 'lint' target running 'npm run lint'

lint/backend:
	@echo "--- Linting Backend (.NET Format) --- "
	# Verify formatting without making changes
	dotnet format backend/Concierge.Api/Concierge.Api.csproj --verify-no-changes
	dotnet format backend/Concierge.Api.Tests/Concierge.Api.Tests.csproj --verify-no-changes

test/frontend:
	@echo "--- Running Frontend Tests --- "
	$(MAKE) -C frontend test

test/backend:
	@echo "--- Running Backend Tests --- "
	$(MAKE) -C backend test

test: test/backend test/frontend
	@echo "--- Concierge test run complete ---"

dev:
	@echo "--- Starting Backend (Docker Compose) --- "
	docker-compose -f deployment/docker-compose.yml up -d --build
	@echo "--- Starting Frontend Dev Server --- "
	$(MAKE) -C frontend dev

watch:
	$(MAKE) -C frontend watch