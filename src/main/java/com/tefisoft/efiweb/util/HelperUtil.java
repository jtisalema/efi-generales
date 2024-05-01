package com.tefisoft.efiweb.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tefisoft.efiweb.enums.TextResponseEnum;
import com.tefisoft.efiweb.exc.CustomException;
import org.springframework.data.domain.Sort;
import org.springframework.util.ObjectUtils;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;

/**
 * @author dacopanCM on 09/04/17.
 */
public abstract class HelperUtil {

    private HelperUtil() {

    }

    private static final String REQUIRED_FIELD_EMPTY_MSG = "El campo '%s' es requerido y no puede estar vacío";
    private static final String FIELD_MUST_BE_NUMERIC_MSG = "El campo '%s' debe ser un valor numérico";

    public static String getTimestamp() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        return LocalDateTime.now().format(formatter);
    }


    public static String empty(String apCliente) {
        return ObjectUtils.isEmpty(apCliente) ? "" : apCliente.trim();
    }

    public static Sort sortDefault(ArrayNode sorted, String fieldDefault) {
        if (ObjectUtils.isEmpty(fieldDefault))
            return Sort.unsorted();

        Sort.Order fc = Sort.Order.desc(fieldDefault);//campo de ordenamiento por defecto
        if (sorted == null)
            return Sort.by(fc);

        if (!sorted.isEmpty()) {
            String id = sorted.get(0).get("id").asText();
            Sort.Order order = sorted.get(0).get("desc").asBoolean() ? Sort.Order.desc(id) : Sort.Order.asc(id);
            return Sort.by(order, fc);
        } else {
            return Sort.by(fc);
        }
    }

    public static String parseCamelCase(String txt) {
        if (ObjectUtils.isEmpty(txt))
            return "";

        StringBuilder result = new StringBuilder();
        char[] chars = txt.toCharArray();
        result.append(Character.toLowerCase(chars[0]));

        for (int i = 1; i < chars.length; i++) {
            char actual = chars[i];
            char anterior = chars[i - 1];

            if (Character.isLowerCase(actual)) {
                result.append(actual);
                continue;
            }

            if (Character.isUpperCase(actual)) {
                if (Character.isLowerCase(anterior) || (i + 1 < chars.length && Character.isLowerCase(chars[i + 1]))) {
                    result.append("_").append(Character.toLowerCase(actual));
                } else {
                    result.append(actual);
                }
            }
        }
        return result.toString().toUpperCase();
    }

    public static String formatDate(Date fcDesde) {
        var formatter = new SimpleDateFormat("ddMMyyyy");
        if (fcDesde == null) {
            return "";
        }
        return formatter.format(fcDesde);
    }

    public static boolean isEmpty(String text) {
        if (ObjectUtils.isEmpty(text)) return false;
        return text.trim().isEmpty();
    }

    public static String constructTextResponse(TextResponseEnum type, String message) {
        return type.name() + " " + message;
    }

    public static void validateRequiredDataNodeField(JsonNode data, String fieldName) {
        validateRequiredDataNodeField(data, fieldName, false);
    }

    public static void validateRequiredDataNodeField(JsonNode toValidateData, String fieldName, boolean isNumeric) {
        var field = toValidateData.path(fieldName);

        if (field.isMissingNode() || field.asText().isEmpty() || toValidateData.path(fieldName).isNull()) {
            throw new CustomException(String.format(REQUIRED_FIELD_EMPTY_MSG, fieldName));
        }

        if (isNumeric && !(field.isFloat() || field.isInt() || field.isDouble())) {
            throw new CustomException(String.format(FIELD_MUST_BE_NUMERIC_MSG, fieldName));
        }
    }

    public static void validateRequiredNestedDataFields(ObjectNode toValidateData, String fieldName, List<String> nestedFields) {
        if (!toValidateData.hasNonNull(fieldName)) {
            throw new CustomException(String.format(REQUIRED_FIELD_EMPTY_MSG, fieldName));
        }
        var fieldByName = toValidateData.path(fieldName);
        nestedFields.forEach(nestedField -> validateRequiredDataNodeField(fieldByName, nestedField, true));
    }
}
