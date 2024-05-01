package com.tefisoft.efiweb.entidad;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

/**
 * @author dacopanCM on 02/09/17.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CredHospital implements Serializable {

    private Integer cdCredHospital;
    private Integer cdCompania;
    private Integer cdHospital;
    private String nmHospital;
    private Integer cdIncSiniestro;
    private Integer cdEjecutivo;
    private Integer cdMedico;
    private String apMedico;
    private String nmMedico;
    private String chequeA;
    private Boolean aprobado;
    private BigDecimal valPresupuesto;
    private BigDecimal valAprobado;
    private BigDecimal valNotaCob;
    private BigDecimal valNoCubierto;
    private BigDecimal valDeducible;
    private BigDecimal valCoaseguro;
    private Date fcPrevista;
    private Date fcVence;
    private Date fcPago;
    private Date fcAprueba;
    private Date fcSeguimiento;
    private BigDecimal valPago;
    private BigDecimal valSaldo;
    private String pagado;
    private String notaCobranza;
    private String banco;
    private String cheque;
    private String cartaAsegNc;
    private String cartaCliNc;
    private String observaciones;
    private String instrucciones;
    private Integer cdReclamo;
    private String liquida;
    private String ctaCte;
    private BigDecimal saldoAnterior;
    private String formaPago;
    private Date fcCartaCli;
    private Date fcCartaAseg;
    private BigDecimal valIncurrido;
}
