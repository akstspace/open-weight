#!/usr/bin/env npx ts-node

import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import readline from 'readline';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'file:./dev.db'
    }
  }
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
};

/**
 * CLI entry point that parses the command argument, executes the selected command, and performs cleanup.
 *
 * Parses the first command-line argument and dispatches to the corresponding command handler
 * (status, reset-key, reset-all, or help). After the handler completes, disconnects the Prisma client
 * and closes the readline interface.
 */
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

/**
 * Display the CLI configuration status and related metadata.
 *
 * If a configuration record exists, prints that the app is configured along with the owner's name, total weight entry count, and the configuration creation timestamp; otherwise prints that the app is not configured and instructs to run the web app for initial setup.
 */
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

/**
 * Resets the stored API key after an explicit user confirmation and prints the newly generated plaintext key.
 *
 * If no configuration exists, logs an error and returns without making changes. Prompts the user to confirm
 * the action; if the user does not confirm, the operation is cancelled. When confirmed, a new API key is
 * generated, its hash is stored in the database, and the plaintext key is displayed once with a security notice.
 */
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

/**
 * Permanently deletes all configuration and weight-entry data after explicit user confirmation.
 *
 * Displays the current config owner (if any) and the number of weight entries, then prompts the user to type "DELETE ALL". If the input matches exactly, all records in the `weightEntry` and `config` tables are removed and a confirmation message is printed; otherwise the operation is cancelled.
 */
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

/**
 * Displays usage instructions, available commands for the CLI, and a note that API keys are hashed and cannot be retrieved.
 */
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