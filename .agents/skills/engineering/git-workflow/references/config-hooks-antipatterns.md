<!-- Part of the `git-workflow` skill. Read only when the router in SKILL.md points you here. -->

## Git Configuration

### Essential Configs

```bash
# User identity
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Default branch name
git config --global init.defaultBranch main

# Pull behavior (rebase instead of merge)
git config --global pull.rebase true

# Push behavior (push current branch only)
git config --global push.default current

# Auto-correct typos
git config --global help.autocorrect 1

# Better diff algorithm
git config --global diff.algorithm histogram

# Color output
git config --global color.ui auto
```

### Useful Aliases

```bash
# Add to ~/.gitconfig
[alias]
    co = checkout
    br = branch
    ci = commit
    st = status
    unstage = reset HEAD --
    last = log -1 HEAD
    visual = log --oneline --graph --all
    amend = commit --amend --no-edit
    wip = commit -m "WIP"
    undo = reset --soft HEAD~1
    contributors = shortlog -sn
```

### Gitignore Patterns

```gitignore
# Dependencies
node_modules/
vendor/

# Build outputs
dist/
build/
*.o
*.exe

# Environment files
.env
.env.local
.env.*.local

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Test coverage
coverage/

# Cache
.cache/
*.tsbuildinfo
```

## Common Workflows

### Starting a New Feature

```bash
# 1. Update main branch
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/user-auth

# 3. Make changes and commit
git add .
git commit -m "feat(auth): implement OAuth2 login"

# 4. Push to remote
git push -u origin feature/user-auth

# 5. Create Pull Request on GitHub/GitLab
```

### Updating a PR with New Changes

```bash
# 1. Make additional changes
git add .
git commit -m "feat(auth): add error handling"

# 2. Push updates
git push origin feature/user-auth
```

### Syncing Fork with Upstream

```bash
# 1. Add upstream remote (once)
git remote add upstream https://github.com/original/repo.git

# 2. Fetch upstream
git fetch upstream

# 3. Merge upstream/main into your main
git checkout main
git merge upstream/main

# 4. Push to your fork
git push origin main
```

### Undoing Mistakes

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Undo last commit pushed to remote
git revert HEAD
git push origin main

# Undo specific file changes
git checkout HEAD -- path/to/file

# Fix last commit message
git commit --amend -m "New message"

# Add forgotten file to last commit
git add forgotten-file
git commit --amend --no-edit
```

## Git Hooks

### Pre-Commit Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Run linting
npm run lint || exit 1

# Run tests
npm test || exit 1

# Check for secrets
if git diff --cached | grep -E '(password|api_key|secret)'; then
    echo "Possible secret detected. Commit aborted."
    exit 1
fi
```

### Pre-Push Hook

```bash
#!/bin/bash
# .git/hooks/pre-push

# Run full test suite
npm run test:all || exit 1

# Check for console.log statements
if git diff origin/main | grep -E 'console\.log'; then
    echo "Remove console.log statements before pushing."
    exit 1
fi
```

## Anti-Patterns

```
# BAD: Committing directly to main
git checkout main
git commit -m "fix bug"

# GOOD: Use feature branches and PRs

# BAD: Committing secrets
git add .env  # Contains API keys

# GOOD: Add to .gitignore, use environment variables

# BAD: Giant PRs (1000+ lines)
# GOOD: Break into smaller, focused PRs

# BAD: "Update" commit messages
git commit -m "update"
git commit -m "fix"

# GOOD: Descriptive messages
git commit -m "fix(auth): resolve redirect loop after login"

# BAD: Rewriting public history
git push --force origin main

# GOOD: Use revert for public branches
git revert HEAD

# BAD: Long-lived feature branches (weeks/months)
# GOOD: Keep branches short (days), rebase frequently

# BAD: Committing generated files
git add dist/
git add node_modules/

# GOOD: Add to .gitignore
```

## Quick Reference

| Task             | Command                        |
| ---------------- | ------------------------------ |
| Create branch    | `git checkout -b feature/name` |
| Switch branch    | `git checkout branch-name`     |
| Delete branch    | `git branch -d branch-name`    |
| Merge branch     | `git merge branch-name`        |
| Rebase branch    | `git rebase main`              |
| View history     | `git log --oneline --graph`    |
| View changes     | `git diff`                     |
| Stage changes    | `git add .` or `git add -p`    |
| Commit           | `git commit -m "message"`      |
| Push             | `git push origin branch-name`  |
| Pull             | `git pull origin branch-name`  |
| Stash            | `git stash push -m "message"`  |
| Undo last commit | `git reset --soft HEAD~1`      |
| Revert commit    | `git revert HEAD`              |
