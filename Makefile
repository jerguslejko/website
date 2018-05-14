.PHONY: build help serve

help:
	@echo "usage: build | serve"

build:
	@docker run --rm \
		-v $(shell pwd):/srv/jekyll \
		jekyll/jekyll \
		jekyll build

serve:
	@docker run --rm -it \
		-v $(shell pwd):/srv/jekyll \
		-p 4000:4000 \
		jekyll/jekyll \
		jekyll serve
