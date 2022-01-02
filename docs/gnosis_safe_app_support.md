## Running as a Gnosis Safe App

It is possible to run the ANS app as a [Gnosis Safe App](https://docs.gnosis.io/safe/docs/sdks_safe_apps/). This will allow it to directly use the ANS app from withing the [Gnosis Safe web interface](https://app.gnosis-safe.io).

As the ANS app is normally running on a different host (unless both, the Gnosis Safe web interface and the ANS app, are for example hosted locally) it is required to enable CORS headers. This will allow the Gnosis Safe web interface to access the ANS app meta information from the `manifest.json`.

To enable this without changes to the ANS project it is possible to use the [`local-cors-proxy`](https://www.npmjs.com/package/local-cors-proxy) package via `npx`.

Run `npx local-cors-proxy --proxyUrl http://localhost:3000 --proxyPartial ""`

Now it is possible to use `http://localhost:8010` inside the Gnosis Safe web interface as a Gnosis Safe App. For this navigate to the Apps section of the web interface and follow the process to add a custom app. The following interfaces can be used for testing:

- [Gnosis Safe Mainnet interface](https://app.gnosis-safe.io)
- [Gnosis Safe Rinkeby interface](https://rinkeby.gnosis-safe.io)

Note: To test the ANS app as a Gnosis Safe App it is required to be owner of a Gnosis Safe and that this Gnosis Safe is available in the interface.

### Alternatives

It is also possible to host the app via [GithHub page](https://pages.github.com/), [Netlify](https://www.netlify.com/) or similar providers.
