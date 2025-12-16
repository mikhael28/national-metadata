# Overview

We are building `national-metadata`, the internet's most beautiful npm package that contains comprehensive data about sovereign countries, including immigration programs & tax rates. For the initial release, we are working on releasing a TypeScript-based npm package that focuses first on shipping utility functions meant to make it easier to work with the data surrounding countries; 2 digit vs 3 digit ISO codes, how to convert an ISO Code to the name of the country, the mercator hashes for placing the countries on a world map, and more.

## Todo

1. We need to put together the scaffolding of the NPM package, exporting a simple function called 'hello world' that returns 'Mr World Wide' is here, as a simple proof of concept.
2. We need to organize each file, and each import, and add them to the core npm package.
3. We need to generate sturdy documentation in the README on how to use each function, and their requisite TypeScript types.
4. We also need to have instructions on how to release a new version of the npm package to NPM - perhaps we can set up an automated process through GitHub.
