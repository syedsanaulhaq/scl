# 🔑 HOW TO GET YOUR GITHUB PERSONAL ACCESS TOKEN

Follow these steps to create a token for the automated configuration:

## Step 1: Go to GitHub Settings
👉 Visit: https://github.com/settings/tokens

Or manually:
1. Go to github.com
2. Click your profile photo (top right)
3. Click "Settings"
4. Click "Developer settings" (left sidebar, bottom)
5. Click "Personal access tokens" → "Tokens (classic)"

## Step 2: Create New Token
1. Click "Generate new token (classic)"
2. Name: `SCL-Configuration` (or any name)
3. Expiration: 30 days (for safety)

## Step 3: Select Scopes (Permissions)
✅ Check these boxes:
- [ ] repo (all: Full control of private repositories)
- [ ] admin:repo_hook (if available)
- [ ] admin:org (if available)
- [ ] workflow (Updates GitHub Actions workflows)

## Step 4: Generate Token
1. Click "Generate token" button
2. **COPY THE TOKEN** (you won't see it again!)
3. Paste it when the script asks

## Step 5: Run Script
Paste your token when prompted:
```
Token: [paste here]
```

---

## ⚠️ IMPORTANT NOTES

- ✅ Keep token secret - don't share it
- ✅ Token expires after 30 days
- ✅ You can revoke it anytime
- ✅ Create a new one if you lose it

## Token is Needed For:
- Setting branch protection rules
- Enabling GitHub Actions
- Configuring repository settings

---

## Ready?

1. Go to: https://github.com/settings/tokens
2. Generate new token (classic)
3. Copy the token
4. Come back to terminal
5. Paste when prompted

Let's go! 🚀
