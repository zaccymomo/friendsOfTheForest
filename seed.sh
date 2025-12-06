#!/bin/bash
# Smart seed script - detects if database needs seeding or reseeding

echo "Checking database status..."

# Check if database has any users (indicator of existing data)
USER_COUNT=$(docker-compose exec -T backend npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM \"User\";" 2>/dev/null | grep -E '^\s*[0-9]+\s*$' | tr -d ' ')

if [ -z "$USER_COUNT" ] || [ "$USER_COUNT" = "0" ]; then
    echo "Database is empty. Running initial seed..."
    docker-compose exec backend npx prisma db seed

    if [ $? -eq 0 ]; then
        echo "✓ Database seeded successfully!"
    else
        echo "❌ Error: Database seeding failed"
        exit 1
    fi
else
    echo "Database has existing data ($USER_COUNT users found)."
    echo "Running reseed (clearing and reseeding)..."
    docker-compose exec backend npm run reseed

    if [ $? -eq 0 ]; then
        echo "✓ Database reseeded successfully!"
    else
        echo "❌ Error: Database reseeding failed"
        exit 1
    fi
fi
