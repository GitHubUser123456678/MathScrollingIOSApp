# MathScroll

An endless, swipe-up feed of maths — like TikTok, but every "video" is a contest problem, a theorem, a concept or an integer sequence.

**What's in the feed**

| Tab | What | Size | Difficulty |
|---|---|---|---|
| ✨ Discover | Hand-made cards for everyone: 40 fun facts, 30 brain teasers with explanations, 6 tap-through visual proofs, and a "number spotlight" for any number | always fresh | easy |
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
- **Made for everyone**: on first open you pick *Just curious*, *Student* or *Competitor*, which tunes the mix (curious gets more Discover cards, competitors get AMC/AIME and olympiad problems first). Change it any time in Settings → Your feed style. A three-step tutorial shows how to swipe, answer and like.
- **Bottom navigation** (Home · Learn · ＋ Post · Games · Me), and redesigned cards: a big faint symbol for each kind of card, a 5-bar difficulty meter, larger answer buttons, bursts and confetti when you're right, a shake when you're wrong, and an explanation right under the answer.
- Swipe one card at a time, TikTok-style. Double-tap or tap the heart to like.
- Tap A–E or type an answer and it's checked instantly; streak counter for answers in a row.
- **Diagrams and pictures**: Asymptote diagrams in AMC/AIME and MATH problems are drawn in the app (a built-in Asymptote interpreter), olympiad and forum problems show their images, Wikipedia cards keep their main picture, and tapping any picture opens it full screen.
- **Hints** (the first step of the solution) and full solutions/proofs that slide up.
- **Focus problems**: every few problems the feed pauses for 10 seconds (or until you answer) so you really try it, with a few skips a day. Hints, answers, solutions and source links unlock after the think time, and flicking past several problems in a row triggers a focus problem. Think time is tracked in your profile. All adjustable in Settings.
- **XP & levels**: every solve earns XP (more for harder problems, ×1.5–×2.5 combos for answer streaks), plus a daily sign-in bonus; level-ups with titles from Novice to Legend.
- **Rewards**: lucky "critical" solves (2× XP), a chest every 5 solves and every level-up (XP, streak freezes, avatar frames, jackpots), "on fire" mode at 5 in a row, sound effects, and an always-visible XP bar.
- **Leagues**: Bronze → Silver → Gold → Platinum → Diamond → Master by weekly XP.
- **🎓 Learn**: **Foundations** courses (7 MATH subjects, levels 1–5) and **Olympiad** courses (number theory, combinatorics, algebra, geometry, mixed; Omni-MATH, warm-up to IMO). Each unit has:
  - a 📚 **lecture** written for that unit: a hook, three explained ideas, a worked example revealed step by step, a quick check question with an explanation, a Wikipedia "go deeper" page, a real competition problem, and flip-card recap (the 📖 guidebook keeps the notes);
  - four lessons with hearts and **confidence bets** (🤷 guess / 🙂 think so / 🔒 sure: sure pays bonus XP but costs two hearts if wrong; your calibration is shown at the end);
  - a 🎁 chest, a 🏆 unit test, and a 👹 **boss problem** one level harder, with a hint ladder that lowers the reward;
  - a 🧠 **memory meter** that fades like real memory (one-week half-life, doubling with each review) and asks you to refresh;
  - a 📖 guidebook and a 👑 legendary no-mistakes challenge, plus a 🔁 mistakes review.
- **Answers you can type**: besides whole numbers and multiple choice, problems with answers like 3/4, 2√3 or π/6 are checked by value. You can type `3/4`, `2sqrt(3)` or `pi/6`.
- **12 mini-games** (🎮 Games tab), each a different kind of game, with first-play tutorials, particle effects and a daily **game of the day** (2× XP):
  - **Action:** *Number Ninja* (swipe to slice numbers that fit the rule: primes, squares, multiples…), *Meteor Defense* (tap answers to laser falling meteors, in waves), *Math Blitz* (60 s of mixed speed maths with combo multipliers, fever mode and time freezes).
  - **Puzzle:** Block Blast, 2048, Sudoku, Minesweeper.
  - **Brain teasers:** 24, Code Breaker, Memory Match.
  - **Strategy:** Chess Puzzles (Lichess, rated), Nim.
  - Games cost ⚡ (earned by solving problems), except Math Blitz, 24 and Memory Match.
