# iam-policies

> 

[![NPM](https://img.shields.io/npm/v/iam-policies.svg)](https://www.npmjs.com/package/iam-policies) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## About

Define an allowed or denied set of actions against a set of resources with optional context.

Deny rules trump allow rules.

This is a fork of [@ddt/iam](https://www.npmjs.com/package/@ddt/iam) updated.

## Install

```bash
npm install --save iam-policies
```

Or

```bash
yarn add iam-policies
```

## Usage

```js
const {Role}=require('iam-policies')

const role = new Role([
  {
    effect: 'allow', // optional, defaults to allow
    resources: ['secrets:${user.id}:*'],
    actions: ['read', 'write'],
  },
  {
    resources: ['secrets:{${user.bestfriends}}:*'],
    actions: ['read'],
  },
  {
    effect: 'deny',
    resources: ['secrets:admin:*'],
    actions: ['read'],
  },
])

const adminRole = new Role([
  {
    effect: 'allow',
    resources: ['*'],
    actions: ['*'],
  },
  {
    resources: ['secrets:{${user.bestfriends}}:*'],
    actions: ['read'],
  },
  {
    effect: 'deny',
    resources: ['secrets:admin:*'],
    actions: ['read'],
  },
])
const context = { user: { id: 456, bestfriends: [123, 563, 1211] } }
// true
role.can('read', 'secrets:563:sshhh', context)
// false
role.can('read', 'secrets:admin:super-secret', context)

const friendsWithAdminContext = { user: { id: 456, bestfriends: ['admin'] } }

// false
role.can('read', 'secrets:admin:super-secret', friendsWithAdminContext)

const adminRole = new Role([
  {
    resources: ['*'],
    actions: ['*'],
  },
])

// true
adminRole.can('read', 'someResource')
// true
adminRole.can('write', 'otherResource')
```
