package com.tefisoft.efiweb.ctrl;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tefisoft.efiweb.entidad.BrkTObjCotizacion;
import com.tefisoft.efiweb.entidad.BrkTSiniestro;
import com.tefisoft.efiweb.entidad.CredHospital;
import com.tefisoft.efiweb.entidad.IncapSiniestro;
import com.tefisoft.efiweb.entidad.Inspeccion;
import com.tefisoft.efiweb.srv.PolizaContenidoService;
import com.tefisoft.efiweb.srv.SiniestroService;
import lombok.AllArgsConstructor;
import net.sf.jasperreports.engine.JRException;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@AllArgsConstructor
public class SiniestroCtrl {

    private final SiniestroService siniestroService;

    private final PolizaContenidoService polizaContenidoService;

    //Métodos para Siniestro-Vam

    @PostMapping("/api/siniestros-vam/search")
    public Page<IncapSiniestro> search(@RequestBody ObjectNode req) {
        return siniestroService.searchSiniestrosVAM(req);
    }

    @GetMapping("/api/siniestros-vam/cobertura")
    public List<?> cargarCobertura(@RequestParam Integer cdCompania, @RequestParam Integer cdIncSiniestro) {
        return siniestroService.getCobDedSiniestro(cdCompania, cdIncSiniestro, true);
    }

    @GetMapping("/api/siniestros-vam/cargarDocs")
    public List<?> cargarDocs(@RequestParam Integer cdCompania, @RequestParam Integer cdIncSiniestro) {
        return siniestroService.getDocsVam(cdCompania, cdIncSiniestro);
    }

    @GetMapping("/api/siniestros-vam/documentosGet")
    public List<?> getDocs(@RequestParam Integer cdCompania, @RequestParam Integer cdReclamo) {
        return siniestroService.getDocsVam(cdCompania, cdReclamo);
    }

    @GetMapping("/api/siniestros-vam/cargarFactura")
    public List<?> cargarFacturas(@RequestParam Integer cdCompania, @RequestParam Integer cdIncSiniestro) {
        return siniestroService.getFacturas(cdCompania, cdIncSiniestro, true);
    }

    @GetMapping("/api/siniestros-vam/imprimir")
    public void siniestroImprimir(@RequestParam boolean pdf, @RequestParam boolean vam, @RequestParam Integer cdCompania, @RequestParam Integer cdIncSiniestro, @RequestParam Integer cdReclamo, HttpServletResponse response) throws IOException, JRException {
        siniestroService.siniestroImprimir(pdf, vam, cdCompania, cdIncSiniestro, cdReclamo, response);
    }


    @GetMapping("/api/siniestros-vam/cargarLiquidacion")
    public List<?> cargarLiquidación(@RequestParam Integer cdCompania, @RequestParam Integer cdIncSiniestro) {
        return siniestroService.getLiquidacion(cdCompania, cdIncSiniestro, true);
    }

    @GetMapping("/api/siniestros-vam/credhosp")
    public CredHospital cargarCredHosp(@RequestParam Integer cdCompania, @RequestParam Integer cdIncSiniestro) {
        return siniestroService.getCredHosp(cdCompania, cdIncSiniestro);
    }

    @GetMapping("/api/siniestros-vam/deducible")
    public HashMap<String, String> findDeducible(@RequestParam Integer cdCompania, @RequestParam Integer cdAsegurado) {
        return siniestroService.findDeducible(cdCompania, cdAsegurado);
    }

    @GetMapping("/api/siniestros-vam/deducible/matrix")
    public List<Map<String, Object>> findDeducible(@RequestParam String cedula, @RequestParam boolean caducada) {
        return siniestroService.findDeducibleMatrix(cedula, caducada);
    }


    //Métodos para Siniestro-General

    @PostMapping("/api/siniestros-gen/search")
    public Page<BrkTSiniestro> searchGEN(@RequestBody ObjectNode req1) {
        return siniestroService.searchSiniestrosGEN(req1);
    }

    @GetMapping("/api/siniestros-gen/cobertura")
    public List<?> cargarCoberturaGEN(@RequestParam Integer cdCompania, @RequestParam Integer cdReclamo) {
        return siniestroService.getCobDedSiniestro(cdCompania, cdReclamo, false);
    }

    @GetMapping("/api/siniestros-gen/inspecion")
    public List<Inspeccion> cargarInspeccion(@RequestParam Integer cdCompania, @RequestParam Integer cdReclamo) {
        return siniestroService.getGestion(cdCompania, cdReclamo);
    }

    @GetMapping("/api/siniestros-gen/documentos")
    public List<?> cargarDocsGEN(@RequestParam Integer cdCompania, @RequestParam Integer cdReclamo) {
        return siniestroService.getDocs(cdCompania, cdReclamo);

    }

    @GetMapping("/api/siniestros-gen/cargarFactura")
    public List<?> cargarFacturasGen(@RequestParam Integer cdCompania, @RequestParam Integer cdReclamo) {
        return siniestroService.getFacturas(cdCompania, cdReclamo, false);
    }

    @GetMapping("/api/siniestros-gen/cargarLiquidacion")
    public List<?> cargarLiquidaciónGen(@RequestParam Integer cdCompania, @RequestParam Integer cdReclamo) {
        return siniestroService.getLiquidacion(cdCompania, cdReclamo, false);
    }

    @GetMapping("/api/siniestros-gen/cargarGastoLiquidacion")
    public List<?> cargarGastoLiquidacion(@RequestParam Integer cdCompania, @RequestParam Integer cdReclamo) {
        return siniestroService.getGastoLiquidacion(cdCompania, cdReclamo);
    }

    @GetMapping("/api/siniestros-gen/aseguradora")
    public List<Map<String, Object>> getAseguradoraByIdUser(@RequestParam Integer cdCliente, @RequestParam boolean caducada) {
        return siniestroService.getPolizasAsistenciaMedicas(cdCliente, caducada);
    }

    @GetMapping("/api/siniestros-gen/titulares")
    public List<BrkTObjCotizacion> getTitulares(@RequestParam Integer cdUbicacion, @RequestParam Integer cdCompania) {
        return polizaContenidoService.getObjCotizacion(2, null, cdCompania, cdUbicacion, 0, 200, null, null, null).getContent();
    }

    @GetMapping("/api/siniestros-gen/asegurados")
    public Map<String, Object> getPacientesAsegurados(@RequestParam Integer cdCotizacion, @RequestParam Integer cdCompania, @RequestParam String cedula) {
        return Map.of("asegurados", siniestroService.getPacientesAsegurados(cdCotizacion, cdCompania, cedula));
    }

}
