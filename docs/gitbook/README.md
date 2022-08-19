# What is Iam-Policies

Iam-Policies is a [Node.js](https://nodejs.org/en/) library that implements easy way to validate a set of actions against a set of resources with optional context and conditions.

The library is designed so that it will fulfill the following goals:

* Deny rules trump allow rules.
* Base of [@ddt/iam](https://www.npmjs.com/package/@ddt/iam) and [AWS Reference Policies ](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference\_policies.html).
* Validate statements using context.
* Define conditions for validations.
