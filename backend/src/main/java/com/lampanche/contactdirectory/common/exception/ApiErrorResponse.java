package com.lampanche.contactdirectory.common.exception;

import java.time.Instant;
import java.util.List;

public class ApiErrorResponse {

    private final Instant timestamp;
    private final int status;
    private final String error;
    private final String message;
    private final String path;
    private final List<FieldErrorResponse> fields;

    public ApiErrorResponse(
            int status,
            String error,
            String message,
            String path,
            List<FieldErrorResponse> fields
    ) {
        this.timestamp = Instant.now();
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
        this.fields = fields;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public int getStatus() {
        return status;
    }

    public String getError() {
        return error;
    }

    public String getMessage() {
        return message;
    }

    public String getPath() {
        return path;
    }

    public List<FieldErrorResponse> getFields() {
        return fields;
    }
}
