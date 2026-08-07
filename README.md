# Advanced Creation Studio

A polished, static marketing website for Advanced Creation Studio with:

- A premium reentry and reintegration message
- A responsive hero and services section
- A contact form tied to Web3Forms
- Cloudflare Web Analytics support

## Local preview

Open `index.html` in a browser, or serve the folder with any static web server.

```bash
python3 -m http.server 8000
```

## Deploy to Cloudflare Pages

1. Create a Cloudflare Pages project and connect this GitHub repository.
2. Add these repository secrets in GitHub:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
3. Optionally set a repository variable named `CLOUDFLARE_PAGES_PROJECT_NAME` with your Cloudflare Pages project name.
4. Push to `main` and the workflow will deploy the site from the repository root.
5. In Cloudflare Pages, add your custom domain once the deployment is live.
