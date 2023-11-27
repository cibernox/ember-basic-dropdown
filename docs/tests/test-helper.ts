import Application from 'docs/app';
import config from 'docs/config/environment';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start } from 'ember-qunit';
import 'qunit-dom';

setApplication(Application.create(config.APP));

setup(QUnit.assert);

start();
