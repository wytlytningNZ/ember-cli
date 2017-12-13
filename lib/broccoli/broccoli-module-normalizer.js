'use strict';

const Plugin = require('broccoli-plugin');
const fs = require('fs');
const path = require('path');
const symlinkOrCopy = require('symlink-or-copy');

const symlinkOrCopySync = symlinkOrCopy.sync;

module.exports = class ModuleNormalizer extends Plugin {
  constructor(input) {
    super([input], {
      persistentOutput: true,
    });

    this._hasRan = false;
  }

  build() {
    if (this._hasRan && symlinkOrCopy.canSymlink) { return; }

    let symlinkSource;

    let modulesPath = path.join(this.inputPaths[0], 'modules');
    if (fs.existsSync(modulesPath)) {
      let files = fs.readdirSync(modulesPath);
      for (let file of files) {
        let x = path.join(modulesPath, file);
        if (this._hasRan) {
          fs.unlinkSync(path.join(this.outputPath, file));
        } else if (fs.existsSync(path.join(this.outputPath, file))) {
          fs.rmdirSync(path.join(this.outputPath, file));
        }

        symlinkOrCopySync(x, path.join(this.outputPath, file));
      }
      // symlinkSource = modulesPath;
    } else {
      // symlinkSource = this.inputPaths[0];
    }

    let files = fs.readdirSync(this.inputPaths[0]);
    for (let file of files) {
      if (file === 'modules') {
        continue;
      }

      let x = path.join(this.inputPaths[0], file);
      if (this._hasRan) {
        fs.unlinkSync(path.join(this.outputPath, file));
      } else if (fs.existsSync(path.join(this.outputPath, file))) {
        fs.rmdirSync(path.join(this.outputPath, file));
      }

      symlinkOrCopySync(x, path.join(this.outputPath, file));
    }

    // if (this._hasRan) {
    //   fs.unlinkSync(this.outputPath);
    // } else {
    //   fs.rmdirSync(this.outputPath);
    // }

    // symlinkOrCopySync(symlinkSource, this.outputPath);
    this._hasRan = true;
  }
};
