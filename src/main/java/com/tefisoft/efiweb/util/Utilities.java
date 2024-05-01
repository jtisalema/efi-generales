package com.tefisoft.efiweb.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.tefisoft.efiweb.enums.EstadoSiniestroEnum;
import org.apache.commons.lang3.text.WordUtils;
import org.springframework.util.ObjectUtils;

import java.text.Normalizer;
import java.time.ZonedDateTime;
import java.util.regex.Pattern;

public final class Utilities {
    private static final String REGULARIZAR = "DEVUELTO";
    private static final String REVISAR = "EN PROCESO";

    private Utilities() {

    }

    @SuppressWarnings("unchecked")
    public static <T> T getOrDefaultNull(JsonNode item, String property, Class<T> clazz) {
        if (Integer.class.equals(clazz)) {
            var value = Integer.valueOf(item.path(property).asInt());
            return value > 0 ? (T) value : null;
        }
        if (String.class.equals(clazz)) {
            var value = item.path(property).asText();
            return value.length() > 0 ? (T) value : null;
        }
        return null;
    }

    public static String truncate(String texto, int longitud) {
        if (texto == null || texto.length() <= longitud) {
            return texto;
        }
        return texto.substring(0, longitud);
    }

    public static String removeExtension(String withExtension) {
        try {
            var lastIndex = withExtension.lastIndexOf(".");
            return withExtension.substring(0, lastIndex);
        } catch (Exception ex) {
            return withExtension;
        }
    }

    public static String removerTildes(String texto) {
        if (texto == null) return texto;
        String textoNormalizado = Normalizer.normalize(texto, Normalizer.Form.NFD);
        Pattern patron = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return patron.matcher(textoNormalizado).replaceAll("");
    }

    public static String removerCaracteresEspeciales(String texto) {
        if (texto == null) return texto;
        Pattern patron = Pattern.compile("[^a-zA-Z0-9\\s,.\\-_]");
        return patron.matcher(texto).replaceAll("");
    }

    public static String mapearEstados(EstadoSiniestroEnum estado, boolean movil) {
        switch (estado) {
            case POR_REGULARIZAR:
                return movil ? WordUtils.capitalizeFully(REGULARIZAR) : REGULARIZAR;
            case POR_REVISAR:
                return movil ? WordUtils.capitalizeFully(REVISAR) : REVISAR;
            default:
                return estado.value();
        }
    }

    public static Integer getIntValueOrDefault(Integer value) {
        if (ObjectUtils.isEmpty(value) || value == 0) {
            return null;
        }
        return value;
    }

    public static String getStringValueOrDefault(String value) {
        if ("0".equalsIgnoreCase(value) || "TODOS".equalsIgnoreCase(value) || "null".equalsIgnoreCase(value) || ObjectUtils.isEmpty(value)) {
            return null;
        }
        return value.trim();
    }

    public static ZonedDateTime getTimeDate(ZonedDateTime date, int hour, int minute, int second) {
        return date.withHour(hour).withMinute(minute).withSecond(second);
    }

}
