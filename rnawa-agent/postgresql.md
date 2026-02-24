# PostgreSQL
```bash
=> postgres
=> admin
```

## DATABASE
```bash
=> eliza
| USER:
===> eliza_user
===> eliza999
| DATABASE:
===> eliza
===> postgres
```

---
In order to login to this database, while using the created user:
```bash
=> psql -U eliza_user -d eliza #this if you want to login to eliza database
```

## CLI  INTERFACE
```bash
\l, \list: List all databases
-c <command>: Execute a command
-d <database_name>: Connect to a specific database
-U <username>: Connect as a specific user
