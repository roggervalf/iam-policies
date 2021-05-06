# [4.9.0](https://github.com/roggervalf/iam-policies/compare/v4.8.2...v4.9.0) (2021-05-06)


### Features

* **date:** adding negated date maching condition operator ([6081df9](https://github.com/roggervalf/iam-policies/commit/6081df9d83fba84599251914ece843f5a5ddd3a8))

## [4.8.2](https://github.com/roggervalf/iam-policies/compare/v4.8.1...v4.8.2) (2021-04-11)


### Bug Fixes

* **evaluate:** using context in instantiation in IdentityBasedPolicy and ResourceBasedPolicy ([c0f3561](https://github.com/roggervalf/iam-policies/commit/c0f3561e4458baf15983425c64cb1d5550fdf6f8)), closes [#43](https://github.com/roggervalf/iam-policies/issues/43)

## [4.8.1](https://github.com/roggervalf/iam-policies/compare/v4.8.0...v4.8.1) (2021-04-09)


### Bug Fixes

* **resourcebasedstatement:** check principalType when is undefined ([34ce2f4](https://github.com/roggervalf/iam-policies/commit/34ce2f49ecb6b41dd6fc2248fc6e98e11f2694e1)), closes [#42](https://github.com/roggervalf/iam-policies/issues/42)

# [4.8.0](https://github.com/roggervalf/iam-policies/compare/v4.7.0...v4.8.0) (2021-04-05)


### Features

* **date:** adding date exact matching condition operator ([07315cc](https://github.com/roggervalf/iam-policies/commit/07315cc30e757e97adfcc1d860e9ee5655373435))

# [4.7.0](https://github.com/roggervalf/iam-policies/compare/v4.6.0...v4.7.0) (2021-02-28)


### Features

* **bool:** adding boolean matching condition operator ([028c968](https://github.com/roggervalf/iam-policies/commit/028c96893ff9fb5919b70f9b9a9d2485e6cb05cb))

# [4.6.0](https://github.com/roggervalf/iam-policies/compare/v4.5.0...v4.6.0) (2021-02-25)


### Features

* **numeric:** adding numericEquals condition operator ([46b89c8](https://github.com/roggervalf/iam-policies/commit/46b89c8af4c7c796a826e9dd6f12770b933ded87))
* **numeric:** adding numericGreaterThan condition operator ([01384d0](https://github.com/roggervalf/iam-policies/commit/01384d02f601912b1e542b472365b538f17ffabd))
* **numeric:** adding numericGreaterThanEquals condition operator ([35ad211](https://github.com/roggervalf/iam-policies/commit/35ad2114505e1ac0ce4457d3d02af9b9b2945118))
* **numeric:** adding numericLessThan condition operator ([fb75c5f](https://github.com/roggervalf/iam-policies/commit/fb75c5f20ad22a9fca74c7118aa8f43b0ad8c49f))
* **numeric:** adding numericLessThanEquals condition operator ([7ceb06d](https://github.com/roggervalf/iam-policies/commit/7ceb06df5ab6b5e6fb1859d886ebb6582b051ce2))
* **numeric:** adding numericNotEquals condition operator ([1de1638](https://github.com/roggervalf/iam-policies/commit/1de163869fe18baaf47ac8faa1d2c11f102d60ae))

# [4.5.0](https://github.com/roggervalf/iam-policies/compare/v4.4.0...v4.5.0) (2021-02-21)


### Features

* **stringlike:** adding case sensitive matching with multi character match * ([e5f2fc8](https://github.com/roggervalf/iam-policies/commit/e5f2fc81b81982cab832be2c5e479db4933c14d7))

# [4.4.0](https://github.com/roggervalf/iam-policies/compare/v4.3.0...v4.4.0) (2021-02-18)


### Features

* **stringequalsignorecase:** adding exact matching string operator, ignoring case ([83665fa](https://github.com/roggervalf/iam-policies/commit/83665fa769ba76059a66a9f3ab2c72a1bf107692))
* **stringnotequals:** adding negated string matching operator ([83665fa](https://github.com/roggervalf/iam-policies/commit/83665fa769ba76059a66a9f3ab2c72a1bf107692))
* **stringnotequalsignorecase:** adding negated string matching operator, ignoring case ([83665fa](https://github.com/roggervalf/iam-policies/commit/83665fa769ba76059a66a9f3ab2c72a1bf107692))

# [4.3.0](https://github.com/roggervalf/iam-policies/compare/v4.2.1...v4.3.0) (2021-02-16)


### Features

* **stringequals:** adding exact matching string operator ([6fd5766](https://github.com/roggervalf/iam-policies/commit/6fd5766b9f0af96b30907af65763f72448fdd3d2))

## [4.2.1](https://github.com/roggervalf/iam-policies/compare/v4.2.0...v4.2.1) (2020-12-06)


### Bug Fixes

* **matcher:** allow ignoring {} by using $, ie ${a} should match with {a} ([470f07d](https://github.com/roggervalf/iam-policies/commit/470f07db33303934a40bfbd7d252125f777cb72f)), closes [#37](https://github.com/roggervalf/iam-policies/issues/37)

# [4.2.0](https://github.com/roggervalf/iam-policies/compare/v4.1.0...v4.2.0) (2020-12-05)


### Features

* **policies:** adding addStatement function ([fc2697f](https://github.com/roggervalf/iam-policies/commit/fc2697f20fe4e14a77c78c0034654fdb498503dd)), closes [#35](https://github.com/roggervalf/iam-policies/issues/35)

# [4.1.0](https://github.com/roggervalf/iam-policies/compare/v4.0.3...v4.1.0) (2020-11-10)


### Features

* **condition:** extends condition block type to accept unknown values ([38a6daa](https://github.com/roggervalf/iam-policies/commit/38a6daafd5e7d231c51bd50a0f914e4201ec5109))
* **context:** allow passing objects as context ([b78d5fb](https://github.com/roggervalf/iam-policies/commit/b78d5fb98e3e2c4aa23889ecf8a8d865d339418e)), closes [#15](https://github.com/roggervalf/iam-policies/issues/15)

## [4.0.3](https://github.com/roggervalf/iam-policies/compare/v4.0.2...v4.0.3) (2020-11-03)


### Bug Fixes

* **types:** using object type in generateProxy ([8f90ff1](https://github.com/roggervalf/iam-policies/commit/8f90ff1370250133a55387d7c1259f84a7fc5230))

## [4.0.2](https://github.com/roggervalf/iam-policies/compare/v4.0.1...v4.0.2) (2020-10-31)


### Bug Fixes

* **sourcemaps:** allowing sourceMap from ts config ([f071ca0](https://github.com/roggervalf/iam-policies/commit/f071ca0927d61152fb9ddf428b2685f95bbf2663))

## [4.0.1](https://github.com/roggervalf/iam-policies/compare/v4.0.0...v4.0.1) (2020-10-30)


### Bug Fixes

* **types:** adding this types in public functions in classes ([f182fd9](https://github.com/roggervalf/iam-policies/commit/f182fd9cad7603ed3c347f8475ea510b48d6a4f9))

# [4.0.0](https://github.com/roggervalf/iam-policies/compare/v3.5.0...v4.0.0) (2020-10-26)


### Bug Fixes

* **resourcebasedstatement:** validate principal, notPrincipal, resource and notResource attributes ([2aee00c](https://github.com/roggervalf/iam-policies/commit/2aee00caf6ac720213cbb7bcc1da2c5292f41acb))
* throw Type Error in Identity and Resource statements for actions and resources ([78c52ca](https://github.com/roggervalf/iam-policies/commit/78c52ca50a4edf84758d4d96e8d422ade6d3f1d7))
* **actionbasedstatement:** throw TypeError when action and notAction are present ([2e4409d](https://github.com/roggervalf/iam-policies/commit/2e4409dd87cad000c85a0d8d2c6941b936293487))
* **resourcebasedstatement:** return true in matchNotPrincipals ([f78553e](https://github.com/roggervalf/iam-policies/commit/f78553e307ed58b6823b05da3408d5fc5a3c1097))


### Features

* **actionbasedpolicy:** allow to generate proxy from Action Based Policy ([72f4092](https://github.com/roggervalf/iam-policies/commit/72f40920e7869fd22b3ea3dbaa9dcaccc75dfd92))
* extending Policy in Identity and Resource Based Policies ([bd06fc6](https://github.com/roggervalf/iam-policies/commit/bd06fc6ec22177e0fca38308bda7601e4c47fd1e))
* **actionbasedpolicy:** allowing set and get conditionResolver ([10bee79](https://github.com/roggervalf/iam-policies/commit/10bee7935e7aa72d59995d170fe0f801acc5dc20))
* **actionbasedpolicy:** allowing set and get context ([3420d87](https://github.com/roggervalf/iam-policies/commit/3420d871d98c7bc62ecef9f147479228640edba3))


### BREAKING CHANGES

* new way to contruct Policies instances with a json

# [3.5.0](https://github.com/roggervalf/iam-policies/compare/v3.4.1...v3.5.0) (2020-10-11)


### Features

* **sid:** generating uuid to set sid in statements as default ([c23d6e6](https://github.com/roggervalf/iam-policies/commit/c23d6e66208df06f8d48702c6143252374c22deb)), closes [#27](https://github.com/roggervalf/iam-policies/issues/27)
* **uuid:** adding util functions to generate uuid ([f7687e6](https://github.com/roggervalf/iam-policies/commit/f7687e698e2c28e95fe37e6a744bb6f49e9cd9bb))

## [3.4.1](https://github.com/roggervalf/iam-policies/compare/v3.4.0...v3.4.1) (2020-09-06)


### Bug Fixes

* **github:** trying to publish on github ([#26](https://github.com/roggervalf/iam-policies/issues/26)) ([24d0672](https://github.com/roggervalf/iam-policies/commit/24d06720c57bfb9748e710f47246a9387324d0fe))

# [3.4.0](https://github.com/roggervalf/iam-policies/compare/v3.3.0...v3.4.0) (2020-08-28)


### Features

* **actionbasedpolicy:** adding new policy, just with actions ([994c0ff](https://github.com/roggervalf/iam-policies/commit/994c0ff4ab0720bf2a31e05dc0b533b44bc5507e))

# [3.3.0](https://github.com/roggervalf/iam-policies/compare/v3.2.0...v3.3.0) (2020-05-30)


### Features

* **getstatements:** add public function to get statements in policies ([b1aa400](https://github.com/roggervalf/iam-policies/commit/b1aa4002eb1c3527d13742474588c9f8938f2220))

# [3.2.0](https://github.com/roggervalf/iam-policies/compare/v3.1.1...v3.2.0) (2020-05-24)


### Bug Fixes

* **baseget:** validate value as object instead of null ([6998f6d](https://github.com/roggervalf/iam-policies/commit/6998f6d1399dfd32ef90d04acc95e64b7522a7e4))


### Features

* **standalone:** keep standalone files in dist directory ([72962d3](https://github.com/roggervalf/iam-policies/commit/72962d37c413bd5c7b90e6aca44c2d773612fdd6))


### Performance Improvements

* **types:** bundle d.ts files using rollup-plugin-dts ([ea3a17e](https://github.com/roggervalf/iam-policies/commit/ea3a17ec3212c742c056ed4f1685bbc85fd8e303))

## [3.1.1](https://github.com/roggervalf/iam-policies/compare/v3.1.0...v3.1.1) (2020-05-22)


### Bug Fixes

* **matcher:** * should match at least one character ([5a42b66](https://github.com/roggervalf/iam-policies/commit/5a42b66250784b5e66b6ee8f616129eae99a57df))

# [3.1.0](https://github.com/roggervalf/iam-policies/compare/v3.0.5...v3.1.0) (2020-05-03)


### Features

* **gettag:** adding util function to get to string tag of a value ([29c981f](https://github.com/roggervalf/iam-policies/commit/29c981f66bad15d66efde7705839d83825ab5dcd))
* **iskey:** adding new util to match property names and paths ([97e60ed](https://github.com/roggervalf/iam-policies/commit/97e60eddee79e970efa640e03e0582758555e6bd))
* **issymbol:** adding new util for checking if a value is a symbol ([6ddf3d1](https://github.com/roggervalf/iam-policies/commit/6ddf3d12e9d336f4441b25050acca85163e025c3))
* **memoize:** adding new util function to memoize results ([c55032d](https://github.com/roggervalf/iam-policies/commit/c55032d4ec45039e8a558f959e569934ccd7f328))
* **memoizecapped:** adding specialized memoize function version ([4e88c35](https://github.com/roggervalf/iam-policies/commit/4e88c3590a02d8345e167e534aabb0c02b4be68e))
* **stringtopath:** add util to convert string to a property path array ([c4d0dd4](https://github.com/roggervalf/iam-policies/commit/c4d0dd43fbc2612f28960ede973c2ba5e12885b4))
* **tokey:** adding util to convert value to a string key ([8d19068](https://github.com/roggervalf/iam-policies/commit/8d19068b6775289ca785dc8f3128ae9e102a9222))


### Performance Improvements

* **dependencies:** upgrading deprecated dev-dependencies ([a6f09a9](https://github.com/roggervalf/iam-policies/commit/a6f09a95c1d2e560f4c01c23a28f8fbf38eaf26b))

## [3.0.5](https://github.com/roggervalf/iam-policies/compare/v3.0.4...v3.0.5) (2020-04-30)


### Bug Fixes

- **matcher:** allow passing / into string comparison for \* ([94da308](https://github.com/roggervalf/iam-policies/commit/94da30873f2fc044bfaa890e7f2dd5fc1acede09)), closes [#18](https://github.com/roggervalf/iam-policies/issues/18)

## [3.0.4](https://github.com/roggervalf/iam-policies/compare/v3.0.3...v3.0.4) (2020-04-12)


### Bug Fixes

- **github:** updating github references ([974d818](https://github.com/roggervalf/iam-policies/commit/974d818e6a22c985c3c612f25c034b54f1076724))

## [3.0.3](https://github.com/roggervalf/iam-policies/compare/v3.0.2...v3.0.3) (2020-03-30)


### Bug Fixes

- **rollup:** deleting unused external-helpers plugin ([2b829de](https://github.com/roggervalf/iam-policies/commit/2b829de1baa2dc3aa774688654a0f8c9065d79c4))

## [3.0.2](https://github.com/roggervalf/iam-policies/compare/v3.0.1...v3.0.2) (2020-03-20)


### Bug Fixes

- **getvaluefrompath:** return ConditionKey type values ([febbcb7](https://github.com/roggervalf/iam-policies/commit/febbcb7ae552ae29779899ab0b474218b1490f3f)), closes [#14](https://github.com/roggervalf/iam-policies/issues/14)

## [3.0.1](https://github.com/roggervalf/iam-policies/compare/v3.0.0...v3.0.1) (2020-03-06)


### Bug Fixes

- **semantic-release:** trying semantic-release from travis ([91e0384](https://github.com/roggervalf/iam-policies/commit/91e0384e56af1b0bbaf8d031f2aa8a2158487f80))

# [3.0.0](https://github.com/roggervalf/iam-policies/compare/v2.0.1...v3.0.0) (2020-03-06)


### Bug Fixes

- exclude dist from ts compile ([9b6b754](https://github.com/roggervalf/iam-policies/commit/9b6b7545bae513100f52b76f8adb230990dbad80))
- change node version into travis and package ([4347bd2](https://github.com/roggervalf/iam-policies/commit/4347bd274ed774db84d18584e94b8184befebe0a))
- not rollup test files ([e153fbf](https://github.com/roggervalf/iam-policies/commit/e153fbf5d6d4325ed9ee3d3bd834877d574c2695))


### Features

- **semantic-release:** add semantic-release package ([#12](https://github.com/roggervalf/iam-policies/issues/12)) ([28cf910](https://github.com/roggervalf/iam-policies/commit/28cf9102ca85db4f9dde7907ea3c0b1790e73600))

## [2.0.1](https://github.com/roggervalf/iam-policies/compare/2.0.0...v2.0.1) (2020-03-01)


### Bug Fixes

- **resourcebasedstatement:** fixing notprincipal attribute ([#9](https://github.com/roggervalf/iam-policies/issues/9)) ([cb21c66](https://github.com/roggervalf/iam-policies/commit/cb21c6655dc491ef5ef49c2540fdf7654563ff8b))

# [2.0.0](https://github.com/roggervalf/iam-policies/compare/1.3.2...2.0.0) (2020-02-23)


### Bug Fixes

- more legibility ([#7](https://github.com/roggervalf/iam-policies/pull/7)) ([7c37cb1](https://github.com/roggervalf/iam-policies/commit/7c37cb1ab5deee71a7aaca757d01dceeb53909b9))


### Features

- **identitybased and resourcebased:** adding new policies ([#8](https://github.com/roggervalf/iam-policies/pull/8)) ([58210b7](https://github.com/roggervalf/iam-policies/commit/58210b738f95b9eb6f81d297a08a36af4ee2b19e))

### [1.3.2](https://github.com/roggervalf/iam-policies/compare/1.3.1...1.3.2) (2020-02-11)

### [1.3.1](https://github.com/roggervalf/iam-policies/compare/1.3.0...1.3.1) (2020-01-19)

## [1.3.0](https://github.com/roggervalf/iam-policies/compare/1.2.0...1.3.0) (2020-01-01)

## [1.2.0](https://github.com/roggervalf/iam-policies/compare/1.1.0...1.2.0) (2019-12-20)
