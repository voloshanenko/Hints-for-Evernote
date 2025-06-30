#!/usr/bin/env node

/**
 * Validation script for Hints for Evernote userscript
 * Checks for common issues and validates metadata
 */

const fs = require('fs');
const path = require('path');

const SCRIPT_PATH = path.join(__dirname, '..', 'Evernote.user.js');
const WAIT_ELEMENTS_PATH = path.join(__dirname, '..', 'waitForKeyElements.js');

function validateScript() {
    console.log('🔍 Validating Hints for Evernote userscript...\n');
    
    let errors = 0;
    let warnings = 0;

    // Check if main script exists
    if (!fs.existsSync(SCRIPT_PATH)) {
        console.error('❌ Evernote.user.js not found!');
        errors++;
        return { errors, warnings };
    }

    // Check if utility script exists
    if (!fs.existsSync(WAIT_ELEMENTS_PATH)) {
        console.error('❌ waitForKeyElements.js not found!');
        errors++;
        return { errors, warnings };
    }

    const scriptContent = fs.readFileSync(SCRIPT_PATH, 'utf8');
    const waitElementsContent = fs.readFileSync(WAIT_ELEMENTS_PATH, 'utf8');

    // Validate metadata
    const metadataChecks = [
        { pattern: /@name\s+/, name: '@name' },
        { pattern: /@namespace\s+/, name: '@namespace' },
        { pattern: /@version\s+/, name: '@version' },
        { pattern: /@description\s+/, name: '@description' },
        { pattern: /@author\s+/, name: '@author' },
        { pattern: /@match\s+/, name: '@match' },
        { pattern: /@grant\s+/, name: '@grant' }
    ];

    metadataChecks.forEach(check => {
        if (!check.pattern.test(scriptContent)) {
            console.error(`❌ Missing required metadata: ${check.name}`);
            errors++;
        } else {
            console.log(`✅ Found ${check.name}`);
        }
    });

    // Check for required functions
    const requiredFunctions = [
        'simulateMouseClick',
        'simulateMouseOver',
        'textColorSpecific',
        'textHighlightSpecific',
        'onKeydown',
        'detectOS',
        'initialize'
    ];

    requiredFunctions.forEach(func => {
        if (scriptContent.includes(`const ${func}`) || scriptContent.includes(`function ${func}`)) {
            console.log(`✅ Found function: ${func}`);
        } else {
            console.error(`❌ Missing required function: ${func}`);
            errors++;
        }
    });

    // Check for jQuery usage
    if (!scriptContent.includes('jquery')) {
        console.warn('⚠️  No jQuery dependency found');
        warnings++;
    } else {
        console.log('✅ jQuery dependency found');
    }

    // Check for error handling
    if (!scriptContent.includes('try') && !scriptContent.includes('catch')) {
        console.warn('⚠️  No error handling found');
        warnings++;
    } else {
        console.log('✅ Error handling found');
    }

    // Check waitForKeyElements
    if (!waitElementsContent.includes('waitForKeyElements')) {
        console.error('❌ waitForKeyElements function not found in utility file');
        errors++;
    } else {
        console.log('✅ waitForKeyElements utility found');
    }

    // Validate version consistency
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
    const versionMatch = scriptContent.match(/@version\s+([\d.]+)/);
    
    if (versionMatch) {
        const scriptVersion = versionMatch[1];
        const packageVersion = packageJson.version.replace(/\.0$/, ''); // Remove trailing .0 if present
        
        if (scriptVersion === packageVersion) {
            console.log(`✅ Version consistency: ${scriptVersion}`);
        } else {
            console.warn(`⚠️  Version mismatch: script(${scriptVersion}) vs package.json(${packageVersion})`);
            warnings++;
        }
    }

    console.log('\n📊 Validation Summary:');
    console.log(`   Errors: ${errors}`);
    console.log(`   Warnings: ${warnings}`);

    if (errors === 0) {
        console.log('\n🎉 Validation passed!');
    } else {
        console.log('\n❌ Validation failed! Please fix the errors above.');
    }

    return { errors, warnings };
}

// Run validation
const result = validateScript();
process.exit(result.errors > 0 ? 1 : 0);
