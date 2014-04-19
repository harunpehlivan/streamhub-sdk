.PHONY: all build

all: build

build: node_modules

jsdoc: build
	./node_modules/jsdoc/jsdoc.js -d api  -u examples/ -t node_modules/jaguarjs-jsdoc/ -c config/jsdoc.json src/content/main.js

dist:
	./node_modules/requirejs/bin/r.js -o ./tools/build.conf.js	

# if package.json changes, install
node_modules: package.json
	npm install
	touch $@

test: build
	npm test

clean:
	rm -rf node_modules

package: build

deploy:
	lfcdn

deployprod:
	lfcdn prod
