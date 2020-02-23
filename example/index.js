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
console.log(
  identityBasedPolicy.can({
    action: 'read',
    resource: 'secrets:563:sshhh',
    context,
  })
);
// false
console.log(
  identityBasedPolicy.can({
    action: 'read',
    resource: 'secrets:admin:super-secret',
    context,
  })
);
// true
console.log(
  identityBasedPolicy.can({
    action: 'delete',
    resource: 'bd:company:account',
    context,
  })
);
// true
console.log(
  identityBasedPolicy.can({
    action: 'create',
    resource: 'bd:company:account',
    context,
  })
);
// false
console.log(
  identityBasedPolicy.can({
    action: 'update',
    resource: 'bd:roles:here',
    context,
  })
);
// true
console.log(
  identityBasedPolicy.can({ action: 'update', resource: 'photos', context })
);

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
console.log(
  resourceBasedPolicy.can({
    principal: '1',
    action: 'read',
    resource: 'secrets:563:sshhh',
    context,
  })
);
// false
console.log(
  resourceBasedPolicy.can({
    principal: '1',
    action: 'read',
    resource: 'secrets:admin:super-secret',
    context,
  })
);
// false
console.log(
  resourceBasedPolicy.can({
    principal: '3',
    action: 'read',
    resource: 'secrets:admin:name',
    principalType: 'id',
    context,
  })
);
// true
console.log(
  resourceBasedPolicy.can({
    principal: '3',
    action: 'create',
    resource: 'bd:company:account',
    context,
  })
);
// false
console.log(
  resourceBasedPolicy.can({
    principal: '',
    action: 'update',
    resource: 'bd:roles:here',
    context,
  })
);
// false
console.log(
  resourceBasedPolicy.can({
    principal: '',
    action: 'update',
    resource: 'photos',
    context,
  })
);

const friendsWithAdminContext = { user: { id: 456, bestfriends: ['admin'] } };

// false
console.log(
  identityBasedPolicy.can(
    { action: 'read', resource: 'secrets:admin:super-secret' },
    friendsWithAdminContext
  )
);

const adminIdentityBasedPolicy = new IdentityBasedPolicy([
  {
    resource: '*',
    action: '*',
  },
]);

// true
console.log(
  adminIdentityBasedPolicy.can({ action: 'read', resource: 'someResource' })
);
// true
console.log(
  adminIdentityBasedPolicy.can({ action: 'write', resource: 'otherResource' })
);

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
console.log(
  identityBasedPolicyWithCondition.can({
    action: 'read',
    resource: 'secrets:sshhh',
    context: { user: { age: 19 } },
  })
);
// false
console.log(
  identityBasedPolicyWithCondition.can({
    action: 'read',
    resource: 'secrets:admin:super-secret',
    context: {
      user: { age: 18 },
    },
  })
);
