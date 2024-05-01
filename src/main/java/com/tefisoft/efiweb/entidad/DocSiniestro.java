package com.tefisoft.efiweb.entidad;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Date;

/**
 * @author dacopanCM on 25/08/17.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DocSiniestro implements Serializable {

    private Integer cdDocSiniestro;
    private String nmDocumento;
    private Short recibo;
    private Date fcReciboBrk;
    private Date fcEnvioAseg;
    private String envio;
    private String obsDocSiniestro;
    private Date fcRecuerdaCli;
    private String docRecuerdaCli;
}
