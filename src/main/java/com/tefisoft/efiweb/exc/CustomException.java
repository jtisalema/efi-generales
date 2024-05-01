package com.tefisoft.efiweb.exc;

/**
 * @author dacopanCM on 23/03/16.
 */
public class CustomException extends RuntimeException {
    private static final long serialVersionUID = -7501205773569718745L;

    public CustomException() {
    }

    public CustomException(String message) {
        super(message);
    }

    public CustomException(String message, Throwable cause) {
        super(message, cause);
    }
}