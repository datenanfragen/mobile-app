## Development

The mobile app is built using [Preact](https://preactjs.com/) and [Capacitor](https://capacitorjs.com/).

To build the project locally for development, follow these steps:

1. [Install Yarn 1 (Classic)](https://classic.yarnpkg.com/en/docs/install) and follow the [environment setup instructions for Capacitor](https://capacitorjs.com/docs/getting-started/environment-setup).
2. Clone the repo and run `yarn` in the root directory of the repo to fetch all required dependencies.
3. Run `yarn dev` to build the JS part. This will watch for changes and rebuild automatically.
4. To update the native projects, you need to run `yarn cap sync`. This will **not** happen automatically.
5. Use `yarn cap run android` to run the app for Android. You can append `--target [emulator_name]` to not have to pick the device every time.

See the [Capacitor workflow docs](https://capacitorjs.com/docs/v3/basics/workflow) for more details.

You can use the Chrome remote dev tools (`chrome://inspect`).
