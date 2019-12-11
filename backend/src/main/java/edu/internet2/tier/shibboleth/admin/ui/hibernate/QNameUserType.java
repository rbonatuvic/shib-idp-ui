package edu.internet2.tier.shibboleth.admin.ui.hibernate;

import net.shibboleth.utilities.java.support.xml.QNameSupport;
import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.usertype.UserType;

import javax.xml.namespace.QName;
import java.io.Serializable;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;

/**
 * Hibernate custom UserType needed to properly persist QName objects.
 * Base implementation is taken from {@link https://github.com/tomsontom/emf-databinding-example/blob/0ae7faa67697a84171846852a5c5b0492d9a8f7d/org.eclipse.emf.teneo.hibernate/src/org/eclipse/emf/teneo/hibernate/mapping/QNameUserType.java}
 */
public class QNameUserType implements UserType {

    private static final int[] SQL_TYPES = new int[]{Types.VARCHAR};

    /*
     * (non-Javadoc)
     *
     * @see org.hibernate.usertype.UserType#assemble(java.io.Serializable, java.lang.Object)
     */
    public Object assemble(Serializable cached, Object owner) throws HibernateException {
        return cached;
    }

    /*
     * (non-Javadoc)
     *
     * @see org.hibernate.usertype.UserType#deepCopy(java.lang.Object)
     */
    public Object deepCopy(Object value) throws HibernateException {
        return value;
    }

    /*
     * (non-Javadoc)
     *
     * @see org.hibernate.usertype.UserType#disassemble(java.lang.Object)
     */
    public Serializable disassemble(Object value) throws HibernateException {
        return (Serializable) value;
    }

    public boolean equals(Object x, Object y) throws HibernateException {
        if (x == y) {
            return true;
        } else if (x == null || y == null) {
            return false;
        } else {
            return x.equals(y);
        }
    }

    /*
     * (non-Javadoc)
     *
     * @see org.hibernate.usertype.UserType#hashCode(java.lang.Object)
     */
    public int hashCode(Object x) throws HibernateException {
        return x.hashCode();
    }

    /**
     * Not mutable
     */
    public boolean isMutable() {
        return false;
    }

    /*
     * (non-Javadoc)
     *
     * @see org.hibernate.usertype.UserType#nullSafeGet(java.sql.ResultSet, java.lang.String[],
     *      java.lang.Object)
     */
    public Object nullSafeGet(ResultSet rs, String[] names, SharedSessionContractImplementor sessionContractImplementor, Object owner) throws HibernateException, SQLException {
        final String str = rs.getString(names[0]);
        if (rs.wasNull()) {
            return null;
        }
        return convertFromString(str);
    }

    /*
     * (non-Javadoc)
     *
     * @see org.hibernate.usertype.UserType#nullSafeSet(java.sql.PreparedStatement,
     *      java.lang.Object, int)
     */
    public void nullSafeSet(PreparedStatement st, Object value, int index, SharedSessionContractImplementor sessionContractImplementor) throws HibernateException, SQLException {
        if (value == null) {
            st.setNull(index, Types.VARCHAR);
        } else {
            st.setString(index, convertToString((QName) value));
        }
    }

    /*
     * (non-Javadoc)
     *
     * @see org.hibernate.usertype.UserType#replace(java.lang.Object, java.lang.Object,
     *      java.lang.Object)
     */
    public Object replace(Object original, Object target, Object owner) throws HibernateException {
        return original;
    }

    /**
     * Returns the parameterizezd enumType
     */
    public Class<?> returnedClass() {
        return QName.class;
    }

    /**
     * An enum is stored in one varchar
     */
    public int[] sqlTypes() {
        return SQL_TYPES;
    }

    protected String convertToString(QName qName) {
        return "{" + qName.getNamespaceURI() + "}" + qName.getPrefix() + ":" + qName.getLocalPart();
    }

    protected QName convertFromString(String str) {
        if (str.indexOf("{") == -1) {
            throw new HibernateException("String " + str + " can not be converted to a QName, missing starting {");
        }
        final int endIndexNS = str.indexOf("}");
        if (endIndexNS == -1) {
            throw new HibernateException("String " + str +
                    " can not be converted to a QName, missing end ns delimiter } ");
        }
        final int prefixIndex = str.indexOf(":", endIndexNS);
        if (prefixIndex == -1) {
            throw new HibernateException("String " + str + " can not be converted to a QName, missing prefix delimiter :");
        }
        final String ns = str.substring(1, endIndexNS);
        final String prefix = str.substring(endIndexNS + 1, prefixIndex);
        final String localPart = str.substring(prefixIndex + 1);
        return QNameSupport.constructQName(ns, localPart, prefix);
    }
}
