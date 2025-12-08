#!/bin/bash
# Reseed script - always clears database and starts fresh

echo "Running reseed (clearing and reseeding database)..."
docker-compose exec backend npm run reseed

if [ $? -eq 0 ]; then
    echo "✓ Database reseeded successfully!"
else
    echo "❌ Error: Database reseeding failed"
    exit 1
fi
