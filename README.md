# iam-policies

>

[![NPM](https://img.shields.io/npm/v/iam-policies.svg)](https://www.npmjs.com/package/iam-policies) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

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

```js
// @deno-types="https://raw.githubusercontent.com/roggervalf/iam-policies/master/dist/main.d.ts"
import {
  IdentityBasedPolicy,
  ResourceBasedPolicy
} from 'https://raw.githubusercontent.com/roggervalf/iam-policies/master/dist/main.es.js';
```

## Features

Supports these glob features:

- Policies creation ([IdentityBasedPolicy and ResourceBasedPolicy](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html#access_policy-types))
- Permission verifications
- Translations: [Chinese docs](./translations/README.zh-CN.md) by [@mickymao1110](https://github.com/mickymao1110)

## Usage

### Examples

First, we should get our policies classes:

```js
const { IdentityBasedPolicy, ResourceBasedPolicy } = require('iam-policies');
```

#### Effect property allow

```js
const allowExample = new IdentityBasedPolicy([
  {
    effect: 'allow', // optional, defaults to allow
    resource: ['secrets:${user.id}:*'], // embedded value by context
    action: ['read', 'write']
  },
  {
    resource: ['bd:company:*'],
    action: 'create'
  }
]);

const contextForAllowExample = { user: { id: 456 } };

allowExample.evaluate({
  action: 'read',
  resource: 'secrets:456:ultraSecret',
  context: contextForAllowExample
}); // true
allowExample.evaluate({
  action: 'create',
  resource: 'secrets:456:ultraSecret',
  context: contextForAllowExample
}); // false
allowExample.evaluate({
  action: 'create',
  resource: 'bd:company:account',
  context: contextForAllowExample
}); // true
allowExample.evaluate({
  action: 'read',
  resource: 'bd:company:account',
  context: contextForAllowExample
}); // false
```

#### Effect property deny

```js
const denyExample = new IdentityBasedPolicy([
  {
    resource: ['secrets:${user.bestFriends}:*'],
    action: 'read'
  },
  {
    effect: 'deny',
    resource: 'secrets:123:*',
    action: 'read'
  }
]);

const contextForDenyExample = { user: { bestFriends: [123, 563, 1211] } };

denyExample.evaluate({
  action: 'read',
  resource: 'secrets:563:super-secret',
  context: contextForDenyExample
}); // true
denyExample.evaluate({
  action: 'read',
  resource: 'secrets:123:super-secret',
  context: contextForDenyExample
}); // false
```

#### Not Action property

```js
const notActionExample = new IdentityBasedPolicy([
  {
    resource: 'bd:company:*',
    notAction: 'update'
  }
]);

notActionExample.evaluate({
  action: 'delete',
  resource: 'bd:company:account'
}); // true
notActionExample.evaluate({
  action: 'update',
  resource: 'bd:company:account'
}); // false
```

#### Not Resource property

```js
const notResourceExample = new IdentityBasedPolicy([
  {
    notResource: ['bd:roles:*'],
    action: 'update'
  }
]);

notResourceExample.evaluate({
  action: 'update',
  resource: 'photos'
}); // true
notResourceExample.evaluate({
  action: 'update',
  resource: 'bd:roles:admin'
}); // false
```

#### Allow everything

```js
const adminExample = new IdentityBasedPolicy([
  {
    resource: '*',
    action: '*'
  }
]);

adminExample.evaluate({
  action: 'read',
  resource: 'someResource'
}); // true
adminExample.evaluate({
  action: 'write',
  resource: 'otherResource'
}); // true
```

#### Conditions property

```js
const conditions = {
  greaterThan: function(data, expected) {
    return data > expected;
  }
};

const conditionExample = new IdentityBasedPolicy(
  [
    {
      resource: 'secrets:*',
      action: ['read', 'write'],
      condition: {
        greaterThan: {
          'user.age': 18
        }
      }
    }
  ],
  conditions
);

conditionExample.evaluate({
  action: 'read',
  resource: 'secrets:code',
  context: { user: { age: 19 } }
}); // true
conditionExample.evaluate({
  action: 'read',
  resource: 'secrets:admin:super-secret',
  context: {
    user: { age: 18 }
  }
}); // false
```

#### Principal property

```js
const principalExample = new ResourceBasedPolicy([
  {
    principal: '1',
    effect: 'allow',
    resource: ['secrets:user:*'],
    action: ['read', 'write']
  },
  {
    principal: { id: '2' },
    resource: 'bd:company:*',
    notAction: 'update'
  }
]);

principalExample.evaluate({
  principal: '1',
  action: 'read',
  resource: 'secrets:user:name'
}); // true
principalExample.evaluate({
  principal: '2',
  action: 'read',
  resource: 'secrets:user:super-secret'
}); // false
principalExample.evaluate({
  principal: '2',
  action: 'read',
  resource: 'bd:company:name',
  principalType: 'id'
}); // true
principalExample.evaluate({
  principal: '2',
  action: 'update',
  resource: 'bd:company:name',
  principalType: 'id'
}); // false
```

#### Not Principal property

```js
const notPrincipalExample = new ResourceBasedPolicy([
  {
    notPrincipal: ['1', '2'],
    resource: ['secrets:bd:*'],
    action: 'read'
  },
  {
    notPrincipal: { id: '3' },
    resource: 'secrets:admin:*',
    action: 'read'
  }
]);

notPrincipalExample.evaluate({
  principal: '3',
  action: 'read',
  resource: 'secrets:bd:tables'
}); // true
notPrincipalExample.evaluate({
  principal: '1',
  action: 'read',
  resource: 'secrets:bd:tables'
}); // false
notPrincipalExample.evaluate({
  principal: '1',
  action: 'read',
  resource: 'secrets:admin:friends',
  principalType: 'id'
}); // true
notPrincipalExample.evaluate({
  principal: '3',
  action: 'read',
  resource: 'secrets:admin:friends',
  principalType: 'id'
}); // false
```

#### Using `can` and `cannot`

```js
const canAndCannotStatements = [
  {
    effect: 'allow', // again, this is optional, as it already defaults to allow
    resource: ['website:${division.companyId}:${division.countryId}:*/*'],
    action: ['create', 'update', 'delete']
  },
  {
    effect: 'deny',
    resource: ['website:${division.companyId}:${division.countryId}:city/lima'],
    action: 'delete'
  }
];

const inclusivePolicy = new IdentityBasedPolicy(canAndCannotStatements);

const contextCanAndCannot = {
  division: {
    companyId: 123,
    countryId: 456
  }
};

const canAndCannotDeniedArgument = {
  action: 'delete',
  resource: 'website:123:456:city/lima',
  context: contextCanAndCannot
};

inclusivePolicy.evaluate(canAndCannotDeniedArgument); // false
// So far, we are not sure whether the argument is denied or not present.

inclusivePolicy.can(canAndCannotDeniedArgument); // true
// It's present as an allow policy, so it must be explicitly denied, right?

inclusivePolicy.cannot(canAndCannotDeniedArgument); // true
// I knew it!

const canAndCannotNotPresentArgument = {
  action: 'read',
  resource: 'website:123:456:}city/lima',
  context: contextCanAndCannot
};

inclusivePolicy.evaluate(canAndCannotNotPresentArgument); // false
// Again, the user doesn't have access here, but why? Let's investigate..

inclusivePolicy.can(canAndCannotNotPresentArgument); // false
// It's not present as an allow policy, but is it explicitly denied?

inclusivePolicy.cannot(canAndCannotNotPresentArgument); // false
// Nope, it just isn't there.
```

## IdentityBasedPolicy Class

Attach managed and inline policies to identities (users, groups to which users belong, or roles). Identity-based policies grant permissions to an identity.

```js
const { IdentityBasedPolicy } = require('iam-policies');

const identityBasedPolicy = new IdentityBasedPolicy(
  Statement,
  conditionResolver
);
```

### Properties

| Name                                                     | Type                                                             | Default   | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| -------------------------------------------------------- | ---------------------------------------------------------------- | --------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Statement`                                              | object[]                                                         | undefined | `true`   | The **_Statement_** element is the main element for a policy. The Statement element can contain a single statement or an array of individual statements.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `Statement[].effect`                                     | string                                                           | allow     | `false`  | The **_effect_** element specifies whether the statement results in an allow or an explicit deny. Valid values for Effect are `allow` and `deny`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `Statement[].action`                                     | string or string[]                                               | undefined | `false`  | The **_action_** element describes the specific action or actions that will be allowed or denied. Statements must include either an `action` or `notAction` element.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `Statement[].notAction`                                  | string or string[]                                               | undefined | `false`  | The **_notAction_** element is an advanced policy element that explicitly matches everything except the specified list of actions. Statements must include either an `action` or `notAction` element. Using `notAction` can result in a shorter policy by listing only a few actions that should not match, rather than including a long list of actions that will match. When using `notAction`, you should keep in mind that actions specified in this element are the only actions in that are limited. This, in turn, means that all of the applicable actions or services that are not listed are allowed if you use the Allow effect. In addition, such unlisted actions or services are denied if you use the `deny` effect. When you use `notAction` with the `resource` element, you provide scope for the policy. |
| `Statement[].resource`                                   | string or string[]                                               | undefined | `true`   | The **_resource_** element specifies the object or objects that the statement covers. Statements must include either a `resource` or a `notResource` element.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `Statement[].notResource`                                | string or string[]                                               | undefined | `true`   | The **_notResource_** element is an advanced policy element that explicitly matches every resource except those specified. Statements must include either an `resource` or `notResource` element. Using `notResource` can result in a shorter policy by listing only a few resources that should not match, rather than including a long list of resources that will match.                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `Statement[].condition`                                  | object                                                           | undefined | `false`  | The **_condition_** element (or Condition block) lets you specify conditions for when a policy is in effect. In the `condition` element, you build expressions in which you use condition operators (equal, less than, etc.) to match the condition keys and values in the policy against keys and values in the request context.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `Statement[].condition["conditionType"]`                 | object                                                           | undefined | `false`  | The **_conditionType_** name should be replaced with a custom string attribute for a specific condition that should be match with one conditionResolver element.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `Statement[].condition["conditionType"]["conditionKey"]` | (string or number or boolean) or (string or number or boolean)[] | undefined | `false`  | The **_conditionKey_** should be a custom string path attribute for a specific context attribute. Note: attributes must be separated but dots (`.`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |

### Methods

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
const { ResourceBasedPolicy } = require('iam-policies');

const resourceBasedPolicy = new ResourceBasedPolicy(
  Statement,
  conditionResolver
);
```

### Properties

| Name                                                     | Type                                                             | Default   | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| -------------------------------------------------------- | ---------------------------------------------------------------- | --------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Statement`                                              | object[]                                                         | undefined | `true`   | The **_Statement_** element is the main element for a policy. The Statement element can contain a single statement or an array of individual statements.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `Statement[].effect`                                     | string                                                           | allow     | `false`  | The **_effect_** element specifies whether the statement results in an allow or an explicit deny. Valid values for Effect are `allow` and `deny`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `Statement[].principal`                                  | string or string[]                                               | undefined | `false`  | The **_principal_** element in a policy to specify the principal that is allowed or denied access to a resource. Statements must include either an `principal` or `notPrincipal` element.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `Statement[].notPrincipal`                               | string or string[]                                               | undefined | `false`  | The **_notPrincipal_** element specifies the principal that is not allowed or denied access to a resource. The `notPrincipal` element enables you to specify an exception to a list of principals. Use this element to deny access to all principals except the one named in the `notPrincipal` element. Statements must include either an `principal` or `notPrincipal` element.                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `Statement[].action`                                     | string or string[]                                               | undefined | `false`  | The **_action_** element describes the specific action or actions that will be allowed or denied. Statements must include either an `action` or `notAction` element.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `Statement[].notAction`                                  | string or string[]                                               | undefined | `false`  | The **_notAction_** element is an advanced policy element that explicitly matches everything except the specified list of actions. Statements must include either an `action` or `notAction` element. Using `notAction` can result in a shorter policy by listing only a few actions that should not match, rather than including a long list of actions that will match. When using `notAction`, you should keep in mind that actions specified in this element are the only actions in that are limited. This, in turn, means that all of the applicable actions or services that are not listed are allowed if you use the Allow effect. In addition, such unlisted actions or services are denied if you use the `deny` effect. When you use `notAction` with the `resource` element, you provide scope for the policy. |
| `Statement[].resource`                                   | string or string[]                                               | undefined | `true`   | The **_resource_** element specifies the object or objects that the statement covers. Statements could include either a `resource` or a `notResource` element.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `Statement[].notResource`                                | string or string[]                                               | undefined | `true`   | The **_notResource_** element is an advanced policy element that explicitly matches every resource except those specified. Statements could include either an `resource` or `notResource` element. Using `notResource` can result in a shorter policy by listing only a few resources that should not match, rather than including a long list of resources that will match.                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `Statement[].condition`                                  | object                                                           | undefined | `false`  | The **_condition_** element (or Condition block) lets you specify conditions for when a policy is in effect. In the `condition` element, you build expressions in which you use condition operators (equal, less than, etc.) to match the condition keys and values in the policy against keys and values in the request context.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `Statement[].condition["conditionType"]`                 | object                                                           | undefined | `false`  | The **_conditionType_** name should be replaced with a custom string attribute for a specific condition that should be match with one conditionResolver element.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `Statement[].condition["conditionType"]["conditionKey"]` | (string or number or boolean) or (string or number or boolean)[] | undefined | `false`  | The **_conditionKey_** should be a custom string path attribute for a specific context attribute. Note: attributes must be separated but dots (`.`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |

### Methods

#### resourceBasedPolicy.evaluate({principal, action, resource, context, principalType})

_public_: Verify if action for specific resource is allowed (`true`) or denied (`false`).

##### Params

| Name            | Type   | Default   | Required | Description                                                                                                  |
| --------------- | ------ | --------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| `principal`     | string | undefined | `true`   | It represents the principal you are asking.                                                                  |
| `action`        | string | undefined | `true`   | It represents the action you are asking.                                                                     |
| `resource`      | string | undefined | `true`   | It represents the resource for the action you are asking.                                                    |
| `context`       | object | undefined | `false`  | It represents the properties that will be embedded into your resources.                                      |
| `principalType` | string | undefined | `true`   | It represents the principalType (principal attribute if the statement have principal object) you are asking. |

#### resourceBasedPolicy.can({principal, action, resource, context, principalType})

_public_: Verify if action for specific resource is allowed (`true`) or not present (`false`).

##### Params

| Name            | Type   | Default   | Required | Description                                                                                                  |
| --------------- | ------ | --------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| `principal`     | string | undefined | `true`   | It represents the principal you are asking.                                                                  |
| `action`        | string | undefined | `true`   | It represents the action you are asking.                                                                     |
| `resource`      | string | undefined | `true`   | It represents the resource for the action you are asking.                                                    |
| `context`       | object | undefined | `false`  | It represents the properties that will be embedded into your resources.                                      |
| `principalType` | string | undefined | `true`   | It represents the principalType (principal attribute if the statement have principal object) you are asking. |

#### resourceBasedPolicy.cannot({principal, action, resource, context, principalType})

_public_: Verify if action for specific resource is denied (`true`) or not present (`false`).

##### Params

| Name            | Type   | Default   | Required | Description                                                                                                  |
| --------------- | ------ | --------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| `principal`     | string | undefined | `true`   | It represents the principal you are asking.                                                                  |
| `action`        | string | undefined | `true`   | It represents the action you are asking.                                                                     |
| `resource`      | string | undefined | `true`   | It represents the resource for the action you are asking.                                                    |
| `context`       | object | undefined | `false`  | It represents the properties that will be embedded into your resources.                                      |
| `principalType` | string | undefined | `true`   | It represents the principalType (principal attribute if the statement have principal object) you are asking. |

## getValueFromPath(data, path) Function

Get object value from path.

```js
const { getValueFromPath } = require('iam-policies');

const value = getValueFromPath(data, path, defaultValue);
```

### Params

| Name           | Type            | Default   | Required | Description                                                             |
| -------------- | --------------- | --------- | -------- | ----------------------------------------------------------------------- |
| `data`         | object          | undefined | `true`   | It is our context.                                                      |
| `path`         | Array or string | undefined | `true`   | It is the value path from data. Separate attribute names by dots (`.`). |
| `defaultValue` | any             | undefined | `false`  | It is the value returned for `undefined` resolved values.               |

## applyContext(str, context) Function

Get string with context value embedded into it.

```js
const { applyContext } = require('iam-policies');

const embeddedStr = applyContext(str, context);
```

### Params

| Name      | Type   | Default   | Required | Description                                                     |
| --------- | ------ | --------- | -------- | --------------------------------------------------------------- |
| `str`     | string | undefined | `true`   | It could contain embedded path values into it by using (`${}`). |
| `context` | object | undefined | `false`  | It represents the context that should be embedded into `str`.   |

## Contributing

Fork the repo, make some changes, submit a pull-request! Here is the [contributing](contributing.md) doc that has some details.

## License

MIT © [roggervalf](https://github.com/roggervalf)
