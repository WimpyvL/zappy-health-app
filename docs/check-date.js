#!/usr/bin/env node

/**
 * AI Builder Helper Script
 * Run this to check current date and ensure proper directory structure
 */

const fs = require('fs');
const path = require('path');

const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
const docsDir = path.join(__dirname, 'docs');
const todayDir = path.join(docsDir, today);

console.log(`📅 Current Date: ${today}`);
console.log(`📁 Target Directory: docs/${today}/`);

// Check if docs directory exists
if (!fs.existsSync(docsDir)) {
    console.log('❌ docs/ directory does not exist - creating it...');
    fs.mkdirSync(docsDir, { recursive: true });
    console.log('✅ Created docs/ directory');
}

// Check if today's directory exists
if (!fs.existsSync(todayDir)) {
    console.log(`❌ docs/${today}/ directory does not exist - creating it...`);
    fs.mkdirSync(todayDir, { recursive: true });
    console.log(`✅ Created docs/${today}/ directory`);
} else {
    console.log(`✅ docs/${today}/ directory already exists`);
}

// List existing date directories
const existingDirs = fs.readdirSync(docsDir)
    .filter(item => {
        const fullPath = path.join(docsDir, item);
        return fs.statSync(fullPath).isDirectory() && item.match(/^\d{4}-\d{2}-\d{2}$/);
    })
    .sort();

console.log('\n📂 Existing date directories:');
existingDirs.forEach(dir => {
    const dirPath = path.join(docsDir, dir);
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
    console.log(`   ${dir}/ (${files.length} documents)`);
});

console.log(`\n🎯 Place new documents in: docs/${today}/`);
console.log('📋 Follow naming convention: FEATURE_NAME.md (UPPERCASE)');
