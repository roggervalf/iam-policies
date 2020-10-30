# iam-policies

> [![NPM](https://img.shields.io/npm/v/iam-policies.svg)](https://www.npmjs.com/package/iam-policies) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier) [![Build Status](https://travis-ci.com/roggervalf/iam-policies.svg?branch=master)](https://travis-ci.com/github/roggervalf/iam-policies) [![NPM downloads](https://img.shields.io/npm/dm/iam-policies)](https://www.npmjs.com/package/iam-policies) [![Coverage Status](https://coveralls.io/repos/github/roggervalf/iam-policies/badge.svg?branch=master)](https://coveralls.io/github/roggervalf/iam-policies?branch=master) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## About

Define custom IAM Policies by allowed or denied set of actions against a set of resources with optional context and conditions.

Deny rules trump allow rules.

This is based of [@ddt/iam](https://www.npmjs.com/package/@ddt/iam) and [AWS Reference Policies ](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies.html).

## Install

```bash
npm install --save iam-policies
```

Or

```bash
yarn add iam-policies
```

## Deno import

```ts
// @deno-types="https://raw.githubusercontent.com/roggervalf/iam-policies/master/dist/main.d.ts"
import {
  ActionBasedPolicy,
  IdentityBasedPolicy,
  ResourceBasedPolicy
} from 'https://raw.githubusercontent.com/roggervalf/iam-policies/master/dist/main.es.js';
```

or

```ts
// @deno-types="https://deno.land/x/iam_policies@master/dist/main.d.ts"
import {
  ActionBasedPolicy,
  IdentityBasedPolicy,
  ResourceBasedPolicy
} from 'https://deno.land/x/iam_policies@master/dist/main.es.js';
```

## Node import

```js
import {
  ActionBasedPolicy,
  IdentityBasedPolicy,
  ResourceBasedPolicy
} from 'iam-policies';
```

## Examples

- Here is an example of using it into a [GraphQL project](https://github.com/roggerval/tech-insiders-nodejs) (step 7).

## Features

Supports these glob features:

- Policies creation (ActionBasedPolicy, [IdentityBasedPolicy and ResourceBasedPolicy](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html#access_policy-types))
- Permission verifications

## Documentation

Please click on the language that you prefer

- Translations:
  - [Chinese docs](https://roggervalf.github.io/iam-policies/zh-CN/) by [@mickymao1110](https://github.com/mickymao1110) (< v3.5.0 )
  - [English docs](https://roggervalf.github.io/iam-policies/en/) by [@roggervalf](https://github.com/roggervalf)

## Article

[How to build a Deno module](https://medium.com/@rogger.valverde/how-to-build-a-deno-module-dc383eee8edb)

## Contributing

Fork the repo, make some changes, submit a pull-request! Here is the [contributing](contributing.md) doc that has some details.

## License

MIT © [roggervalf](https://github.com/roggervalf)
