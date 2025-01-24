#!/bin/bash

# remove test-postgres container if it exists
if [[ "$(docker ps -a -q -f name=test-postgres)" ]]; then
  docker rm -f test-postgres
fi

# run test-postgres container

docker run --name test-postgres --env-file ./.env.test -p 5432:5432 -d postgres

# wait for postgres to start
echo "Waiting for PostgreSQL to be ready..."
for i in {1..10}; do
  if docker exec test-postgres pg_isready -U user123 >/dev/null 2>&1; then
    break
  else
    echo "PostgreSQL is not ready. Retrying ($i/10)..."
    sleep 2
  fi
done

# create test database if it doesn't exist
exists=$(docker exec test-postgres psql -U user123 -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='onboarding_db_test'")
if [[ -z "$exists" || "$exists" != *"1"* ]]; then
  npx sequelize-cli db:create --env test
fi

# run migrations
npx sequelize-cli db:migrate --env test
