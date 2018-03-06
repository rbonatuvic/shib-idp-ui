package edu.internet2.tier.shibboleth.admin.ui.domain.frontend;

import java.io.Serializable;

public class AttributeReleaseRepresentation implements Serializable {

    private static final long serialVersionUID = -6112130016302634264L;

    private boolean eduPersonPrincipalName;

    private boolean uid;

    private boolean mail;

    private boolean surname;

    private boolean givenName;

    private boolean displayName;

    private boolean eduPersonAffiliation;

    private boolean eduPersonScopedAffiliation;

    private boolean eduPersonPrimaryAffiliation;

    private boolean eduPersonEntitlement;

    private boolean eduPersonAssurance;

    private boolean eduPersonUniqueId;

    private boolean employeeNumber;

    public boolean isEduPersonPrincipalName() {
        return eduPersonPrincipalName;
    }

    public void setEduPersonPrincipalName(boolean eduPersonPrincipalName) {
        this.eduPersonPrincipalName = eduPersonPrincipalName;
    }

    public boolean isUid() {
        return uid;
    }

    public void setUid(boolean uid) {
        this.uid = uid;
    }

    public boolean isMail() {
        return mail;
    }

    public void setMail(boolean mail) {
        this.mail = mail;
    }

    public boolean isSurname() {
        return surname;
    }

    public void setSurname(boolean surname) {
        this.surname = surname;
    }

    public boolean isGivenName() {
        return givenName;
    }

    public void setGivenName(boolean givenName) {
        this.givenName = givenName;
    }

    public boolean isDisplayName() {
        return displayName;
    }

    public void setDisplayName(boolean displayName) {
        this.displayName = displayName;
    }

    public boolean isEduPersonAffiliation() {
        return eduPersonAffiliation;
    }

    public void setEduPersonAffiliation(boolean eduPersonAffiliation) {
        this.eduPersonAffiliation = eduPersonAffiliation;
    }

    public boolean isEduPersonScopedAffiliation() {
        return eduPersonScopedAffiliation;
    }

    public void setEduPersonScopedAffiliation(boolean eduPersonScopedAffiliation) {
        this.eduPersonScopedAffiliation = eduPersonScopedAffiliation;
    }

    public boolean isEduPersonPrimaryAffiliation() {
        return eduPersonPrimaryAffiliation;
    }

    public void setEduPersonPrimaryAffiliation(boolean eduPersonPrimaryAffiliation) {
        this.eduPersonPrimaryAffiliation = eduPersonPrimaryAffiliation;
    }

    public boolean isEduPersonEntitlement() {
        return eduPersonEntitlement;
    }

    public void setEduPersonEntitlement(boolean eduPersonEntitlement) {
        this.eduPersonEntitlement = eduPersonEntitlement;
    }

    public boolean isEduPersonAssurance() {
        return eduPersonAssurance;
    }

    public void setEduPersonAssurance(boolean eduPersonAssurance) {
        this.eduPersonAssurance = eduPersonAssurance;
    }

    public boolean isEduPersonUniqueId() {
        return eduPersonUniqueId;
    }

    public void setEduPersonUniqueId(boolean eduPersonUniqueId) {
        this.eduPersonUniqueId = eduPersonUniqueId;
    }

    public boolean isEmployeeNumber() {
        return employeeNumber;
    }

    public void setEmployeeNumber(boolean employeeNumber) {
        this.employeeNumber = employeeNumber;
    }
}
