'use strict';

const fs = require('fs');
const path = require('path');
const Funnel = require('broccoli-funnel');
const walkSync = require('walk-sync');

class AmdExcluder extends Funnel {
  constructor(inputNode, options) {
    options = options || {};
    let _options = {
      annotation: options.annotation,
    };
    if (options.include) {
      _options.include = [];
    } else {
      _options.exclude = [];
    }
    super(inputNode, _options);

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
        if (this.options.include) {
          this.include.push(file);
        } else {
          this.exclude.push(file);
        }
      }
    }

    super.build();
  }
}

module.exports = AmdExcluder;
