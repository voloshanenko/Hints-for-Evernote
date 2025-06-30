# Validation Scripts

This directory contains validation scripts to ensure the userscript is properly formatted and functional.

## Scripts

### `validate.sh` (Recommended)
A shell script that works on any Unix-like system without dependencies.

```bash
./scripts/validate.sh
```

**Checks:**
- File existence (main script, utilities, documentation)
- Required userscript metadata (@name, @version, etc.)
- Essential function presence
- jQuery dependency
- Error handling implementation
- waitForKeyElements utility

### `validate.js` (Node.js required)
A more comprehensive Node.js script with additional features.

```bash
node scripts/validate.js
```

**Additional checks:**
- Version consistency between package.json and userscript
- More detailed syntax validation
- Better error reporting

## Usage in CI/CD

The GitHub Actions workflow (`.github/workflows/validate.yml`) automatically uses both validation scripts in a progressive manner:

1. **Shell validation**: Always runs first (no dependencies)
2. **Node.js validation**: Runs if Node.js and package.json are available
3. **Enhanced checks**: Linting and formatting if tools are installed

The workflow is designed to be robust and always provide some level of validation, even if advanced tools aren't available.

## Local Development

Before committing changes:

```bash
# Quick validation
./scripts/validate.sh

# Full validation (if Node.js available)
npm run validate

# Run all checks
npm test
```

## Error Codes

- **Exit 0**: Validation passed
- **Exit 1**: Validation failed (errors found)

Warnings don't cause validation failure but should be addressed for best practices.
