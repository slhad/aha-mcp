---
description: "Version bump assistant - bump package version, create Git tag, and create GitHub release"
mode: agent
model: Claude Sonnet 4
---

# Version Bump Assistant

You are a version bump assistant. Help me bump the version of this package, create/push a Git tag, and create a GitHub release.

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
- Creates a GitHub release using the `gh` CLI

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

# Generate detailed release notes based on commit logs
commit_logs=$(git log "$old..$new" --oneline --pretty=format:"%s")
echo "Commits since last version:"
echo "$commit_logs"

# Analyze commit types for release notes
features=$(echo "$commit_logs" | grep -i "feat\|add\|new")
fixes=$(echo "$commit_logs" | grep -i "fix\|bug\|patch")
improvements=$(echo "$commit_logs" | grep -i "improve\|enhance\|update\|refactor")
docs=$(echo "$commit_logs" | grep -i "doc\|readme")
other=$(echo "$commit_logs" | grep -v -i "feat\|add\|new\|fix\|bug\|patch\|improve\|enhance\|update\|refactor\|doc\|readme")

# Build detailed release notes
notes="## What's Changed in v$new"$'\n\n'

if [ -n "$features" ]; then
    notes+="### 🚀 New Features"$'\n'
    while IFS= read -r line; do
        notes+="- $line"$'\n'
    done <<< "$features"
    notes+=$'\n'
fi

if [ -n "$fixes" ]; then
    notes+="### 🐛 Bug Fixes"$'\n'
    while IFS= read -r line; do
        notes+="- $line"$'\n'
    done <<< "$fixes"
    notes+=$'\n'
fi

if [ -n "$improvements" ]; then
    notes+="### ✨ Improvements"$'\n'
    while IFS= read -r line; do
        notes+="- $line"$'\n'
    done <<< "$improvements"
    notes+=$'\n'
fi

if [ -n "$docs" ]; then
    notes+="### 📚 Documentation"$'\n'
    while IFS= read -r line; do
        notes+="- $line"$'\n'
    done <<< "$docs"
    notes+=$'\n'
fi

if [ -n "$other" ]; then
    notes+="### 🔧 Other Changes"$'\n'
    while IFS= read -r line; do
        notes+="- $line"$'\n'
    done <<< "$other"
    notes+=$'\n'
fi

notes+="**Full Changelog**: https://github.com/slhad/aha-mcp/compare/$old..$new"

echo "Generated release notes:"
echo "$notes" > release_notes.md

```

## Step 4: Generate a summary from notes

- Read the generated release notes with runCommands tool
- Create a concise oneliner summary title from the detailed notes.
- Write it to a file or output variable.

## Step 5: Create release

Use the summary generated from the detailed notes and notes to create the release with the new tag.

```bash
gh release create "$new" --title "$summary" --notes "$(< release_notes.md)" --latest
echo "Successfully bumped version from $old to $new, pushed to remote, and created GitHub release!"
rm release_notes.md
```

## Step 6: Confirm Success

Confirm the operation was successful by showing:
- Old version → New version
- Git commit hash
- Tag created
- Push status
- GitHub release created

---

**What type of version bump would you like to perform: patch, minor, or major?**
