package edu.internet2.tier.shibboleth.admin.ui.domain.filters;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import org.hibernate.envers.Audited;

import edu.internet2.tier.shibboleth.admin.ui.domain.CustomEntityAttributeDefinition;
import lombok.Getter;
import lombok.Setter;


@Entity(name = "custom_entity_attr_filter_value")
@Table(uniqueConstraints = { @UniqueConstraint(columnNames = { "filter_id", "custom_entity_attribute_name" }) })
@Audited
// NOTE: lombok's toString and equals cause an infinite loop somewhere that causes stack overflows, so if we need impls,
// do it manually. Do not replace the Getter and Setter with @Data...
@Getter
@Setter
public class CustomEntityAttributeFilterValue {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "generated_id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "filter_id", nullable = false)
    EntityAttributesFilter entityAttributesFilter;

    @ManyToOne
    @JoinColumn(name = "custom_entity_attribute_name", referencedColumnName = "name", nullable = false)
    CustomEntityAttributeDefinition customEntityAttributeDefinition;

    @Column(name = "value", nullable = false)
    String value;
}
