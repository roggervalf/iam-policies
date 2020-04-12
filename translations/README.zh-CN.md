# iam-policies

>

[![NPM](https://img.shields.io/npm/v/iam-policies.svg)](https://www.npmjs.com/package/iam-policies) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## 介绍

自定义 IAM 政策来提供对资源访问的控制，并且可以设置可选的上下文几条件

拒绝政策高于认许政策

基于 [@ddt/iam](https://www.npmjs.com/package/@ddt/iam) 和 [AWS Reference Policies ](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies.html).

## 安装

```bash
npm install --save iam-policies
```

或者

```bash
yarn add iam-policies
```

## 功能

提供以下功能:

- 创建政策 ([IdentityBasedPolicy and ResourceBasedPolicy](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html#access_policy-types))
- 权限验证

## 使用

### 例子

首先需要得到政策类:

```js
const { IdentityBasedPolicy, ResourceBasedPolicy } = require('iam-policies');
```

#### 设置允许属性

```js
const allowExample = new IdentityBasedPolicy([
  {
    effect: 'allow', // 可选的， 默认值'allow'
    resource: ['secrets:${user.id}:*'], // 嵌入值
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
  resource: 'secrets:456:ultrasecret',
  context: contextForAllowExample
}); // true
allowExample.evaluate({
  action: 'create',
  resource: 'secrets:456:ultrasecret',
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

#### 设置拒绝属性

```js
const denyExample = new IdentityBasedPolicy([
  {
    resource: ['secrets:${user.bestfriends}:*'],
    action: 'read'
  },
  {
    effect: 'deny',
    resource: 'secrets:123:*',
    action: 'read'
  }
]);

const contextForDenyExample = { user: { bestfriends: [123, 563, 1211] } };

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

#### 排除的行为属性

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

#### 排除的资源属性

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

#### 允许一切

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

#### 条件属性

```js
const conditions = {
  greatherThan: function(data, expected) {
    return data > expected;
  }
};

const conditionExample = new IdentityBasedPolicy(
  [
    {
      resource: 'secrets:*',
      action: ['read', 'write'],
      condition: {
        greatherThan: {
          'user.age': 18
        }
      }
    }
  ],
  conditions
);

conditionExample.evaluate({
  action: 'read',
  resource: 'secrets:sshhh',
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

#### 主要的属性

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

#### 非主要属性

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

#### 使用 `can` 和 `cannot`

```js
const canAndCannotStatements = [
  {
    effect: 'allow', // 可选的， 默认值'allow
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
// 到这里， 我们还不确定参数是被拒绝还是不存在

inclusivePolicy.can(canAndCannotDeniedArgument); // true
// 是一个存在的允许政策， 所以应该是被拒绝了， 是吧？

inclusivePolicy.cannot(canAndCannotDeniedArgument); // true
// 事实证明， 我是对的。

const canAndCannotNotPresentArgument = {
  action: 'read',
  resource: 'website:123:456:}city/lima',
  context: contextCanAndCannot
};

inclusivePolicy.evaluate(canAndCannotNotPresentArgument); // false
// 在这里用户没有访问权限， 但是为什么呐， 我们看看

inclusivePolicy.can(canAndCannotNotPresentArgument); // false
// 这不是一个存在的允许政策， 但是是被拒绝了吗？

inclusivePolicy.cannot(canAndCannotNotPresentArgument); // false
// 不是的， 它不在那。
```

## IdentityBasedPolicy 类

附加托管和内联政策到个体资源(用户，群， 或者规则)。 基于个体的政策授予权限给个体。

```js
const { IdentityBasedPolicy } = require('iam-policies');

const identityBasedPolicy = new IdentityBasedPolicy(
  Statement,
  conditionResolver
);
```

### Properties

| 名字                                                     | 类型                                                             | 默认值    | 必须的  | 描述                                                                                                                                                                                                                                                                                                                                                                                   |
| -------------------------------------------------------- | ---------------------------------------------------------------- | --------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Statement`                                              | object[]                                                         | undefined | `true`  | **_Statement_** 是政策对象中主要的元素，Statement 元素可以包含单个 statement 或者是包含一组 statement.                                                                                                                                                                                                                                                                                 |
| `Statement[].effect`                                     | string                                                           | allow     | `false` | **_effect_** 元素指明是被允许还是拒绝。 有效的值是 `allow` 和 `deny`.                                                                                                                                                                                                                                                                                                                  |
| `Statement[].action`                                     | string or string[]                                               | undefined | `false` | **_action_**元素描述行为， Statements 中必须包含`action` 或者 `notAction` 元素.                                                                                                                                                                                                                                                                                                        |
| `Statement[].notAction`                                  | string or string[]                                               | undefined | `false` | **_notAction_** 元素是一个高级的政策元素， 它使得 statement 取匹配所有除了列出的所有行为。Statements 必须包含`action` 或者 `notAction` 元素. 通过使用 `notAction`，可以只列出少量的需要匹配的行为, 而不需要列出一个超长的列表。 当使用 `notAction` 的时候, 你需要注意，如果指明允许， 那么所有行为没有在这个元素中列出的将被允许，如果指明拒绝，那么所有不在这个属性里的行为将被拒绝。 |
| `Statement[].resource`                                   | string or string[]                                               | undefined | `true`  | **_resource_** 元素指明 statement 包含的对象。Statements 必须包含 `resource` 或者 `notResource` 元素.                                                                                                                                                                                                                                                                                  |
| `Statement[].notResource`                                | string or string[]                                               | undefined | `true`  | **_notResource_** 元素是一个高级政策元素， 它将匹配除了列表指定的所有的资源。Statements 必须包含 `resource` 或 `notResource` 元素。 通过使用 `notResource` 你可以制定相对短的不匹配资源列表。                                                                                                                                                                                          |
| `Statement[].condition`                                  | object                                                           | undefined | `false` | **_condition_** 元素 (或者条件块) 可以让你指定当政策生效时候的条件。 在`condition` 元素里边, 你可以通过条件运算符来创建表达式(equal, less than...) 来匹配在政策中的 keys，values 和在请求中的 keys， values.                                                                                                                                                                           |
| `Statement[].condition["conditionType"]`                 | object                                                           | undefined | `false` | 对于特定条件的 conditionResolver 元素， **_conditionType_** 应该被替换成一个自定义的字符串                                                                                                                                                                                                                                                                                             |
| `Statement[].condition["conditionType"]["conditionKey"]` | (string or number or boolean) or (string or number or boolean)[] | undefined | `false` | 对于自定义的 context，**_conditionKey_** 应该是一个自定义的字符串路径。 备注： 属性必须以`.`分隔。                                                                                                                                                                                                                                                                                     |

### 方法

#### identityBasedPolicy.evaluate({action, resource, context})

_public_: 验证针对特定资源的行为是被允许 (`true`) 还是拒绝 (`false`).

##### Params

| 名字       | 类型   | 默认值    | 必须的  | 描述                   |
| ---------- | ------ | --------- | ------- | ---------------------- |
| `action`   | string | undefined | `true`  | 描述行为。             |
| `resource` | string | undefined | `true`  | 描述资源。             |
| `context`  | object | undefined | `false` | 描述资源中嵌入的属性。 |

#### identityBasedPolicy.can({action, resource, context})

_public_: 验证针对特定资源的行为是被允许 (`true`) 还是拒绝 (`false`).

##### Params

| 名字       | 类型   | 默认值    | 必须的  | 描述                   |
| ---------- | ------ | --------- | ------- | ---------------------- |
| `action`   | string | undefined | `true`  | 描述行为。             |
| `resource` | string | undefined | `true`  | 描述资源。             |
| `context`  | object | undefined | `false` | 描述资源中嵌入的属性。 |

#### identityBasedPolicy.cannot({action, resource, context})

_public_: 验证针对特定资源的行为是被拒绝 (`true`) 还是不存在 (`false`)。

##### 参数

| 名字       | 类型   | 默认值    | 必须的  | 描述                   |
| ---------- | ------ | --------- | ------- | ---------------------- |
| `action`   | string | undefined | `true`  | 描述行为。             |
| `resource` | string | undefined | `true`  | 描述资源。             |
| `context`  | object | undefined | `false` | 描述资源中嵌入的属性。 |

## ResourceBasedPolicy 类

附加内联政策到个体资源。 Resource-based 政策授权给 principal.

```js
const { ResourceBasedPolicy } = require('iam-policies');

const resourceBasedPolicy = new ResourceBasedPolicy(
  Statement,
  conditionResolver
);
```

### 属性

| 名字                                                     | 类型                                                             | 默认值    | 必须的  | 描述                                                                                                                                                                                                                                                                                                                                                                                   |
| -------------------------------------------------------- | ---------------------------------------------------------------- | --------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Statement`                                              | object[]                                                         | undefined | `true`  | **_Statement_** 是政策对象中主要的元素，Statement 元素可以包含单个 statement 或者是包含一组 statement.                                                                                                                                                                                                                                                                                 |
| `Statement[].effect`                                     | string                                                           | allow     | `false` | **_effect_** 元素指明是被允许还是拒绝。 有效的值是 `allow` 和 `deny`.                                                                                                                                                                                                                                                                                                                  |
| `Statement[].principal`                                  | string or string[]                                               | undefined | `false` | **_principal_**元素描述针对资源是允许或是拒绝行为， Statements 中必须包含`principal` 或者 `notPrincipal` 元素.                                                                                                                                                                                                                                                                         |
| `Statement[].notPrincipal`                               | string or string[]                                               | undefined | `false` | **_notPrincipal_** 元素指定 principal 不被允许或拒绝访问. `notPrincipal` 元素可以让你指定例外。使用这个元素， 可以拒绝所有 principal, 除了指定在`notPrincipal` 元素里边的.                                                                                                                                                                                                             |
| `Statement[].action`                                     | string or string[]                                               | undefined | `false` | **_action_**元素描述行为， Statements 中必须包含`action` 或者 `notAction` 元素.                                                                                                                                                                                                                                                                                                        |
| `Statement[].notAction`                                  | string or string[]                                               | undefined | `false` | **_notAction_** 元素是一个高级的政策元素， 它使得 statement 取匹配所有除了列出的所有行为。Statements 必须包含`action` 或者 `notAction` 元素. 通过使用 `notAction`，可以只列出少量的需要匹配的行为, 而不需要列出一个超长的列表。 当使用 `notAction` 的时候, 你需要注意，如果指明允许， 那么所有行为没有在这个元素中列出的将被允许，如果指明拒绝，那么所有不在这个属性里的行为将被拒绝。 |
| `Statement[].resource`                                   | string or string[]                                               | undefined | `true`  | **_resource_** 元素指明 statement 包含的对象。Statements 必须包含 `resource` 或者 `notResource` 元素.                                                                                                                                                                                                                                                                                  |
| `Statement[].notResource`                                | string or string[]                                               | undefined | `true`  | **_notResource_** 元素是一个高级政策元素， 它将匹配除了列表指定的所有的资源。Statements 必须包含 `resource` 或 `notResource` 元素。 通过使用 `notResource` 你可以制定相对短的不匹配资源列表。                                                                                                                                                                                          |
| `Statement[].condition`                                  | object                                                           | undefined | `false` | **_condition_** 元素 (或者条件块) 可以让你指定当政策生效时候的条件。 在`condition` 元素里边, 你可以通过条件运算符来创建表达式(equal, less than...) 来匹配在政策中的 keys，values 和在请求中的 keys， values.                                                                                                                                                                           |
| `Statement[].condition["conditionType"]`                 | object                                                           | undefined | `false` | 对于特定条件的 conditionResolver 元素， **_conditionType_** 应该被替换成一个自定义的字符串                                                                                                                                                                                                                                                                                             |
| `Statement[].condition["conditionType"]["conditionKey"]` | (string or number or boolean) or (string or number or boolean)[] | undefined | `false` | 对于自定义的 context，**_conditionKey_** 应该是一个自定义的字符串路径。 备注： 属性必须以`.`分隔。                                                                                                                                                                                                                                                                                     |

### 方法

#### resourceBasedPolicy.evaluate({principal, action, resource, context, principalType})

_public_: 验证针对特定资源的行为是被允许 (`true`) 还是拒绝 (`false`).

##### 参数

| 名字            | 类型   | 默认值    | 必须的  | 描述                                                                          |
| --------------- | ------ | --------- | ------- | ----------------------------------------------------------------------------- |
| `principal`     | string | undefined | `true`  | 描述 principal。                                                              |
| `action`        | string | undefined | `true`  | 描述行为。                                                                    |
| `resource`      | string | undefined | `true`  | 描述资源。                                                                    |
| `context`       | object | undefined | `false` | 描述资源中嵌入的属性。                                                        |
| `principalType` | string | undefined | `true`  | 描述 principal 类型 (principal 的属性， 如果 statement 包含 principal 对象)。 |

#### resourceBasedPolicy.can({principal, action, resource, context, principalType})

_public_: 验证针对特定资源的行为是被允许 (`true`) 还是不存在 (`false`)。

##### 参数

| 名字            | 类型   | 默认值    | 必须的  | 描述                                                                          |
| --------------- | ------ | --------- | ------- | ----------------------------------------------------------------------------- |
| `principal`     | string | undefined | `true`  | 描述 principal。                                                              |
| `action`        | string | undefined | `true`  | 描述行为。                                                                    |
| `resource`      | string | undefined | `true`  | 描述资源。                                                                    |
| `context`       | object | undefined | `false` | 描述资源中嵌入的属性。                                                        |
| `principalType` | string | undefined | `true`  | 描述 principal 类型 (principal 的属性， 如果 statement 包含 principal 对象)。 |

#### resourceBasedPolicy.cannot({principal, action, resource, context, principalType})

_public_: 验证针对特定资源的行为是被拒绝 (`true`) 还是不存在 (`false`)。

##### 参数

| 名字            | 类型   | 默认值    | 必须的  | 描述                                                                          |
| --------------- | ------ | --------- | ------- | ----------------------------------------------------------------------------- |
| `principal`     | string | undefined | `true`  | 描述 principal。                                                              |
| `action`        | string | undefined | `true`  | 描述行为。                                                                    |
| `resource`      | string | undefined | `true`  | 描述资源。                                                                    |
| `context`       | object | undefined | `false` | 描述资源中嵌入的属性。                                                        |
| `principalType` | string | undefined | `true`  | 描述 principal 类型 (principal 的属性， 如果 statement 包含 principal 对象)。 |

## getValueFromPath(data, path) Function

通过路径获取对象。

```js
const { getValueFromPath } = require('iam-policies');

const value = getValueFromPath(data, path);
```

### 参数

| 名字   | 类型   | 默认值    | 必须的 | 描述                              |
| ------ | ------ | --------- | ------ | --------------------------------- |
| `data` | object | undefined | `true` | 上下文。                          |
| `path` | string | undefined | `true` | 数据中的路径。属性名通过`.`分隔。 |

## applyContext(str, context) Function

获取嵌入到上下文的字符串

```js
const { applyContext } = require('iam-policies');

const embeddedStr = applyContext(str, context);
```

### 参数

| 名字      | 类型   | 默认值    | 必须的  | 描述                                     |
| --------- | ------ | --------- | ------- | ---------------------------------------- |
| `str`     | string | undefined | `true`  | 它可能包含嵌入的路径， 通过使用 (`${}`). |
| `context` | object | undefined | `false` | 指定上下文， 它应该被嵌入到 `str` 里边.  |

## License

MIT © [roggervalf](https://github.com/roggervalf)
