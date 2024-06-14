package com.tefisoft.efiweb.srv;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tefisoft.efiweb.dao.BrkTSiniestroDAO;
import com.tefisoft.efiweb.dao.BrkTVPolizasDAO;
import com.tefisoft.efiweb.dao.SiniestroJdbcDao;
import com.tefisoft.efiweb.dto.ResultIncapSiniestroPortal;
import com.tefisoft.efiweb.entidad.BrkTSiniestro;
import com.tefisoft.efiweb.entidad.CobDedSiniestro;
import com.tefisoft.efiweb.entidad.CredHospital;
import com.tefisoft.efiweb.entidad.DocSiniestro;
import com.tefisoft.efiweb.entidad.GastosVam;
import com.tefisoft.efiweb.entidad.IncapSiniestro;
import com.tefisoft.efiweb.entidad.Inspeccion;
import com.tefisoft.efiweb.entidad.PagoSiniestro;
import com.tefisoft.efiweb.entidad.ResumenGastosLiquidacion;
import com.tefisoft.efiweb.exc.CustomException;
import com.tefisoft.efiweb.util.Ctns;
import com.tefisoft.efiweb.util.HelperUtil;
import com.tefisoft.efiweb.util.Utilities;
import lombok.extern.apachecommons.CommonsLog;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperPrint;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.web.client.RestTemplate;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.time.format.DateTimeFormatter;

/**
 * @author dacopanCM on 25/08/17.
 */
@Service
@CommonsLog
public class SiniestroService extends GenericService<BrkTSiniestro, BrkTSiniestroDAO> {

    private boolean vam;
    private final SiniestroJdbcDao daoJdbc;
    private final BrkTVPolizasDAO vPolizasDAO;
    private final RestTemplate restTemplate;
    private final ReportService report;
    private static final String CD_CLT = "cdCliente";
    private static final String NUM_SINI = "numSiniestro";
    private static final String POLIZA = "poliza";
    private static final String CD_RAMO = "cdRamo";
    private static final String CD_ASEG = "cdAseguradora";
    private static final String CD_EJEC = "cdEjecutivo";

    SiniestroService(BrkTSiniestroDAO dao, SiniestroJdbcDao daoJdbc, BrkTVPolizasDAO vPolizasDAO, RestTemplateBuilder builder, ReportService report) {
        super(dao);
        this.vam = vam;
        this.daoJdbc = daoJdbc;
        this.vPolizasDAO = vPolizasDAO;
        this.restTemplate = builder.build();
        this.report = report;
    }

    //Service para siniestro-GENERAL métodos exclusivos de general
    public List<DocSiniestro> getDocs(Integer cdCompania, Integer cdReclamo) {
        return daoJdbc.getDocs(cdCompania, cdReclamo);
    }


    public Page<BrkTSiniestro> searchSiniestrosGEN(ObjectNode item) {

        int pageSize = item.get("pageSize").asInt();
        int page = item.get("page").asInt();
        Integer cdCliente = item.get(CD_CLT).asInt();
        Integer cdCompania = item.get("cdCompania").asInt();
        Integer numSiniestro = item.get(NUM_SINI).asInt();
        String poliza = item.get(POLIZA).asText();
        Integer cdRamo = item.get(CD_RAMO).asInt();
        Integer cdAseguradora = item.get(CD_ASEG).asInt();
        Integer anio = item.get("anio").asInt();
        Integer cdEjecutivo = item.get(CD_EJEC).asInt();
        Integer cdPool = item.has("cdPool") ? item.get("cdPool").asInt() : null;
        ArrayNode sorted = (ArrayNode) item.get("sorted");


        java.sql.Date fcDesde;
        java.sql.Date fcHasta;

        List<Integer> cdAgente = null;

        if (cdPool != null && cdPool > 0) {
            cdAgente = vPolizasDAO.findPools(cdPool);
        } else {
            cdPool = null;
        }
        if (ObjectUtils.isEmpty(cdRamo) || cdRamo == 0) {
            cdRamo = null;
        }
        if (ObjectUtils.isEmpty(cdEjecutivo) || cdEjecutivo == 0) {
            cdEjecutivo = null;
        }

        if (ObjectUtils.isEmpty(poliza)) {
            poliza = null;
        }
        if (ObjectUtils.isEmpty(cdAseguradora) || cdAseguradora == 0) {
            cdAseguradora = null;
        }
        if (ObjectUtils.isEmpty(numSiniestro) || numSiniestro == 0) {
            numSiniestro = null;
        }

        if (ObjectUtils.isEmpty(anio) || anio == 0) {
            anio = null;
        }
        if ((ObjectUtils.isEmpty(item.get("fcDesde").asText())) || (ObjectUtils.isEmpty(item.get("fcHasta").asText()))) {
            var _desde = ZonedDateTime.now().minusYears(23).toLocalDate();
            fcDesde = java.sql.Date.valueOf(_desde);

            var _hasta = ZonedDateTime.now().toLocalDate();
            fcHasta = java.sql.Date.valueOf(_hasta);

        } else {
            var _desde = ZonedDateTime.parse(item.get("fcDesde").asText()).toLocalDate();
            fcDesde = java.sql.Date.valueOf(_desde);

            var _hasta = ZonedDateTime.parse(item.get("fcHasta").asText()).toLocalDate();
            fcHasta = java.sql.Date.valueOf(_hasta);
        }
        Sort sort = HelperUtil.sortDefault(sorted, "fcSiniestro");
        Pageable pageable = PageRequest.of(page, pageSize, sort);

        return dao.findGenerales(cdCliente, cdCompania, numSiniestro, poliza, cdRamo, cdAseguradora, fcDesde, fcHasta, anio, cdEjecutivo, cdAgente, cdPool, pageable);

    }


