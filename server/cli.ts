#!/usr/bin/env npx ts-node

import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import readline from 'readline';
import prismaConfig from '../prisma/prisma.config';

const prisma = new PrismaClient(prismaConfig);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
};

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  console.log('\n🏋️ Open-Weight CLI\n');

  switch (command) {
    case 'status':
      await showStatus();
      break;

    case 'reset-key':
      await resetApiKey();
      break;

    case 'reset-all':
      await resetAll();
      break;

    case 'help':
    default:
      showHelp();
  }

  await prisma.$disconnect();
  rl.close();
}

async function showStatus() {
  const config = await prisma.config.findFirst();
  const entryCount = await prisma.weightEntry.count();

  if (config) {
    console.log('Status: Configured ✓');
    console.log(`Owner: ${config.userName}`);
    console.log(`Entries: ${entryCount}`);
    console.log(`Created: ${config.createdAt.toISOString()}`);
  } else {
    console.log('Status: Not configured');
    console.log('Run the web app to complete initial setup.');
  }
}

async function resetApiKey() {
  const config = await prisma.config.findFirst();
  
  if (!config) {
    console.log('Error: Not configured yet. Run web app first.');
    return;
  }

  const confirm = await question('⚠️  This will invalidate the current API key. Continue? (yes/no): ');
  
  if (confirm.toLowerCase() !== 'yes') {
    console.log('Cancelled.');
    return;
  }

  const newApiKey = `wt_${randomBytes(32).toString('hex')}`;
  const apiKeyHash = await bcrypt.hash(newApiKey, 10);
  
  await prisma.config.update({
    where: { id: config.id },
    data: { apiKeyHash },
  });

  console.log('\n✓ API Key reset successfully!\n');
  console.log(`New API Key: ${newApiKey}\n`);
  console.log('⚠️  IMPORTANT: Save this key securely! It cannot be retrieved again.');
  console.log('The key is now hashed in the database for security.');
}

async function resetAll() {
  const config = await prisma.config.findFirst();
  const entryCount = await prisma.weightEntry.count();

  console.log('⚠️  WARNING: This will delete ALL data!');
  if (config) console.log(`   - Configuration for: ${config.userName}`);
  console.log(`   - ${entryCount} weight entries`);
  
  const confirm = await question('\nType "DELETE ALL" to confirm: ');
  
  if (confirm !== 'DELETE ALL') {
    console.log('Cancelled.');
    return;
  }

  await prisma.weightEntry.deleteMany();
  await prisma.config.deleteMany();

  console.log('\n✓ All data deleted.');
  console.log('Restart the app to run initial setup again.');
}

function showHelp() {
  console.log('Usage: npx ts-node server/cli.ts <command>\n');
  console.log('Commands:');
  console.log('  status      Show current configuration status');
  console.log('  reset-key   Generate a new API key (invalidates old key)');
  console.log('  reset-all   Delete all data and reset configuration');
  console.log('  help        Show this help message');
  console.log('\nNote: API keys are hashed for security and cannot be retrieved.');
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
