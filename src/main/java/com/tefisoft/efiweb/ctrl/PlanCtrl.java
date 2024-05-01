package com.tefisoft.efiweb.ctrl;

import com.tefisoft.efiweb.entidad.BrkTPlanes;
import com.tefisoft.efiweb.srv.PlanSrv;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor
public class PlanCtrl {

    private final PlanSrv planSrv;

    @GetMapping("/api/planes")
    public List<BrkTPlanes> findAll() {
        return planSrv.findAll();
    }

    @GetMapping("/api/plan/{cdUbicacion}/{cdCompania}")
    public BrkTPlanes findByCdCotizacion(@PathVariable Integer cdUbicacion, @PathVariable Integer cdCompania) {
        return planSrv.findByUbicacion(cdUbicacion, cdCompania);
    }

}
