This script can be used to bulk upload metadata files into the Shibboleth IdP UI

### requirements ###
Docker engine - the run script will launch a Docker container which will handle the process.
OR
Bash shell with Perl (and additional Perl libraries - see below).

The Shib-UI must be configured *without* SAML authentication enabled. The needed API is currently only accessible using Basic auth. If you are using SAML auth, you can return to using it after the bulk upload process is run. 
If Shib-UI is using SAML auth, you can temporarily disable it by setting pac4j-enabled: false in application.yml and restarting shibui.  
After uploading you can re-enable SAML auth by setting pac4j-enabled: true in application.yml and restarting shibui.  

### usage ###
`./run.sh <metadata location> -e`

Where <metadata location> is one of:

path to a dir containing individual metadata files, aggregate files, or a mix of both  
path to one metadata file or aggregate file.  

-e    enable metadata source after upload

### configuration ###
Configuration is done in upload.conf. This file must reside in the same dir as run.sh  
At a minimum it must contain the shibui api info. It can also be used to add entity attributes to the metadata as it is uploaded (examples are in upload.conf).  

#a entity attribute configuration in upload.conf like:  
attr[0][FriendlyName] = signAssertions  
attr[0][Name] = http://shibboleth.net/ns/profiles/saml2/sso/browser/signAssertions  
attr[0][type] = xsd:boolean  
attr[0][Value] = false  

#turns into:
```xml
<saml2:Attribute xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion" FriendlyName="signAssertions" Name="http://shibboleth.net/ns/profiles/saml2/sso/browser/signAssertions" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:uri">
  <saml2:AttributeValue xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xsd:boolean">false</saml2:AttributeValue>
</saml2:Attribute>
```

### docker image ###
run.sh will pull the shibui-bulk-upload image from dockerhub and run the script within  
If you prefer to build the image yourself, `cd docker-build;docker build -t unicon/shibui-bulk-upload .`    

### running without docker ###
The docker-build/shibui-md-upload.pl script can be run manually.  
Depending on OS you may need to install some additional non dist Perl modules. REST::Client , XML::LibXML , JSON , Config::File , URI::Encode 
`perl shibui-md-upload.pl -c <path to upload.conf> -m <path to metadata location> -e (enable metadata source after upload)`  

