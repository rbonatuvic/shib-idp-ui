#!/usr/bin/perl

use strict;
use warnings;

use Getopt::Std;
use Config::File;
use REST::Client;
use MIME::Base64;
use HTTP::Cookies;
use XML::LibXML;
use XML::LibXML::XPathContext;
use Encode;
use JSON;

##process arguments
our ($opt_e,$opt_m,$opt_c);
getopts('em:c:');
my $enable = ($opt_e) ? 'true' : 'false';
my $md = ($opt_m) ? $opt_m : '/opt/metadata/';
my $uc = ($opt_c) ? $opt_c : '/opt/conf/upload.conf';
##

#config file is required, will contain the api information and other optional settings for adding extensions to the MD
my $conf = Config::File::read_config_file($uc);

##setup REST::Client
my $unpw = encode_base64($conf->{api_user} . ':' . $conf->{api_pass});
my $cookies = HTTP::Cookies->new( {} );
my $client = REST::Client->new();
$client->getUseragent()->cookie_jar($cookies);

if ($conf->{api_selfsigned} =~ m/true/) {
  $client->getUseragent()->ssl_opts(verify_hostname => 0);                                                                        
  $client->getUseragent()->ssl_opts(SSL_verify_mode => 0);
}

$client->addHeader('Accept', 'application/json');
$client->addHeader('Authorization', "Basic $unpw");
$client->setHost($conf->{api_host});

#create auth token
$client->HEAD('/');

my $code = $client->responseCode();
my $res = $client->responseContent();
die "$res\n" if ($code != 302 && $code != 200);

my $token = &get_cookie_value($cookies, 'XSRF-TOKEN');
$client->addHeader('X-XSRF-TOKEN', $token);
##

#for stats
my $i = 0;
my $j = 0;

##load the MD
#check whether we are reading a dir or file
if (-d $md) {
  opendir(my $DH, $md) or die "Can't open $md: $!";
  
  while (readdir $DH) {
    next if ($_ =~ m/^\.|\.\./);
    my $file = $_;
        
    my $xpc = &load_xml("$md/$file");
    
    #check if file is aggregate, or individual entity
    my $root = $xpc->findnodes("/*[local-name()='EntitiesDescriptor']");
  
    if ($root) {
      print "\nprocessing aggregate file: $file ....\n";
      
      my $entity = $xpc->findnodes("//*[local-name()='EntityDescriptor']");
      
      foreach my $var ($entity->get_nodelist) {   
        my ($name,$entid,$xml) = &get_entity($var);
        print "\nimporting entity $entid\n";
        
        #check if config file indicates entity attributes are to be added and add them to the parsed xml as needed
        my $attr = get_attr_xml($xpc,$xml);
        $xml = $attr if ($attr);
    
        my $code = &call_api($name,$entid,$xml,$enable);  
        $i++ if ($code == 201);
        $j++ if ($code == 409);
      } 
          
    } else {
      print "\nprocessing MD file: $file ....\n";
   
      open(my $fh,"$md/$file");
      read $fh, my $xml, -s $fh;
    
      my ($name,$entid) = &get_names($xpc);
      
      #check if config file indicates entity attributes are to be added and add them to the parsed xml as needed
      my $attr = get_attr_xml($xpc,$xml);
      $xml = $attr if ($attr);
    
      my $code = &call_api($name,$entid,$xml,$enable);
      $i++ if ($code == 201);
      $j++ if ($code == 409);
    } 
  }  
  closedir $DH;
  
#single file  
} elsif (-f $md) {
  my $xpc = &load_xml("$md");
    
  #check if file is aggregate, or individual entity
  my $root = $xpc->findnodes("/*[local-name()='EntitiesDescriptor']");
  
  if ($root) {
    print "\nprocessing aggregate file: $md ....\n";
      
    my $entity = $xpc->findnodes("//*[local-name()='EntityDescriptor']");
      
    foreach my $var ($entity->get_nodelist) {   
      my ($name,$entid,$xml) = &get_entity($var);
      print "\nimporting entity $entid\n";
      
      #check if config file indicates entity attributes are to be added and add them to the parsed xml as needed
      my $attr = get_attr_xml($xpc,$xml);
      $xml = $attr if ($attr);
    
      my $code = &call_api($name,$entid,$xml,$enable);
      $i++ if ($code == 201);
      $j++ if ($code == 409);
    } 
        
  } else {
    print "\nprocessing MD file: $md ....\n";
   
    open(my $fh,$md);
    read $fh, my $xml, -s $fh;
    
    my ($name,$entid) = &get_names($xpc);
  
    #check if config file indicates entity attributes are to be added and add them to the parsed xml as needed
    my $attr = get_attr_xml($xpc,$xml);
    $xml = $attr if ($attr);
      
    my $code = &call_api($name,$entid,$xml,$enable);
    $i++ if ($code == 201);
    $j++ if ($code == 409);
  } 
    
} else {
  print "$md can not be found\n";
  exit 1;
}

