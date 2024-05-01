package com.tefisoft.efiweb.exc;

public class FileProcessException extends RuntimeException {
    private static final long serialVersionUID = -7963413323346693517L;

    public FileProcessException(String message) {
        super(message);
    }

    public FileProcessException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
