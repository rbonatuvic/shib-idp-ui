# Versioning policy

ShibUI versioning scheme is based on the [semantic versioning 2.0.0](https://semver.org/)

It follows the version format of the following form: `MAJOR.MINOR.PATCH` numbers where:

* MAJOR: Represents major software features and potential breaking changes
* MINOR: Represents backward-compatible software features
* PATCH: Backward-compatible software bug fixes, typically released outside of the normal release cycle

Together with semantic versioning numbers, the following labels are used to give hints about the state of release lifecycle. These labels are:

* M[number]: A milestone release (M1, M2, M3...) marks as significant progress milestone in a major release development. Milestone releases are not considered to be stable and are discouraged to be used in production.

* RC[number]: A release candidate (RC1, RC2, RC3...) is the last feature complete release before building a final generally available release. The purpose of release candidates is to give end users of the software a chance to do a test drive, to find and fix bugs before releasing a final version. To minimize code changes, only bug fixes should occur at this stage. Release candidate releases are not considered to be stable and are discouraged to be used in production.

At the very end of release process, the ShibUI development team with publish so called generally available releases which would be considered stable and targeted to be used in production.

In ShibUI software, some of the examples of release cycles are:

* Major database and data model changes, which would break backward compatibility during upgrades, would be characterized as `MAJOR` releases. In the same vein, major changes to the exposed Web Services APIs would be included in `MAJOR` release cycle.
* Any new added UI features that would not break major backward compatibility during upgrades would be characterized as `MINOR` feature releases.

Examples of version:

* `2.0.0-M1` - first milestone release of 2.0.0 major version (not stable)
* `2.0.0-RC1` - first release candidate of 2.0.0 major version (not stable)
* `2.0.0` - Major GA release of 2.0.0 line
* `2.0.1` - Patch release of 2.0.x line
* `2.1.0` - First minor feature release of 2.x line 


