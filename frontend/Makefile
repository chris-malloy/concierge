FRONTEND_DIR := $(shell pwd)/frontend

define run_in_project
	@echo "$@..."
	npm run $@
endef

.PHONY: all install test dev watch build lint

all: install test
	@echo "UI tests complete"

install:
	@echo "installing dependencies..."
	npm install

test: install
	@echo "running UI tests..."
	$(call run_in_project,test)

# Default backend host port if not passed from parent Makefile
BACKEND_HOST_PORT ?= 8080

dev: install
	@echo "running dev server..."
	export NEXT_PUBLIC_API_URL="http://localhost:$(BACKEND_HOST_PORT)" ; \
	echo "--- Frontend API URL: $${NEXT_PUBLIC_API_URL} ---" ; \
	npm run dev

watch: install
	@echo "running watch server..."
	cd $(FRONTEND_DIR) && npm run test:watch

build: install
	@echo "building UI..."
	$(call run_in_project,build)

lint: install
	@echo "running lint..."
	$(call run_in_project,lint)
