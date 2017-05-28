/// <reference path="../../typings/tsd.d.ts"/>

const low = require('lowdb');
const storage = require('lowdb/file-async');
const restify = require('restify');
const _ = require('lodash');
const chalk = require('chalk');
const pretty = require('prettyjson');

const db = low('db.json', { storage });
db._.mixin(require('underscore-db'))

import * as Mails from './mails';
import * as Mailboxes from './mailboxes';

const server = restify.createServer({ name: 'emmett' });

server.use(restify.bodyParser({ mapParams: false }));
server.use(restify.queryParser({ mapParams: true }));
server.use(restify.CORS());

server.listen(4096, '0.0.0.0', () => {
  console.info(`server started`);
});

server.use((req, res, next) => {
  const methods = {
    GET: `${chalk.green(req.method)}`,
    POST: `${chalk.yellow(req.method)}`,
    PUT: `${chalk.blue(req.method)}`
  };

  console.log(`${methods[req.method]} ${chalk.gray(req.url)}`);

  if (!_.isEmpty(req.headers)) {
    console.log(pretty.render(req.headers));
  }

  if (!_.isEmpty(req.params)) {
    console.log(pretty.render(req.params));
  }

  if (!_.isEmpty(req.body)) {
    console.log(pretty.render(req.body));
  }

  next();
});

Mails.setup(db, server);
Mailboxes.setup(db, server);

