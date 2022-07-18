Understanding the liquidbase changelog.sql file

" -- liquibase formatted sql" - this is required at the top of this file "

" -- changeset liquibase:1.11.0 dbms:mariadb,mysql,postgresql "
This indicates a change set and the version - please use the release version that the change matches so that looking at the DB should
give a good indication of what has been run.

The dbms section indicates which DBs the changeset that follows is valid to be run on. If this is not present, Liquidbase will try
to run the changeset always.

" -- preconditions onFail:MARK_RAN "
" -- precondition-sql-check expectedResult:1 SELECT count(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'users' "

@see - https://docs.liquibase.com/concepts/changelogs/preconditions.html
The check here is looking to see if the schema has been built out yet. If it has not, then the db is new and will be created
correctly without needing to be updated, so MARK_RAN ensures that the given changeset will not be run, but will be added to the
liquibase changesetlog table indicating that it was checked.