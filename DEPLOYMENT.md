# GitHub Pages publication

This repository publishes its static export from the main branch root using the existing GitHub Pages branch deployment. The Next.js source remains in app/ and components/.

To publish a new version, run npm ci and npm run build, then copy the contents of out/ into the repository root, including .nojekyll and _next/. Commit the source and export together.

The optional deploy.yml workflow is manual because custom GitHub Actions are currently blocked by the account billing status. The Pages branch deployment is the publication path for this release.
