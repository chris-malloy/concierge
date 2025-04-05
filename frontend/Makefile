FRONTEND_DIR := $(shell pwd)/frontend

define run_in_project
	@echo "$@..."
	cd $(FRONTEND_DIR) && npm run $@
endef

all: install test
	@echo "UI tests complete"

install:
	@echo "installing dependencies..."
	npm install --prefix $(FRONTEND_DIR)

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
