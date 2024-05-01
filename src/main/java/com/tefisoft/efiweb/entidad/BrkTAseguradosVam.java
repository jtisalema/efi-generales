package com.tefisoft.efiweb.entidad;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;

@Entity
@Table(name = "BRK_T_ASEGURADOS_VAM")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BrkTAseguradosVam implements Serializable {

    private static final long serialVersionUID = -6058355117441263439L;
    @Id
    @Column(name = "CEDULA", nullable = false, precision = 22)
    private String cedula;

    @Column(name = "NM_CLIENTE", nullable = false, length = 80)
    private String nmCliente;

    @Column(name = "AP_CLIENTE", nullable = false, length = 80)
    private String apCliente;
}
