# Documentation Guidelines for AI Builders

## 📁 Directory Structure

All documentation should be organized in the `docs/` directory with date-based subdirectories:

```
docs/
├── 2025-06-25/           # Documents created on June 25, 2025
│   ├── GOOGLE_OAUTH_SETUP.md
│   ├── SUPABASE_SETUP.md
│   └── PATIENT_INTEGRATION.md
├── 2025-06-26/           # Documents created on June 26, 2025 (example)
│   ├── NEW_FEATURE_DOCS.md
│   └── API_CHANGES.md
└── README.md             # This file
```

## 🤖 AI Builder Instructions

When creating documentation as an AI assistant, follow these rules:

### 1. **Date-Based Organization**
- **Always** check the current date before creating documentation
- Create documents in a directory named `YYYY-MM-DD` format (e.g., `2025-06-25`)
- If the directory for today's date doesn't exist, create it first
- If working on a different day, create a new directory for that date

### 2. **Directory Creation Process**
```bash
# Check if today's directory exists
# If current date is 2025-06-25, create:
docs/2025-06-25/

# If current date is 2025-06-26, create:
docs/2025-06-26/
```

### 3. **Document Naming Conventions**
- Use UPPERCASE for important setup/configuration files: `SETUP_GUIDE.md`
- Use descriptive names: `PATIENT_INTEGRATION.md` not `integration.md`
- Use underscores for multi-word names: `API_DOCUMENTATION.md`
- Include version numbers when applicable: `DATABASE_MIGRATION_V2.md`

### 4. **Content Requirements**
Every documentation file should include:
- **Clear title** and purpose
- **Date created** (in frontmatter or at top)
- **Overview/Summary** section
- **Step-by-step instructions** when applicable
- **Code examples** with proper syntax highlighting
- **Troubleshooting** section when relevant
- **Dependencies** or prerequisites

### 5. **Cross-Referencing**
- Always update the main project README when adding significant documentation
- Reference related documents using relative paths from project root
- Example: `See [Patient Integration](docs/2025-06-25/PATIENT_INTEGRATION.md) for details`

## 📋 Document Types & Templates

### Setup/Configuration Documents
```markdown
# [Feature] Setup Guide

## Overview
Brief description of what this sets up.

## Prerequisites
- Requirement 1
- Requirement 2

## Step-by-Step Instructions
1. First step
2. Second step

## Environment Variables
```env
VARIABLE_NAME=value
```

## Testing
How to verify the setup works.

## Troubleshooting
Common issues and solutions.
```

### Feature Implementation Documents
```markdown
# [Feature] Implementation

## Overview
What was implemented and why.

## Changes Made
### Files Modified
- `file1.ts` - Description of changes
- `file2.tsx` - Description of changes

### New Files Created
- `newfile.ts` - Purpose and functionality

## Technical Details
Implementation specifics.

## Usage Examples
How to use the new feature.

## Impact & Benefits
What this change enables.
```

## 🔄 Maintenance Guidelines

### For AI Builders:
1. **Before creating any documentation**, run:
   ```javascript
   const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
   ```
2. **Check if directory exists**: `docs/${today}/`
3. **Create directory if needed**: `mkdir docs/${today}`
4. **Place all documents** in the date-appropriate directory
5. **Update this README** if adding new document types or conventions

### For Human Developers:
- Review documentation organization monthly
- Archive old directories if they become irrelevant
- Ensure all setup documents are current and working
- Update cross-references when files are moved

## 📈 Benefits of This System

1. **Chronological Organization**: Easy to see when features were added
2. **Historical Context**: Understand development timeline
3. **Easier Maintenance**: Know which docs might be outdated
4. **Clear Responsibility**: Each AI session's work is clearly grouped
5. **Better Collaboration**: Humans can track AI contributions over time

## 🚨 Important Notes

- **Never mix documents from different dates** in the same directory
- **Always check the current date** before creating documents
- **Create the directory structure first**, then add documents
- **Use consistent naming** across all documentation
- **Reference the date directory** in any cross-links from project root

---

*This guideline was created on 2025-06-25. Update as needed for future documentation standards.*
