-- liquibase formatted sql

-- changeset liquibase:1.11.0.1 dbms:mysql,mariadb
-- preconditions onFail:MARK_RAN
-- precondition-sql-check expectedResult:1 SELECT count(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'users'
-- comment: /* we don't need to run this if the system is new */
ALTER TABLE custom_entity_attr_list_items
    CHANGE value item_value varchar(255);
GO
ALTER TABLE custom_entity_attr_list_items_aud
    CHANGE value item_value varchar(255);
GO
ALTER TABLE entity_attributes_filter_target_value
    CHANGE value target_value varchar(255);
GO
ALTER TABLE entity_attributes_filter_target_value_aud
    CHANGE value target_value varchar(255);
GO
ALTER TABLE name_id_format_filter_target_value
    CHANGE value target_value varchar(255);
GO
ALTER TABLE name_id_format_filter_target_value_aud
    CHANGE value target_value varchar(255);
GO
ALTER TABLE organizationurl
    CHANGE value uri_value varchar(255);
GO
ALTER TABLE organizationurl_aud
    CHANGE value uri_value varchar(255);
GO
ALTER TABLE organization_display_name
    CHANGE value name_value varchar(255);
GO
ALTER TABLE organization_display_name_aud
    CHANGE value name_value varchar(255);
GO
ALTER TABLE organization_name
    CHANGE value name_value varchar(255);
GO
ALTER TABLE organization_name_aud
    CHANGE value name_value varchar(255);
GO
ALTER TABLE resource_backed_metadata_resolver
    CHANGE file file_resource varchar(255);
GO
ALTER TABLE resource_backed_metadata_resolver_aud
    CHANGE file file_resource varchar(255);
GO
ALTER TABLE service_description
    CHANGE value name_value varchar(255);
GO
ALTER TABLE service_description_aud
    CHANGE value name_value varchar(255);
GO
ALTER TABLE service_name
    CHANGE value name_value varchar(255);
GO
ALTER TABLE service_name_aud
    CHANGE value name_value varchar(255);
GO


-- changeset liquibase:1.11.0.1 dbms:postgresql
-- preconditions onFail:MARK_RAN
-- precondition-sql-check expectedResult:1 SELECT count(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'users'
-- comment: /* we don't need to run this if the system is new */
ALTER TABLE custom_entity_attr_list_items
    RENAME "value" TO "item_value";
GO
ALTER TABLE custom_entity_attr_list_items_aud
    RENAME "value" TO "item_value";
GO
ALTER TABLE entity_attributes_filter_target_value
    RENAME "value" TO "target_value";
GO
ALTER TABLE entity_attributes_filter_target_value_aud
    RENAME "value" TO "target_value";
GO
ALTER TABLE name_id_format_filter_target_value
    RENAME "value" TO "target_value";
GO
ALTER TABLE name_id_format_filter_target_value_aud
    RENAME "value" TO "target_value";
GO
ALTER TABLE organizationurl
    RENAME "value" TO "uri_value";
GO
ALTER TABLE organizationurl_aud
    RENAME "value" TO "uri_value";
GO
ALTER TABLE organization_display_name
    RENAME "value" TO "name_value";
GO
ALTER TABLE organization_display_name_aud
    RENAME "value" TO "name_value";
GO
ALTER TABLE organization_name
    RENAME "value" TO "name_value";
GO
ALTER TABLE organization_name_aud
    RENAME "value" TO "name_value";
GO
ALTER TABLE resource_backed_metadata_resolver
    RENAME "file" TO "file_resource";
GO
ALTER TABLE resource_backed_metadata_resolver_aud
    RENAME "file" TO "file_resource";
GO
ALTER TABLE service_description
    RENAME "value" TO "name_value";
GO
ALTER TABLE service_description_aud
    RENAME "value" TO "name_value";
GO
ALTER TABLE service_name
    RENAME "value" TO "name_value";
GO
ALTER TABLE service_name_aud
    RENAME "value" TO "name_value";
GO


-- changeset liquibase:1.11.0.1 dbms:mssql
-- preconditions onFail:MARK_RAN
-- precondition-sql-check expectedResult:1 SELECT count(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'users'
-- comment: /* we don't need to run this if the system is new */
EXEC sp_rename 'custom_entity_attr_list_items.value', item_value, 'COLUMN'
GO
EXEC sp_rename 'custom_entity_attr_list_items_aud.value', item_value, 'COLUMN'
GO
EXEC sp_rename 'entity_attributes_filter_target_value.value', target_value, 'COLUMN'
GO
EXEC sp_rename 'entity_attributes_filter_target_value_aud.value', target_value, 'COLUMN'
GO
EXEC sp_rename 'name_id_format_filter_target_value.value', target_value, 'COLUMN'
GO
EXEC sp_rename 'name_id_format_filter_target_value_aud.value', target_value, 'COLUMN'
GO
EXEC sp_rename 'organizationurl.value', uri_value, 'COLUMN'
GO
EXEC sp_rename 'organizationurl_aud.value', uri_value, 'COLUMN'
GO
EXEC sp_rename 'organization_display_name.value', name_value, 'COLUMN'
GO
EXEC sp_rename 'organization_display_name_aud.value', name_value, 'COLUMN'
GO
EXEC sp_rename 'organization_name.value', name_value, 'COLUMN'
GO
EXEC sp_rename 'organization_name_aud.value', name_value, 'COLUMN'
GO
EXEC sp_rename 'service_description.value', name_value, 'COLUMN'
GO
EXEC sp_rename 'service_description_aud.value', name_value, 'COLUMN'
GO
EXEC sp_rename 'service_name.value', name_value, 'COLUMN'
GO
EXEC sp_rename 'service_name_aud.value', name_value, 'COLUMN'
GO

-- changeset liquibase:1.11.0.2 dbms:mariadb,postgresql,mssql,mysql
-- preconditions onFail:MARK_RAN
-- precondition-sql-check expectedResult:1 SELECT count(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'users'
-- comment: /* we don't need to run this if the system is new */

update filesystem_metadata_resolver set min_refresh_delay ='PT5M';
update filesystem_metadata_resolver_aud set min_refresh_delay ='PT5M';
update filesystem_metadata_resolver set max_refresh_delay ='PT4H';
update filesystem_metadata_resolver_aud set max_refresh_delay ='PT4H';

update file_backed_http_metadata_resolver set min_refresh_delay ='PT5M';
update file_backed_http_metadata_resolver_aud set min_refresh_delay ='PT5M';
update file_backed_http_metadata_resolver set max_refresh_delay ='PT4H';
update file_backed_http_metadata_resolver_aud set max_refresh_delay ='PT4H';

update resource_backed_metadata_resolver set min_refresh_delay ='PT5M';
update resource_backed_metadata_resolver_aud set min_refresh_delay ='PT5M';
update resource_backed_metadata_resolver set max_refresh_delay ='PT4H';
update resource_backed_metadata_resolver_aud set max_refresh_delay ='PT4H';