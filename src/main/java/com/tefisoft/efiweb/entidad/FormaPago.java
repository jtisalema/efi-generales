package com.tefisoft.efiweb.entidad;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * @author dacopanCM on 18/08/17.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FormaPago implements Serializable {

    private Integer cdFormaPago;
    private Integer cdCotizacion;
    private Integer cdCompania;
    private Long numAlternativa;
    private String frmPago;
    private Integer numPagos;
    private BigDecimal totPrima;
    private BigDecimal valFinanciamiento;
    private BigDecimal totalPago;
    private BigDecimal pctCuotaInicial;
    private Integer periodicidad;
    private String aceptada;
    private BigDecimal iva;
    private BigDecimal superBancos;
    private String responsable;
    private BigDecimal ordEmision;
    private Integer cdRubro;
    private BigDecimal valRubro;
    private Integer cdPlanRamCot;
    private String observaciones;
    private BigDecimal seguroC;
    private BigDecimal ciImpuesto;
    private Boolean cuotaLetra;
    private Integer tpPagoTarjeta;
    private Boolean comFactura;
    private BigDecimal subtotal;
    private BigDecimal dereEmision;
    private Boolean valOtroIva;
    private Boolean sinIva;
    private String frmPagoAux;
    private Boolean frmCalBrk;
    private Boolean frmCalAge;
    private String dscRubro;

    public BigDecimal getPctCuotaInicial() {
        return pctCuotaInicial == null ? BigDecimal.ZERO : pctCuotaInicial;
    }
}
