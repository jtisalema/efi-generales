package com.tefisoft.efiweb.ctrl;

import com.tefisoft.efiweb.entidad.BrkTAseguradoras;
import com.tefisoft.efiweb.srv.AseguradoraSrv;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class AseguradoraCtrl {

    private final AseguradoraSrv aseguradoraSrv;

    public AseguradoraCtrl(AseguradoraSrv aseguradoraSrv) {
        this.aseguradoraSrv = aseguradoraSrv;
    }

    @GetMapping("/api/aseguradora")
    public List<BrkTAseguradoras> findAll() {
        return aseguradoraSrv.getAll();
    }

    @GetMapping("/api/aseguradora/{cdAseguradora}")
    public BrkTAseguradoras findByCdCotizacion(@PathVariable Integer cdAseguradora) {
        return aseguradoraSrv.findByBrkTAseguradoras(cdAseguradora);
    }
    @GetMapping("/api/aseguradora/search/{nm}")
    public List<BrkTAseguradoras> findByName(@PathVariable String nm) {
        return aseguradoraSrv.findByName(nm);
    }

}