    //Método de cargar Cobertura
    public List<CobDedSiniestro> getCodSiniestroGeneral(Integer cdCompania, Integer cdReclamo, boolean vam) {
        return daoJdbc.getCobDedSiniestro(cdCompania, cdReclamo, vam);
    }


    //Métodos del service siniestro-VAm exclusivos de vam

    public List<GastosVam> getDocsVam(Integer cdCompania, Integer cdIncapSiniestro) {
        return daoJdbc.getFacturas(cdCompania, cdIncapSiniestro, true, 2);
    }

    public void siniestroImprimir(boolean pdf, boolean vam, Integer cdCompania, Integer cdIncSiniestro, Integer cdReclamo, HttpServletResponse response) throws JRException, IOException {
        Map<String, Object> params = new HashMap<>();
        params.put("cdCompania", Long.parseLong(cdCompania.toString()));
        params.put("cdReclamo", Long.parseLong(cdReclamo.toString()));
        params.put("cdIncSiniestro", Long.parseLong(cdIncSiniestro.toString()));
        params.put("vam", vam);
        params.put("pdf", pdf);
        try {
            JasperPrint reportPrint = report.init("siniestros/siniestro" + (vam ? "_vam" : "") + ".jasper", params);
            if (!pdf) {
                report.writeXlsxReport(reportPrint, response, "Reporte_de_Siniestro_" + cdReclamo);
            } else {
                report.writePdfReport(reportPrint, response, "Reporte_de_Siniestro_" + cdReclamo);
            }
        } catch (IOException | JRException | CustomException ex) {
            log.error("error al generar reporte", ex);
            throw ex;
        }
    }


