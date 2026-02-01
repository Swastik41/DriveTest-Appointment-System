# Pre-Push to GitHub Checklist

Use this checklist before pushing your project to GitHub to ensure quality and security.

## ✅ Critical Security Checks

- [ ] **No `.env` file committed** - Credentials should never be in version control
  - Run: `git check-ignore .env`
  - Verify `.env` is in `.gitignore`

- [ ] **No node_modules directory** - Should be git-ignored
  - Run: `git check-ignore node_modules`
  - Verify `node_modules/` is in `.gitignore`

- [ ] **No sensitive files** - Database credentials, API keys, secrets
  - Verify `package-lock.json` is git-ignored if not needed
  - Search for hardcoded passwords: `grep -r "password:" .`
  - Search for hardcoded credentials: `grep -r "admin:admin" .`

- [ ] **Environment configuration**
  - [ ] `.env.example` file exists with placeholder values
  - [ ] `.env` file is in `.gitignore`
  - [ ] No real MongoDB URI in any tracked files

## ✅ Code Quality Checks

- [ ] **No console errors**
  - Run: `npm start` and check server logs
  - Verify application starts without errors

- [ ] **No console.log debugging left**
  - Search for: `grep -r "console.log" .` (except intentional ones)
  - Remove or convert to proper logging

- [ ] **No commented-out code**
  - Search for: `grep -r "^[[:space:]]*//" .`
  - Remove unnecessary comments or code blocks

- [ ] **Consistent code style**
  - Check for consistent indentation (2 or 4 spaces)
  - Verify no trailing whitespace
  - Check for consistent naming conventions

- [ ] **No duplicate code**
  - Look for similar functions that could be refactored
  - Example: `/g2test/book` and `/gtest/book` routes

## ✅ Testing Checks

- [ ] **Run test suite**
  ```bash
  node TEST_SUITE.js
  ```
  - Verify all tests pass
  - Review warnings and fix critical issues

- [ ] **Manual testing completed**
  - [ ] Test driver registration
  - [ ] Test driver login
  - [ ] Test G2 test submission
  - [ ] Test appointment booking
  - [ ] Test admin dashboard access
  - [ ] Test examiner dashboard
  - [ ] Test logout
  - [ ] Test unauthorized access is blocked

- [ ] **Error handling tested**
  - [ ] Test invalid login
  - [ ] Test expired session
  - [ ] Test missing required fields
  - [ ] Test invalid appointment slot
  - [ ] Test database connection failure

## ✅ Documentation Checks

- [ ] **README.md is complete**
  - [ ] Setup instructions clear
  - [ ] Prerequisites listed
  - [ ] Project structure documented
  - [ ] Known issues documented
  - [ ] Troubleshooting section included

- [ ] **ISSUES_FOUND_AND_FIXES.md exists**
  - [ ] All issues documented
  - [ ] Severity levels assigned
  - [ ] Recommendations provided

- [ ] **Code comments where needed**
  - [ ] Complex logic explained
  - [ ] Non-obvious functionality documented
  - [ ] API endpoints commented

## ✅ Dependency Checks

- [ ] **package.json is correct**
  ```bash
  npm list
  ```
  - [ ] All required dependencies listed
  - [ ] No unnecessary dependencies
  - [ ] Version numbers reasonable

- [ ] **All dependencies installable**
  ```bash
  npm install
  npm list --depth=0
  ```
  - [ ] No deprecated packages
  - [ ] No conflicting versions

## ✅ Git Checks

- [ ] **No large files**
  - Run: `git ls-files -l -S 1m` (shows files over 1MB)
  - Remove any files over 5MB

- [ ] **Commit history is clean**
  ```bash
  git log --oneline
  ```
  - [ ] Meaningful commit messages
  - [ ] No accidental commits
  - [ ] No test/debug commits

- [ ] **Branch is up to date**
  ```bash
  git pull origin main
  ```
  - [ ] No conflicts
  - [ ] Latest changes merged

- [ ] **Remote is correct**
  ```bash
  git remote -v
  ```
  - [ ] Points to correct repository
  - [ ] No test/temporary remotes

