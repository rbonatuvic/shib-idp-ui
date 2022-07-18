CREATE DATABASE shibui;
GO
USE shibui;
GO
CREATE LOGIN shibui WITH PASSWORD = 'shibuiPass1';
GO
CREATE USER shibui FOR LOGIN shibui;
GO
EXEC sp_addrolemember 'db_owner', 'shibui';
GO