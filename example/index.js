const { IdentityBasedPolicy, ResourceBasedPolicy } = require('iam-policies');

console.log('Allow Example');

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

// true
console.log(
  allowExample.evaluate({
    action: 'read',
    resource: 'secrets:456:ultrasecret',
    context: contextForAllowExample
  })
);
// false
console.log(
  allowExample.evaluate({
    action: 'create',
    resource: 'secrets:456:ultrasecret',
    context: contextForAllowExample
  })
);
// true
console.log(
  allowExample.evaluate({
    action: 'create',
    resource: 'bd:company:account',
    context: contextForAllowExample
  })
);
// false
console.log(
  allowExample.evaluate({
    action: 'read',
    resource: 'bd:company:account',
    context: contextForAllowExample
  })
);

console.log('Deny Example');

const denyExample = new IdentityBasedPolicy([
  {
    resource: ['secrets:${user.bestfriends}:*'],
    action: 'read'
  },
  {
    effect: 'deny',
    resource: 'secrets:123:*',
    action: 'read'
  },
  {
    resource: 'bd:company:*',
    notAction: 'update'
  },
  {
    notResource: ['bd:roles:*'],
    action: 'update'
  }
]);

const contextForDenyExample = { user: { bestfriends: [123, 563, 1211] } };

// true
console.log(
  denyExample.evaluate({
    action: 'read',
    resource: 'secrets:563:super-secret',
    context: contextForDenyExample
  })
);
// false
console.log(
  denyExample.evaluate({
    action: 'read',
    resource: 'secrets:123:super-secret',
    context: contextForDenyExample
  })
);

console.log('Not Action Example');

const notActionExample = new IdentityBasedPolicy([
  {
    resource: 'bd:company:*',
    notAction: 'update'
  }
]);

// true
console.log(
  notActionExample.evaluate({
    action: 'delete',
    resource: 'bd:company:account'
  })
);
// false
console.log(
  notActionExample.evaluate({
    action: 'update',
    resource: 'bd:company:account'
  })
);

console.log('Not Resource Example');

const notResourceExample = new IdentityBasedPolicy([
  {
    notResource: ['bd:roles:*'],
    action: 'update'
  }
]);

// true
console.log(
  notResourceExample.evaluate({ action: 'update', resource: 'photos' })
);
// false
console.log(
  notResourceExample.evaluate({
    action: 'update',
    resource: 'bd:roles:admin'
  })
);

console.log('Admin Example');

const adminExample = new IdentityBasedPolicy([
  {
    resource: '*',
    action: '*'
  }
]);

// true
console.log(
  adminExample.evaluate({ action: 'read', resource: 'someResource' })
);
// true
console.log(
  adminExample.evaluate({ action: 'write', resource: 'otherResource' })
);

console.log('Conditions Example');

const conditions = {
  greatherThan: function(data, expected) {
    return data > expected;
  }
};

const conditionExample = new IdentityBasedPolicy(
  [
    {
      effect: 'allow', // optional, defaults to allow
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

// true
console.log(
  conditionExample.evaluate({
    action: 'read',
    resource: 'secrets:sshhh',
    context: { user: { age: 19 } }
  })
);
// false
console.log(
  conditionExample.evaluate({
    action: 'read',
    resource: 'secrets:admin:super-secret',
    context: {
      user: { age: 18 }
    }
  })
);

console.log('Principal Example');

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

// true
console.log(
  principalExample.evaluate({
    principal: '1',
    action: 'read',
    resource: 'secrets:user:name'
  })
);
// false
console.log(
  principalExample.evaluate({
    principal: '2',
    action: 'read',
    resource: 'secrets:user:super-secret'
  })
);
// true
console.log(
  principalExample.evaluate({
    principal: '2',
    action: 'read',
    resource: 'bd:company:name',
    principalType: 'id'
  })
);
// false
console.log(
  principalExample.evaluate({
    principal: '2',
    action: 'update',
    resource: 'bd:company:name',
    principalType: 'id'
  })
);

console.log('Not Principal Example');

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

// true
console.log(
  notPrincipalExample.evaluate({
    principal: '3',
    action: 'read',
    resource: 'secrets:bd:tables'
  })
);
// false
console.log(
  notPrincipalExample.evaluate({
    principal: '1',
    action: 'read',
    resource: 'secrets:bd:tables'
  })
);
// true
console.log(
  notPrincipalExample.evaluate({
    principal: '1',
    action: 'read',
    resource: 'secrets:admin:friends',
    principalType: 'id'
  })
);
// false
console.log(
  notPrincipalExample.evaluate({
    principal: '3',
    action: 'read',
    resource: 'secrets:admin:friends',
    principalType: 'id'
  })
);

console.log('Can and Cannot Examples');

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

// false
console.log(inclusivePolicy.evaluate(canAndCannotDeniedArgument));
// So far, we are not sure whether the argument is denied or not present.

// true
console.log(inclusivePolicy.can(canAndCannotDeniedArgument));
// It's present as an allow policy, so it must be explicitly denied, right?

// true
console.log(inclusivePolicy.cannot(canAndCannotDeniedArgument));
// I knew it!

const canAndCannotNotPresentArgument = {
  action: 'read',
  resource: 'website:123:456:}city/lima',
  context: contextCanAndCannot
};

// false
console.log(inclusivePolicy.evaluate(canAndCannotNotPresentArgument));
// Again, the user doesn't have access here, but why? Let's investigate..

// false
console.log(inclusivePolicy.can(canAndCannotNotPresentArgument));
// It's not present as an allow policy, but is it explicitly denied?

// false
console.log(inclusivePolicy.cannot(canAndCannotNotPresentArgument));
// Nope, it just isn't there.
