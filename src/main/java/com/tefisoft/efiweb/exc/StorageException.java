package com.tefisoft.efiweb.exc;

public class StorageException extends RuntimeException {

    private static final long serialVersionUID = -7963413323346693519L;

    public StorageException(String message) {
        super(message);
    }

    public StorageException(String message, Throwable cause) {
        super(message, cause);
    }
}

