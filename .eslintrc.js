module.exports = {
    env: {
        browser: true,
        es2021: true,
        greasemonkey: true,
        jquery: true
    },
    extends: [
        'eslint:recommended'
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'script'
    },
    globals: {
        // Tampermonkey/Greasemonkey globals
        GM_addStyle: 'readonly',
        GM_getValue: 'readonly',
        GM_setValue: 'readonly',
        GM_notification: 'readonly',
        GM_xmlhttpRequest: 'readonly',
        
        // jQuery (loaded via @require)
        $: 'readonly',
        jQuery: 'readonly',
        
        // Custom utility function (loaded via @require)
        waitForKeyElements: 'writable'
    },
    rules: {
        // Allow console.log for userscripts
        'no-console': 'off',
        
        // Allow unused variables for callback parameters
        'no-unused-vars': ['warn', { 
            'argsIgnorePattern': '^_',
            'varsIgnorePattern': '^_' 
        }],
        
        // Prefer const/let over var
        'no-var': 'error',
        'prefer-const': 'warn',
        
        // Code style
        'indent': ['error', 4],
        'quotes': ['error', 'single', { 'allowTemplateLiterals': true }],
        'semi': ['error', 'always'],
        
        // Best practices
        'eqeqeq': 'warn',
        'no-eval': 'error',
        'no-implied-eval': 'error',
        
        // Allow immediate function calls (IIFE pattern)
        'no-extra-parens': 'off'
    }
};
