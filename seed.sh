#!/bin/bash
# Seed the database using docker-compose

echo "Seeding database..."
docker-compose exec backend npx prisma db seed

if [ $? -eq 0 ]; then
    echo "Database seeded successfully!"
else
    echo "Error: Database seeding failed"
    exit 1
fi
