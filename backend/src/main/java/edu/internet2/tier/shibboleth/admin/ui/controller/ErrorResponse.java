package edu.internet2.tier.shibboleth.admin.ui.controller;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@AllArgsConstructor
@Getter
@Setter
@ToString
public class ErrorResponse {
    private String errorCode;
    private String errorMessage;
}
