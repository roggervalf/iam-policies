# Contributing

## Commit messages

This package is using semantic-release to automate the release process, and this depends on a specific format for commit messages. Please run `yarn cm` to use `commitizen` to properly format your commit messages so they can be automatically processed and included in release notes. Also in travis process we should use `node >=12.0.0` since @typescript-eslint/eslint-plugin@4.5.0 requires this.

## Pull request testing

Some notes on testing and releasing.

- For a PR, follow Github's command-line instructions for retrieving the branch with the changes.
- To start a local development:

```sh
yarn build
cd example
yarn
yarn start
```

- Provide feedback on the PR about your results.

## Doing a release

We are using semantic-release instead of this:

- update the version number in `package.json`
  - Fixes update the patch number, features update the minor number.
  - Major version update is reserved for API breaking changes, not just additions.
- `git add`, `git commit` and `git push` to get the version to master.
- update changelog following the commits format.
- `git tag -a 3.X.Y -m 3.X.Y` `git push --tags`
- `npm publish`
- add a version on the github release page, based on the tag
