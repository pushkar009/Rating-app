// hash_generator.js

// 1. If your main project uses "type": "module" in package.json:
import bcrypt from 'bcrypt'; 
// 2. If your main project uses CommonJS (require):
// const bcrypt = require('bcrypt');

const plaintextPassword = 'Owner1@123';
const saltRounds = 10;

async function generateHash() {
    try {
        const hash = await bcrypt.hash(plaintextPassword, saltRounds);
        console.log('Plaintext Password:', plaintextPassword);
        console.log('Bcrypt Hash:', hash);
    } catch (error) {
        console.error('Error generating hash:', error);
    }
}

generateHash();