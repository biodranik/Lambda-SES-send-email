# Serverless lambda to send email from HTML form

This lambda function sends email using Amazon SES (Simple Email Service).

## Installation and Setup

1. Install and setup [serverless](https://serverless.com/framework/docs/providers/aws/guide/installation/).
2. Verify 'From' and 'To' email addresses in [SES Console](https://console.aws.amazon.com/ses/home).
3. Deploy this lambda by `sls deploy` and remember it's POST endpoint: it should be used in your HTML form JS code.
4. Open Lambda function configuration console and add an environment variable. The name of variable should be in lowercase, and it is passed as a query *?source=<env_variable_name>* parameter to the POST URL above. The value should be in JSON and have three required parameters: *from*, *to* and *subject*. For example:
```json
{"from":"from@example.com","to":"to@example.com","subject":"My Static Website Contact Form","noheaders":false}
```
5. Use sample HTML form, CSS and JS from this repo on your static site. Use your POST URL in the code, like *`https://asd123qwe.execute-api.eu-west-1.amazonaws.com/dev/send?source=your_env_variable_name`*

Enjoy!

## Notes

- JS code sends all form inputs with *name=""* attribute.
- For better formatting, use *name="First Name" + name="Last Name"* or *name="Name"*, and *name="Email"* inside your `<input>` tags.
