# MathScroll

An endless, swipe-up feed of maths — like TikTok, but every "video" is a contest problem, a theorem, a concept or an integer sequence.

**What's in the feed**

| Tab | What | Size | Difficulty |
|---|---|---|---|
| Community | Problems, facts and questions posted by people using the app | grows | set by the poster |
| AMC/AIME | AMC 8/10/12 and AIME problems with AoPS Wiki solutions | ~5,000 | estimated |
| MATH | Competition problems with worked solutions (MATH dataset) | 12,500 | rated, levels 1–5 |
| Omni | Olympiad problems (Omni-MATH) | 4,400 | rated 1–10 |
| AoPS | Problems posted on the AoPS forums | ~33,000 | estimated |
| Olympiad | Olympiad problems from around the world | ~157,000 | estimated |
| Proofs | ProofWiki theorems with their proofs | ~24,800 | – |
| Sequences | The entire OEIS | ~392,000 | – |
| Concepts | Wikipedia maths articles | thousands | – |

Every problem is placed on one 1–10 difficulty scale (AMC 10/12 ≈ 2–4, AIME ≈ 4–6, olympiads ≈ 6–10).

Why the mirrors? AoPS puts every automated request through a bot check, and ProofWiki and the OEIS don't allow other websites/apps to read them. Hugging Face hosts public copies of their content with an open API, so the app reads those instead. Every card's **Source** button takes you to the original.

**Features**
- Swipe one card at a time, TikTok-style. Double-tap or tap the heart to like.
- Tap A–E or type an answer and it's checked instantly; streak counter for answers in a row.
- **Hints** (the first step of the solution) and full solutions/proofs that slide up.
- **Daily challenge**: the same AMC/AIME problem for everyone each day, with a daily streak and a share-your-result button.
- **Sprint**: 10 answerable AMC/AIME problems against the clock, with a personal best.
- **Guess the next term** on every OEIS sequence.
- **Post** your own problems, facts and questions with a live maths preview. Sharing makes a link that contains the whole post, so anyone can open it in MathScroll — no account or server needed.
- **Search** across problems, ProofWiki, the OEIS and Wikipedia.
- **Accounts & Community** (after the 5-minute setup in [SETUP-ACCOUNTS.md](SETUP-ACCOUNTS.md)): sign up with a username, post publicly, like, comment, report, and share links to posts.
- **Filters**: difficulty range or "match my level", answer type (A–E / number / proof), only checkable problems, topics, Wikipedia topics, sources, classic sequences, skip seen.
- **Skill rating**: an Elo-style rating that rises faster for harder problems, with a history graph and accuracy by difficulty and by topic.
- **Profile**: solved count, accuracy, best run, day streak, daily goal with a 7-day strip, 16 badges, and your Saved / Liked / Posts.
- **For you** learns what you like, save and solve, and shows more of it.
- Topic filter (algebra, number theory, combinatorics incl. graph theory, geometry, inequalities, calculus, logic), light/dark theme, works offline for the app shell.

Without accounts set up, everything is stored on your own phone. With them, posts, likes and comments are public; your stats stay on your phone.

No API keys, no server, no accounts. Everything is free and public.

---

## Project layout

```
www/                  the app (plain HTML/CSS/JS, no build step)
  index.html
  styles.css
  js/app.js           feed, cards, answers, saved, settings
  js/sources.js       the 5 content sources
  js/render.js        cleans wiki HTML and typesets the maths
  vendor/katex/       maths typesetting (bundled so it works offline)
  sw.js, manifest.webmanifest, icons/
ios/                  native iOS project (Capacitor) — already set up with icon, splash, dark status bar
capacitor.config.json
.github/workflows/
  ios.yml             builds MathScroll.ipa on a free GitHub Mac
  pages.yml           publishes the web version to GitHub Pages
```

---

## Step 0 — put the project on GitHub (needed for both options)

You're on Windows, and building iPhone apps normally needs a Mac. GitHub gives you a free Mac in the cloud, so the plan is: upload this folder to GitHub, let it build the app for you.

