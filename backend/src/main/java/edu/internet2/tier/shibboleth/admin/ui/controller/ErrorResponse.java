package edu.internet2.tier.shibboleth.admin.ui.controller;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.http.HttpStatus;

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
    private String cause;

    public ErrorResponse(String errorCode, String errorMessage) {
        this(errorCode, errorMessage, null);
    }

    public ErrorResponse(HttpStatus httpStatus, String errorMessage) {
        this(httpStatus, errorMessage, null);
    }

    public ErrorResponse(HttpStatus httpStatus, String errorCode, String cause) {
        this(String.valueOf(httpStatus.value()), errorCode, cause);
    }
}