- **Feed**: odd or broken cards are skipped (problems that refer to a missing figure, garbled or near-empty text, stub articles) while every source stays in. Every 8 cards the For you feed drops in a ⚡ lightning round, a Quick 24, a "continue your course" card or the game of the day.
- **⚡ Charges**: every correct answer — feed, Learn or in-game — earns 1 ⚡. When you're out, the game hands you a problem to solve. Set how hard those problems are in Games → change (Easy, Medium, Hard, Expert).
- **Duels**: play 5 AMC/AIME problems, send a friend a link with the same five, see who wins (no account needed).
- **Avatar frames** to collect and equip; a session recap every 30 minutes.
- **Daily quests**: three a day (the same for everyone); finishing all three gives bonus XP and a streak freeze that protects your day streak.
- **Progress hub** (the level ring, top left): level, quests, streaks, daily challenge results and leaderboards.
- **Daily challenge**: the same AMC/AIME problem for everyone each day, with a daily streak and a share-your-result button.
- **Sprint**: 10 answerable AMC/AIME problems against the clock, with a personal best.
- **Guess the next term** on every OEIS sequence.
- **Post** your own problems, facts and questions with a live maths preview. Sharing makes a link that contains the whole post, so anyone can open it in MathScroll — no account or server needed.
- **Search** across problems, ProofWiki, the OEIS and Wikipedia.
- **Account-only features** (once accounts are set up): the daily challenge, weekly/all-time/sprint leaderboards, ranked sprints, and saving more than 20 cards. Before setup nothing is locked.
- **Accounts & Community** (after the 5-minute setup in [SETUP-ACCOUNTS.md](SETUP-ACCOUNTS.md)): sign up with a username, post publicly, like, comment, report, and share links to posts.
- **Filters**: difficulty range or "match my level", answer type (A–E / number / proof), only checkable problems, topics, Wikipedia topics, sources, classic sequences, skip seen.
- **Skill rating**: an Elo-style rating that rises faster for harder problems, with a history graph and accuracy by difficulty and by topic.
- **Profile**: solved count, accuracy, best run, day streak, daily goal with a 7-day strip, 16 badges, and your Saved / Liked / Posts.
- **For you** learns what you like, save and solve, and shows more of it.
- Topic filter (algebra, number theory, combinatorics incl. graph theory, geometry, inequalities, calculus, logic), light/dark theme, works offline for the app shell.

Without accounts set up, everything is stored on your own phone. With them, posts, likes and comments are public; your stats stay on your phone.

No API keys, no server, no accounts. Everything is free and public.

---


## ⚔️ Numeria — the MathScroll MMO (`www/rpg/`)

A separate game for ages 12–16 that lives in the same app, at `/rpg/` (open it from **Games → Numeria**).

- **World:** the town of Integer Hamlet plus six zones that climb from **AMC 8** to the **AIME**: Fraction Fields → Prime Woods → Polygon Peaks → Modular Marsh → Combinatoria Canyon → Citadel of AIME. Maps are generated from fixed seeds, so every player sees the same world. Tap to walk (or use WASD/arrows), talk to townsfolk, and use 🔷 waystones to fast travel.
- **Battles:** regular monsters ask quick AMC-style questions (25 generators, five choices, 30 s, critical hits for fast answers). **Elites, zone bosses and the raid boss use real contest problems**: AMC 8/10/12 and AIME from Easy2Hard-Bench (with difficulty ratings) and AIME 1983–2024, checked by value, with solutions and AoPS Wiki links.
- **Heroes:** four classes (Algebraist, Geometer, Number Theorist, Combinatorist), each with +25% damage on its topic and a maths hint ability: Estimate, Sketch, Last Digit or Eliminate. Abilities unlock as you level: Focus, Heal, Second Chance, Overdrive.
- **Progression:** XP and levels up to 30, gold, a shop, gear (weapon/armour/charm), potions, an inn, the main story (recover a Theorem Shard from each zone guardian), side quests, three daily bounties, and a trainer you can spar with.
- **Multiplayer:** other players appear live in your zone. Chat is **quick chat only** (preset phrases and emotes), so it stays safe for minors. The **Grand Examiner** is an hourly raid boss with shared HP: every correct AIME answer from anyone in the Citadel damages it. Multiplayer runs over Supabase Realtime once `js/config.js` has your Supabase URL and anon key (Realtime broadcast is on by default; no tables needed). Without it, players in other tabs on the same device see each other, and labelled 🤖 NPC adventurers keep zones lively.
- Saves automatically on the device.

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