1. Make a free account at github.com if you don't have one.
2. Install **GitHub Desktop** (desktop.github.com) and sign in.
3. *File → Add local repository →* pick this `mathscroll` folder → it'll offer to "create a repository" → do that.
4. Click **Publish repository**. Untick "Keep this code private" if you want the free web hosting in Option A (GitHub Pages is free for public repos).

## Option A — web app on your home screen (5 minutes, free, no cable)

1. On github.com open your repo → **Settings → Pages** → under *Source* choose **GitHub Actions**.
2. Go to the **Actions** tab → **Deploy web app** → **Run workflow**. Wait ~1 minute.
3. Your app is now at `https://YOUR-USERNAME.github.io/mathscroll/`.
4. On your iPhone open that link **in Safari** → tap **Share** → **Add to Home Screen**.

It opens full-screen with its own icon, like a normal app. Updates appear automatically whenever you push changes.

## Option B — real iOS app installed from your PC (free)

**1. Build the IPA (on GitHub's Mac):**
Repo → **Actions** → **Build iOS app** → **Run workflow**. After ~5–10 minutes, open the finished run and download **MathScroll-ipa** from *Artifacts*. Unzip it → you get `MathScroll.ipa`.

**2. Install it with Sideloadly (on your PC):**
1. Install **iTunes** and **iCloud** from apple.com — use the downloads from Apple's website, *not* the Microsoft Store versions (Sideloadly needs those).
2. Install **Sideloadly** from sideloadly.io.
3. Plug your iPhone in with a cable and tap **Trust** on the phone.
4. Drag `MathScroll.ipa` into Sideloadly, type your Apple ID email, press **Start**, and sign in when it asks. (A free Apple ID is fine. Sideloadly signs the app with it.)

**3. Allow it on the iPhone:**
- *Settings → Privacy & Security → Developer Mode* → turn on (the phone restarts).
- *Settings → General → VPN & Device Management* → tap your Apple ID → **Trust**.

Open MathScroll. Done.

**The catch with a free Apple ID:** the app stops opening after **7 days**. Plug in and press Start in Sideloadly again to renew it (Sideloadly also has an auto-refresh option over Wi-Fi). Free accounts can have at most 3 sideloaded apps at once.

## Option C — TestFlight / App Store (paid)

For no 7-day limit, or to share it with friends: join the Apple Developer Program ($99/year). Then either borrow a Mac and run `npm install && npx cap open ios` → in Xcode set your Team → *Product → Archive → Distribute*. Or use a cloud build service like Codemagic, which can sign and upload to TestFlight from Windows.

---

## Making changes

Everything is in `www/`. To try it on your PC:

```
npx http-server www -p 8080
```

Open http://localhost:8080 in Chrome, press F12, and click the phone icon to see the phone layout. Arrow keys / J / K scroll; S opens the solution.

Push your changes with GitHub Desktop (Commit → Push). Both workflows re-run automatically: the web version updates, and a new IPA is built for you to re-install with Sideloadly.

Ideas to tune:
- `weights` in `js/app.js` sets how often each source shows up in *For you*.
- `WIKI_CATEGORY_GROUPS` in `js/sources.js` controls which Wikipedia topics appear.
- `SOURCES` in `js/sources.js` lists every source; each one is a small function you can copy to add another Hugging Face dataset.

## Credits

Problems: [NuminaMath-1.5](https://huggingface.co/datasets/project-numina/NuminaMath-1.5) (AMC/AIME problems with [AoPS Wiki](https://artofproblemsolving.com/wiki) solutions, [AoPS](https://artofproblemsolving.com/community) forum and olympiad problems; some forum solutions were written up with AI help). Theorems: [ProofWiki](https://proofwiki.org) (CC BY-SA) via [NaturalProofs](https://huggingface.co/datasets/wellecks/naturalproofs-gen). Sequences: the [OEIS](https://oeis.org) (CC BY-SA) via [christopher/oeis](https://huggingface.co/datasets/christopher/oeis). Articles: [Wikipedia](https://en.wikipedia.org) (CC BY-SA), live. Contest problems © MAA and their respective owners. MathScroll is for personal study and isn't affiliated with any of them.
