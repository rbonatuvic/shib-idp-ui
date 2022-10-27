package edu.internet2.tier.shibboleth.admin.ui.security.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity(name = "ownership")
@Data
@NoArgsConstructor
public class Ownership {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    protected Long id;

    private String ownedId;
    private String ownedType;
    private String ownerId;
    private String ownerType;

    public Ownership(Owner owner, Ownable ownedObject) {
        ownerId = owner.getOwnerId();
        ownerType = owner.getOwnerType().name();

        ownedId = ownedObject.getObjectId();
        ownedType = ownedObject.getOwnableType().name();
    }
}