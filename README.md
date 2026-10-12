# Fence company website template

Static site. No build step, no backend, no API keys. Works on Vercel, Netlify or any static host.

## Reskin for a new client (about 20 minutes)

1. Open `site.config.js`. Every piece of client-specific content lives there: business name, phone, WhatsApp number, email, city, service areas, hours, colours, hero copy, visualizer text, steps, gallery captions, reviews, badges.
2. Replace the images in `assets/`:
   - `viz-wood.jpg`, `viz-vinyl.jpg`, `viz-aluminum.jpg`, `viz-chainlink.jpg`: the four Material Visualizer images. Keep them the same size and framing so the cross-fade stays seamless (1600 x 1000 works well). The current ones are 3D renders; swap in the client's real photos when they have a matching set, or keep the renders.
   - `gal-*.jpg`: gallery photos. Add as many as you like and list them in `gallery.items` with the right `tag` (wood, vinyl, aluminum, chainlink).
   - `og.jpg`: the preview image shown when the link is shared (1200 x 630).
   - `favicon.svg`: browser tab icon.
3. Change `theme.brand` and `theme.accent` to the client's colours. Everything else is derived.
4. Deploy.

Nothing in `index.html`, `styles.css`, `app.js` or `fence3d.js` is client-specific.

## Lead routing

The form opens WhatsApp (`wa.me`) with the visitor's details and chosen material pre-filled. If `business.email` is set, an "Email instead" button appears that opens their mail app the same way. No data is stored anywhere.

## Deploy to Vercel

```
npm i -g vercel
vercel --prod
```

Accept the defaults (framework: Other, no build command, output directory: `./`).

## Files

- `index.html` page structure
- `styles.css` design system (colours come from the config at runtime)
- `app.js` renders the config, visualizer, gallery, lead form, 3D hero
- `fence3d.js` the 3D fence scene used by the scroll-built hero
- `site.config.js` the only file you edit per client
- `assets/` images