    public Page<IncapSiniestro> searchSiniestrosVAM(ObjectNode item) {

        int pageSize = item.get("pageSize").asInt();
        int page = item.get("page").asInt();
        Integer cdCliente = item.get(CD_CLT).asInt();
        Integer numSiniestro = item.get(NUM_SINI).asInt();
        String poliza = item.get(POLIZA).asText();
        Integer cdRamo = item.get(CD_RAMO).asInt();
        Integer cdAseguradora = item.get(CD_ASEG).asInt();
        Integer anio = item.get("anio").asInt();
        String dscObjeto = item.get("dscObjeto").asText(null);
        String titular = item.get("titular").asText(null);
        Integer cdEjecutivo = item.get(CD_EJEC).asInt();
        Integer cdPool = item.has("cdPool") ? item.get("cdPool").asInt() : null;
        ArrayNode sorted = (ArrayNode) item.get("sorted");

        String fcDesde;
        String fcHasta;
        List<Integer> cdAgente = null;

        if (cdPool != null) {
            cdAgente = vPolizasDAO.findPools(cdPool);
        }


        if (ObjectUtils.isEmpty(cdRamo) || cdRamo == 0) {
            cdRamo = null;
        }
        if (ObjectUtils.isEmpty(cdEjecutivo) || cdEjecutivo == 0) {
            cdEjecutivo = null;
        }
        if (ObjectUtils.isEmpty(poliza)) {
            poliza = null;
        }
        if (ObjectUtils.isEmpty(cdAseguradora) || cdAseguradora == 0) {
            cdAseguradora = null;
        }
        if (ObjectUtils.isEmpty(numSiniestro) || numSiniestro == 0) {
            numSiniestro = null;
        }
        if (ObjectUtils.isEmpty(anio) || anio == 0) {
            anio = null;
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        if ((ObjectUtils.isEmpty(item.get("fcDesde").asText())) || (ObjectUtils.isEmpty(item.get("fcHasta").asText()))) {
            var _desde = ZonedDateTime.now().minusYears(23).toLocalDate();
            fcDesde = _desde.format(formatter);

            var _hasta = ZonedDateTime.now().toLocalDate();
            fcHasta = _hasta.format(formatter);

        } else {
            var _desde = ZonedDateTime.parse(item.get("fcDesde").asText()).toLocalDate();
            fcDesde = _desde.format(formatter);

            var _hasta = ZonedDateTime.parse(item.get("fcHasta").asText()).toLocalDate();
            fcHasta = _hasta.format(formatter);
        }
        Pageable pageable = PageRequest.of(page, pageSize);
        String order = " ORDER BY ";
        String orderDefault = "i.FC_ALCANCE DESC";
        if (sorted != null && sorted.size() > 0) {
            String id = HelperUtil.parseCamelCase(sorted.get(0).get("id").asText());//cambia de camelcase a underscore
            String ord = sorted.get(0).get("desc").asBoolean() ? " DESC" : " ASC";
            order = order + id + ord + ", " + orderDefault;
        } else {
            order = order + orderDefault;
        }

        Map<String, Object> params = new HashMap<>();
        params.put(CD_CLT, cdCliente);
        params.put(NUM_SINI, numSiniestro);
        params.put(POLIZA, poliza);
        params.put(CD_RAMO, cdRamo);
        params.put(CD_ASEG, cdAseguradora);
        params.put("fcDesde", fcDesde);
        params.put("fcHasta", fcHasta);
        params.put("anio", anio);
        params.put("dscObjeto", dscObjeto);
        params.put("titular", titular);
        params.put(CD_EJEC, cdEjecutivo);
        params.put("cdAgente", cdAgente);
        params.put("cdPool", cdPool);

        return daoJdbc.searchSiniestrosVam(params, order, pageable);
    }


    public CredHospital getCredHosp(Integer cdCompania, Integer cdIncSiniestro) {
        List<CredHospital> list = daoJdbc.getCredHosp(cdCompania, cdIncSiniestro);
        return !list.isEmpty() ? list.get(0) : null;
    }

    public List<Map<String, Object>> getPolizasAsistenciaMedicas(Integer cdCliente, boolean caducadas) {
        return daoJdbc.getAseguradoraPoliza(cdCliente, caducadas);
    }

    public HashMap<String, String> findDeducible(Integer cdCompania, Integer cdAsegurado) {
        return daoJdbc.findDeducible(cdCompania, cdAsegurado);
    }

    public List<Map<String, Object>> findDeducibleMatrix(String cedula, boolean caducadas) {
        return daoJdbc.polizasActivasAsistenciaMed(cedula, caducadas);
    }


    //Métodos reutilizables para siniestros-GENERALES y siniestros-VAM


    public List<Inspeccion> getGestion(Integer cdCompania, Integer cdReclamo) {
        return daoJdbc.getGestion(cdCompania, cdReclamo);
    }

    /**
     * devuelve la lista de documentos, ojo en vam cada beneficio tiene una lista de documentos pero eso salen de GastosVam
     * razon por la cual cuando es VAM traemos de GastosVam y construimos aqui a mano el DocSiniestro resultante
     *
     * @param cdCompania compania
     * @param cdReclamo  cdReclamo o cdIncSiniestro si es vam
     * @return lista de documentos
     */


    public List<GastosVam> getFacturas(Integer cdCompania, Integer cdReclamo, boolean vam) {
        return daoJdbc.getFacturas(cdCompania, cdReclamo, vam, vam ? 1 : 3);
    }

    public List<CobDedSiniestro> getCobDedSiniestro(Integer cdCompania, Integer cdReclamo, boolean vam) {
        return daoJdbc.getCobDedSiniestro(cdCompania, cdReclamo, vam);
    }

    public List<PagoSiniestro> getLiquidacion(Integer cdCompania, Integer cdReclamo, boolean vam) {
        return daoJdbc.getLiquidacion(cdCompania, cdReclamo, vam);
    }

    public List<ResumenGastosLiquidacion> getGastoLiquidacion(Integer cdCompania, Integer cdReclamo) {
        return daoJdbc.getGastosLiquidacion(cdCompania, cdReclamo);
    }

    public ObjectNode getDiasMsg(Integer cdIncSiniestro, String numReclamo, Short anio, Integer cdCompania) {

        var body = new HashMap<String, Object>();
        body.put("cdIncSiniestro", cdIncSiniestro);
        body.put("cdCompania", cdCompania);
        body.put("numReclamo", numReclamo);
        body.put("anio", anio);

        //HttpEntity<?> entity = new HttpEntity<>(Map.of("Host",""));

        return restTemplate.postForEntity(Ctns.EFI_VAM + "/api/DiasMsg", body, ObjectNode.class).getBody();
    }

    public IncapSiniestro findCliente(Integer cdCliente) {
        return daoJdbc.nmCliente(cdCliente);
    }


    public List<Map<String, Object>> getPacientesAsegurados(Integer cdCotizacion, Integer cdCompania, String cedula) {
        return daoJdbc.aseguradosPoliza(cdCotizacion, cdCompania, cedula);
    }

    public Page<ResultIncapSiniestroPortal> searchSiniestroModuleGen(ObjectNode siniestroParam) {
        int pageSize = siniestroParam.path("pageSize").asInt();
        int page = siniestroParam.path("page").asInt();
        ArrayNode sorted = (ArrayNode) siniestroParam.path("sorted");
        Integer idRamo = Utilities.getIntValueOrDefault(siniestroParam.path(CD_RAMO).asInt());
        Integer idContratante = Utilities.getIntValueOrDefault(siniestroParam.path("cdContratante").asInt());
        Integer idEjecutivo = Utilities.getIntValueOrDefault(siniestroParam.path(CD_EJEC).asInt());
        String cdEstado = Utilities.getStringValueOrDefault(siniestroParam.path("cdEstado").asText());
        String poliza = Utilities.getStringValueOrDefault(siniestroParam.path(POLIZA).asText());
        String fcCreacionDesde = Utilities.getStringValueOrDefault(siniestroParam.path("fcCreacionDesde").asText());
        String fcCreacionHasta = Utilities.getStringValueOrDefault(siniestroParam.path("fcCreacionHasta").asText());
        String fcIncurrenciaDesde = Utilities.getStringValueOrDefault(siniestroParam.path("fcIncurrenciaDesde").asText());
        String fcIncurrenciaHasta = Utilities.getStringValueOrDefault(siniestroParam.path("fcIncurrenciaHasta").asText());
        String cdReclamo = Utilities.getStringValueOrDefault(siniestroParam.path("cdReclamo").asText());

        ZonedDateTime createDesde = ZonedDateTime.parse(Objects.requireNonNull(fcCreacionDesde));
        ZonedDateTime createHasta = ZonedDateTime.parse(Objects.requireNonNull(fcCreacionHasta));
        ZonedDateTime incurrenciaDesde = ZonedDateTime.parse(Objects.requireNonNull(fcIncurrenciaDesde));
        ZonedDateTime incurrenciaHasta = ZonedDateTime.parse(Objects.requireNonNull(fcIncurrenciaHasta));

        String sortBy = "FC_ALCANCE";
        String orderBy = "DESC";

        Pageable pageable = PageRequest.of(page, pageSize);
        if (sorted != null && !sorted.isEmpty()) {
            sortBy = sorted.get(0).get("id").asText();
            orderBy = sorted.get(0).get("desc").asBoolean() ? "DESC" : "ASC";
        }

        Map<String, Object> params = new HashMap<>();
        params.put(CD_RAMO, idRamo);
        params.put("cdContratante", idContratante);
        params.put(CD_EJEC, idEjecutivo);
        params.put("cdEstado", cdEstado);
        params.put(POLIZA, poliza);
        params.put("fcCreDesde", Utilities.getTimeDate(createDesde, 0, 0, 0));
        params.put("fcCreHasta", Utilities.getTimeDate(createHasta, 23, 59, 59));
        params.put("fcIncuDesde", Utilities.getTimeDate(incurrenciaDesde, 0, 0, 0));
        params.put("fcIncuHasta", Utilities.getTimeDate(incurrenciaHasta, 23, 0, 0));
        params.put("cdReclamo", cdReclamo);
        params.put("fcIn", fcIncurrenciaDesde);

        return daoJdbc.getSiniestrosGenRegistered(params, sortBy, orderBy, pageable);

    }

}

