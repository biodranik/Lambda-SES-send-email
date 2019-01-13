'use strict';

function extractNameAndEmail(form) {
  let emailAndName = {};
  let firstname, lastname;
  for (const key in form) {
    const lc = key.toLowerCase();
    if (lc.indexOf('mail') > -1 && form[key].indexOf('@') > -1)
      emailAndName['email'] = form[key];
    else if (lc.indexOf('name') > -1) {
      if (lc.indexOf('first') > -1)
        firstname = form[key];
      else if (lc.indexOf('last') > -1)
        lastname = form[key];
      else
        emailAndName['name'] = form[key];
    }
  }
  if (!('name' in emailAndName)) {
    if (firstname) {
      emailAndName['name'] = firstname;
      if (lastname) emailAndName['name'] += ' ' + lastname;
    } else if (lastname)
      emailAndName['name'] = lastname
  }
  return emailAndName;
}

module.exports.sendMail = async (event, context) => {
  if (!event.query.source) throw new Error('[401] Authorization required');
  const source = event.query.source;
  if (source != event.query.source.toLowerCase() || !(source in process.env))
    throw new Error('[403] Access denied for ' + source);
  const params = JSON.parse(process.env[source]);
  if (!params) throw new Error('[403] Access denied for ' + source);

  const form = event.body;
  let message = '';
  for (const key in form) message += key + ': ' + form[key] + '\n';

  // Attach headers for more detailed information.
  message += '\n' +
      JSON.stringify(event.headers, null, ' ').replace(/",|}|{| |"/g, '');

  let {name, email} = extractNameAndEmail(form);
  const sesParams = {
    Destination: {ToAddresses: [params.to]},
    Message: {
      Body: {Text: {Charset: 'UTF-8', Data: message}},
      Subject: {
        Charset: 'UTF-8',
        Data: name ? name + ' / ' + params.subject : params.subject
      }
    },
    Source: name ? `"${name}" <${params.from}>` : params.from,
    ReplyToAddresses:
        [email ? (name ? `"${name}" <${email}>` : email) : params.to],
  };
  const AWS = require('aws-sdk');
  const SES = new AWS.SES({apiVersion: '2010-12-01'});
  await SES.sendEmail(sesParams).promise();

  return 'Mahalo';
};