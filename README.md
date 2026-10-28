## V0.2.1 visual update

Slower typewriter (195 ms/character), longer section reveals, animated translucent cyan gradient sweeps inside hovered/focused cards, ambient hero lighting, stronger glow and slow breathing selected filters/CV tabs. All animations respect reduced-motion settings. No changes to editable content schema.

# Nick Moore — Personal Portfolio v0.1

A static, GitHub Pages-ready portfolio. No framework, database, login or analytics.

## Preview locally

Open `index.html` in a browser. All content is loaded from ordinary JavaScript files; no build step is required.

## Editing content

- `content/site.js`: intro, section order, navigation labels, links and project categories.
- `content/profiles.js`: professional profiles.
- `content/experience.js`: career entries.
- `content/qualifications.js`: completed, in-progress or planned learning.
- `content/projects.js`: software, businesses, campaigns and other projects.
- `content/achievements.js`: TV, records and adventures.
- `content/journey.js`: geographical journey.
- `content/music.js`, `content/books.js`, `content/hobbies.js`: personal and creative galleries.

To add an entry, copy an existing `{...}` item, change its `id` to something unique, then edit its content. Add an optional `image: "assets/your-image.webp"` and `imageAlt`. Set `visible: false` to hide an entry. The website creates cards automatically. Add `links: [{label:"Visit website",url:"https://example.com"}]` for details-panel links.

To reorder entire sections, rearrange `sectionOrder` in `content/site.js`. To reorder cards, rearrange entries in the relevant content file. To reorder project categories, rearrange `projectCategories`.

**Important:** Each new content file must be loaded by `index.html`; existing content files can accept unlimited additional entries without HTML changes. Use commas between array items, and avoid repeating IDs.

## CV privacy

Do not publish a CV containing your private phone number unless you intentionally want it publicly accessible. Prepare a public CV PDF without your telephone number, place it in `downloads/`, and set `links.cv` in `content/site.js` to e.g. `downloads/nick-moore-public-cv.pdf`. An unfilled CV link is automatically hidden.

## Deployment

Create a new public GitHub repository and upload the files at the repository root. In Settings → Pages, select Deploy from a branch → main / root. GitHub Pages will give a temporary URL; configure a custom domain only after testing. Never commit private information, passwords, credentials or private project assets.

## Validation

Run `node validate.mjs` (requires Node.js) to check duplicate IDs, missing fields, invalid categories, duplicate section names and unsafe links. Run before committing content edits.

## Known starter-content limitations

Descriptions are drafts where precise details have not yet been confirmed. No actual CV, LinkedIn URL, email, record certificates, book links or music artwork have been supplied. The website deliberately omits unverified external links. Review all content before publishing.


## Version 0.2 additions

- Hero typewriter heading and blinking terminal cursor; smooth scroll, glowing interactive states, scroll reveals and journey timeline motion (reduced-motion friendly).
- About Me shows only configured Email / LinkedIn plus View CV. Music section can show YouTube and Spotify. Instagram and public GitHub links are intentionally absent.
- `content/cv/shared.js` stores factual career records, qualifications and public contact details. Four files in `content/cv/` contain tailored summaries, skills and record selection.
- CV module offers Generic, Local Government, Cybersecurity & Tech, Social Media & Web, with A4 preview and browser Print / Save as PDF. Public CVs do **not** contain a phone number.
- Direct CV URL: `#cv-generic`, `#cv-local-government`, `#cv-cybersecurity-tech`, `#cv-social-media-web`.
- For best print results select A4, scale 100%, and turn off browser headers/footers. Long content may span multiple pages.
- Draft CV text and career entries are **placeholders**, not verified employment claims. Review and complete before publishing.
- Browser preview: open `index.html`. GitHub Pages: upload repository files to its root and enable Pages.


## Version 0.2.2 additions
- Stronger **moving ambient lighting** now lives behind semi-transparent page sections. It remains visible even when the page is scrolled. Motion is disabled when the visitor requests reduced motion.
- Your supplied black-and-white headshot is included at `assets/nick-moore-portrait.jpg` and appears in About Me.
- All four CV versions have a **Include portrait on CV** checkbox (off by default for recruitment-system friendliness).
- The CV header has linked Website, LinkedIn and Email fields, plus city-level location. Configure the public contact details in `content/cv/shared.js`. Until filled, labels clearly say to add the URL/address.
- `content/site.js` controls the About Me portrait. No phone number is stored.
- The actual CV print/PDF layout should be checked in Chrome Print Preview; pagination depends on the final amount of content.

## V0.2.3 — Secret GeoCities mode

Click the `nick@moore:~#` brand in the top-left **five times within about two seconds per click** to toggle an intentionally ridiculous 1990s homepage makeover. Click five times again to restore normal mode. The mode is not saved across page reloads. All changes are isolated to `geocities.css` and `geocities.js`, plus three tiny local animated GIFs in `assets/`. No external resources, trackers, audio or modifications to the editable content files. Animations respect reduced-motion settings; print output hides the joke decorations.

Normal V0.2.2 visual design and content are unchanged.


## V0.2.4 — optional citations

Each card may have a `sources` array. In its `detail` (or `summary` if no detail exists), insert markers such as `[1]` after a supported claim. Example:

```js
{
  id: 'example', title: 'Example',
  detail: `A notable claim. [1]\n\nA second paragraph.`,
  sources: [{ id: 1, label: 'Read the original article', url: 'https://example.com/article' }]
}
```

Only sources with matching markers and valid URLs appear in the expandable Sources & references panel. Cards without citations show no panel. `links` remains available for unrelated general links. Run `node validate.mjs` to catch missing, duplicate or unused sources. Backtick template literals and blank lines are supported for multi-paragraph descriptions.


## V0.2.5 — inline text emphasis

In content fields rendered as card summaries or detail descriptions, use `**bold**`, `*italic*`, or `***bold and italic***` inside normal quoted strings or multiline backtick template literals. Existing `[1]` citation markers still work, including immediately after emphasized text. Formatting is safely rendered as text and DOM elements (not raw HTML). No change to GeoCities mode or the opt-in references system.


## v0.2.6 — Current spotlight
Edit `content/spotlight.js` to set each tile's `enabled`, `order`, `title`, `description`, `image` and `href`. The first four enabled entries sorted by ascending `order` are displayed. A hidden entry remains available for future use. Images are editable local SVGs in `assets/`. `href` can target a section (e.g. `#projects`) or an existing card (e.g. `#seamen-pool`), which opens its details. With no enabled tiles, the spotlight panel disappears.


## V0.2.7 update
Added supplied music and book artwork, 22 music releases plus a Christmas playlist, career and Journey copy, populated tailored CVs, projects and Google Forms contact link. No public email address or telephone number is embedded.

**Source note:** This package is based on the provided V0.2.6 ZIP, not a fresh GitHub checkout. Compare any edits made directly on GitHub since V0.2.6 before replacing those files.
