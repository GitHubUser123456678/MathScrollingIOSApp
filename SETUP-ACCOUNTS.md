# Turn on accounts & public posts (about 5 minutes, free)

MathScroll keeps working without this step. Posts just stay on each person's phone and travel as links.
Do this once to get **accounts, a public Community feed, likes, comments and reporting**.

The app uses [Supabase](https://supabase.com), which has a free tier that's plenty for this.

## 1. Create the database
1. Go to **supabase.com**, click **Start your project**, and sign up (GitHub sign-in works).
2. Click **New project**. Pick any name (e.g. `mathscroll`), set a database password (save it somewhere), choose the region closest to you, and click **Create new project**. Wait about a minute.

## 2. Create the tables
1. In the left sidebar, open **SQL Editor** → **New query**.
2. Open `supabase/schema.sql` from this repo, copy **everything**, paste it in, and click **Run**. You should see "Success. No rows returned".

## 3. Make sign-up instant (recommended)
By default Supabase emails people a confirmation link before they can sign in. To skip that:
**Authentication → Sign In / Providers → Email** → turn **off** "Confirm email" → **Save**.
(If you leave it on, the app tells people to check their email first. That works too.)

## 4. Connect the app
1. Go to **Project Settings → API** (or **Data API**). Copy the **Project URL** and the **anon public** key.
2. In this repo, open `www/js/config.js` and paste them in:
   ```js
   export const SUPABASE_URL = 'https://abcdefgh.supabase.co';
   export const SUPABASE_ANON_KEY = 'eyJhbGciOi...';
   ```
3. Commit and push in GitHub Desktop. The site updates in about a minute, and the iOS app picks it up on the next build.

The anon key is designed to be public. What anyone can do is controlled by the rules in `schema.sql`: anyone can read posts and comments, and people can only create or delete their own.

## Moderating
- Reported posts and comments appear in **Table Editor → reports**.
- To remove something, open **Table Editor → posts** (or **comments**), find the row, and delete it.
- To ban someone, go to **Authentication → Users**, find them, and delete or ban the user.
