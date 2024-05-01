package com.tefisoft.efiweb.ctrl;

import com.tefisoft.efiweb.entidad.BrkTCiudades;
import com.tefisoft.efiweb.srv.CiudadService;
import lombok.Data;
import org.springframework.stereotype.Controller;

import javax.annotation.PostConstruct;
import java.util.Comparator;
import java.util.List;

/**
 * @author dacopanCM on 10/06/18.
 */
@Controller
@Data
public class CiudadCtrl {

    private final CiudadService ciudadService;
    private List<BrkTCiudades> provincias;

    public CiudadCtrl(CiudadService ciudadService) {
        this.ciudadService = ciudadService;
    }

    @PostConstruct
    public void init() {
        provincias = ciudadService.findProvincias();
        provincias.sort(Comparator.comparing(BrkTCiudades::getNmProvincia));
    }


    public List<BrkTCiudades> findCiudades() {
        List<BrkTCiudades> ciudades = ciudadService.findCiudades();
        ciudades.sort(Comparator.comparing(BrkTCiudades::getNmCiudad));
        return ciudades;
    }
}
