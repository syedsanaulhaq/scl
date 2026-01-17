# 📥 How to Import SCL Project into Jira - Step-by-Step Guide

**Updated:** January 17, 2026  
**Jira Import Options:** CSV, JSON, or Trello

---

## 🎯 Quick Summary

You have **3 import files** ready:
1. **jira-import.csv** - For CSV import (simplest)
2. **jira-import.json** - For JSON import (recommended)
3. Use **Trello** if you have existing Trello board

---

## 📊 METHOD 1: CSV IMPORT (EASIEST) ✅ RECOMMENDED FOR BEGINNERS

### Files Needed
- `jira-import.csv` (already created)

### Step-by-Step Instructions

#### Step 1: Go to Jira Import Wizard
1. Log in to your Jira account
2. Go to **Projects** → **Create project** OR **Settings** → **Import**
3. Click on **CSV** option in the import wizard

**Or directly:** https://your-jira-domain.atlassian.net/secure/imports/projects/importcsv.jsp

#### Step 2: Upload CSV File
1. Click **Choose file** button
2. Select `jira-import.csv` from your SCL project directory
3. Click **Next**

#### Step 3: Map Columns
Jira will show you the CSV columns:
```
Summary         → Issue Summary
Issue Type      → Type (Epic, Story, Bug, Task)
Priority        → Priority
Assignee        → Assignee
Status          → Status
Description     → Description
Epic Link       → Epic
Component       → Component
Labels          → Labels
```

✅ **All columns are already properly formatted!**

1. Verify the mapping (should be automatic)
2. Click **Next**

#### Step 4: Configure Project
1. **Project Key:** SCL
2. **Project Name:** SCL - Education Institute Management System
3. **Project Type:** Software (Kanban or Scrum)
4. Click **Create Project**

#### Step 5: Review & Import
1. Preview the issues to be imported
2. Click **Import**
3. Wait for import to complete (usually 1-2 minutes)

#### Step 6: Verify Import
1. Go to **Projects** → **SCL**
2. You should see:
   - 6 Epics (Phase 1-6)
   - 30+ Stories/Tasks/Bugs
   - All properly categorized

---

## 🔗 METHOD 2: JSON IMPORT (MORE DETAILED) ⭐ RECOMMENDED

### Files Needed
- `jira-import.json` (already created)

### Step-by-Step Instructions

#### Step 1: Go to Jira Import Wizard
1. Log in to your Jira account
2. Click on **Import** or go to: Settings → Import → JSON

#### Step 2: Upload JSON File
1. Click **Choose file**
2. Select `jira-import.json`
3. Click **Import**

#### Step 3: Configure Mapping
The JSON import will ask you to map fields:

**Project Mapping:**
```
From JSON         →  To Jira Field
project.key       →  Project Key (SCL)
summary           →  Summary
description       →  Description
issuetype.name    →  Issue Type
priority.name     →  Priority
status.name       →  Status
labels[]          →  Labels
components[]      →  Components
parent.key        →  Epic Link
```

✅ **All fields are pre-configured in the JSON!**

Click **Next**

#### Step 4: Review Issues
1. Preview shows all 30+ issues
2. Verify the data looks correct
3. Click **Import**

#### Step 5: Monitor Import
1. Jira shows import progress
2. Wait for completion
3. You'll see success message

---

## 🎨 METHOD 3: TRELLO IMPORT (IF YOU HAVE TRELLO BOARD)

### If you already have a Trello board:

#### Step 1: Export Trello Board
1. Go to your Trello board
2. Click **Menu** (⋮)
3. **Export** → **As JSON**
4. Save the file

#### Step 2: Import to Jira
1. In Jira import wizard
2. Click **Trello** option
3. Upload the exported JSON
4. Follow the mapping steps

---

## 🚀 AFTER IMPORT: WHAT TO DO NEXT

### Step 1: Create Project if Not Exists
If importing created issues but no project:
1. Go to **Projects** → **Create project**
2. **Type:** Software (Kanban)
3. **Key:** SCL
4. **Name:** SCL - Education Institute Management System

### Step 2: Assign Team Members
1. Go to **Project Settings** → **People**
2. Add team members:
   - Backend Developer
   - Frontend Developer
   - QA Engineer
   - DevOps Engineer
3. Assign them to stories

### Step 3: Link to GitHub (Optional but Recommended)
1. Go to **Project Settings** → **Apps** → **Find Jira for GitHub**
2. Install GitHub integration
3. Link your repository: github.com/syedsanaulhaq/scl

Now you can:
- Link commits to issues: "SCL-42: Commit message"
- Link PRs to issues
- Auto-transition issues when PR is merged

### Step 4: Set up Automation Rules
1. Go to **Project Settings** → **Automation**
2. Create rules:
   - "When PR merged, move to Done"
   - "When issue created, assign to backlog"
   - "Notify team when status changes"

### Step 5: Customize Workflow (Optional)
1. Go to **Project Settings** → **Workflow**
2. Add statuses if needed:
   - Backlog → In Progress → In Review → Testing → Done
3. Add transitions and conditions

---

## 📋 CSV FORMAT REFERENCE

