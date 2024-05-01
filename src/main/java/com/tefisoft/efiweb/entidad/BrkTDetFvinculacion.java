package com.tefisoft.efiweb.entidad;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

/**
 * @author dacopanCM on 07/08/17.
 */
@Entity
@Table(name = "BRK_T_DET_FVINCULACION")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BrkTDetFvinculacion implements java.io.Serializable {

    @Id
 //   @Column(name = "CD_DET_FVINCULACION", unique = true, nullable = false, precision = 22)
    private Integer cdDetFvinculacion;


  //  @Column(name = "CD_COMPANIA", nullable = false)
    private Integer cdCompania;


    @ManyToOne(fetch = FetchType.LAZY)
    //@JoinColumn(name = "CD_DOCUMENTO_FV", nullable = false)
    private BrkTDocumentosFv documento;


    @ManyToOne(fetch = FetchType.LAZY)
    //@JoinColumn(name = "CD_FVINCULACION", nullable = false)
    private BrkTFvinculacion fvinculacion;


    @Temporal(TemporalType.DATE)
 //   @Column(name = "FC_DESDE", length = 7)
    private Date fcDesde;


    @Temporal(TemporalType.DATE)
  //  @Column(name = "FC_HASTA", length = 7)
    private Date fcHasta;


  //  @Column(name = "RECIBIDO", nullable = false, precision = 1)
    private boolean recibido;


  //  @Column(name = "OBSERVACIONES", length = 100)
    private String observaciones;


    @Temporal(TemporalType.DATE)
  //  @Column(name = "FC_SOLICITA", length = 7)
    private Date fcSolicita;


    @Temporal(TemporalType.DATE)
  //  @Column(name = "FC_RECIBE", length = 7)
    private Date fcRecibe;

}


