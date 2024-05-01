package com.tefisoft.efiweb.util;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * @author dacopanCM on 10/03/17.
 */
@Component
public class Ctns {

    @Getter
    @Setter
    @Value("${app.images.login}")
    private int imagesLogin;

    @Getter
    @Setter
    @Value("${app.images.landing}")
    private int imagesLanding;

    //static properties
    public static String PHOTO_PATH = "/opt/public/images/";
    public static Integer MAX_LOGIN_FAIL = 3;
    public static Integer LOGIN_RETRY_TIME = 3;
    public static String EFI_VAM = "http://efi-vam-server:8082";
    public static final String PHONE = "phone";


    @Getter
    private final String SI = "SI";
    @Getter
    private final String NO = "NO";
    @Getter
    private final String ASEGURADOS = "Asegurados";
    @Getter
    private final String RUBROS = "Rubros";
    @Getter
    private final BigDecimal ZERO = BigDecimal.ZERO;

    public static final String COMMA = ",";

    public static final String KEY_RAMO_VIDA = "VIDA";
    public static final String KEY_RAMO_MEDICA = "MEDICA";
    public static final String KEY_RAMO_VEHICULO = "VEHICULO";

    public static final String TEMPLATE = "TEMPLATE";

    // uso constantes y no emun porque en base me ponen valores con minusculas -_-
    // Documentos siniestros
    public static final String CARGADO = "CARGADO";
    public static final String DEVUELTO = "DEVUELTO";
    public static final String FACTURA = "FACTURA";
    public static final String RECETA = "RECETA";
    public static final String POR_ELIMINAR = "POR_ELIMINAR";
    public static final String INGRESADO = "INGRESADO";

}
