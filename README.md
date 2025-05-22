branch feature/user-authentication

****réez une nouvelle base de données (green_roots)****
postgres=# CREATE DATABASE green_roots;
CREATE DATABASE

***Créez un nouvel utilisateur (greenrootes_database) avec mot de passe (greenrootes)****
postgres=# CREATE USER greenrootes_database WITH PASSWORD 'greenrootes';
CREATE ROLE

****Accordez des privilèges à cet utilisateur sur la base de données ****
postgres=# GRANT ALL PRIVILEGES ON DATABASE green_roots TO greenrootes_database;
GRANT

****Se connecter à la base de données avec l'utilisateur crée ****
psql -U sofien -d green_roots


****L'erreur GEOMETRY ****
Pour utiliser des types de données géospatiales comme GEOMETRY, il faut que l'extension PostGIS soit installée et activée dans votre base de données.