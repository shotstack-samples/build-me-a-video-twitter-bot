<!--
title: 'Build Me A Video Twitter Bot'
description: 'This template demonstrates how to develop and deploy a simple Node Express API running on AWS Lambda using the traditional Serverless Framework.'
layout: Doc
platform: AWS
language: nodeJS
priority: 1
authorLink: 'https://github.com/derkzomer'
authorName: 'Derk Zomer'
-->

# Build Me A Video Twitter Bot

Create a Twitter bot that creates videos from tweets using the Shotstack API.

This project uses AWS Lambda via the [Serverless](https://serverless.com/) framework,
[Shotstack](https://github.com/shotstack), [node-twitter-api-v2](https://github.com/plhery/node-twitter-api-v2) to
query any Twitter mentions and create a personalised video from tweet and user data.

This project creates three Lambda functions:

1. Query function that checks for new mentions every minute and creates a personalised video for each mention.
2. Webhook function that accepts a Shotstack callback and executes the lambda which will reply to the Tweet.
3. Reply function which uploads the Shotstack video to Twitter when the render completes and tweets the result as a
   reply to the original tweet.

## Install

Register for a [Shotstack developer account](https://dashboard.shotstack.io/register) and a [Twitter developer
account](https://developer.twitter.com/en).

```bash
npm install
cp .env.dist .env
```

### Twitter authentication

For the Twitter API we use OAuth1.1. You can generate your API (consumer) keys and associated access token and secret on
your dashboard. You will likely have to apply for elevated account access.

Once you have your Twitter credentials add them to your `.env` file, in addition to your [Twitter user
ID](https://tweeterid.com/).

### Shotstack authentication

For Shotstack you can access your API keys via your dashboard. Add your sandbox or production key to your `.env` file
and use the appropriate environment. `v1` for production and `stage` for the sandbox.

### AWS

To deploy the application you will need an AWS account. The easiest way to deploy from your local machine is if the AWS
CLI is already installed. To install and configure the AWS CLI follow the [Getting started with the AWS
CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html) guide.

Other ways to authenticate your AWS account are explained in the [Serverless AWS
Credentials](https://www.serverless.com/framework/docs/providers/aws/guide/credentials/) guide.

## Deployment

First create a deployment bucket in AWS S3 and then add the bucket name to the `DEPLOYMENT_BUCKET` environment variable
in your `.env` file. Alternatively you can allow the Serverless Framework to create a deployment bucket for you by
deleting the following lines from `serverless.yml`:

```yaml
  deploymentBucket:
    name: ${env:DEPLOYMENT_BUCKET}
    blockPublicAccess: true
```

Next deploy the application:

```bash
npm run deploy
```

Now copy your webhook API endpoint to your `.env` file and deploy your serverless project again:

```bash
npm run deploy
```

Note that you can override the `stage` and `region` parameters using options:

```bash
npm run deploy -- --stage production --region us-east-1
```

## Built with

- [Shotstack](https://github.com/shotstack/) - Shotstack provides a cloud based video editing API used to power
  applications that create, automate and personalise millions of data driven videos.
- [node-twitter-api-v2](https://github.com/plhery/node-twitter-api-v2) - Strongly typed, full-featured, light, versatile
  yet powerful Twitter API v1.1 and v2 client for Node.js.
