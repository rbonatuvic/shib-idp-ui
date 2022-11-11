package edu.internet2.tier.shibboleth.admin.ui.domain;

public interface IApprovable {
    String getIdOfOwner();

    void removeLastApproval();
}