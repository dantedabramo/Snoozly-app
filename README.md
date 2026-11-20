# snoozly

The Snoozly website, laid out as one night. A centered hero has the sleepy creature and a fan of three real screens. Below it, a timeline runs from wind-down at 10:30 PM to the morning check-in at 8:35 AM, and the sky warms as you scroll. After the night come a wall of Progress screens, your week, the Colors skip game (you can play it), Snoozly Pro, the FAQ and a sunrise footer.

## Files

| Path | What it is |
| --- | --- |
| `index.html` | Home page. All text is in the HTML, so it reads fine without JavaScript |
| `support.html`, `privacy.html`, `terms.html` | Support and legal pages, in a single reading column |
| `assets/css/site.css` | All styles |
| `assets/js/core.js` | Every page: smooth scroll, the bar and its phone menu, the starry sky, the dawn, App Store links |
| `assets/js/home.js` | The hero fan, the night timeline, the parallax wall, the Colors game and the FAQ animation |
| `assets/js/doc.js` | Support and legal pages: smooth jumps to a section, and reveals |
| `assets/img/shots/` | Real app screenshots (780 × 1696 JPEG) |
| `assets/img/icon.svg`, `creature.svg` | App icon and the sleepy creature, built from the app's own SVG layers |
| `assets/img/og.png` | Link preview image (1200 × 630) |

## Screenshots

The screenshots were taken in the iOS Simulator (iPhone 18 Pro, Snoozly 1.6) from a scratch copy of the app. That copy had demo data: 24 days of check-ins, a profile named Alex, Pro unlocked and permissions shown as allowed. The status bar was set to 9:41. Your app repo wasn't changed.

| File | Screen |
| --- | --- |
| `tonight.jpg` | Tonight: bedtime card and tonight's routine |
| `reminders.jpg` | Tonight: sleep sounds, Reminders and Alarms, and the late-screens insight |
| `sounds.jpg` | Tonight: sleep sounds |
| `schedule.jpg`, `alarm.jpg`, `shift.jpg` | Schedule: the week, the wake-up alarm, Gradual Shift |
| `checkin.jpg`, `checkin-habits.jpg` | Morning Check-In |
| `progress.jpg`, `stats.jpg`, `debt.jpg`, `habits.jpg`, `history.jpg` | Progress |
| `skip.jpg` | Skip Tonight's game picker |

To replace one, export the screen at 1206 × 2622 and convert it, for example `sips -s format jpeg -s formatOptions 84 -z 1696 780 in.png --out assets/img/shots/name.jpg`. Simulator screenshots don't include the Dynamic Island, so the site draws it on top. Real device screenshots already include it. If you use one, remove the `.ph-s::after` rule in `site.css`.

## How it behaves

- **Motion.** GSAP, ScrollTrigger, SplitText and Lenis (pinned versions, from cdnjs and unpkg). With Reduce Motion turned on, or if the scripts can't load, the page is a plain scrolling page, and the FAQ still works as native disclosures.
- **Colors.** Every color comes from the app's asset catalog: Midnight Navy `#171A30`, Night Surface `#222744`, Lavender `#C4B5FD`, Dream Purple `#A78BFA`, Starlight Gold `#F5D78E`, Restful Mint `#7EE0B8`, Moonlight Blue `#8BD5F6`, Dream Coral `#F29C8C`.
- **Type.** SF Pro Rounded on Apple devices (`ui-rounded`), and Nunito from Google Fonts everywhere else.
- **Header and footer.** They're repeated in each page. If you change a link, change it in all four pages.

## Before launch

- **Domain.** `CNAME` points GitHub Pages at `www.snoozly.tech`. Still to do: add `<link rel="canonical">` and `og:url` to each page, change `og:image` to `https://www.snoozly.tech/assets/img/og.png`, and add a `sitemap.xml` with a `Sitemap:` line in `robots.txt`.
- **Support contact.** App Review expects the support page to offer a way to reach you. Add a contact email or form to `support.html`.
- **App Store link.** It's set to `https://apps.apple.com/app/id6822070712`, the ID used by the app's review prompt. It's in `APP_STORE_URL` at the top of `assets/js/core.js` and in the `href` of each `data-app` link.
- **Legal.** The privacy policy and terms were written on November 20, 2026 from Snoozly 1.6: no network code, an empty privacy manifest, read-only Apple Health, Screen Time, AlarmKit, and on-device storage. Have them reviewed if you need legal certainty.

## Keeping the site in step with the app

- Pro features match `ProFeaturesCard.swift`, and the FAQ, support steps and screen captions match `Localizable.xcstrings`. Retake the screenshots when a screen changes.
- Pricing isn't on the site. The App Store shows each region's price.
- If the app starts sending data anywhere (analytics, a sync service, a server), update `privacy.html` before that version ships.
