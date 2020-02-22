# iam-policies

>

[![NPM](https://img.shields.io/npm/v/iam-policies.svg)](https://www.npmjs.com/package/iam-policies) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## About

Define an allowed or denied set of actions against a set of resources with optional context and conditions.

Deny rules trump allow rules.

This is based of [@ddt/iam](https://www.npmjs.com/package/@ddt/iam) with new functionalities.

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
const { IdentityBasedPolicy, ResourceBasedPolicy } = require('iam-policies');

const identityBasedPolicy = new IdentityBasedPolicy([
  {
    effect: 'allow', // optional, defaults to allow
    resource: ['secrets:${user.id}:*'],
    action: ['read', 'write'],
  },
  {
    resource: ['secrets:${user.bestfriends}:*'],
    action: 'read',
  },
  {
    effect: 'deny',
    resource: 'secrets:admin:*',
    action: 'read',
  },
  {
    resource: 'bd:company:*',
    notAction: 'update',
  },
  {
    notResource: ['bd:roles:*'],
    action: 'update',
  },
]);

const context = { user: { id: 456, bestfriends: [123, 563, 1211] } };

// true
identityBasedPolicy.can({
  action: 'read',
  resource: 'secrets:563:sshhh',
  context,
});
// false
identityBasedPolicy.can({
  action: 'read',
  resource: 'secrets:admin:super-secret',
  context,
});
// true
identityBasedPolicy.can({
  action: 'delete',
  resource: 'bd:company:account',
  context,
});
// true
identityBasedPolicy.can({
  action: 'create',
  resource: 'bd:company:account',
  context,
});
// false
identityBasedPolicy.can({
  action: 'update',
  resource: 'bd:roles:here',
  context,
});
// true
identityBasedPolicy.can({ action: 'update', resource: 'photos', context })

const resourceBasedPolicy = new ResourceBasedPolicy([
  {
    principal: '1',
    effect: 'allow',
    resource: ['secrets:${user.id}:*'],
    action: ['read', 'write'],
  },
  {
    principal: ['1', '2'],
    resource: ['secrets:${user.bestfriends}:*'],
    action: 'read',
  },
  {
    notPrincipal: { id: '3' },
    effect: 'deny',
    resource: 'secrets:admin:*',
    action: 'read',
  },
  {
    principal: { id: '2' },
    resource: 'bd:company:*',
    notAction: 'update',
  },
  {
    principal: '3',
    notResource: ['bd:roles:*'],
    action: 'update',
  },
]);

// true
resourceBasedPolicy.can({
  principal: '1',
  action: 'read',
  resource: 'secrets:563:sshhh',
  context,
});
// false
resourceBasedPolicy.can({
  principal: '1',
  action: 'read',
  resource: 'secrets:admin:super-secret',
  context,
});
// false
resourceBasedPolicy.can({
  principal: '3',
  action: 'read',
  resource: 'secrets:admin:name',
  principalType: 'id',
  context,
});
// true
resourceBasedPolicy.can({
  principal: '3',
  action: 'create',
  resource: 'bd:company:account',
  context,
});
// false
resourceBasedPolicy.can({
  principal: '',
  action: 'update',
  resource: 'bd:roles:here',
  context,
});
// false
resourceBasedPolicy.can({
  principal: '',
  action: 'update',
  resource: 'photos',
  context,
});

const friendsWithAdminContext = { user: { id: 456, bestfriends: ['admin'] } };

// false
identityBasedPolicy.can(
  { action: 'read', resource: 'secrets:admin:super-secret' },
  friendsWithAdminContext
);

const adminIdentityBasedPolicy = new IdentityBasedPolicy([
  {
    resource: '*',
    action: '*',
  },
]);

// true
adminIdentityBasedPolicy.can({ action: 'read', resource: 'someResource' });
// true
adminIdentityBasedPolicy.can({ action: 'write', resource: 'otherResource' });

const conditions = {
  greatherThan: function(data, expected) {
    return data > expected;
  },
};

const identityBasedPolicyWithCondition = new IdentityBasedPolicy(
  [
    {
      effect: 'allow', // optional, defaults to allow
      resource: 'secrets:*',
      action: ['read', 'write'],
      condition: {
        greatherThan: {
          'user.age': 18,
        },
      },
    },
  ],
  conditions
);

// true
identityBasedPolicyWithCondition.can({
  action: 'read',
  resource: 'secrets:sshhh',
  context: { user: { age: 19 } },
});
// false
identityBasedPolicyWithCondition.can({
  action: 'read',
  resource: 'secrets:admin:super-secret',
  context: {
    user: { age: 18 },
  },
});
```

## Features

Supports these glob features:

* Policies creation
* Permission verifications

## IdentityBasedPolicy Class

Attach managed and inline policies to identities (users, groups to which users belong, or roles). Identity-based policies grant permissions to an identity.

```js
const { IdentityBasedPolicy } = require('iam-policies')

const identityBasedPolicy = new IdentityBasedPolicy(Statement,conditionResolver)
```

### Properties

Name | Type | Default | Required|Description
---- | ----- | ------- | ------ | -----------
`Statement` | object[] | undefined | `true` | The ***Statement*** element is the main element for a policy. The Statement element can contain a single statement or an array of individual statements.
`Statement[].effect` | string | allow | `false` | The ***effect*** element specifies whether the statement results in an allow or an explicit deny. Valid values for Effect are `allow` and `deny`.
`Statement[].action` | string or string[] | undefined | `false` | The ***action*** element describes the specific action or actions that will be allowed or denied. Statements must include either an `action` or `notAction` element.
`Statement[].notAction` | string or string[] | undefined | `false` | The ***notAction*** element is an advanced policy element that explicitly matches everything except the specified list of actions. Statements must include either an `action` or `notAction` element. Using `notAction` can result in a shorter policy by listing only a few actions that should not match, rather than including a long list of actions that will match. When using `notAction`, you should keep in mind that actions specified in this element are the only actions in that are limited. This, in turn, means that all of the applicable actions or services that are not listed are allowed if you use the Allow effect. In addition, such unlisted actions or services are denied if you use the `deny` effect. When you use `notAction` with the `resource` element, you provide scope for the policy.
`Statement[].resource` | string or string[] | undefined | `true` | The ***resource*** element specifies the object or objects that the statement covers. Statements must include either a `resource` or a `notResource` element.
`Statement[].notResource` | string or string[] | undefined | `true` | The ***notResource*** element is an advanced policy element that explicitly matches every resource except those specified. Statements must include either an `resource` or `notResource` element. Using `notResource` can result in a shorter policy by listing only a few resources that should not match, rather than including a long list of resources that will match.
`Statement[].condition` | object | undefined | `false` | The ***condition*** element (or Condition block) lets you specify conditions for when a policy is in effect. In the `condition` element, you build expressions in which you use condition operators (equal, less than, etc.) to match the condition keys and values in the policy against keys and values in the request context.
`Statement[].condition["conditionType"]` | object | undefined | `false` | The ***conditionType*** name should be replaced with a custom string attribute for a specific condition that should be match with one conditionResolver element.
`Statement[].condition["conditionType"]["conditionKey"]` | (string or number or boolean) or (string or number or boolean)[] | undefined | `false` | The ***conditionKey*** should be a custom string path attribute for a specific context attribute. Note: attributes must be separated but dots (`.`).

### Methods

#### identityBasedPolicy.can({action, resource, context})

*public*: Verify if action for specific resource is allowed (`true`) or denied (`false`).

##### Params

Name | Type | Default | Required|Description
---- | ----- | ------- | ------ | -----------
`action` | string | undefined | `true` | It represents the action you are asking.
`resource` | string | undefined | `true` | It represents the resource for the action you are asking.
`context` | object | undefined | `false` | It represents the properties that will be embedded into your resources.

## ResourceBasedPolicy Class

Attach inline policies to resources. Resource-based policies grant permissions to the principal that is specified in the policy.

```js
const { ResourceBasedPolicy } = require('iam-policies')

const resourceBasedPolicy = new IdentityBasedPolicy(Statement,conditionResolver)
```

### Properties

Name | Type | Default | Required|Description
---- | ----- | ------- | ------ | -----------
`Statement` | object[] | undefined | `true` | The ***Statement*** element is the main element for a policy. The Statement element can contain a single statement or an array of individual statements.
`Statement[].effect` | string | allow | `false` | The ***effect*** element specifies whether the statement results in an allow or an explicit deny. Valid values for Effect are `allow` and `deny`.
`Statement[].principal` | string or string[] | undefined | `false` | The ***principal*** element in a policy to specify the principal that is allowed or denied access to a resource. Statements must include either an `principal` or `notPrincipal` element.
`Statement[].notPrincipal` | string or string[] | undefined | `false` | The ***notPrincipal*** element specifies the principal that is not allowed or denied access to a resource. The `notPrincipal` element enables you to specify an exception to a list of principals. Use this element to deny access to all principals except the one named in the `notPrincipal` element. Statements must include either an `principal` or `notPrincipal` element.
`Statement[].action` | string or string[] | undefined | `false` | The ***action*** element describes the specific action or actions that will be allowed or denied. Statements must include either an `action` or `notAction` element.
`Statement[].notAction` | string or string[] | undefined | `false` | The ***notAction*** element is an advanced policy element that explicitly matches everything except the specified list of actions. Statements must include either an `action` or `notAction` element. Using `notAction` can result in a shorter policy by listing only a few actions that should not match, rather than including a long list of actions that will match. When using `notAction`, you should keep in mind that actions specified in this element are the only actions in that are limited. This, in turn, means that all of the applicable actions or services that are not listed are allowed if you use the Allow effect. In addition, such unlisted actions or services are denied if you use the `deny` effect. When you use `notAction` with the `resource` element, you provide scope for the policy.
`Statement[].resource` | string or string[] | undefined | `true` | The ***resource*** element specifies the object or objects that the statement covers. Statements could include either a `resource` or a `notResource` element.
`Statement[].notResource` | string or string[] | undefined | `true` | The ***notResource*** element is an advanced policy element that explicitly matches every resource except those specified. Statements could include either an `resource` or `notResource` element. Using `notResource` can result in a shorter policy by listing only a few resources that should not match, rather than including a long list of resources that will match.
`Statement[].condition` | object | undefined | `false` | The ***condition*** element (or Condition block) lets you specify conditions for when a policy is in effect. In the `condition` element, you build expressions in which you use condition operators (equal, less than, etc.) to match the condition keys and values in the policy against keys and values in the request context.
`Statement[].condition["conditionType"]` | object | undefined | `false` | The ***conditionType*** name should be replaced with a custom string attribute for a specific condition that should be match with one conditionResolver element.
`Statement[].condition["conditionType"]["conditionKey"]` | (string or number or boolean) or (string or number or boolean)[] | undefined | `false` | The ***conditionKey*** should be a custom string path attribute for a specific context attribute. Note: attributes must be separated but dots (`.`).

### Methods

#### resourceBasedPolicy.can({principal, action, resource, context, principalType})

*public*: Verify if action for specific resource is allowed (`true`) or denied (`false`).

##### Params

Name | Type | Default | Required|Description
---- | ----- | ------- | ------ | -----------
`principal` | string | undefined | `true` | It represents the principal you are asking.
`action` | string | undefined | `true` | It represents the action you are asking.
`resource` | string | undefined | `true` | It represents the resource for the action you are asking.
`context` | object | undefined | `false` | It represents the properties that will be embedded into your resources.
`principalType` | string | undefined | `true` | It represents the principalType (principal attribute if the statement have principal object) you are asking.

## getValueFromPath(data, path) Function

Get object value from path.

```js
const { getValueFromPath } = require('iam-policies')

const value = getValueFromPath(data, path)
```

### Params

Name | Type | Default | Required|Description
---- | ----- | ------- | ------ | -----------
`data` | object | undefined | `true` | It is our context.
`path` | string | undefined | `true` | It is the value path from data. Separate attribute names by dots (`.`).

## applyContext(str, context) Function

Get string with context value embedded into it.

```js
const { applyContext } = require('iam-policies')

const embeddedStr = applyContext(str, context)
```

### Params

Name | Type | Default | Required|Description
---- | ----- | ------- | ------ | -----------
`str` | string | undefined | `true` | It could contain embedded path values into it by using (`${}`).
`context` | object | undefined | `false` | It represents the context that should be embedded into `str`.

## License

MIT © [Rogger794](https://github.com/Rogger794)
