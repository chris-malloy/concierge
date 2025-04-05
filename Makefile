SHELL := /bin/bash

# List of targets the `readme` target should call before generating the readme
export README_DEPS ?= docs/github-action.md

# Uses the official Cloud Posse URL for fetching.
-include $(shell curl -sSL -o .build-harness "https://cloudposse.tools/build-harness"; echo .build-harness)

all:
	@echo "concierge test run starting..."
	$(MAKE) -C frontend
	@echo "concierge test run complete"

dev:
	$(MAKE) -C frontend dev

watch:
	$(MAKE) -C frontend watch

include frontend/Makefile
