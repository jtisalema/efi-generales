package com.tefisoft.efiweb.entidad;

import lombok.*;

import javax.persistence.*;
import java.math.BigInteger;
import java.util.Date;

/**
 * @author dacopanCM on 10/03/17.
 */
@Entity
@Table(name = "BRK_T_USUARIO_PORTAL_WEB", uniqueConstraints = @UniqueConstraint(columnNames = "USUARIO_WEB"))
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Usuario implements java.io.Serializable {

    @Id
    @Column(name = "CD_ADICIONAL", unique = true, precision = 22)
    private Integer id;

    private Integer cdCliente;


    @Column(name = "CD_COMPANIA", precision = 22)
    private Integer cdCompania;


    @Column(name = "USUARIO_WEB", length = 20)
    private String usuario;
    @Column(name = "CLAVE_WEB", length = 300)
    private String clave;
    private boolean activo;

    private String email;


    @Temporal(TemporalType.DATE)
    @Column(name = "FC_CREACION", length = 7)
    private Date fcCreacion;


    @Temporal(TemporalType.DATE)
    @Column(name = "FC_CAMBIO_CLAVE", length = 7)
    private Date fcCambioClave;


    @Column(name = "INTENTOS_FALLIDOS", precision = 6)
    private Integer intentosFallidos;


    @Temporal(TemporalType.DATE)
    @Column(name = "FC_INTENTO_FALLIDO", length = 7)
    private Date fcIntentoFallido;


    @Column(name = "CONTADOR_SESIONES", precision = 8)
    private BigInteger contadorSesiones;


    @Temporal(TemporalType.DATE)
    @Column(name = "FC_ULT_VISITA", length = 7)
    private Date fcUltVisita;


    @Temporal(TemporalType.DATE)
    @Column(name = "FC_ULT_VISITA_TMP", length = 7)
    private Date fcUltVisitaTmp;


    @Column(name = "FC_MODIFICACION", length = 7)
    private Date fcModifica;

    private String rolWeb;

    private Integer cdEjecutivoAdm; //-> match con cdEjecutivo
    private Integer cdSucEjeAdm;

    private Integer cdPool; // este uso para hacer mtch con vista de luis saco cdAgente

    private Integer cdPersAdm;
    private String tpPersAdm;

    private Integer cdEjecutivo;
    private Integer cdSucPersAdm;
    private Integer cdSucursalEje;
    private String cedula;
    private String nmAsegurado;
    private String apAsegurado;
    private String observaciones;
    private String tipoUsuario;
    @Column(name = "USUARIO")
    private String usrcod;
    private boolean enviarEmail;

    public Usuario(Usuario usr) {
        if (usr != null) {
            this.id = usr.id;
            this.cdCliente = usr.cdCliente;
            this.cdCompania = usr.cdCompania;
            this.usuario = usr.usuario;
            this.clave = usr.clave;
            this.activo = usr.activo;
            this.email = usr.email;
            this.fcCreacion = usr.fcCreacion;
            this.fcCambioClave = usr.fcCambioClave;
            this.intentosFallidos = usr.intentosFallidos;
            this.fcIntentoFallido = usr.fcIntentoFallido;
            this.contadorSesiones = usr.contadorSesiones;
        }
    }
}
