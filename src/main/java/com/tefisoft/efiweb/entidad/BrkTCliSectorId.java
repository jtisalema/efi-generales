package com.tefisoft.efiweb.entidad;
// Generated 23/06/2017 11:02:27 by Hibernate Tools 4.3.1


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;

/**
 * @author dacopanCM on 23/06/17.
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BrkTCliSectorId implements java.io.Serializable {


    @Column(name = "CD_CIUDAD", nullable = false, precision = 12)
    private Integer cdCiudad;

    @Column(name = "SECTOR", nullable = false, length = 25)
    private String sector;

    public boolean equals(Object other) {
        if ((this == other)) return true;
        if ((other == null)) return false;
        if (!(other instanceof BrkTCliSectorId)) return false;
        BrkTCliSectorId castOther = (BrkTCliSectorId) other;

        return (this.getCdCiudad() == castOther.getCdCiudad())
                && ((this.getSector() == castOther.getSector()) || (this.getSector() != null && castOther.getSector() != null && this.getSector().equals(castOther.getSector())));
    }

    public int hashCode() {
        int result = 17;

        result = 37 * result + (int) this.getCdCiudad();
        result = 37 * result + (getSector() == null ? 0 : this.getSector().hashCode());
        return result;
    }


}


