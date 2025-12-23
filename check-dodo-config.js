// Quick script to check DodoPayments configuration
const fs = require('fs');
const path = require('path');

console.log('\n🔍 Checking DodoPayments Configuration...\n');

// Try to read .env.local
const envPath = path.join(__dirname, '.env.local');
let envContent = '';
const envVars = {};

try {
  envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      envVars[match[1].trim()] = match[2].trim();
    }
  });
} catch (err) {
  console.log('⚠️  .env.local file not found or unreadable\n');
}

const config = {
  'DODO_PAYMENTS_API_KEY': envVars.DODO_PAYMENTS_API_KEY ? '✅ Set' : '❌ Missing',
  'DODO_STARTER_PRODUCT_ID': envVars.DODO_STARTER_PRODUCT_ID ? '✅ Set' : '❌ Missing',
  'DODO_ELITE_PRODUCT_ID': envVars.DODO_ELITE_PRODUCT_ID ? '✅ Set' : '❌ Missing',
  'DODO_TEST_MODE': envVars.DODO_TEST_MODE || '❌ Not set',
  'DODO_WEBHOOK_KEY': envVars.DODO_WEBHOOK_KEY ? '✅ Set' : '⚠️  Not set (optional)',
  'RESEND_API_KEY': envVars.RESEND_API_KEY ? '✅ Set' : '❌ Missing',
};

console.log('Environment Variables Status:');
Object.entries(config).forEach(([key, value]) => {
  console.log(`  ${key}: ${value}`);
});

const missingDodo = !envVars.DODO_PAYMENTS_API_KEY || !envVars.DODO_STARTER_PRODUCT_ID || !envVars.DODO_ELITE_PRODUCT_ID;

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (missingDodo) {
  console.log('❌ DodoPayments NOT CONFIGURED\n');
  console.log('📋 Setup Steps:\n');
  console.log('1. Sign up at https://dodopayments.com');
  console.log('2. Dashboard → Developers → API → Copy API Key');
  console.log('3. Dashboard → Products → Create 2 products:');
  console.log('   • Starter Protocol - $499');
  console.log('   • Elite Mastery Bundle - $999');
  console.log('4. Copy both product IDs\n');
  console.log('5. Add to .env.local file:');
  console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('   DODO_PAYMENTS_API_KEY=sk_test_your_key_here');
  console.log('   DODO_STARTER_PRODUCT_ID=prod_xxxxx');
  console.log('   DODO_ELITE_PRODUCT_ID=prod_xxxxx');
  console.log('   DODO_TEST_MODE=true');
  console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('6. Restart dev server: npm run dev\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('⚠️  FOR NOW: Use internal test mode (no Dodo needed):\n');
  console.log('   http://localhost:3000/checkout?package=starter&test=true\n');
} else {
  console.log('✅ DodoPayments CONFIGURED!\n');
  if (envVars.DODO_TEST_MODE === 'true') {
    console.log('   Mode: TEST MODE (safe to test)\n');
  } else {
    console.log('   Mode: PRODUCTION (real payments!)\n');
  }
  console.log('🚀 Test card payments at:\n');
  console.log('   http://localhost:3000/checkout?package=starter\n');
}
