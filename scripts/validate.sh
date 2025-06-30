#!/bin/bash

# Validation script for Hints for Evernote userscript
# Simple shell version for environments without Node.js

echo "🔍 Validating Hints for Evernote userscript..."
echo

SCRIPT_FILE="Evernote.user.js"
WAIT_FILE="waitForKeyElements.js"
README_FILE="README.md"

errors=0
warnings=0

# Check if files exist
if [ ! -f "$SCRIPT_FILE" ]; then
    echo "❌ $SCRIPT_FILE not found!"
    ((errors++))
else
    echo "✅ Found $SCRIPT_FILE"
fi

if [ ! -f "$WAIT_FILE" ]; then
    echo "❌ $WAIT_FILE not found!"
    ((errors++))
else
    echo "✅ Found $WAIT_FILE"
fi

if [ ! -f "$README_FILE" ]; then
    echo "❌ $README_FILE not found!"
    ((errors++))
else
    echo "✅ Found $README_FILE"
fi

if [ -f "$SCRIPT_FILE" ]; then
    # Check for required metadata
    metadata_fields=("@name" "@namespace" "@version" "@description" "@author" "@match" "@grant")
    
    for field in "${metadata_fields[@]}"; do
        if grep -q "$field" "$SCRIPT_FILE"; then
            echo "✅ Found metadata: $field"
        else
            echo "❌ Missing metadata: $field"
            ((errors++))
        fi
    done
    
    # Check for required functions
    functions=("simulateMouseClick" "simulateMouseOver" "textColorSpecific" "onKeydown" "detectOS")
    
    for func in "${functions[@]}"; do
        if grep -q "$func" "$SCRIPT_FILE"; then
            echo "✅ Found function: $func"
        else
            echo "❌ Missing function: $func"
            ((errors++))
        fi
    done
    
    # Check for jQuery
    if grep -q "jquery" "$SCRIPT_FILE"; then
        echo "✅ jQuery dependency found"
    else
        echo "⚠️  No jQuery dependency found"
        ((warnings++))
    fi
    
    # Check for error handling
    if grep -q "try\|catch\|safeExecute" "$SCRIPT_FILE"; then
        echo "✅ Error handling found"
    else
        echo "⚠️  No error handling found"
        ((warnings++))
    fi
fi

if [ -f "$WAIT_FILE" ]; then
    if grep -q "waitForKeyElements" "$WAIT_FILE"; then
        echo "✅ waitForKeyElements utility found"
    else
        echo "❌ waitForKeyElements function not found"
        ((errors++))
    fi
fi

echo
echo "📊 Validation Summary:"
echo "   Errors: $errors"
echo "   Warnings: $warnings"

if [ $errors -eq 0 ]; then
    echo
    echo "🎉 Validation passed!"
    exit 0
else
    echo
    echo "❌ Validation failed! Please fix the errors above."
    exit 1
fi
