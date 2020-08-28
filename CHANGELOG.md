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

## [3.0.0](https://github.com/roggervalf/iam-policies/compare/v2.0.1...v3.0.0) (2020-03-06)

### Bug Fixes

- exclude dist from ts compile ([9b6b754](https://github.com/roggervalf/iam-policies/commit/9b6b7545bae513100f52b76f8adb230990dbad80))
- nchange node version into travis and package ([4347bd2](https://github.com/roggervalf/iam-policies/commit/4347bd274ed774db84d18584e94b8184befebe0a))
- not rollup test files ([e153fbf](https://github.com/roggervalf/iam-policies/commit/e153fbf5d6d4325ed9ee3d3bd834877d574c2695))

### Features

- **semantic-release:** add semantic-release package ([#12](https://github.com/roggervalf/iam-policies/issues/12)) ([28cf910](https://github.com/roggervalf/iam-policies/commit/28cf9102ca85db4f9dde7907ea3c0b1790e73600))

## [2.0.1](https://github.com/roggervalf/iam-policies/compare/2.0.0...v2.0.1) (2020-03-01)

### Bug Fixes

- **resourcebasedstatement:** fixing notprincipal attribute ([#9](https://github.com/roggervalf/iam-policies/issues/9)) ([cb21c66](https://github.com/roggervalf/iam-policies/commit/cb21c6655dc491ef5ef49c2540fdf7654563ff8b))

## [2.0.0](https://github.com/roggervalf/iam-policies/compare/1.3.2...2.0.0) (2020-02-23)

### Bug Fixes

- more legibility ([#7](https://github.com/roggervalf/iam-policies/pull/7)) ([7c37cb1](https://github.com/roggervalf/iam-policies/commit/7c37cb1ab5deee71a7aaca757d01dceeb53909b9))

### Features

- **identitybased and resourcebased:** adding new policies ([#8](https://github.com/roggervalf/iam-policies/pull/8)) ([58210b7](https://github.com/roggervalf/iam-policies/commit/58210b738f95b9eb6f81d297a08a36af4ee2b19e))