print "\nmetadata uploaded: $i\nduplicate: $j\n";

sub load_xml {
  my $file = shift;
    
  my $dom = XML::LibXML->load_xml(location => "$file");
  my $xpc = XML::LibXML::XPathContext->new();
  $xpc->registerNs('md', 'urn:oasis:names:tc:SAML:2.0:metadata');
  $xpc->registerNs('mdui', 'urn:oasis:names:tc:SAML:metadata:ui');
  $xpc->setContextNode($dom);
  return $xpc;
}

sub get_cookie_value {
  my $cookies = $_[0];
  my $name = $_[1];
  my $result = 0;
  
  $cookies->scan(sub  
  {  
    if ($_[1] eq $name) 
    { 
      $result = $_[2];
    }; 
  });
  
  return $result;
}

sub get_names {
  my $node = shift;
  my $name;
  
  my $entid = $node->findnodes("//*[local-name()='EntityDescriptor']/\@entityID");
  my $orgname = $node->findnodes("//*[local-name()='Organization']/*[local-name()='OrganizationDisplayName']/text()");
  my $uiname = $node->findnodes("//*[local-name()='UIInfo']/*[local-name()='DisplayName']/text()");
  $name = ($orgname) ? $orgname : $entid;
  $name = ($uiname) ? $uiname : $name;
  
  return ($name,$entid);   
}


sub call_api {
  my $name = shift;
  my $entid = shift;
  my $xml = shift;
  my $enable = shift;
  my ($params,$code,$result);
  
  my $utf8 = encode_utf8($xml);
  
  $params = "?spName=$name";
  $params .= "&enableService=true" if ($enable);
  
  $client->addHeader('Content-Type', "application/xml; charset='utf8'");
  $client->POST("/api/EntityDescriptor$params",$utf8);
 
  $code = $client->responseCode();
  $result = $client->responseContent();        
  
  if ($code == 201) {  
    
    if ($enable =~ m/true/) {
      
      my $res = JSON->new->decode($result);
      my $id = $res->{id};

      $client->PATCH("/api/activate/entityDescriptor/$id/enable");
      
      my $ecode = $client->responseCode();
      my $eresult = $client->responseContent();     
            
      if ($ecode == 200 || $ecode == 201) {
        print "$ecode: entity $name uploaded sucessfully and enabled\n";
      } else {
        print "$ecode: entity $name uploaded sucessfully but enabling failed:\n";
        open(my $pipe, '|-', "jq .");
        print $pipe $eresult;
      } 
            
    } else {
      print "$code: entity $name uploaded sucessfully\n";
    }
  } elsif ($code == 409) {
    print "$code: entity $name already exists\n";
  } elsif ($code == 500) {
    print "$code: $result\n";
  } else {          
    open(my $pipe, '|-', "jq .");
    print $pipe $result;
  }
      
  return $code;
}

