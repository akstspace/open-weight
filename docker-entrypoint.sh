#!/bin/sh
set -e

echo "⚖️  Weight Log - Starting..."

# Run database migrations
echo "📦 Running database migrations..."
bunx prisma migrate deploy

# Start the application
echo "🚀 Starting server..."
exec "$@"
