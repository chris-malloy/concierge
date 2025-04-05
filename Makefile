SHELL := /bin/bash

# List of targets the `readme` target should call before generating the readme
export README_DEPS ?= docs/github-action.md

# Uses the official Cloud Posse URL for fetching.
-include $(shell curl -sSL -o .build-harness "https://cloudposse.tools/build-harness"; echo .build-harness)

all: test
	@echo "--- Concierge test run complete ---"
# --- Backend Tests --- 
.PHONY: test-backend
test-backend:
	@echo "--- Running Backend Tests --- "
	$(MAKE) -C backend test

# --- Frontend Tests --- 
.PHONY: test-frontend
test-frontend:
	@echo "--- Running Frontend Tests --- "
	$(MAKE) -C frontend test

# --- All Tests --- 
.PHONY: test
test: test-backend test-frontend
	@echo "--- Concierge test run complete ---"

# Make 'test' the default goal
.DEFAULT_GOAL := test

# Keep potentially useful targets, but they are now superseded by 'test'
# all:
# 	@echo "concierge test run starting..."
# 	$(MAKE) -C frontend
# 	$(MAKE) -C backend
# 	@echo "concierge test run complete"

dev:
	$(MAKE) -C frontend dev

watch:
	$(MAKE) -C frontend watch

# Includes are less necessary now that we explicitly call targets in sub-makes
# include frontend/Makefile
# include backend/Makefile