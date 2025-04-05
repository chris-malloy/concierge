PROJECT_DIR := $(shell pwd)/frontend

define run_in_project
	@echo "$@..."
	cd $(PROJECT_DIR) && npm run $@
endef

all: install test
	@echo "testing UI..."

install:
	@echo "installing dependencies..."
	npm install --prefix $(PROJECT_DIR)

test: install
	@echo "tests coming soon..."

dev: install
	@echo "dev server coming soon..."
	# $(call run_in_project,dev)

build: install
	@echo "building..."
	# $(call run_in_project,build)
