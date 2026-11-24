# Turn on accounts & public posts (about 5 minutes, free)

MathScroll keeps working without this step. Posts just stay on each person's phone and travel as links.
Do this once to get **permanent accounts with email confirmation, a public Community feed, likes, comments and reporting**. Each account's stats, saves, likes, badges and private posts are stored on the server too, so they follow you to any device.

The app uses [Supabase](https://supabase.com), which has a free tier that's plenty for this.

## 1. Create the database
1. Go to **supabase.com**, click **Start your project**, and sign up (GitHub sign-in works).
2. Click **New project**. Pick any name (e.g. `mathscroll`), set a database password (save it somewhere), choose the region closest to you, and click **Create new project**. Wait about a minute.

## 2. Create the tables
1. In the left sidebar, open **SQL Editor** → **New query**.
2. Open `supabase/schema.sql` from this repo, copy **everything**, paste it in, and click **Run**. You should see "Success. No rows returned".

## 3. Email confirmation
New accounts must confirm their email before they can sign in. "Confirm email" is on by default in Supabase; leave it on.

**Point the email links at your site.** Go to **Authentication → URL Configuration** and set:
- **Site URL:** `https://githubuser123456678.github.io/MathScrollingIOSApp/`
- **Redirect URLs:** add the same address.

Tapping the link in a confirmation email then opens MathScroll, which signs the person in automatically. Password-reset emails work the same way: the link opens a "choose a new password" screen.

**Set up real email sending (needed for anyone other than you).** Supabase's built-in email only reaches you (the project owner) and sends about 2 emails an hour. That's fine for testing but not for friends. To fix it, connect a free email sender under **Authentication → Emails → SMTP Settings** (turn on **Enable custom SMTP**). Two easy options:
- **Gmail (simplest):** turn on 2-Step Verification for your Google account, then create an **App password** at myaccount.google.com/apppasswords. In Supabase use host `smtp.gmail.com`, port `587`, username = your Gmail address, password = the 16-character app password, sender email = your Gmail address, sender name = `MathScroll`. Allows a few hundred emails a day.
- **Brevo** (brevo.com, free 300 emails/day): sign up, verify your sender email, then copy the SMTP host, port, login and key from **SMTP & API** into Supabase.

Then raise the limit under **Authentication → Rate Limits** ("emails sent per hour") to something like 30.

Optional: under **Authentication → Emails → Templates** you can reword the "Confirm signup" email, e.g. subject "Confirm your MathScroll account".

## 4. Connect the app
1. Go to **Project Settings → API** (or **Data API**). Copy the **Project URL** and the **anon public** key.
2. In this repo, open `www/js/config.js` and paste them in:
   ```js
   export const SUPABASE_URL = 'https://abcdefgh.supabase.co';
   export const SUPABASE_ANON_KEY = 'eyJhbGciOi...';
   ```
3. Commit and push in GitHub Desktop. The site updates in about a minute, and the iOS app picks it up on the next build.

The anon key is designed to be public. What anyone can do is controlled by the rules in `schema.sql`: anyone can read posts and comments, and people can only create or delete their own.

## How accounts work
- **Sign up:** username, email and password. MathScroll sends a confirmation email; tapping the link finishes sign-up and signs you in. There's a **Resend email** button if it doesn't arrive.
- **Sign in** works on any device (website or iPhone app), and your data syncs automatically.
- **Forgot password?** on the sign-in screen emails a link for choosing a new password.
- Accounts are permanent until you delete them in **Authentication → Users**.

## Moderating
- Reported posts and comments appear in **Table Editor → reports**.
- To remove something, open **Table Editor → posts** (or **comments**), find the row, and delete it.
- To ban someone, go to **Authentication → Users**, find them, and delete or ban the user.
