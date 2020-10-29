---
title: "en"
date: "14-08-2020"
---

# iam-policies

> [![NPM](https://img.shields.io/npm/v/iam-policies.svg)](https://www.npmjs.com/package/iam-policies) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![Build Status](https://travis-ci.com/roggervalf/iam-policies.svg?branch=master)](https://travis-ci.com/github/roggervalf/iam-policies) [![NPM downloads](https://img.shields.io/npm/dm/iam-policies)](https://www.npmjs.com/package/iam-policies) [![Coverage Status](https://coveralls.io/repos/github/roggervalf/iam-policies/badge.svg?branch=master)](https://coveralls.io/github/roggervalf/iam-policies?branch=master) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

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
} from "https://raw.githubusercontent.com/roggervalf/iam-policies/master/dist/main.es.js"
```

or

```ts
// @deno-types="https://deno.land/x/iam_policies@master/dist/main.d.ts"
import {
  ActionBasedPolicy,
  IdentityBasedPolicy,
  ResourceBasedPolicy
} from "https://deno.land/x/iam_policies@master/dist/main.es.js"
```

## Features

Supports these glob features:

- Policies creation ([IdentityBasedPolicy and ResourceBasedPolicy](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html#access_policy-types))
- Permission verifications
- Generate Proxies

## Usage

### Examples

First, we should get our policies classes:

```js
const {
  ActionBasedPolicy,
  IdentityBasedPolicy,
  ResourceBasedPolicy
} = require("iam-policies")
```

#### Effect property allow

```js
const allowExample = new IdentityBasedPolicy({
  statements: [
    {
      effect: "allow", // optional, defaults to allow
      resource: ["secrets:${user.id}:*"], // embedded value by context
      action: ["read", "write"]
    },
    {
      resource: ["bd:company:*"],
      action: "create"
    }
  ]
})

const contextForAllowExample = { user: { id: 456 } }

allowExample.evaluate({
  action: "read",
  resource: "secrets:456:ultraSecret",
  context: contextForAllowExample
}) // true
allowExample.evaluate({
  action: "create",
  resource: "secrets:456:ultraSecret",
  context: contextForAllowExample
}) // false
allowExample.evaluate({
  action: "create",
  resource: "bd:company:account",
  context: contextForAllowExample
}) // true
allowExample.evaluate({
  action: "read",
  resource: "bd:company:account",
  context: contextForAllowExample
}) // false
```

#### Effect property deny

```js
const denyExample = new IdentityBasedPolicy({
  statements: [
    {
      resource: ["secrets:${user.bestFriends}:*"],
      action: "read"
    },
    {
      effect: "deny",
      resource: "secrets:123:*",
      action: "read"
    }
  ]
})

const contextForDenyExample = { user: { bestFriends: [123, 563, 1211] } }

denyExample.evaluate({
  action: "read",
  resource: "secrets:563:super-secret",
  context: contextForDenyExample
}) // true
denyExample.evaluate({
  action: "read",
  resource: "secrets:123:super-secret",
  context: contextForDenyExample
}) // false
```

#### Not Action property

```js
const notActionExample = new IdentityBasedPolicy({
  statements: [
    {
      resource: "bd:company:*",
      notAction: "update"
    }
  ]
})

notActionExample.evaluate({
  action: "delete",
  resource: "bd:company:account"
}) // true
notActionExample.evaluate({
  action: "update",
  resource: "bd:company:account"
}) // false
```

#### Not Resource property

```js
const notResourceExample = new IdentityBasedPolicy({
  statements: [
    {
      notResource: ["bd:roles:*"],
      action: "update"
    }
  ]
})

notResourceExample.evaluate({
  action: "update",
  resource: "photos"
}) // true
notResourceExample.evaluate({
  action: "update",
  resource: "bd:roles:admin"
}) // false
```

#### Allow everything

```js
const adminExample = new IdentityBasedPolicy({
  statements: [
    {
      resource: "*",
      action: "*"
    }
  ]
})

adminExample.evaluate({
  action: "read",
  resource: "someResource"
}) // true
adminExample.evaluate({
  action: "write",
  resource: "otherResource"
}) // true
```

#### Conditions property

```js
const conditionResolver = {
  greaterThan: function (data, expected) {
    return data > expected
  }
}

const conditionExample = new IdentityBasedPolicy({
  statements: [
    {
      resource: "secrets:*",
      action: ["read", "write"],
      condition: {
        greaterThan: {
          "user.age": 18
        }
      }
    }
  ],
  conditionResolver
})

conditionExample.evaluate({
  action: "read",
  resource: "secrets:code",
  context: { user: { age: 19 } }
}) // true
conditionExample.evaluate({
  action: "read",
  resource: "secrets:admin:super-secret",
  context: {
    user: { age: 18 }
  }
}) // false
```

#### Principal property

```js
const principalExample = new ResourceBasedPolicy({
  statements: [
    {
      principal: "1",
      effect: "allow",
      resource: ["secrets:user:*"],
      action: ["read", "write"]
    },
    {
      principal: { id: "2" },
      resource: "bd:company:*",
      notAction: "update"
    }
  ]
})

principalExample.evaluate({
  principal: "1",
  action: "read",
  resource: "secrets:user:name"
}) // true
principalExample.evaluate({
  principal: "2",
  action: "read",
  resource: "secrets:user:super-secret"
}) // false
principalExample.evaluate({
  principal: "2",
  action: "read",
  resource: "bd:company:name",
  principalType: "id"
}) // true
principalExample.evaluate({
  principal: "2",
  action: "update",
  resource: "bd:company:name",
  principalType: "id"
}) // false
```

#### Not Principal property

```js
const notPrincipalExample = new ResourceBasedPolicy({
  statements: [
    {
      notPrincipal: ["1", "2"],
      resource: ["secrets:bd:*"],
      action: "read"
    },
    {
      notPrincipal: { id: "3" },
      resource: "secrets:admin:*",
      action: "read"
    }
  ]
})

notPrincipalExample.evaluate({
  principal: "3",
  action: "read",
  resource: "secrets:bd:tables"
}) // true
notPrincipalExample.evaluate({
  principal: "1",
  action: "read",
  resource: "secrets:bd:tables"
}) // false
notPrincipalExample.evaluate({
  principal: "1",
  action: "read",
  resource: "secrets:admin:friends",
  principalType: "id"
}) // true
notPrincipalExample.evaluate({
  principal: "3",
  action: "read",
  resource: "secrets:admin:friends",
  principalType: "id"
}) // false
```

#### Using `can` and `cannot`

```js
const canAndCannotStatements = [
  {
    effect: "allow", // again, this is optional, as it already defaults to allow
    resource: ["website:${division.companyId}:${division.countryId}:*/*"],
    action: ["create", "update", "delete"]
  },
  {
    effect: "deny",
    resource: ["website:${division.companyId}:${division.countryId}:city/lima"],
    action: "delete"
  }
]

const inclusivePolicy = new IdentityBasedPolicy({
  statements: canAndCannotStatements
})

const contextCanAndCannot = {
  division: {
    companyId: 123,
    countryId: 456
  }
}

const canAndCannotDeniedArgument = {
  action: "delete",
  resource: "website:123:456:city/lima",
  context: contextCanAndCannot
}

inclusivePolicy.evaluate(canAndCannotDeniedArgument) // false
// So far, we are not sure whether the argument is denied or not present.

inclusivePolicy.can(canAndCannotDeniedArgument) // true
// It's present as an allow policy, so it must be explicitly denied, right?

inclusivePolicy.cannot(canAndCannotDeniedArgument) // true
// I knew it!

const canAndCannotNotPresentArgument = {
  action: "read",
  resource: "website:123:456:}city/lima",
  context: contextCanAndCannot
}

inclusivePolicy.evaluate(canAndCannotNotPresentArgument) // false
// Again, the user doesn't have access here, but why? Let's investigate..

inclusivePolicy.can(canAndCannotNotPresentArgument) // false
// It's not present as an allow policy, but is it explicitly denied?

inclusivePolicy.cannot(canAndCannotNotPresentArgument) // false
// Nope, it just isn't there.
```

## ActionBasedPolicy Class

Attach managed and simple inline policies to grant actions only.

```js
const { ActionBasedPolicy } = require("iam-policies")

const actionBasedPolicy = new ActionBasedPolicy({
  statements,
  conditionResolver,
  context
})
```

### Properties

| Name                                                             | Type                                                                  | Default   | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---------------------------------------------------------------- | --------------------------------------------------------------------- | --------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `statements`                                                     | object[]                                                              | undefined | `true`   | The **_statements_** is the main element for a policy.<br/> The statements element can contain an array of individual statements.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `statements[]`<br/>`.sid`                                        | string                                                                | _uuid_    | `false`  | The **_sid_** element should be a unique identifier.<br/> It is automatically generated with a uuid in case it is undefined.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `statements[]`<br/>`.effect`                                     | string                                                                | allow     | `false`  | The **_effect_** element specifies whether the statement results in an allow or an explicit deny.<br/> Valid values for Effect are `allow` and `deny`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `statements[]`<br/>`.action`                                     | string or string[]                                                    | undefined | `false`  | The **_action_** element describes the specific action or actions that will be allowed or denied.<br/> Each statement must include either an `action` or `notAction` element.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `statements[]`<br/>`.notAction`                                  | string or string[]                                                    | undefined | `false`  | The **_notAction_** element is an advanced policy element that explicitly matches everything except the specified list of actions.<br/> Each statement must include either an `action` or `notAction` element.<br/> Using `notAction` can result in a shorter policy by listing only a few actions that should not match, rather than including a long list of actions that will match.<br/> When using `notAction`, you should keep in mind that actions specified in this element are the only actions in that are limited.<br/> This, in turn, means that all of the applicable actions or services that are not listed are allowed if you use the Allow effect.<br/> In addition, such unlisted actions or services are denied if you use the `deny` effect.<br/> When you use `notAction` with the `resource` element, you provide scope for the policy. |
| `statements[]`<br/>`.condition`                                  | object                                                                | undefined | `false`  | The **_condition_** element (or Condition block) lets you specify conditions for when a policy is in effect.<br/> In the `condition` element, you build expressions in which you use condition operators (equal, less than, etc.) to match the condition keys and values in the policy against keys and values in the request context.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `statements[]`<br/>`.condition["conditionType"]`                 | object                                                                | undefined | `false`  | The **_conditionType_** name should be replaced with a custom string attribute for a specific condition that should be match with one conditionResolver element.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `statements[]`<br/>`.condition["conditionType"]["conditionKey"]` | (string or number or boolean) or<br/> (string or number or boolean)[] | undefined | `false`  | The **_conditionKey_** should be a custom string path attribute for a specific context attribute.<br/> Note: attributes must be separated but dots (`.`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `conditionResolver`                                              | object                                                                | undefined | `false`  | The **_conditionResolver_** should contain a function in each attribute to resolve an specific embedded condition in our statements.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `conditionResolver["conditionKey"]`                              | function                                                              | undefined | `false`  | The **_conditionKey_** should match with a function name that will be used as a resolver in condition evaluation.<br/> There are 2 parameters for this function: **data** (first parameter) that will be evaluated with **expected** (second parameter), returning a **true** or **false**.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `context`                                                        | object                                                                | undefined | `false`  | The **_context_** has those properties that will be embedded in our statements.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |

### Methods

#### actionBasedPolicy.getStatements()

_public_: Returns `statements[]` (statements array).

#### actionBasedPolicy.getContext()

_public_: Returns `context` object.

#### actionBasedPolicy.setContext(context)

_public_: Sets `context` object.

#### actionBasedPolicy.getConditionResolver()

_public_: Returns `conditionResolver` object.

#### actionBasedPolicy.setConditionResolver(conditionResolver)

_public_: Sets `conditionResolver` object.

#### actionBasedPolicy.evaluate({action, context})

_public_: Verify if action is allowed (`true`) or denied (`false`).

##### Params

| Name      | Type   | Default   | Required | Description                                                           |
| --------- | ------ | --------- | -------- | --------------------------------------------------------------------- |
| `action`  | string | undefined | `true`   | It represents the action you are asking.                              |
| `context` | object | undefined | `false`  | It represents the properties that will be embedded into your actions. |

#### actionBasedPolicy.can({action, context})

_public_: Verify if action is allowed (`true`) or not present (`false`).

##### Params

| Name      | Type   | Default   | Required | Description                                                           |
| --------- | ------ | --------- | -------- | --------------------------------------------------------------------- |
| `action`  | string | undefined | `true`   | It represents the action you are asking.                              |
| `context` | object | undefined | `false`  | It represents the properties that will be embedded into your actions. |

#### actionBasedPolicy.cannot({action, context})

_public_: Verify if action for specific resource is denied (`true`) or not present (`false`).

##### Params

| Name      | Type   | Default   | Required | Description                                                           |
| --------- | ------ | --------- | -------- | --------------------------------------------------------------------- |
| `action`  | string | undefined | `true`   | It represents the action you are asking.                              |
| `context` | object | undefined | `false`  | It represents the properties that will be embedded into your actions. |

#### actionBasedPolicy.generateProxy(object, options)

_public_: Generate a Proxy for the object param.

##### Params

| Name                             | Type    | Default                                         | Required | Description                                                                        |
| -------------------------------- | ------- | ----------------------------------------------- | -------- | ---------------------------------------------------------------------------------- |
| `object`                         | object  | undefined                                       | `true`   | It's the object that is going to be wrapped with a Proxy.                          |
| `options`                        | object  | { get:{ allow:true },<br/> set:{ allow:true } } | `false`  | It should contains attributes to modify the default behavior.                      |
| `options`<br/>`.get`             | object  | { allow:true }                                  | `false`  | It should contain get function handler options for the Proxy instance.             |
| `options`<br/>`.get.allow`       | boolean | true                                            | `false`  | It should allow to use the get function handler.                                   |
| `options`<br/>`.get.propertyMap` | object  | {}                                              | `false`  | It should serve as a mapping for different property names in get function handler. |
| `options`<br/>`.set`             | object  | { allow:true }                                  | `false`  | It should contain set function handler options for the Proxy instance.             |
| `options`<br/>`.set.allow`       | boolean | true                                            | `false`  | It should allow to use the set function handler.                                   |
| `options`<br/>`.set.propertyMap` | object  | {}                                              | `false`  | It should serve as a mapping for different property names in set function handler. |

## IdentityBasedPolicy Class

Attach managed and inline policies to identities (users, groups to which users belong, or roles). Identity-based policies grant permissions to an identity.

```js
const { IdentityBasedPolicy } = require("iam-policies")

const identityBasedPolicy = new IdentityBasedPolicy({
  statements,
  conditionResolver
})
```

### Properties

| Name                                                             | Type                                                                  | Default   | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ---------------------------------------------------------------- | --------------------------------------------------------------------- | --------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `statements`                                                     | object[]                                                              | undefined | `true`   | The **_statements_** element is the main element for a policy. The statements element can contain an array of individual statements.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `statements[]`<br/>`.sid`                                        | string                                                                | _uuid_    | `false`  | The **_sid_** element should be a unique identifier.<br/> It is automatically generated with a uuid in case it is undefined.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `statements[]`<br/>`.effect`                                     | string                                                                | allow     | `false`  | The **_effect_** element specifies whether the statement results in an allow or an explicit deny.<br/> Valid values for Effect are `allow` and `deny`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `statements[]`<br/>`.action`                                     | string or string[]                                                    | undefined | `false`  | The **_action_** element describes the specific action or actions that will be allowed or denied.<br/> Statements must include either an `action` or `notAction` element.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `statements[]`<br/>`.notAction`                                  | string or string[]                                                    | undefined | `false`  | The **_notAction_** element is an advanced policy element that explicitly matches everything except the specified list of actions.<br/> Statements must include either an `action` or `notAction` element.<br/> Using `notAction` can result in a shorter policy by listing only a few actions that should not match, rather than including a long list of actions that will match.<br/> When using `notAction`, you should keep in mind that actions specified in this element are the only actions in that are limited.<br/> This, in turn, means that all of the applicable actions or services that are not listed are allowed if you use the Allow effect.<br/> In addition, such unlisted actions or services are denied if you use the `deny` effect.<br/> When you use `notAction` with the `resource` element, you provide scope for the policy. |
| `statements[]`<br/>`.resource`                                   | string or string[]                                                    | undefined | `true`   | The **_resource_** element specifies the object or objects that the statement covers.<br/> Each statement must include either a `resource` or a `notResource` element.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `statements[]`<br/>`.notResource`                                | string or string[]                                                    | undefined | `true`   | The **_notResource_** element is an advanced policy element that explicitly matches every resource except those specified.<br/> Each statement must include either an `resource` or `notResource` element.<br/> Using `notResource` can result in a shorter policy by listing only a few resources that should not match, rather than including a long list of resources that will match.                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `statements[]`<br/>`.condition`                                  | object                                                                | undefined | `false`  | The **_condition_** element (or Condition block) lets you specify conditions for when a policy is in effect.<br/> In the `condition` element, you build expressions in which you use condition operators (equal, less than, etc.) to match the condition keys and values in the policy against keys and values in the request context.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `statements[]`<br/>`.condition["conditionType"]`                 | object                                                                | undefined | `false`  | The **_conditionType_** name should be replaced with a custom string attribute for a specific condition that should be match with one conditionResolver element.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `statements[]`<br/>`.condition["conditionType"]["conditionKey"]` | (string or number or boolean) or<br/> (string or number or boolean)[] | undefined | `false`  | The **_conditionKey_** should be a custom string path attribute for a specific context attribute.<br/> Note: attributes must be separated but dots (`.`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `conditionResolver`                                              | object                                                                | undefined | `false`  | The **_conditionResolver_** should contain a function in each attribute to resolve an specific embedded condition in our statements.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `conditionResolver["conditionKey"]`                              | function                                                              | undefined | `false`  | The **_conditionKey_** should match with a function name that will be used as a resolver in condition evaluation.<br/> There are 2 parameters for this function: **data** (first parameter) that will be evaluated with **expected** (second parameter), returning a **true** or **false**.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `context`                                                        | object                                                                | undefined | `false`  | The **_context_** has those properties that will be embedded in our statements.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |

### Methods

#### identityBasedPolicy.getStatements()

_public_: Returns `statements[]` (statements array).

#### identityBasedPolicy.getContext()

_public_: Returns `context` object.

#### identityBasedPolicy.setContext(context)

_public_: Sets `context` object.

#### identityBasedPolicy.getConditionResolver()

_public_: Returns `conditionResolver` object.

#### identityBasedPolicy.setConditionResolver(conditionResolver)

_public_: Sets `conditionResolver` object.

#### identityBasedPolicy.evaluate({action, resource, context})

_public_: Verify if action for specific resource is allowed (`true`) or denied (`false`).

##### Params

| Name       | Type   | Default   | Required | Description                                                             |
| ---------- | ------ | --------- | -------- | ----------------------------------------------------------------------- |
| `action`   | string | undefined | `true`   | It represents the action you are asking.                                |
| `resource` | string | undefined | `true`   | It represents the resource for the action you are asking.               |
| `context`  | object | undefined | `false`  | It represents the properties that will be embedded into your resources. |

#### identityBasedPolicy.can({action, resource, context})

_public_: Verify if action for specific resource is allowed (`true`) or not present (`false`).

##### Params

| Name       | Type   | Default   | Required | Description                                                             |
| ---------- | ------ | --------- | -------- | ----------------------------------------------------------------------- |
| `action`   | string | undefined | `true`   | It represents the action you are asking.                                |
| `resource` | string | undefined | `true`   | It represents the resource for the action you are asking.               |
| `context`  | object | undefined | `false`  | It represents the properties that will be embedded into your resources. |

#### identityBasedPolicy.cannot({action, resource, context})

_public_: Verify if action for specific resource is denied (`true`) or not present (`false`).

##### Params

| Name       | Type   | Default   | Required | Description                                                             |
| ---------- | ------ | --------- | -------- | ----------------------------------------------------------------------- |
| `action`   | string | undefined | `true`   | It represents the action you are asking.                                |
| `resource` | string | undefined | `true`   | It represents the resource for the action you are asking.               |
| `context`  | object | undefined | `false`  | It represents the properties that will be embedded into your resources. |

## ResourceBasedPolicy Class

Attach inline policies to resources. Resource-based policies grant permissions to the principal that is specified in the policy.

```js
const { ResourceBasedPolicy } = require("iam-policies")

const resourceBasedPolicy = new ResourceBasedPolicy({
  statements,
  conditionResolver,
  context
})
```

### Properties

| Name                                                             | Type                                                                  | Default   | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---------------------------------------------------------------- | --------------------------------------------------------------------- | --------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `statements`                                                     | object[]                                                              | undefined | `true`   | The **_statements_** element is the main element for a policy.<br/> The statements element can contain an array of individual statements.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `statements[]`<br/>`.sid`                                        | string                                                                | _uuid_    | `false`  | The **_sid_** element should be a unique identifier.<br/> It is automatically generated with a uuid in case it is undefined.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `statements[]`<br/>`.effect`                                     | string                                                                | allow     | `false`  | The **_effect_** element specifies whether the statement results in an allow or an explicit deny.<br/> Valid values for Effect are `allow` and `deny`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `statements[]`<br/>`.principal`                                  | string or string[]                                                    | undefined | `false`  | The **_principal_** element in a policy to specify the principal that is allowed or denied access to a resource.<br/> Each statement could include either an `principal` or `notPrincipal`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `statements[]`<br/>`.notPrincipal`                               | string or string[]                                                    | undefined | `false`  | The **_notPrincipal_** element specifies the principal that is not allowed or denied access to a resource.<br/> The `notPrincipal` element enables you to specify an exception to a list of principals.<br/> Use this element to deny access to all principals except the one named in the `notPrincipal` element.<br/> Each statement could include either an `principal` or `notPrincipal` element.                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `statements[]`<br/>`.action`                                     | string or string[]                                                    | undefined | `false`  | The **_action_** element describes the specific action or actions that will be allowed or denied.<br/> Each statement must include either an `action` or `notAction` element.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `statements[]`<br/>`.notAction`                                  | string or string[]                                                    | undefined | `false`  | The **_notAction_** element is an advanced policy element that explicitly matches everything except the specified list of actions.<br/> Each statement must include either an `action` or `notAction` element.<br/> Using `notAction` can result in a shorter policy by listing only a few actions that should not match, rather than including a long list of actions that will match.<br/> When using `notAction`, you should keep in mind that actions specified in this element are the only actions in that are limited.<br/> This, in turn, means that all of the applicable actions or services that are not listed are allowed if you use the Allow effect.<br/> In addition, such unlisted actions or services are denied if you use the `deny` effect.<br/> When you use `notAction` with the `resource` element, you provide scope for the policy. |
| `statements[]`<br/>`.resource`                                   | string or string[]                                                    | undefined | `true`   | The **_resource_** element specifies the object or objects that the statement covers.<br/> Each statement could include either a `resource` or a `notResource` element.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `statements[]`<br/>`.notResource`                                | string or string[]                                                    | undefined | `true`   | The **_notResource_** element is an advanced policy element that explicitly matches every resource except those specified.<br/> Each statement could include either an `resource` or `notResource` element.<br/> Using `notResource` can result in a shorter policy by listing only a few resources that should not match, rather than including a long list of resources that will match.                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `statements[]`<br/>`.condition`                                  | object                                                                | undefined | `false`  | The **_condition_** element (or Condition block) lets you specify conditions for when a policy is in effect.<br/> In the `condition` element, you build expressions in which you use condition operators (equal, less than, etc.) to match the condition keys and values in the policy against keys and values in the request context.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `statements[]`<br/>`.condition["conditionType"]`                 | object                                                                | undefined | `false`  | The **_conditionType_** name should be replaced with a custom string attribute for a specific condition that should be match with one conditionResolver element.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `statements[]`<br/>`.condition["conditionType"]["conditionKey"]` | (string or number or boolean) or<br/> (string or number or boolean)[] | undefined | `false`  | The **_conditionKey_** should be a custom string path attribute for a specific context attribute.<br/> Note: attributes must be separated but dots (`.`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `conditionResolver`                                              | object                                                                | undefined | `false`  | The **_conditionResolver_** should contain a function in each attribute to resolve an specific embedded condition in our statements.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `conditionResolver["conditionKey"]`                              | function                                                              | undefined | `false`  | The **_conditionKey_** should match with a function name that will be used as a resolver in condition evaluation.<br/> There are 2 parameters for this function: **data** (first parameter) that will be evaluated with **expected** (second parameter), returning a **true** or **false**.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `context`                                                        | object                                                                | undefined | `false`  | The **_context_** has those properties that will be embedded in our statements.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |

### Methods

#### resourceBasedPolicy.getStatements()

_public_: Returns `statements[]` (statements array).

#### resourceBasedPolicy.getContext()

_public_: Returns `context` object.

#### resourceBasedPolicy.setContext(context)

_public_: Sets `context` object.

#### resourceBasedPolicy.getConditionResolver()

_public_: Returns `conditionResolver` object.

#### resourceBasedPolicy.setConditionResolver(conditionResolver)

_public_: Sets `conditionResolver` object.

#### resourceBasedPolicy.evaluate({principal, action, resource, context, principalType})

_public_: Verify if action for specific resource is allowed (`true`) or denied (`false`).

##### Params

| Name            | Type   | Default   | Required | Description                                                                                                  |
| --------------- | ------ | --------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| `principal`     | string | undefined | `false`  | It represents the principal you are asking.                                                                  |
| `action`        | string | undefined | `true`   | It represents the action you are asking.                                                                     |
| `resource`      | string | undefined | `false`  | It represents the resource for the action you are asking.                                                    |
| `context`       | object | undefined | `false`  | It represents the properties that will be embedded into your resources.                                      |
| `principalType` | string | undefined | `false`  | It represents the principalType (principal attribute if the statement have principal object) you are asking. |

#### resourceBasedPolicy.can({principal, action, resource, context, principalType})

_public_: Verify if action for specific resource is allowed (`true`) or not present (`false`).

##### Params

| Name            | Type   | Default   | Required | Description                                                                                                  |
| --------------- | ------ | --------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| `principal`     | string | undefined | `false`  | It represents the principal you are asking.                                                                  |
| `action`        | string | undefined | `true`   | It represents the action you are asking.                                                                     |
| `resource`      | string | undefined | `false`  | It represents the resource for the action you are asking.                                                    |
| `context`       | object | undefined | `false`  | It represents the properties that will be embedded into your resources.                                      |
| `principalType` | string | undefined | `false`  | It represents the principalType (principal attribute if the statement have principal object) you are asking. |

#### resourceBasedPolicy.cannot({principal, action, resource, context, principalType})

_public_: Verify if action for specific resource is denied (`true`) or not present (`false`).

##### Params

| Name            | Type   | Default   | Required | Description                                                                                                  |
| --------------- | ------ | --------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| `principal`     | string | undefined | `false`  | It represents the principal you are asking.                                                                  |
| `action`        | string | undefined | `true`   | It represents the action you are asking.                                                                     |
| `resource`      | string | undefined | `false`  | It represents the resource for the action you are asking.                                                    |
| `context`       | object | undefined | `false`  | It represents the properties that will be embedded into your resources.                                      |
| `principalType` | string | undefined | `false`  | It represents the principalType (principal attribute if the statement have principal object) you are asking. |

## getValueFromPath(data, path) Function

Get object value from path.

```js
const { getValueFromPath } = require("iam-policies")

const value = getValueFromPath(data, path, defaultValue)
```

### Params

| Name           | Type            | Default   | Required | Description                                                                  |
| -------------- | --------------- | --------- | -------- | ---------------------------------------------------------------------------- |
| `data`         | object          | undefined | `true`   | It is our context.                                                           |
| `path`         | Array or string | undefined | `true`   | It is the value path from data.<br/> Separate attribute names by dots (`.`). |
| `defaultValue` | any             | undefined | `false`  | It is the value returned for `undefined` resolved values.                    |

## applyContext(str, context) Function

Get string with context value embedded into it.

```js
const { applyContext } = require("iam-policies")

const embeddedStr = applyContext(str, context)
```

### Params

| Name      | Type   | Default   | Required | Description                                                     |
| --------- | ------ | --------- | -------- | --------------------------------------------------------------- |
| `str`     | string | undefined | `true`   | It could contain embedded path values into it by using (`${}`). |
| `context` | object | undefined | `false`  | It represents the context that should be embedded into `str`.   |

## License

MIT © [roggervalf](https://github.com/roggervalf)
