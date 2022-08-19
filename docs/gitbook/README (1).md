---
description: This is a basic guide.
---

# Quick Start

## Install

Install using npm:

```
$ npm install iam-policies
```

Install using yarn:

```
$ yarn add iam-policies
```

{% hint style="info" %}
Iam-policies is written in TypeScript, and although it can be used in vanilla JavaScript, all examples in this guide will be written in TypeScript.
{% endhint %}

Import into your project and add some policies:

```typescript
import { IdentityBasedPolicy } from 'iam-policies';

const allowExample = new IdentityBasedPolicy({
  statements: [
    {
      effect: 'allow',
      resource: ['secrets:${user.id}:*'],
      action: ['read', 'write']
    },
    {
      resource: ['bd:company:*'],
      action: 'create'
    }
  ]
});
```

{% hint style="danger" %}
You need to provide an array of statements per each policy instance.
{% endhint %}

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

Policies own an array of statements that contain rules to be evaluated later as the user requires:

```typescript
import { IdentityBasedPolicy } from 'iam-policies';

const identityExample = new IdentityBasedPolicy({
  statements: [
    {
      resource: 'bd:company:*',
      notAction: 'update'
    }
  ]
});

identityExample.evaluate({
  action: 'delete',
  resource: 'bd:company:account'
}); // true
identityExample.evaluate({
  action: 'update',
  resource: 'bd:company:account'
}); // false
```

You can evaluate all the statements or differentiate between what the instance allow or not:

```typescript
identityExample.can({
  action: 'delete',
  resource: 'bd:company:account'
}); // true
identityExample.cannot({
  action: 'update',
  resource: 'bd:company:account'
}); // true
```

{% hint style="info" %}
There are many other methods, check the [Guide](guide/policies.md) or the [API reference](https://github.com/roggervalf/iam-policies/blob/master/docs/gitbook/api/iam-policies.md) for more information.
{% endhint %}
