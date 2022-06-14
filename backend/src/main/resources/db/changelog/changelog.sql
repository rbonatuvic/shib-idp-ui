-- liquibase formatted sql

-- changeset liquibase:1.11.0 dbms:mariadb,mysql,postgresql
-- preconditions onFail:MARK_RAN
-- precondition-sql-check expectedResult:1 SELECT count(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'users'
-- comment: /* we don't need to run this if the system is new */
ALTER TABLE resource_backed_metadata_resolver
    RENAME "file" TO "file_resource";
GO
ALTER TABLE organizationurl
    RENAME "value" TO "uri_value";
GO
ALTER TABLE organization_name
    RENAME "value" TO "name_value";
GO
ALTER TABLE organization_display_name
    RENAME "value" TO "name_value";
GO
ALTER TABLE service_description
    RENAME "value" TO "name_value";
GO
ALTER TABLE service_name
    RENAME "value" TO "name_value";
GO

-- changeset liquibase:1.11.0 dbms:mssql
-- preconditions onFail:MARK_RAN
-- precondition-sql-check expectedResult:1 SELECT count(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'users'
-- comment: /* we don't need to run this if the system is new */
EXEC sp_rename 'organizationurl.value', uri_value, 'COLUMN'
GO
EXEC sp_rename 'custom_entity_attr_list_items.value', item_value, 'COLUMN'
GO
EXEC sp_rename 'organization_name.value', name_value, 'COLUMN'
GO
EXEC sp_rename 'organization_display_name.value', name_value, 'COLUMN'
GO
EXEC sp_rename 'service_description.value', name_value, 'COLUMN'
GO
EXEC sp_rename 'service_name.value', name_value, 'COLUMN'
GO