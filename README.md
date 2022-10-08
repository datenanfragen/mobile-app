# The Datenanfragen.de mobile app

> This repository contains the source code for the Datenanfragen.de mobile app.

Datenanfragen.de is an open source project by [Datenanfragen.de e.&nbsp;V.](https://www.datarequests.org/verein), a registered non-profit from Germany. We have made it our mission to help you exercise your right to privacy. We offer a generator for GDPR requests, a database with the privacy contact details of companies, and comprehensive articles on the GDPR and data protection in general, among other things.

<!-- TODO: Screenshot -->

We are currently working on building a mobile app to complement the website. Through the app, you will finally be able to use our tools on mobile and entirely offline without a need to contact our servers at all. In addition, we will also leverage native operating system features that we cannot access through a website to make the request process even easier. If you want to follow along with our progress, check out our [dev log on Mastodon](https://chaos.social/@dev_at_datarequestsORG).

**Note that the mobile app is still a work in progress and not ready for use yet.**

## Development

The mobile app is built using [Preact](https://preactjs.com/) and [Capacitor](https://capacitorjs.com/).

To build the project locally for development, follow these steps:

1. [Install Yarn 1 (Classic)](https://classic.yarnpkg.com/en/docs/install) and follow the [environment setup instructions for Capacitor](https://capacitorjs.com/docs/getting-started/environment-setup).
2. Clone the repo and run `yarn` in the root directory of the repo to fetch all required dependencies.
3. Run `yarn dev` to build the JS part. This will watch for changes and rebuild automatically.
4. To update a native project (e.g. Android), you need to run `yarn sync-dev android`. This will **not** happen automatically and needs to happen after package or config updates.
5. Use `yarn run-dev android` to run the app for Android. You can append `--target [emulator_name]` to not have to pick the device every time. Changes in the js code will be reflected in the App if it is reloaded (you can use the Chromium inspection for that).

See the [Capacitor workflow docs](https://capacitorjs.com/docs/v3/basics/workflow) for more details.

## Contributing

First of all, thank you very much for taking the time to contribute! Contributions are incredibly valuable for a project like ours.

We warmly welcome issues and pull requests through GitHub. You can also chat with us through our [Matrix space](https://matrix.to/#/#datenanfragen:matrix.altpeter.me). Feel free to ask questions, pitch your ideas, or just talk with the community.

Please be aware that by contributing, you agree for your work to be released under the MIT license, as specified in the `LICENSE` file.

If you are interested in contributing in other ways besides coding, we can also really use your help. Have a look at our [contribute page](https://www.datarequests.org/contribute) for more details.

## Acknowledgements

The German Federal Ministry of Education and Research sponsored the work of the Lorenz Sieben und Benjamin Altpeter GbR on this app between March 2022 and August 2022 through the Prototype Fund (grant number 01IS22S20).

<p align="center">
  <img width="350" alt="Sponsored by the German Federal Ministry of Education and Research through the Prototype Fund." src="https://static.dacdn.de/other/bmbf-ptf-logo.svg">
</p>
