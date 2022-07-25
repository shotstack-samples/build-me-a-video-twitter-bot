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

# ![pageres](media/promo.png)

[![Coverage Status](https://codecov.io/gh/sindresorhus/pageres/branch/main/graph/badge.svg)](https://codecov.io/gh/sindresorhus/pageres)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/xojs/xo)

Create a Twitter bot that creates videos from tweets using the Shotstack API.

This project uses AWS Lambda via the [Serverless](https://serverless.com/) framework, **[Shotstack](https://github.com/shotstack)**, [node-twitter-api-v2](https://github.com/plhery/node-twitter-api-v2) to query any Twitter mentions and create a personalised video from tweet and user data.

## Install

Register for a [Shotstack developer account](https://dashboard.shotstack.io/register) and a [Twitter developer account](https://developer.twitter.com/en).

```
$ npm install
$ cp .env.dist .env
```

### Twitter authentication
For the Twitter API we use OAuth1.1. You can generate your API (consumer) keys and associated access token and secret on your dashboard. You will likely have to apply for elevated account access.

Once you have your Twitter credentials add them to your `.env` file, in addition to your [Twitter user ID](https://tweeterid.com/).

### Shotstack authentication
For Shotstack you can access your API keys via your dashboard. Add your sandbox or production key to your `.env` file and use the appropriate environment. `v1` for production and `stage` for the sandbox.

Only once you have set up your AWS environment and deployed 

### AWS
Make sure your AWS environment is set up correctly. There are a range of resources that will help you if you're unfamiliar with the process:
1. [Setting Up Serverless Framework With AWS](https://www.serverless.com/framework/docs/getting-started)
2. [Getting started with the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html)

## Usage

```
$ npx serverless deploy
```

Now copy your webhook API endpoint to your `.env` file and deploy your serverless project again:

```
$ npx serverless deploy
```

## Built with

- [Shotstack](https://github.com/shotstack/) - Shotstack provides a cloud based video editing API used to power applications that create, automate and personalise millions of data driven videos.
- [node-twitter-api-v2](https://github.com/plhery/node-twitter-api-v2) - Strongly typed, full-featured, light, versatile yet powerful Twitter API v1.1 and v2 client for Node.js.
