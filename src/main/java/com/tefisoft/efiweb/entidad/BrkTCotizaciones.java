package com.tefisoft.efiweb.entidad;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;
import java.util.Objects;

/**
 * @author dacopanCM on 07/08/17.
 */
@Entity
@Table(name = "BRK_T_COTIZACIONES")
@IdClass(BrkTCotizaciones.BrkTCotizacionesId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BrkTCotizaciones implements java.io.Serializable {


    @Id
    private Integer cdCompania;
    @Id
    private Integer cdCotizacion;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CD_ASEGURADORA")
    private BrkTAseguradoras aseguradora;


    @Column(name = "CD_CLIENTE", nullable = false, precision = 22)
    private Integer cdCliente;


    @Temporal(TemporalType.DATE)
    @Column(name = "FC_CREACION", nullable = false, length = 7)
    private Date fcCreacion;


    @Temporal(TemporalType.DATE)
    @Column(name = "FC_DESDE", nullable = false, length = 7)
    private Date fcDesde;


    @Temporal(TemporalType.DATE)
    @Column(name = "FC_HASTA", length = 7)
    private Date fcHasta;


    @Column(name = "NUM_COTIZACION", nullable = false, length = 50)
    private String numCotizacion;


    @Column(name = "COT_ASEGURADORA", length = 50)
    private String cotAseguradora;


    @Column(name = "POLIZA", length = 50)
    private String poliza;


    @Column(name = "ANEXO", length = 20)
    private String anexo;


    @Column(name = "FACT_ASEGURADORA", length = 50)
    private String factAseguradora;


    @Temporal(TemporalType.DATE)
    @Column(name = "FC_SOL_CLIENTE", nullable = false, length = 7)
    private Date fcSolCliente;


    @Column(name = "FORMA_SOL_CLIENTE", length = 20)
    private String formaSolCliente;


    @Column(name = "DIAS_VIGENCIA", nullable = false, precision = 22)
    private Integer diasVigencia;


    @Column(name = "DET_RUBRO", length = 50)
    private String detRubro;


    @Column(name = "REF_SOLICITUD", length = 50)
    private String refSolicitud;


    @Column(name = "SAL_AGENTE", precision = 15)
    private BigDecimal salAgente;


    @Column(name = "SAL_CLIENTE", precision = 15)
    private BigDecimal salCliente;


    @Column(name = "SOL_ORIGEN", precision = 22)
    private Long solOrigen;


    @Column(name = "TIPO", nullable = false, length = 30)
    private String tipo;


    @Column(name = "CLIENTE_PROV", length = 100)
    private String clienteProv;


    @Column(name = "INC_COT", precision = 1)
    private Boolean incCot;


    @Column(name = "SAL_ASEGURADORA", precision = 15)
    private BigDecimal salAseguradora;


    @Column(name = "NUM_COTREAL", precision = 22)
    private BigDecimal numCotreal;


    @Column(name = "GIRO_NEGOCIO", length = 200)
    private String giroNegocio;


    @Column(name = "OBS_COTIZACION", length = 2000)
    private String obsCotizacion;


    @Column(name = "TIPO_POL", length = 1)
    private Character tipoPol;


    @Column(name = "CD_EJEADM_RAMGRP", precision = 22)
    private Integer cdEjeadmRamgrp;


    @Column(name = "CD_RUBRO_RENOVA", precision = 22)
    private Integer cdRubroRenova;


    @Column(name = "ENV_ARCH", precision = 22)
    private BigDecimal envArch;


    @Column(name = "CD_ARCH_EXP", precision = 22)
    private Integer cdArchExp;


    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class BrkTCotizacionesId implements java.io.Serializable {

        @Column(name = "CD_COMPANIA", nullable = false, precision = 22)
        private Integer cdCompania;
        @Column(name = "CD_COTIZACION", nullable = false, precision = 22)
        private Integer cdCotizacion;

        public boolean equals(Object other) {
            if ((this == other)) return true;
            if ((other == null)) return false;
            if (!(other instanceof BrkTCotizacionesId)) return false;
            BrkTCotizacionesId castOther = (BrkTCotizacionesId) other;

            return ((Objects.equals(this.getCdCompania(), castOther.getCdCompania())) || (this.getCdCompania() != null && castOther.getCdCompania() != null && this.getCdCompania().equals(castOther.getCdCompania())))
                    && ((Objects.equals(this.getCdCotizacion(), castOther.getCdCotizacion())) || (this.getCdCotizacion() != null && castOther.getCdCotizacion() != null && this.getCdCotizacion().equals(castOther.getCdCotizacion())));
        }

        public int hashCode() {
            int result = 17;

            result = 37 * result + (getCdCompania() == null ? 0 : this.getCdCompania().hashCode());
            result = 37 * result + (getCdCotizacion() == null ? 0 : this.getCdCotizacion().hashCode());
            return result;
        }


    }


}

