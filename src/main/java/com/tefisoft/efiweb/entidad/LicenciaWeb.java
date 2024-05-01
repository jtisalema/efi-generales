package com.tefisoft.efiweb.entidad;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

/**
 * @author dacopanCM on 24/03/18.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "BRK_T_LICENCIA_WEB")
public class LicenciaWeb {

    @Id
    private Integer id;
    private Date fcCaduca;
    private String lic;
    private String ruc;
    private Date fcModifica;
    //private int premium;
}
