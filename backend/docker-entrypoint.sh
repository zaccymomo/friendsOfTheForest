#!/bin/sh
set -e

echo "Setting up database..."

# Try to deploy migrations
if ! npx prisma migrate deploy 2>&1 | tee /tmp/migrate.log; then
    # Check if error is because database is not empty (P3005)
    if grep -q "P3005" /tmp/migrate.log; then
        echo ""
        echo "⚠️  Database schema exists. Resetting database..."
        echo ""
        npx prisma migrate reset --force --skip-seed
        echo "✓ Database reset complete!"
    else
        echo "❌ Migration failed. Check logs above."
        exit 1
    fi
fi

echo "✓ Database setup complete!"
echo "Starting application..."
exec "$@"
