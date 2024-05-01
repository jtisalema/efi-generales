package com.tefisoft.efiweb.ctrl;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tefisoft.efiweb.entidad.BrkTRamos;
import com.tefisoft.efiweb.entidad.BrkTRamosCotizacion;
import com.tefisoft.efiweb.entidad.BrkTVPolizas;
import com.tefisoft.efiweb.entidad.Clausula;
import com.tefisoft.efiweb.entidad.Cobertura;
import com.tefisoft.efiweb.entidad.Deducible;
import com.tefisoft.efiweb.entidad.ExclusionCobertura;
import com.tefisoft.efiweb.entidad.ExclusionesNegocio;
import com.tefisoft.efiweb.entidad.FormaPrima;
import com.tefisoft.efiweb.entidad.GarantiasNegocio;
import com.tefisoft.efiweb.entidad.IncapSiniestro;
import com.tefisoft.efiweb.srv.PolizaService;
import com.tefisoft.efiweb.srv.RamoSrv;
import com.tefisoft.efiweb.srv.ReportService;
import com.tefisoft.efiweb.srv.SiniestroService;
import com.tefisoft.efiweb.util.HelperUtil;
import lombok.RequiredArgsConstructor;
import net.sf.jasperreports.engine.JRException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class VPolizasCtrl {

    private final PolizaService vPolizasSrv;
    private final ReportService report;
    private final SiniestroService siniestroService;
    private final RamoSrv ramoSrv;

    @PostMapping(value = "/api/polizas")
    public Page<BrkTRamosCotizacion> findAllPage(@RequestBody ObjectNode item) {
        return vPolizasSrv.searchRamosCotizacion(item);
    }

    @PostMapping(value = "/api/v-polizas")
    public Page<BrkTVPolizas> findAllPageVPolizas(@RequestBody ObjectNode item) {
        var desde = ZonedDateTime.parse(item.get("fcDesde").asText()).toLocalDate();
        var hasta = ZonedDateTime.parse(item.get("fcHasta").asText()).toLocalDate();
        Date fcDesde = java.sql.Date.valueOf(desde);
        Date fcHasta = java.sql.Date.valueOf(hasta);

        Integer cdCliente = item.get("cdCliente").asInt();
        String polizaSelected = item.get("poliza").asText();
        Integer cdRamo = item.get("cdRamo").asInt();
        Integer cdAseguradora = item.get("cdAseguradora").asInt();
        Integer cdCompania = item.get("cdCompania").asInt();
        int page = item.get("page").asInt();
        int pageSize = item.get("pageSize").asInt();
        ArrayNode sorted = (ArrayNode) item.get("sorted");
        Sort sort = HelperUtil.sortDefault(sorted, "fcDesde");
        return vPolizasSrv.searchVPolizas(cdCliente, polizaSelected, fcDesde, fcHasta, cdRamo, cdAseguradora, cdCompania, page, pageSize, sort);
    }

    @GetMapping(value = "/api/polizas/coberturas")
    public List<Cobertura> findAllCoberturas(@RequestParam Integer cdCompania, @RequestParam Integer cdRamoCotizacion) {
        return vPolizasSrv.getCoberturasByRamoCot(cdCompania, cdRamoCotizacion);
    }

    @GetMapping(value = "/api/polizas/formaPrima")
    public List<FormaPrima> findAllPrimas(@RequestParam Integer cdCompania, @RequestParam Integer cdUbicacion) {
        return vPolizasSrv.getFormaPrimaByUbc(cdCompania, cdUbicacion);
    }

    @GetMapping(value = "/api/polizas/deducibles")
    public List<Deducible> findAllDeducibles(@RequestParam Integer cdCompania, @RequestParam Integer cdUbicacion) {
        return vPolizasSrv.getDeduciblesByUbicacion(cdCompania, cdUbicacion);
    }

    @GetMapping(value = "/api/polizas/otros-deducibles", params = {"cdCompania", "ramoCot"})
    public Map<String, Object> findAllDeduciblesByRamoCot(@RequestParam Integer cdCompania, @RequestParam Integer ramoCot) {
        return vPolizasSrv.otrosDeducibles(cdCompania, ramoCot);
    }

    @GetMapping(value = "/api/polizas/garantias", params = {"ramoCot"})
    public List<GarantiasNegocio> findAllGarantiasByRamoCot(@RequestParam Integer ramoCot) {
        return vPolizasSrv.getGarantiasByRamoCot(ramoCot);
    }

    @GetMapping(value = "/api/polizas/exclusiones")
    public List<ExclusionesNegocio> findAllExclusiones(@RequestParam Integer cdCompania, @RequestParam Integer cdUbicacion) {
        return vPolizasSrv.getExclusionByUbc(cdCompania, cdUbicacion);
    }


    @GetMapping(value = "/api/polizas/beneficiario")
    public List<String> findBeneficiario(@RequestParam Integer cdCompania, @RequestParam Integer cdRamoCotizacion) {
        return vPolizasSrv.getBeneficiario(cdCompania, cdRamoCotizacion);
    }

    @GetMapping(value = "/api/polizas/clausulas")
    public List<Clausula> findAllClausulas(@RequestParam Integer cdCompania, @RequestParam Integer cdUbicacion) {
        return vPolizasSrv.getClausulasByUbicacion(cdCompania, cdUbicacion);
    }

    @GetMapping(value = "/api/polizas/clausulas", params = {"cdCompania", "ramoCot"})
    public List<Clausula> findAllClausulasByRamo(@RequestParam Integer cdCompania, @RequestParam Integer ramoCot) {
        return vPolizasSrv.getClausulasByRamoCot(cdCompania, ramoCot);
    }

    @GetMapping(value = "/api/polizas/formaPago")
    public Map<String, Object> findAllPagos(@RequestParam Integer cdCompania, @RequestParam Integer cdCotizacion, @RequestParam boolean vam) {
        return vPolizasSrv.cargarPago(cdCompania, cdCotizacion, vam);
    }

    @GetMapping(value = "/api/cliente-nombre", params = {"cdCliente"})
    public IncapSiniestro findByCdCompaniaAndPoliza(@RequestParam Integer cdCliente) {
        return siniestroService.findCliente(cdCliente);
    }

    @GetMapping(value = "/api/polizas/vam/coberturas")
    public List<Cobertura> findAllCoberturasByUbicacion(@RequestParam Integer cdCompania, @RequestParam Integer cdUbicacion) {
        return vPolizasSrv.getCoberturasByUbicacion(cdCompania, cdUbicacion);
    }

    @GetMapping(value = "/api/polizas/tipo-contenido")
    public BrkTRamos findTipoContenido(@RequestParam Integer cdRamoCotizacion, @RequestParam Integer cdCompania) {
        return ramoSrv.findOneByRamoCotizacion(cdRamoCotizacion, cdCompania);
    }

    @GetMapping(value = "/api/poliza/reporte/print")
    public void getPdf(@RequestParam Integer cdCompania, @RequestParam Integer cdCotizacion, @RequestParam Integer cdRamoCotizacion, @RequestParam boolean vam, @RequestParam boolean pdf, @RequestParam boolean aseg, @RequestParam String poliza, @RequestParam(required = false) Integer titular, @RequestParam(required = false) Integer titularu, @RequestParam(required = false) Integer titularF, @RequestParam(required = false) Integer subtotal, @RequestParam(required = false) Integer vigente, @RequestParam(required = false) Integer cantidad, HttpServletResponse response) throws IOException, JRException {
        Map<String, Object> params = new HashMap<>();
        params.put("cdCompania", Long.parseLong(cdCompania.toString()));
        params.put("cdCotizacion", Long.parseLong(cdCotizacion.toString()));
        params.put("cdRamoCotizacion", Long.parseLong(cdRamoCotizacion.toString()));
        params.put("vam", vam);
        params.put("aseg", aseg);
        if (vam) {
            params.put("titular", titular);
            params.put("titularu", titularu);
            params.put("titularF", titularF);
            params.put("vigencia", vigente);
            params.put("subtotal", subtotal);
            params.put("total", cantidad);
        }
        params.put("pdf", pdf);
        var jp = vPolizasSrv.printPolizaAsegurados(params);
        String nm = (aseg ? "Listado_de_Asegurados_" : "Resumen_de_Seguros_") + poliza + "_" + HelperUtil.getTimestamp();
        if (pdf) {
            report.writePdfReport(jp, response, nm);
        } else {
            report.writeXlsxReport(jp, response, nm);
        }
    }

    @PostMapping(value = "/api/poliza/exports/excel")
    public ResponseEntity<byte[]> exportExcel(@RequestBody ObjectNode item, HttpServletResponse response) throws IOException {
        return vPolizasSrv.exportExcel(item);
    }

    //exclusiones
    @GetMapping(value = "/api/polizas/exclusiones-ramo")
    public List<ExclusionCobertura> findExclusiones(@RequestParam Integer cdCompania, @RequestParam Integer cdRamoCotizacion) {
        return vPolizasSrv.getExclusionRamo(cdCompania, cdRamoCotizacion);
    }

    @GetMapping(value = "/api/polizas/exclusiones-cobertura", params = {"cdCompania", "cdRamoCotizacion"})
    public Map<String, Object> findExclusioneByRamoCot(@RequestParam Integer cdCompania, @RequestParam Integer cdRamoCotizacion) {
        return vPolizasSrv.otrosExclusiones(cdCompania, cdRamoCotizacion);
    }
}
