const { Role } = require('iam-policies');

const role = new Role([
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
]);

const context = { user: { id: 456, bestfriends: [123, 563, 1211] } };

// true
console.log(role.can('read', 'secrets:563:sshhh', context));
// false
console.log(role.can('read', 'secrets:admin:super-secret', context));

const friendsWithAdminContext = { user: { id: 456, bestfriends: ['admin'] } };

// false
console.log(
  role.can('read', 'secrets:admin:super-secret', friendsWithAdminContext)
);

const adminRole = new Role([
  {
    resource: '*',
    action: '*',
  },
]);

// true
console.log(adminRole.can('read', 'someResource'));
// true
console.log(adminRole.can('write', 'otherResource'));

const conditions = {
  greatherThan: function(data, expected) {
    return data > expected;
  },
};

const roleWithCondition = new Role(
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
  roleWithCondition.can('read', 'secrets:sshhh', { user: { age: 19 } })
);
// false
console.log(
  roleWithCondition.can('read', 'secrets:admin:super-secret', {
    user: { age: 18 },
  })
);