sub get_entity {
  my $node = shift;

  my $entid = $node->findnodes('./@entityID');
  my $orgname = $node->findnodes("./*[local-name()='Organization']/*[local-name()='OrganizationDisplayName']/text()");
  my $uiname = $node->findnodes("./*[local-name()='SPSSODescriptor']/*[local-name()='Extensions']/*[local-name()='UIInfo']/*[local-name()='DisplayName']/text()");
  my $name = ($orgname) ? $orgname : $entid;
  $name = ($uiname) ? $uiname : $name;
        
   #have to add the NS from EntityDescriptor so each parsed xml fragment is valid
   my $ns = qq(xmlns="urn:oasis:names:tc:SAML:2.0:metadata" xmlns:alg="urn:oasis:names:tc:SAML:metadata:algsupport" xmlns:mdrpi="urn:oasis:names:tc:SAML:metadata:rpi" xmlns:mdattr="urn:oasis:names:tc:SAML:metadata:attribute" xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:mdui="urn:oasis:names:tc:SAML:metadata:ui" xmlns:remd="http://refeds.org/metadata" xmlns:idpdisc="urn:oasis:names:tc:SAML:profiles:SSO:idp-discovery-protocol" xmlns:shibmd="urn:mace:shibboleth:metadata:1.0");
   
   $node =~ s/\<EntityDescriptor\s/<?xml version="1.0" encoding="UTF-8"?>\n<EntityDescriptor $ns /;
  
  return ($name,$entid,$node);   
}

sub get_attr_xml {
  my $xpc = shift;
  my $xml = shift;
  my $attr = $conf->{attr};  
  my ($nxml,$vxml);
  
  if ($attr) {
    my $n = keys %$attr;
    
    #if md:Extensions
    my $ext = $xpc->findnodes("//*[local-name()='Extensions']");
    if ($ext) {
      my $ea = $xpc->findnodes("//*[local-name()='EntityAttributes']");
      if ($ea) {
          $nxml .= &create_attrs($attr,$n);
          $xml =~ s/\<\/mdattr\:EntityAttributes\>/$nxml<\/mdattr:EntityAttributes>/;
        } else {
          $nxml = qq(<mdattr:EntityAttributes xmlns:mdattr="urn:oasis:names:tc:SAML:metadata:attribute">);  
          $nxml .= &create_attrs($attr,$n);
          $nxml .= qq(</mdattr:EntityAttributes>);

          $xml =~ s/\<\/md\:Extensions\>/$nxml<\/md:Extensions>/;       
          }
      } else {      
        $nxml = qq(<md:Extensions>);
        $nxml .= qq(<mdattr:EntityAttributes xmlns:mdattr="urn:oasis:names:tc:SAML:metadata:attribute">);     
        $nxml .= &create_attrs($attr,$n);
        $nxml .= qq(</mdattr:EntityAttributes>);
        $nxml .= qq(</md:Extensions>);
        
        $xml =~ s/\<\/md\:EntityDescriptor\>/$nxml<\/md:EntityDescriptor>/;
      }  
              
    return $xml;
  }
return 0;
}

sub create_attrs {
  my $attr = shift;
  my $n = shift;
  my ($nxml,$vxml);
  
  for(my $i = 0; $i < $n; $i++){
    my @val;
	  my $afname = $attr->{$i}{FriendlyName};
    my $aname = $attr->{$i}{Name};
    my $atype = $attr->{$i}{type};
    my $avalue = $attr->{$i}{Value};
        
    if (ref $avalue eq ref {}) {
      my $n = keys %$avalue;
      for(my $j = 0; $j < $n; $j++){
        push(@val,$attr->{$i}{Value}{$j});
      }
    } else {
      push(@val,$avalue);
    }
      
    undef $vxml;
    foreach my $var (@val) {
      $vxml .= qq(<saml2:AttributeValue xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="$atype">$var</saml2:AttributeValue>\n);
    }
    $vxml =~ s/\n$//;
        
    $nxml .= qq(       
      <saml2:Attribute xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion" FriendlyName="$afname" Name="$aname" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:uri">
        $vxml
      </saml2:Attribute>);
                
  }
  $nxml =~ s/\<\/saml2\:Attribute\>$/<\/saml2:Attribute>\n/;      
  
  return $nxml;
}
