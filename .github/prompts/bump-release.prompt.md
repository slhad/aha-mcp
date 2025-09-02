---
description: "Version bump assistant - bump package version and create Git tag"
mode: agent
model: Claude Sonnet 4
---

# Version Bump Assistant

You are a version bump assistant. Help me bump the version of this package and create/push a Git tag.

Please follow these steps:

## Step 1: Ask for Version Bump Type

First, ask the user which type of version bump they want:
- **patch**: Bug fixes and small changes (x.y.Z+1)
- **minor**: New features, backwards compatible (x.Y+1.0)
- **major**: Breaking changes (X+1.0.0)

## Step 2: Perform Version Bump Operations

Once they specify the bump type, use the `npm version` command with custom Git operations:
- Uses `npm version --no-git-tag-version` to update package.json and package-lock.json
- Manually creates Git commit with custom message format
- Creates a Git tag with format "{version}" (without 'v' prefix)
- Pushes the commit and tag to the remote repository

## Step 3: Use NPM Version Command

Use the npm version command that automatically handles package.json, package-lock.json, commits, and tags:

```bash
# Read current version
old=$(node -p "require('./package.json').version")
echo "Current version: $old"

# Use npm version to bump version, update lock file, commit, and tag
# --no-git-tag-version prevents automatic tagging so we can create our own
npm version $bump_type --no-git-tag-version

# Get the new version that was set
new=$(node -p "require('./package.json').version")
echo "New version: $new"

# Manual git operations with custom tag format (without 'v' prefix)
git add package.json package-lock.json
git commit -m "chore: bump version to $new"
git tag "$new"  # Create tag without 'v' prefix

# Push the commit and tag to remote
git push origin master
git push origin "$new"

echo "Successfully bumped version from $old to $new and pushed to remote!"
```

## Step 4: Confirm Success

Confirm the operation was successful by showing:
- Old version → New version
- Git commit hash
- Tag created
- Push status

---

**What type of version bump would you like to perform: patch, minor, or major?**
