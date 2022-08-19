# What is Iam-Policies

Iam-Policies is a [Node.js](https://nodejs.org/en/) library that implements easy way to validate a set of actions against a set of resources with optional context and conditions.

The library is designed so that it will fulfill the following goals:

* Deny rules trump allow rules.
* Easy to use
* Validate statements using context.
* Define conditions for validations.

View the repository, see open issues, and contribute back [on Github](https://github.com/roggervalf/iam-policies)!

### Features

If you are new to JSON policies, you may wonder why they are needed after all. Policies are used to set permissions boundaries, this is based on [@ddt/iam](https://www.npmjs.com/package/@ddt/iam) and [AWS Reference Policies ](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference\_policies.html).

* [x] Policies creation ([IdentityBasedPolicy and ResourceBasedPolicy](https://docs.aws.amazon.com/IAM/latest/UserGuide/access\_policies.html#access\_policy-types))
* [x] Permission verification
* [x] Generate Proxies
