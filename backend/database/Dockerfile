# Multi-stage PostgreSQL Dockerfile with security best practices

# Base stage with minimal dependencies
FROM debian:bullseye-slim AS base
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# Add PostgreSQL official repository
RUN curl -sSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor -o /usr/share/keyrings/postgresql-keyring.gpg \
    && echo "deb [signed-by=/usr/share/keyrings/postgresql-keyring.gpg] http://apt.postgresql.org/pub/repos/apt bullseye-pgdg main" > /etc/apt/sources.list.d/pgdg.list

# Builder stage for installing PostgreSQL
FROM base AS builder
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-15 \
    postgresql-contrib-15 \
    && rm -rf /var/lib/apt/lists/*

# Final stage
FROM base
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-15 \
    postgresql-contrib-15 \
    && rm -rf /var/lib/apt/lists/*

# Add PostgreSQL user and create necessary directories
RUN groupadd -r postgres --gid=999 \
    && useradd -r -g postgres --uid=999 --home-dir=/var/lib/postgresql --shell=/bin/bash postgres \
    && mkdir -p /var/lib/postgresql/data /var/run/postgresql \
    && chown -R postgres:postgres /var/lib/postgresql /var/run/postgresql \
    && chmod 777 /var/run/postgresql

# Set up volume for persistent data
VOLUME /var/lib/postgresql/data

# Set environment variables
ENV PGDATA=/var/lib/postgresql/data \
    POSTGRES_PASSWORD="" \
    POSTGRES_USER=postgres \
    POSTGRES_DB=postgres

# Copy initialization scripts
COPY --chown=postgres:postgres ./init-scripts/ /docker-entrypoint-initdb.d/
RUN chmod -R 755 /docker-entrypoint-initdb.d

# Copy entrypoint script
COPY ./docker-entrypoint.sh /usr/local/bin/
RUN chmod 755 /usr/local/bin/docker-entrypoint.sh \
    && ln -s /usr/local/bin/docker-entrypoint.sh /

# Switch to non-root user
USER postgres

# Expose PostgreSQL standard port
EXPOSE 5432

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD pg_isready -U postgres -d postgres || exit 1

# Set the entrypoint script
ENTRYPOINT ["docker-entrypoint.sh"]

# Default command
CMD ["postgres"]