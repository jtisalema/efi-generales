package com.tefisoft.efiweb.ctrl;

import com.tefisoft.efiweb.entidad.BrkTUbicacion;
import com.tefisoft.efiweb.srv.UbicacionSrv;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class UbicacionCtrl {

    private final UbicacionSrv ubicacionSrv;

    public UbicacionCtrl(UbicacionSrv ubicacionSrv) {
        this.ubicacionSrv = ubicacionSrv;
    }

    @GetMapping(value = "/api/ubicacion", params = {"cdCompania", "cdRamoCotizacion"})
    public List<BrkTUbicacion> ubicacion(@RequestParam Integer cdCompania, @RequestParam Integer cdRamoCotizacion) {
        return ubicacionSrv.findByCompAndRamoCoti(cdCompania, cdRamoCotizacion);
    }

}
