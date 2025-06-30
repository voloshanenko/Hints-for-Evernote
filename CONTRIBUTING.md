# Contributing to Hints for Evernote

Thank you for your interest in contributing to Hints for Evernote! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Bugs

1. **Check existing issues** to avoid duplicates
2. **Create a detailed issue** with:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser and OS information
   - Evernote version (if applicable)

### Suggesting Features

1. **Search existing issues** for similar requests
2. **Create a feature request** with:
   - Clear description of the feature
   - Use case and benefits
   - Proposed implementation (if applicable)

### Code Contributions

#### Getting Started

1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Hints-for-Evernote.git
   cd Hints-for-Evernote
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```

#### Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed

3. **Test your changes**:
   ```bash
   npm run validate
   npm run lint
   npm run format
   ```

4. **Test manually**:
   - Install the modified script in Tampermonkey
   - Test on Evernote web interface
   - Verify all keyboard shortcuts work
   - Test on different browsers/OS if possible

5. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**

#### Commit Message Guidelines

Use conventional commits format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for test additions
- `chore:` for maintenance tasks

Examples:
- `feat: add support for bold text shortcut`
- `fix: resolve menu positioning on Firefox`
- `docs: update installation instructions`

## 📝 Code Style

### JavaScript

- Use modern ES6+ features
- Prefer `const` over `let`, avoid `var`
- Use arrow functions for callbacks
- Add JSDoc comments for functions
- Use meaningful variable names
- Handle errors gracefully

### Example:

```javascript
/**
 * Simulates a mouse click on an element with error handling
 * @param {HTMLElement} element - The element to click
 * @returns {Promise<boolean>} Success status
 */
const simulateMouseClick = async (element) => {
    return safeExecute(async () => {
        if (!element) {
            throw new Error("Element is null or undefined");
        }
        // Implementation...
    }, 'simulateMouseClick');
};
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Script loads without errors
- [ ] All keyboard shortcuts work
- [ ] Menu positioning is correct
- [ ] Error handling works properly
- [ ] Cross-browser compatibility
- [ ] Help system (Ctrl+Alt+H) works
- [ ] No conflicts with Evernote's native shortcuts

### Automated Testing

Run the validation script:
```bash
npm run validate
```

This checks:
- Metadata completeness
- Required functions presence
- Version consistency
- Basic syntax validation

## 📚 Documentation

When contributing:

1. **Update README.md** if adding new features
2. **Add JSDoc comments** for new functions
3. **Update version numbers** in both script and package.json
4. **Document new keyboard shortcuts** in help system

## 🔄 Release Process

1. **Update version** in both `Evernote.user.js` and `package.json`
2. **Update changelog** in README.md
3. **Create pull request** to main branch
4. **Automated validation** runs via GitHub Actions
5. **Manual review** and testing
6. **Merge to main** triggers automatic release

## ❓ Questions?

- **Check the Wiki** for additional documentation
- **Search existing issues** for similar questions
- **Create a discussion** for general questions
- **Create an issue** for bugs or feature requests

## 📜 Code of Conduct

- Be respectful and constructive
- Help newcomers and answer questions
- Focus on the technical aspects
- Provide clear and helpful feedback

## 🙏 Recognition

Contributors will be:
- Listed in the README.md
- Mentioned in release notes
- Given appropriate credit in code comments

Thank you for helping make Hints for Evernote better for everyone!
