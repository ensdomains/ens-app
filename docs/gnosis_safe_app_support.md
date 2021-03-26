## Running as a Gnosis Safe App

It is possible to run the ENS app as a [Gnosis Safe App](https://docs.gnosis.io/safe/docs/sdks_safe_apps/). This will allow it to directly use the ENS app from withing the [Gnosis Safe web interface](https://app.gnosis-safe.io).

When testing the local dev version of the ENS app as a Gnosis Safe App some additional requirements need to be fullfilled:

- CORS headers need to be available
- HTTPS needs to be enabled

Both are not the default and will require some adjustments.

### Add CORS support

As the ENS app is normally running on a different host (unless both, the Gnosis Safe web interface and the ENS app, are for example hosted locally) it is required to enable CORS headers. This will allow the Gnosis Safe web interface to access the ENS app meta information from the `manifest.json`.

To enable this without changes to the ENS project it is possible to use the [`local-cors-proxy`](https://www.npmjs.com/package/local-cors-proxy) package via `npx`.

Run `npx local-cors-proxy --proxyUrl http://localhost:3000 --proxyPartial ""`

### Enabled HTTPS

Because the Gnosis Safe web interface uses HTTPS it is required that the ENS app also is reachable via HTTPS. For this we will use another proxy called [`local-ssl-proxy`](https://www.npmjs.com/package/local-ssl-proxy).

Run `npx local-ssl-proxy --source 8011 --target 8010`

As the proxy uses a self-signed HTTPS certificate it is required to trust it in the browser before the app can be used. This can be done in most browsers by opening the app and accepting the warning message.

Now it is possible to use `https://localhost:8011` inside the Gnosis Safe web interface as a Gnosis Safe App. For this navigate toApps section of the web interface and follow the process to add a custom app. The following interfaces can be used for testing:

- [Gnosis Safe Mainnet interface](https://app.gnosis-safe.io)
- [Gnosis Safe Rinkeby interface](https://rinkeby.gnosis-safe.io)

Note: To test the ENS app as a Gnosis Safe App it is required to be owner of a Gnosis Safe and that this Gnosis Safe is available in the interface.

### Alternatives

To avoid running two proxies it is also possible to host the app via [GithHub page](https://pages.github.com/), [Netlify](https://www.netlify.com/) or similar providers.
