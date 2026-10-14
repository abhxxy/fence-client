/* ============================================================
   SITE CONFIG  -  the only file you edit to reskin for a new client
   ------------------------------------------------------------
   1. Replace the text below.
   2. Drop the client's photos into /assets and update the paths.
   3. Change the accent colours.
   Nothing in index.html / app.js / styles.css is client-specific.
   ============================================================ */
window.SITE = {
  business: {
    name: "Capital Fence",
    shortName: "Capital Fence",
    tagline: "Built for Arkansas Living",
    phone: "501-247-3918",            // shown on the page
    phoneE164: "15012473918",         // digits only, for tel: and WhatsApp links
    whatsapp: "15012473918",          // digits only (wa.me). Same as phone unless they use a separate WhatsApp number
    email: "",                        // leave empty to hide the email option on the lead form
    owner: "Michael",
    city: "Little Rock",
    state: "AR",
    stateLong: "Arkansas",
    baseTown: "Cabot",                // where the crew is based
    yearsInBusiness: 5,
    hours: "Mon to Fri 8am to 5pm · Sat 8am to 12pm",
    serviceAreas: ["Little Rock", "North Little Rock", "Sherwood", "Cabot", "Jacksonville", "Austin", "Ward", "Lonoke", "Beebe", "Vilonia", "Maumelle", "Benton"],
    mapQuery: "Capital Fence, Cabot, AR",   // used for the Google Maps embed and directions link
    mapEmbed: true                          // false hides the map iframe (useful for previews that block iframes)
  },

  /* Night theme colours. bg is the page, accent is the string-light amber, moon is the cool highlight. */
  theme: {
    bg: "#070b14",
    accent: "#f5b544",
    ember: "#ff8a3d",
    moon: "#7fd3ff"
  },

  /* Google / review proof shown in the hero and trust row */
  proof: { rating: "5.0", reviewCount: 87, platform: "Google", reviewUrl: "https://www.google.com/maps/search/Capital+Fence+Cabot+AR" },

  hero: {
    eyebrow: "Residential fence installation · Central Arkansas",
    headline: "A fence built right. Day or night.",
    highlight: "built right",            // this phrase inside the headline gets the accent colour
    sub: "Wood, vinyl, aluminum and chain-link fences for homes across Little Rock, Cabot and Central Arkansas. Owner-operated, licensed and insured, free estimates within 48 hours.",
    primaryCta: "Get a free estimate",
    secondaryCta: "Pick a material",
    material: "wood",                     // which material the scene builds first: wood | vinyl | aluminum | chainlink
    background: "assets/nbg.jpg"          // still image used when 3D is not available
  },

  promise: {
    heading: "No crews you have never met. No surprise invoices.",
    text: "Michael quotes every job himself, the same crew that measures your yard builds your fence, and the price you sign is the price you pay. That is how a small company earns 87 five-star reviews.",
    stats: [
      { value: "5.0", suffix: "★", label: "Google rating, 87 reviews" },
      { value: "48", suffix: "hr", label: "Quote turnaround" },
      { value: "5", suffix: "+ yrs", label: "Serving Central Arkansas" },
      { value: "1", suffix: " crew", label: "Owner on every job" }
    ],
    /* Build-spec list shown beside the promise copy */
    cutaway: {
      title: "Why our posts never lean",
      points: [
        "Posts set 30 inches deep, below the frost line",
        "Gravel base so water drains away from the post",
        "Concrete collar crowned to shed rain",
        "Hot-dipped galvanised hardware on every gate"
      ]
    }
  },

  /* Material Visualizer. Images must share the same framing so the cross-fade is seamless. */
  visualizer: {
    enable3d: true,          // the fence in the scene behind the page rebuilds in the chosen material
    heading: "Pick a material. Watch it go up.",
    sub: "The fence in the yard behind this page rebuilds in whatever you choose. Your pick is attached to the estimate form automatically, so Michael knows exactly what to quote.",
    materials: [
      { id: "wood", name: "Wood", image: "assets/nviz-wood.jpg", title: "Cedar privacy fence", blurb: "The classic Arkansas backyard fence. Six feet of warm cedar, full privacy, and the easiest to customise with gates, caps and lattice.", bestFor: "Privacy, pets, resale value", lifespan: "15 to 20 years", upkeep: "Stain or seal every 2 to 3 years", cost: 2 },
      { id: "vinyl", name: "Vinyl", image: "assets/nviz-vinyl.jpg", title: "Vinyl privacy fence", blurb: "Looks freshly painted for decades without ever being painted. No rot, no termites, no staining, and a quick rinse keeps it white.", bestFor: "Zero maintenance, clean modern look", lifespan: "25 to 30 years", upkeep: "Hose it down once a year", cost: 3 },
      { id: "aluminum", name: "Aluminum", image: "assets/nviz-aluminum.jpg", title: "Ornamental aluminum fence", blurb: "The look of wrought iron without the rust. Keeps the view open, meets pool-code requirements, and the powder coat never needs touching up.", bestFor: "Pools, front yards, keeping the view", lifespan: "30+ years", upkeep: "None", cost: 3 },
      { id: "chainlink", name: "Chain-link", image: "assets/nviz-chainlink.jpg", title: "Chain-link fence", blurb: "The most budget-friendly way to secure a yard. Galvanised or black vinyl-coated, built to take Arkansas storms and keep dogs where they belong.", bestFor: "Dogs, large yards, tight budgets", lifespan: "20+ years", upkeep: "None", cost: 1 }
    ]
  },

  steps: {
    heading: "From first call to finished fence",
    items: [
      { title: "Tell us about your yard", text: "Call, WhatsApp or send the form. Pick a material above and it comes through with your message." },
      { title: "Free on-site estimate", text: "Michael walks the property line with you, checks utilities and grade, and leaves a written fixed price. Usually within 48 hours." },
      { title: "Built in a day or two", text: "Most residential fences go up in one to two days. We clean up, walk the finished fence with you and hand over the gate keys." }
    ]
  },

  /* Gallery. tag must match a material id above. Replace with the client's real job photos. */
  gallery: {
    heading: "Recent work",
    sub: "Sample renders shown until the client's job photos are added. Each photo is tagged by material so visitors can filter.",
    items: [
      { src: "assets/ngal-wood-1.jpg", tag: "wood", caption: "6 ft cedar privacy with walk gate · West Little Rock" },
      { src: "assets/ngal-vinyl-1.jpg", tag: "vinyl", caption: "White vinyl privacy, 180 linear ft · Sherwood" },
      { src: "assets/ngal-aluminum-1.jpg", tag: "aluminum", caption: "Black ornamental aluminum, pool enclosure · Maumelle" },
      { src: "assets/ngal-chainlink-1.jpg", tag: "chainlink", caption: "Galvanised chain-link with double drive gate · Cabot" },
      { src: "assets/ngal-wood-2.jpg", tag: "wood", caption: "Cedar privacy with lattice top · Jacksonville" },
      { src: "assets/ngal-vinyl-2.jpg", tag: "vinyl", caption: "Tan vinyl privacy · Benton" },
      { src: "assets/ngal-aluminum-2.jpg", tag: "aluminum", caption: "Bronze aluminum front-yard fence · Lonoke" },
      { src: "assets/ngal-chainlink-2.jpg", tag: "chainlink", caption: "Black vinyl-coated chain-link · North Little Rock" }
    ]
  },

  /* Reviews. SAMPLE TEXT: replace with real Google reviews (copy them word for word, with first name and town). */
  reviews: {
    heading: "What neighbours say",
    items: [
      { name: "Jennifer R.", town: "Sherwood", stars: 5, text: "Michael came out the next day, measured everything and gave us a price on the spot. The crew finished 160 feet of cedar privacy fence in a day and a half and left the yard cleaner than they found it." },
      { name: "Marcus T.", town: "Cabot", stars: 5, text: "Had three quotes. Capital Fence was not the cheapest but it was the only one where the owner showed up himself. Gate still swings perfectly a year later." },
      { name: "Dana W.", town: "Little Rock", stars: 5, text: "We needed a pool-code aluminum fence before an inspection. Scheduled fast, passed inspection first time, and they moved a sprinkler line for us at no charge." },
      { name: "Robert H.", town: "Jacksonville", stars: 5, text: "Chain-link for two big dogs. Posts set in concrete, mesh pulled tight, no sagging. Fair price and exactly what was quoted." }
    ]
  },

  badges: [
    { icon: "shield", title: "Licensed & insured", text: "Fully covered on every job in Arkansas." },
    { icon: "check", title: "Workmanship warranty", text: "Posts, gates and panels backed in writing." },
    { icon: "tag", title: "Free estimates", text: "Written fixed price, no obligation." },
    { icon: "star", title: "Military & senior discounts", text: "Ask when you book your estimate." }
  ],

  form: {
    heading: "Get your free estimate",
    sub: "Takes 30 seconds. Sends straight to Michael's phone.",
    lengthOptions: ["Not sure yet", "Under 100 ft", "100 to 200 ft", "200 to 300 ft", "Over 300 ft"],
    submitLabel: "Send on WhatsApp",
    emailLabel: "Email instead"
  },

  footer: {
    note: "Residential and commercial fence installation, repair and custom gates.",
    links: [{ label: "Google reviews", url: "https://www.google.com/maps/search/Capital+Fence+Cabot+AR" }, { label: "Yelp", url: "https://www.yelp.com/biz/capital-fence-cabot" }]
  }
};
