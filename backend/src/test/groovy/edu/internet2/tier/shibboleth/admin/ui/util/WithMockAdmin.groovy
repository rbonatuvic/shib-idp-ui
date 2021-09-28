package edu.internet2.tier.shibboleth.admin.ui.util


import org.springframework.security.test.context.support.WithMockUser

import java.lang.annotation.Retention
import java.lang.annotation.RetentionPolicy

@Retention(RetentionPolicy.RUNTIME)
@WithMockUser(value = "admin", roles = ["ADMIN"])
@interface WithMockAdmin {}