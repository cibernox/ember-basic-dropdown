import { pageTitle } from 'ember-page-title';
import MyAddon2 from '#src/index.ts';

const greeting = 'hello';

const myAddon2 = new MyAddon2();

<template>
  {{pageTitle "Demo App"}}

  <h1>Welcome to ember!</h1>

  {{log myAddon2.isTestingFromMyAddon}}

  {{greeting}}, world!
</template>
