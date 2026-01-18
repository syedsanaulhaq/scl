# GitHub Actions Workflow Secrets Configuration

This document outlines all the secrets required for the CI/CD pipeline workflows.

## Production Deployment Secrets (`prod-deploy.yml`)

### SSH Access
- **PROD_SSH_HOST**: Production server hostname/IP address
- **PROD_SSH_USER**: SSH username for production server
- **PROD_SSH_KEY**: Private SSH key for authentication (PEM format)

### Notifications
- **SLACK_WEBHOOK_URL**: Slack webhook URL for deployment notifications
- **GITHUB_TOKEN**: GitHub token (auto-provided, no setup needed)

---

## Development Deployment Secrets (`dev-deploy.yml`)

### SSH Access
- **DEV_SSH_HOST**: Development server hostname/IP address
- **DEV_SSH_USER**: SSH username for development server
- **DEV_SSH_KEY**: Private SSH key for authentication (PEM format)

---

## Test Deployment Secrets (`test-deploy.yml`)

### SSH Access
- **TEST_SSH_HOST**: Test/staging server hostname/IP address
- **TEST_SSH_USER**: SSH username for test server
- **TEST_SSH_KEY**: Private SSH key for authentication (PEM format)

### Notifications
- **SLACK_WEBHOOK_URL**: Slack webhook URL for deployment notifications
- **GITHUB_TOKEN**: GitHub token (auto-provided, no setup needed)

---

## How to Add Secrets to GitHub

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with the exact name from above
5. Paste the value (SSH keys should be in PEM format)

## SSH Key Setup

To generate SSH keys for the servers:

```bash
# Generate a new SSH key
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa_prod -N ""

# Copy public key to server
ssh-copy-id -i ~/.ssh/id_rsa_prod.pub user@production-server

# Add the private key to GitHub Secrets (content of id_rsa_prod)
```

## Environment Configuration

The `prod-deploy.yml` workflow uses a GitHub environment named `production`. To set this up:

1. Go to **Settings** → **Environments**
2. Create a new environment named `production`
3. (Optional) Add protection rules for approval before deployment
4. (Optional) Add environment secrets if needed

## Verification

All workflows will validate that required secrets are accessible at runtime. If a secret is missing, the workflow will fail with a clear error message.

