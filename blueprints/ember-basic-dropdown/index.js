﻿/* eslint-env node */
'use strict';

const path = require('path');
const fs = require('fs');
const EOL = require('os').EOL;

module.exports = {
  normalizeEntityName() {
    // this prevents an error when the entityName is
    // not specified (since that doesn't actually matter
    // to us
  },

  afterInstall() {
    let dependencies = this.project.dependencies();
    const promises = [];
    let skipStyleImport = false;

    if ('ember-power-select' in dependencies) {
      skipStyleImport = true;
    }

    if (!skipStyleImport) {
      let type;
      let importStatement = '\n@import "ember-basic-dropdown";\n';
      if ('ember-cli-sass' in dependencies) {
        type = 'scss';
      } else if ('ember-cli-less' in dependencies) {
        type = 'less';
      }

      if (type) {
        let stylePath = path.join('app', 'styles');
        let file = path.join(stylePath, `app.${type}`);

        if (!fs.existsSync(stylePath)) {
          fs.mkdirSync(stylePath);
        }
        if (fs.existsSync(file)) {
          this.ui.writeLine(`Added import statement to ${file}`);
          promises.push(this.insertIntoFile(file, importStatement, {}));
        } else {
          fs.writeFileSync(file, importStatement);
          this.ui.writeLine(`Created ${file}`);
        }
      } else {
        let file = path.join('app', `app.js`);
        if (!fs.existsSync(file)) {
          file = path.join('app', `app.ts`);
        }
        if (fs.existsSync(file)) {
          this.ui.writeLine(`Added import statement to ${file}`);
          promises.push(
            this.insertIntoFile(file, "import 'ember-basic-dropdown/styles';", {
              after: "config/environment';" + EOL,
            }),
          );
        }
      }
    }

    let templatePath = path.join('app', 'templates');
    let applicationFile = path.join(templatePath, `application.hbs`);
    if (fs.existsSync(applicationFile)) {
      this.ui.writeLine(`Added wormhole statement to ${applicationFile}`);
      promises.push(
        this.insertIntoFile(
          applicationFile,
          `${EOL}<BasicDropdownWormhole />`,
          {},
        ),
      );
    }

    return Promise.all(promises);
  },
};