## ✅ Issue Resolution Checks

### Critical Issues (MUST FIX)

- [ ] **Issue #1: Input Validation**
  - Create utils/validationUtils.js with validators
  - Update controllers to use validators

- [ ] **Issue #2: Session Secret**
  - Move to environment variables
  - Update .env.example with instruction to generate

- [ ] **Issue #3: MongoDB Credentials**
  - Move to .env file
  - Never commit real credentials

- [ ] **Issue #4: Environment Configuration**
  - Create .env.example file
  - Add dotenv package: `npm install dotenv`
  - Update index.js to use require('dotenv').config()

- [ ] **Issue #5: Middleware Consistency**
  - Standardize all middleware
  - Handle null/undefined gracefully
  - Use consistent error messages

- [ ] **Issue #6: Error Handling**
  - Add global error handler middleware
  - Add 404 handler (already exists)
  - Update index_FIXED.js

### Major Issues (SHOULD FIX)

- [ ] **Issue #7: Unused Middleware**
  - Review authMiddleware.js
  - Remove or implement properly

- [ ] **Issue #8: DB Connection Error Handling**
  - Add error handlers to mongoose.connect()
  - Add retry logic

- [ ] **Issue #9: Duplicate Routes**
  - Consolidate /g2test/book and /gtest/book if identical

- [ ] **Issue #10: .gitignore**
  - Create .gitignore file (provided)
  - Verify all sensitive files are ignored

- [ ] **Issue #11: Logging System**
  - Replace console.log with proper logging
  - Or at minimum, add comment that logging should be implemented

### Medium Issues (NICE TO FIX)

- [ ] **Issue #14: Flash Messages CSS**
  - Add styling to public/css/styles.css

- [ ] **Issue #16: Rate Limiting**
  - Add express-rate-limit: `npm install express-rate-limit`
  - Implement on login route

## ✅ Browser Testing Checks

- [ ] **Chrome/Chromium tested**
  - No console errors
  - UI renders correctly
  - All features work

- [ ] **Firefox tested**
  - No console errors
  - UI renders correctly

- [ ] **Mobile responsive** (if applicable)
  - Test on device or DevTools
  - CSS media queries working

- [ ] **Session persistence**
  - Login persists after page reload
  - Logout properly clears session

## ✅ Performance Checks

- [ ] **Load time acceptable**
  - Page loads in under 3 seconds
  - Database queries are reasonable

- [ ] **Database queries optimized**
  - No N+1 queries
  - Appropriate indexes on frequently queried fields

- [ ] **File sizes reasonable**
  - Check size of static files
  - Images are optimized

## ✅ Database Checks

- [ ] **MongoDB indexes**
  - Username has unique index: `db.drivetests.find({username:1},{unique:true})`
  - Verify unique constraint on DriveTest.username

- [ ] **Collection structure verified**
  - Sample documents exist and are valid
  - All required fields are present

- [ ] **Test data cleaned up**
  - Remove any test records created during development
  - Database is in production-ready state

## ✅ Final Checks Before Push

```bash
# 1. Verify no uncommitted changes
git status

# 2. Check what will be pushed
git log origin/main..HEAD

# 3. Run tests one more time
node TEST_SUITE.js

# 4. Start application and verify it runs
npm start
# (Ctrl+C to stop)

# 5. Verify .env is not staged
git diff --cached --name-only | grep .env

# 6. Review all changes
git diff --cached | head -50

# 7. When ready, push
git push origin main
```

## ✅ After Push

- [ ] Verify commit appears on GitHub
- [ ] Check GitHub Actions (if configured)
- [ ] Verify no sensitive data in commit
- [ ] Share repository link with team
- [ ] Update project documentation

## 📋 Sign-Off

**Developer Name:** ___________________
**Date:** ___________________
**Branch:** ___________________
**Commit Hash:** ___________________

All checks completed: ☐ Yes ☐ No

**Issues Found and Fixed:**
```
[List any issues found and how they were fixed]
```

**Remaining Issues:**
```
[List any remaining issues with justification for leaving them unfixed]
```

---

**Note:** Do not push until ALL critical and major issues are resolved.