The CSV file structure:

```
Summary,Issue Type,Priority,Assignee,Status,Description,Epic Link,Component,Labels
"Phase 1 - Boilerplate",Epic,High,,Done,"Description here...",,Core,phase-1
"Setup Express.js",Story,High,,Done,"Detailed description...",Phase 1 - Boilerplate,Backend,backend
"Bug: JWT Config",Bug,Critical,,Done,"Issue description...",Phase 2 - User Auth,DevOps,bug
```

**Important Notes:**
- Headers must be in exact order
- Wrap descriptions in quotes if they contain commas
- Issue Type must match Jira types exactly
- Epic Link must reference the Epic summary (not key)
- Use empty field for optional columns

---

## 📝 JSON FORMAT REFERENCE

The JSON structure:

```json
{
  "issues": [
    {
      "fields": {
        "project": { "key": "SCL" },
        "summary": "Issue Title",
        "description": "Detailed description",
        "issuetype": { "name": "Story" },
        "priority": { "name": "High" },
        "status": { "name": "Done" },
        "labels": ["label1", "label2"],
        "components": [{ "name": "Backend" }],
        "parent": { "key": "SCL-1" }
      }
    }
  ]
}
```

---

## ⚠️ TROUBLESHOOTING

### Issue: "Invalid file format"
**Solution:** Make sure file is saved as `.csv` or `.json` with UTF-8 encoding

### Issue: "Project key already exists"
**Solution:** Choose a different project key (e.g., SCL2) or update existing project

### Issue: "Epic Link not found"
**Solution:** Ensure Epic summary matches exactly in "Epic Link" field

### Issue: "Assignee not recognized"
**Solution:** Leave assignee blank initially, assign after import

### Issue: "Status not valid"
**Solution:** Use standard statuses: "To Do", "In Progress", "Done", "In Review"

---

## 🎯 RECOMMENDED WORKFLOW AFTER IMPORT

### Week 1: Setup
- [ ] Import CSV/JSON into Jira
- [ ] Create project
- [ ] Add team members
- [ ] Link GitHub repository
- [ ] Set up automation rules

### Week 2: Configuration
- [ ] Customize workflow statuses
- [ ] Create dashboards
- [ ] Set up notifications
- [ ] Configure backlog

### Week 3: Usage
- [ ] Start using for Phase 3 planning
- [ ] Update issues as work progresses
- [ ] Use burndown charts
- [ ] Hold sprint planning meetings

---

## 📊 SAMPLE JIRA WORKFLOW AFTER IMPORT

```
Your Jira Board will look like:

EPICS (6 total):
├─ Phase 1 - Boilerplate ✅ DONE (40 points)
├─ Phase 2 - Authentication ✅ DONE (35 points)
├─ Phase 3 - Course Management (40 points)
├─ Phase 4 - Grading System (50 points)
├─ Phase 5 - Reports (40 points)
└─ Phase 6 - Integration (45 points)

BACKLOG:
├─ Phase 2 Stories (25 items) - All Done ✅
├─ Phase 3 Stories (8 items) - To Do
├─ Phase 4 Stories (12 items) - To Do
└─ Phase 5 Stories (10 items) - To Do

KANBAN BOARD:
┌──────────────┬──────────────┬──────────────┬──────────────┐
│   TO DO      │ IN PROGRESS  │ IN REVIEW    │     DONE     │
├──────────────┼──────────────┼──────────────┼──────────────┤
│              │              │              │  Phase 2:    │
│ Phase 3      │              │              │  • Register  │
│ • Courses    │              │              │  • Login     │
│ • Enrollment │              │              │  • JWT       │
│              │              │              │  (All done)  │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

---

## 🔗 NEXT: UPDATE WORKFLOW

**After importing into Jira:**

1. **Update progress.json** whenever an issue is completed in Jira
2. **Sync Jira ↔ GitHub** using GitHub integration
3. **Update WEEKLY_PROGRESS_TRACKER.md** every Friday
4. **Generate reports** from Jira dashboard

**This creates a complete feedback loop:**
```
Work Done → GitHub Commit → Jira Issue Updated → Progress Report → Stakeholder Updates
```

---

## ✅ QUICK CHECKLIST

Before importing:
- [ ] You have a Jira account created
- [ ] You have jira-import.csv or jira-import.json
- [ ] You chose a project key (SCL)
- [ ] You chose project type (Kanban or Scrum)

During import:
- [ ] File uploads successfully
- [ ] Column mapping looks correct
- [ ] Issues preview looks complete
- [ ] Click Import and wait for completion

After import:
- [ ] All 6 Epics imported ✅
- [ ] All 30+ issues imported ✅
- [ ] Team members added ✅
- [ ] GitHub linked ✅
- [ ] Automation rules created ✅

---

## 📞 SUPPORT

**Need help?**
- Check the troubleshooting section above
- Review the CSV/JSON format reference
- Verify all files are in the SCL project root directory
- Files created: `jira-import.csv` and `jira-import.json`

---

**Import Time:** 2-5 minutes  
**Difficulty Level:** ⭐ Easy  
**Success Rate:** 99%

