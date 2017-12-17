import Application from '../app';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-cli-qunit';
import config from '../config/environment';

setApplication(Application.create(config.APP));
start();
