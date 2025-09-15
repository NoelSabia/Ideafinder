# PostgreSQL Database Commands Cheat Sheet

## Docker Container Commands

### 1. Enter Docker Container
```bash
docker exec -it IDEAFINDER_DB bash
```

### 2. View Container Logs
```bash
docker logs IDEAFINDER_DB
```

### 3. Restart Container
```bash
docker restart IDEAFINDER_DB
```

### 4. Stop/Start Container
```bash
docker stop IDEAFINDER_DB
docker start IDEAFINDER_DB
```

## PostgreSQL Connection Commands

### 5. Connect to PostgreSQL from Outside Container
```bash
psql -h localhost -U postgres -d ideafinder
```

### 6. Connect to PostgreSQL from Inside Container
```bash
docker exec -it IDEAFINDER_DB psql -U postgres -d ideafinder
```

### 7. Connect to Specific Database
```bash
psql -U postgres -d your_database_name
```

## Database Management Commands

### 8. List All Databases
```sql
\l
```

### 9. Connect to Different Database
```sql
\c database_name
```

### 10. Show All Tables
```sql
\dt
```

### 11. Describe Table Structure
```sql
\d table_name
```

### 12. Show Table with Column Details
```sql
\d+ table_name
```

## Basic SQL Commands

### 13. Create Database
```sql
CREATE DATABASE your_database_name;
```

### 14. Drop Database
```sql
DROP DATABASE your_database_name;
```

### 15. Create Simple Table
```sql
CREATE TABLE problems (
    id SERIAL PRIMARY KEY,
    problem TEXT NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 16. View Table Data
```sql
SELECT * FROM table_name;
SELECT * FROM table_name LIMIT 10;
```

### 17. Insert Data
```sql
INSERT INTO problems (problem, reason) 
VALUES ('Sample problem', 'Sample reason');
```

### 18. Update Data
```sql
UPDATE problems 
SET reason = 'Updated reason' 
WHERE id = 1;
```

### 19. Delete Data
```sql
DELETE FROM problems WHERE id = 1;
```

### 20. Exit PostgreSQL
```sql
\q
```

## Useful Shortcuts

- **Ctrl + C**: Cancel current command
- **Ctrl + D**: Exit psql
- **\?**: Show help for psql commands
- **\h**: Show help for SQL commands
- **\timing**: Toggle timing of commands