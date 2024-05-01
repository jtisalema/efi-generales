package com.tefisoft.efiweb.entidad;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "BRK_T_INCAPACIDADES")
public class BrkTIncapacidad implements Serializable {
    private static final long serialVersionUID = 6946627390443794293L;
    @Column(name = "CD_COMPANIA")
    private Integer cdCompania;
    @Id
    @Column(name = "CD_INCAPACIDAD", nullable = false)
    private Integer cdIncapacidad;
    @Column(name = "NM_INCAPACIDAD")
    private String nmIncapacidad;
    @Column(name = "ESTADO")
    private String estado;
}
