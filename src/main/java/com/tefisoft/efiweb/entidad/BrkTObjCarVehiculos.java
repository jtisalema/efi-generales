package com.tefisoft.efiweb.entidad;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tefisoft.efiweb.util.Ctns;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.commons.lang3.StringUtils;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * @author dacopanCM on 15/08/17.
 */
@Entity
@Table(name = "BRK_T_OBJ_CAR_VEHICULOS")
@IdClass(BrkTObjCarVehiculos.BrkTObjCarVehiculosId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BrkTObjCarVehiculos implements Serializable {

    @Id
    @Column(name = "CD_COMPANIA", nullable = false)
    private Integer cdCompania;
    @Id
    private Integer cdObjCarVehiculo;

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "CD_COMPANIA", referencedColumnName = "CD_COMPANIA", nullable = false, insertable = false, updatable = false),
            @JoinColumn(name = "CD_OBJ_COTIZACION", referencedColumnName = "CD_OBJ_COTIZACION", nullable = false, insertable = false, updatable = false)})
    BrkTObjCotizacion objCotizacion;


    @Column(name = "MARCA", length = 100)
    private String marca;


    @Column(name = "MODELO", length = 100)
    private String modelo;


    @Column(name = "ANIO_DE_FABRICACION", length = 50)
    private String anioDeFabricacion;


    @Column(name = "PLACA", length = 25)
    private String placa;


    @Column(name = "NO_DE_MOTOR", length = 100)
    private String noDeMotor;


    @Column(name = "NO_DE_CHASIS", length = 100)
    private String noDeChasis;


    @Column(name = "COLOR", length = 100)
    private String color;

    @Override
    public String toString() {
        return "MARCA " + StringUtils.SPACE + marca + Ctns.COMMA + StringUtils.SPACE +
                "AÑO FABRICACIÓN " + StringUtils.SPACE + anioDeFabricacion + Ctns.COMMA + StringUtils.SPACE +
                "PLACA " + StringUtils.SPACE + placa + Ctns.COMMA + StringUtils.SPACE +
                "No. MOTOR " + StringUtils.SPACE + noDeMotor + Ctns.COMMA + StringUtils.SPACE +
                "No. CHASIS " + StringUtils.SPACE + noDeChasis + Ctns.COMMA + StringUtils.SPACE +
                "COLOR " + StringUtils.SPACE + color;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BrkTObjCarVehiculosId implements java.io.Serializable {

        @Column(name = "CD_COMPANIA", nullable = false)
        private Integer cdCompania;
        private Integer cdObjCarVehiculo;


        public boolean equals(Object other) {
            if ((this == other)) return true;
            if ((other == null)) return false;
            if (!(other instanceof BrkTObjCarVehiculosId)) return false;
            BrkTObjCarVehiculosId castOther = (BrkTObjCarVehiculosId) other;

            return ((Objects.equals(this.getCdCompania(), castOther.getCdCompania())) || (this.getCdCompania() != null && castOther.getCdCompania() != null && this.getCdCompania().equals(castOther.getCdCompania())))
                    && ((Objects.equals(this.getCdObjCarVehiculo(), castOther.getCdObjCarVehiculo())) || (this.getCdObjCarVehiculo() != null && castOther.getCdObjCarVehiculo() != null && this.getCdObjCarVehiculo().equals(castOther.getCdObjCarVehiculo())));
        }

        public int hashCode() {
            int result = 17;

            result = 37 * result + (getCdCompania() == null ? 0 : this.getCdCompania().hashCode());
            result = 37 * result + (getCdObjCarVehiculo() == null ? 0 : this.getCdObjCarVehiculo().hashCode());
            return result;
        }


    }


}
