'use strict';

const fs = require('fs');
const path = require('path');
const Funnel = require('broccoli-funnel');
const walkSync = require('walk-sync');

class AmdExcluder extends Funnel {
  constructor(inputNode, options) {
    super(inputNode, {
      exclude: [],
      annotation: options.annotation,
    });

    this.options = options;
  }

  build() {
    let inputPath = this.inputPaths[0];

    let files = walkSync(inputPath, {
      directories: false,
      globs: [`**/*.js`],
    });

    for (let file of files) {
      let inputFilePath = path.join(inputPath, file);
      let source = fs.readFileSync(inputFilePath, 'utf8');

      // ember-data and others compile their own source
      if (source.indexOf('define(') === 0) {
        this.exclude.push(file);
      }
    }

    super.build();
  }
}

module.exports = AmdExcluder;
