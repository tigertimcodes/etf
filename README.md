# 🌸 Blossom ETF Lead Generator

Finds new ETF launches each week, pulls LinkedIn pages and marketing contacts, and emails you a digest.

---

## Deploy in 5 steps

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/blossom-etf-leads.git
git push -u origin main
```

### 2. Connect to Netlify
1. Go to [app.netlify.com](https://app.netlify.com)
2. Click **"Add new site" → "Import an existing project"**
3. Choose **GitHub** → select your repo
4. Build settings (auto-detected):
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click **Deploy site**

### 3. Get your API keys
- **Anthropic API key**: [console.anthropic.com](https://console.anthropic.com) → API Keys
- **Resend API key**: [resend.com](https://resend.com) → free account → API Keys

### 4. Add environment variables in Netlify
Go to: **Site settings → Environment variables → Add variable**

| Key | Value |
|-----|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-...` |
| `RESEND_API_KEY` | `re_...` |
| `FROM_EMAIL` | `onboarding@resend.dev` ← use this until you add a custom domain |

### 5. Trigger a redeploy
Go to **Deploys → Trigger deploy → Deploy site** — your app is live!

---

## How it works

- **Page load**: Calls `/api/fetch-etfs` → Claude searches for new ETF launches + LinkedIn URLs
- **Send button**: Calls `/api/send-digest` → Resend delivers a branded HTML email
- **Weekly cron**: Every Monday at 9am ET, `/api/fetch-etfs` runs automatically (Netlify Scheduled Functions)

## Using a custom domain for email
1. Add your domain in Resend → Domains
2. Add the DNS records Resend gives you
3. Update `FROM_EMAIL` in Netlify env vars to `etf-leads@yourdomain.com`

---

## Local development
```bash
npm install
npm run dev          # frontend at localhost:5173

# To test functions locally, install Netlify CLI:
npm install -g netlify-cli
netlify dev          # runs everything at localhost:8888
```
