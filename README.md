# Fence company website template · After Dark edition

Static site. No build step, no backend, no API keys. Works on Vercel, Netlify or any static host.

This is the night-time variant of the template: one 3D backyard scene (string lights, lamp post, moon, fireflies)
sits behind the whole page. Scrolling walks the camera between staged viewpoints, one per section, and the fence
in the scene rebuilds in whatever material the visitor picks. Content sits in glass panels on top.

## Reskin for a new client (about 20 minutes)

1. Open `site.config.js`. Every piece of client-specific content lives there: business name, phone, WhatsApp number, email, city, service areas, hours, colours, hero copy, visualizer text, steps, gallery captions, reviews, badges.
2. Replace the images in `assets/`:
   - `nviz-wood.jpg`, `nviz-vinyl.jpg`, `nviz-aluminum.jpg`, `nviz-chainlink.jpg`: the four Material Visualizer photos (used in the Photo mode, on phones and as the fallback when WebGL is unavailable). Keep them the same size and framing so the cross-fade stays seamless (1600 x 1000 works well).
   - `ngal-*.jpg`: gallery photos. Add as many as you like and list them in `gallery.items` with the right `tag` (wood, vinyl, aluminum, chainlink).
   - `nbg.jpg`: full-screen still used behind the page when 3D is not available (1920 x 1080).
   - `nog.jpg`: the preview image shown when the link is shared (1200 x 630).
   - `favicon.svg`: browser tab icon.
3. Change `theme.accent` (the string-light amber) and, if you like, `theme.bg`, `theme.ember` and `theme.moon`. Everything else is derived.
   `hero.material` decides which fence the scene builds first.
4. Deploy.

Nothing in `index.html`, `styles.css`, `app.js` or `fence3d.js` is client-specific.

## Lead routing

The form opens WhatsApp (`wa.me`) with the visitor's details and chosen material pre-filled. If `business.email` is set, an "Email instead" button appears that opens their mail app the same way. No data is stored anywhere.

## Performance notes

- One WebGL context for the whole page; pixel ratio is capped at 1.5 (1.25 on phones) and the frame rate at 30 fps on phones.
- Phones get the photo visualizer by default; the live scene still runs behind the page.
- If WebGL is unavailable the page falls back to `nbg.jpg` and the photo visualizer automatically.
- `prefers-reduced-motion` turns off the camera easing, idle drift and build animations.

## Deploy to Vercel

```
npm i -g vercel
vercel --prod
```

Accept the defaults (framework: Other, no build command, output directory: `./`).

## Files

- `index.html` page structure
- `styles.css` design system (colours come from the config at runtime)
- `app.js` renders the config, visualizer, gallery, lead form and drives the 3D scene camera
- `fence3d.js` the 3D yard and fence builder (day and night modes)
- `site.config.js` the only file you edit per client
- `assets/` images
