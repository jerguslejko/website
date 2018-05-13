#!/bin/bash

docker run --rm -it -p 4000:4000 -v "$(pwd)":/site bretfisher/jekyll-serve
