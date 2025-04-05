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

dev: install
	@echo "running dev server..."
	$(call run_in_project,dev)

watch: install
	@echo "running watch server..."
	cd $(FRONTEND_DIR) && npm run test:watch

build: install
	@echo "building UI..."
	$(call run_in_project,build)

lint: install
	@echo "running lint..."
	$(call run_in_project,lint)
