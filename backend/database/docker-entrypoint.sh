#!/bin/bash
set -e

# Initialize PostgreSQL data directory if it's empty
if [ -z "$(ls -A "$PGDATA")" ]; then
    echo "Initializing PostgreSQL database..."
    initdb --username="$POSTGRES_USER" --pwfile=<(echo "$POSTGRES_PASSWORD") --auth=md5
    
    # Configure PostgreSQL
    {
        echo "host all all all md5"
        echo "listen_addresses='*'"
    } >> "$PGDATA/pg_hba.conf"
    
    # Start PostgreSQL temporarily to run initialization scripts
    pg_ctl -D "$PGDATA" -o "-c listen_addresses=''" -w start
    
    # Create database and user if provided
    if [ "$POSTGRES_DB" != "postgres" ]; then
        psql -U postgres -c "CREATE DATABASE $POSTGRES_DB;"
    fi
    
    # Run initialization scripts
    for f in /docker-entrypoint-initdb.d/*; do
        case "$f" in
            *.sql)    echo "Running SQL script: $f"; psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f "$f"; echo ;;
            *.sql.gz) echo "Running compressed SQL script: $f"; gunzip -c "$f" | psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"; echo ;;
            *.sh)     echo "Running shell script: $f"; bash "$f"; echo ;;
            *)        echo "Ignoring $f" ;;
        esac
    done
    
    # Stop the temporary server
    pg_ctl -D "$PGDATA" -m fast -w stop
fi

# Start PostgreSQL with appropriate options
exec postgres