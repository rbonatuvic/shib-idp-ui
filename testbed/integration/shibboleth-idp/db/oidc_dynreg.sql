CREATE DATABASE oidc_dynreg;
\c oidc_dynreg
CREATE TABLE storagerecords (
  context varchar(255) NOT NULL,
  id varchar(255) NOT NULL,
  expires bigint DEFAULT NULL,
  value text NOT NULL,
  version bigint NOT NULL,
  PRIMARY KEY (context, id)
);
