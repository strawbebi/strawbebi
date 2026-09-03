# Supabase setup — private Our Little Archive

## 1. Create your Supabase project

Create a project in Supabase.

Then open the project's **Connect** dialog and copy:
- Project URL
- Publishable key

Put them into:

`js/supabase-config.js`

Example:

```js
const SUPABASE_URL = "https://your-project.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "your-publishable-key";
```

Do NOT put a secret/service_role key in this browser project.

## 2. Create the one authorized account

In Supabase Dashboard:

Authentication -> Users -> Add user

Create the email/password account that you want to allow.

If you later decide that both you and your partner should have accounts, create a second user there.

There is intentionally NO sign-up page in this website.

## 3. Disable public sign-ups

In Supabase Dashboard, go to the Authentication settings and turn OFF:

**Allow new users to sign up**

With signups disabled, only existing users can sign in.

This is the key setting that makes this an invite/manual-account-only website.

## 4. Test

Open `login.html`.

Wrong account:
- Supabase rejects the login.
- The website displays the private-space error.
- Dashboard is not opened.

Correct account:
- Supabase creates a session.
- The user is redirected to `dashboard.html`.

## 5. Private pages

The following pages run an authentication check:
- dashboard.html
- photos.html
- videos.html
- journal.html
- documents.html
- add-memory.html

If no authenticated user is found, they are redirected to login.html.

## Important security note

The browser can protect navigation, but the real protection for your future photos/videos/documents/journal data must also be enforced with Supabase database RLS and private Storage policies. Those will be added when we build the upload/database phase.

The browser must only contain your Supabase Project URL and Publishable key. Never expose a secret/service_role key in HTML or JavaScript.

## 6. Uploader attribution

This version records who added each memory. The two private accounts are displayed as:
- `vallejosvanessa59@gmail.com` -> **Kayla**
- `villaryezchia@gmail.com` -> **Yezchia**

Run the included `UPLOADER-ATTRIBUTION.sql` file once in **Supabase -> SQL Editor**. It adds the `uploaded_by` column and backfills existing memories, so older uploads will also show the correct name.

New uploads automatically save the same name in the memory record. The name appears on Photos, Videos, Journal, and Documents, including the Journal reader and Document viewer.
