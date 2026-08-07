# Red Dead Redemption 2 Completionist Guide

A polished, interactive guide for tracking Red Dead Redemption 2 progress with a clear split between:

- Official 100% requirements
- Completionist-style extras and side content

This project is designed as a personal guide companion that can be used locally now and deployed later to a custom domain or hosting platform when you are ready.

## What’s included

- Category-based tracking for missions, strangers, challenges, collectibles, locations, outfits, weapons, and safehouses
- Progress persistence on the device running the app
- A dashboard with status summaries, region-based progress, and pinned next actions
- A structure that is easy to extend with more content and richer walkthroughs

## Project status

- Built as a local-first guide app
- Ready for future deployment to GitHub Pages, Vercel, Netlify, Cloudflare Pages, or another host
- Kept separate from any custom domain until you decide on the final setup

## Future deployment options

When you are ready to publish it publicly or move it to a custom domain, this repository is already structured for a straightforward deployment:

1. Connect the repo to a hosting provider
2. Build the app with the project’s existing Vite/Nitro setup
3. Point the host to the generated production output
4. Attach your domain later if desired

## Local development

If you want to run it locally, install dependencies and start the app in the project folder:

Requirements: Node.js 22.12+.

```bash
npm install
npm run dev
```

## Deploy to Cloudflare Pages

1. Create a Cloudflare Pages project and connect this GitHub repository.
2. Add these repository secrets in GitHub:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
3. Optionally set a repository variable named `CLOUDFLARE_PAGES_PROJECT_NAME` with your Cloudflare Pages project name.
4. Push to `main` and the workflow will build and deploy the generated `.output/public` folder.
5. In Cloudflare Pages, add your custom domain once the deployment is live.

This repository is intended to be a strong foundation for your guide while keeping the project independent from any domain decisions for now.
