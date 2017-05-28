/// <reference path="../../typings/tsd.d.ts"/>

import { isValidName } from './validation';
const restify = require('restify');
const _ = require('lodash');

'use strict';

export const setup = (db, server) => {
  /**
   * GET /mails
   */
  server.get('/mails', (req, res, next) => {
    const name = _.get(req, 'headers.authorization');

    if (!isValidName(name)) {
      return next(new restify.InvalidArgumentError(`Invalid name`));
    }

    db('mails')
      .chain()
      .filter(x => _.includes(x.to, name))
      .map((mail, index) => {
        mail.index = index;
        return mail;
      })
      .thru(x => res.send(x))
      .value();
  });

  /**
   * GET /mails/sent
   */
  server.get('/mails/sent', (req, res, next) => {
    const name = _.get(req, 'headers.authorization');

    if (!isValidName(name)) {
      return next(new restify.InvalidArgumentError(`Invalid name`));
    }

    db('mails')
      .chain()
      .filter(x => x.from === name)
      .map((mail, index) => {
        mail.index = index;
        return mail;
      })
      .thru(x => res.send(x))
      .value();
  });


  /**
   * POST /mails
   */
  server.post('/mails', (req, res, next) => {
    const from = _.get(req, 'headers.authorization');

    if (!isValidName(from)) {
      return next(new restify.InvalidArgumentError(`From invalid name`));
    }

    const to = _(req)
      .chain()
      .get('headers.to', '')
      .split(', ')
      .compact()
      .value();

    if (_.isEmpty(to)) {
      return next(new restify.InvalidArgumentError(`Invalid recipients`));
    }

    // Validate that the `to` fields have names that exist.

  //if (!toNamesExist) {
  //  return next(new restify.InvalidArgumentError(`Recipients don't exist`));
  //}

    const cc = [];

    const body = req.body;

    // Insert one separate mail for each recipient.

    db('mails')
      .insert({ from, to, cc, body })
      .then(x => res.send(x));
  });
};

