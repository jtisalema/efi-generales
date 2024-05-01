package com.tefisoft.efiweb.enums;

public enum EstadoSiniestroEnum {
    POR_REVISAR("Por Revisar"),
    POR_REGULARIZAR("Por Regularizar"),
    RECHAZADO("Rechazado"),
    INGRESADO("Ingresado"),
    DOCUMENTO_ADICIONAL("Documento Adicional"),
    EN_ESPERA("En espera"),
    CARGADO("Cargado"),
    LIQUIDADO("Liquidado");

    private final String value;

    EstadoSiniestroEnum(String value) {
        this.value = value;
    }

    public String value() {
        return value;
    }

}
