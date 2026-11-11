# Portfolio publication

GitHub Pages is configured to publish the `gh-pages` branch at `/`.
The Next.js source and history are maintained on `main`.

## Publish a new version

1. Run `npm ci` when dependencies are missing, then `npm run build`.
2. Copy the contents of `out/` into a checkout of `gh-pages`, including `.nojekyll` and `_next/`.
3. Commit and push the `gh-pages` branch.
4. Verify the Pages deployment and the public page. A successful push alone is not a successful deployment.

The custom Actions workflow is manual. It is not needed to build the already exported static website.
