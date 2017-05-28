/// <reference path="../../typings/tsd.d.ts"/>

import { isValidName, isValidPassword } from './validation';
const restify = require('restify');
const _ = require('lodash');

'use strict';

export const setup = (db, server) => {
  /**
   * GET /mailboxes
   */
  server.get('/mailboxes', (req, res) => {
    const publicBoxes = db('mailboxes')
      .chain()
      .filter({ public: true })
      .map(x => _.pick(x, ['name']))
      .value();

    res.send(publicBoxes);
  });

  /**
   * POST /mailboxes
   */
  server.post('/mailboxes/:name', (req, res, next) => {
    const name = _.get(req.params, 'name');

    if (!isValidName(name)) {
      return next(new restify.InvalidArgumentError(`Invalid name ${name}`));
    }

    const nameIsUnique = db('mailboxes')
      .chain()
      .filter({ name })
      .isEmpty()
      .value();

    if (!nameIsUnique) {
      return next(new restify.InvalidArgumentError(`Name ${name} is already taken`));
    }

    _.assign(req.body, { name });

    if (!isValidPassword(_.get(req, 'body.password'))) {
      return next(new restify.InvalidArgumentError(`Invalid password`));
    }

    req.body.public = _.get(req, 'body.public', true);

    db('mailboxes')
      .insert(req.body)
      .then(x => res.send(x));
  });
};

