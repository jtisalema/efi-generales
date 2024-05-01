package com.tefisoft.efiweb.srv;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tefisoft.efiweb.dao.BrkTRamosCotizacionDAO;
import com.tefisoft.efiweb.dao.BrkTVPolizasDAO;
import com.tefisoft.efiweb.dao.PolizaJdbcDAO;
import com.tefisoft.efiweb.entidad.BrkTObjCotizacion;
import com.tefisoft.efiweb.entidad.BrkTRamosCotizacion;
import com.tefisoft.efiweb.entidad.BrkTVPolizas;
import com.tefisoft.efiweb.entidad.Clausula;
import com.tefisoft.efiweb.entidad.Cobertura;
import com.tefisoft.efiweb.entidad.Deducible;
import com.tefisoft.efiweb.entidad.ExclusionCobertura;
import com.tefisoft.efiweb.entidad.ExclusionesNegocio;
import com.tefisoft.efiweb.entidad.Financiamiento;
import com.tefisoft.efiweb.entidad.FormaPago;
import com.tefisoft.efiweb.entidad.FormaPrima;
import com.tefisoft.efiweb.entidad.GarantiasNegocio;
import com.tefisoft.efiweb.entidad.Subobjetos;
import com.tefisoft.efiweb.util.HelperUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import net.sf.jasperreports.engine.JasperPrint;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.joda.time.LocalDate;
import org.joda.time.Years;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.apache.poi.ss.usermodel.CellType.STRING;

/**
 * @author dacopanCM on 08/08/17.
 */
@Log
@Service
@RequiredArgsConstructor
public class PolizaService {

    private static final long serialVersionUID = -8972438094709060349L;
    private final transient PolizaJdbcDAO polizaJdbcDAO;
    private final BrkTVPolizasDAO vPolizasDAO;
    private final BrkTRamosCotizacionDAO dao;
    private final RamoSrv ramoSrv;
    private final transient ReportService report;
    private final PolizaContenidoService polizaContenidoService;

    private static final String CD_COMPANIA = "cdCompania";
    private static final String PRIMA = "Prima($)";

    public Page<BrkTRamosCotizacion> searchRamosCotizacion(ObjectNode item) {
        int page = item.get("page").asInt();
        int pageSize = item.get("pageSize").asInt();
        Integer cdPool = item.has("cdPool") ? item.get("cdPool").asInt() : null;
        var ramo = item.get("ramo").asInt();
        var comp = item.get("comp").asInt();
        var cdAseguradora = item.get("aseg").asInt();
        var cdCliente = item.get("cdCliente").asInt();
        String poliza = item.get("poliza").asText();
        String placa = item.get("placa").asText();
        var inclEjecutivo = item.get("inclEjecutivo").asBoolean();
        var cdEjecutivoAdm = item.get("cdEjecutivoAdm").asInt();

        ArrayNode sorted = (ArrayNode) item.get("sorted");
        Sort sort = HelperUtil.sortDefault(sorted, "fcDesde");
        Pageable pageable = PageRequest.of(page, pageSize, sort);

        List<Integer> cdAgente = null;
        Integer cdEjecutivo = null;

        if (cdPool != null) {
            cdAgente = vPolizasDAO.findPools(cdPool);
        }
        if (inclEjecutivo) {
            cdEjecutivo = cdEjecutivoAdm;
        }

        if (StringUtils.isEmpty(poliza)) {
            poliza = null;
        }

        if (StringUtils.isEmpty(placa)) {
            placa = null;
        }

        return dao.search(cdCliente, poliza, null, null, ramo == 0 ? null : ramo, cdAseguradora == 0 ? null : cdAseguradora, comp == 0 ? null : comp, cdEjecutivo, cdAgente, cdPool, placa, pageable);
    }

    public List<Cobertura> getCoberturasByRamoCot(Integer cdCompania, Integer cdRamoCotizacion) {
        List<Cobertura> list = polizaJdbcDAO.getCoberturasByRamoCot(cdCompania, cdRamoCotizacion);
        list.sort(Comparator.comparing(Cobertura::getOrdImpresion, Comparator.nullsFirst(Comparator.naturalOrder())));
        return list;
    }

    public List<Cobertura> getCoberturasByUbicacion(Integer cdCompania, Integer cdUbicacion) {
        return polizaJdbcDAO.getCoberturasByUbicacion(cdCompania, cdUbicacion);
    }

    public List<Clausula> getClausulasByRamoCot(Integer cdCompania, Integer cdRamoCotizacion) {
        return polizaJdbcDAO.getClausulasByRamoCot(cdCompania, cdRamoCotizacion);
    }

    public List<Clausula> getClausulasByUbicacion(Integer cdCompania, Integer cdUbicacion) {
        return polizaJdbcDAO.getClausulasByUbicacion(cdCompania, cdUbicacion);
    }

    public List<Deducible> getOtrosDeduciblesByRamoCot(Integer cdCompania, Integer cdRamosCotizacion) {
        return polizaJdbcDAO.getOtrosDeduciblesByRamCot(cdCompania, cdRamosCotizacion);
    }

    public Map<String, Object> otrosDeducibles(Integer cdCompania, Integer cdRamosCotizacion) {
        Map<String, Object> resp = new HashMap<>();
        List<Deducible> deducibleList = new ArrayList<>();

        resp.put("otros", getOtrosDeduciblesByRamoCot(cdCompania, cdRamosCotizacion));
        getCoberturasByRamoCot(cdCompania, cdRamosCotizacion).forEach(c -> getDeduciblesByCobertura(cdCompania, c.getCdCobNegocio()).forEach(cn -> {
            cn.setNmCobertura(c.getNmCobertura());
            deducibleList.add(cn);
        }));
        resp.put("deducibles", deducibleList);
        return resp;
    }

    public List<Deducible> getDeduciblesByCobertura(Integer cdCompania, Integer cdCoberturaDeducible) {
        return polizaJdbcDAO.getDeduciblesByCobertura(cdCompania, cdCoberturaDeducible);
    }

    public List<Deducible> getDeduciblesByUbicacion(Integer cdCompania, Integer cdUbicacion) {
        return polizaJdbcDAO.getDeduciblesByUbicacion(cdCompania, cdUbicacion);
    }

    public List<GarantiasNegocio> getGarantiasByRamoCot(Integer cdRamosCotizacion) {
        return polizaJdbcDAO.getGarantiasByRamoCot(cdRamosCotizacion);
    }

    public Page<BrkTVPolizas> searchVPolizas(Integer cdCliente, String polizaSelected, Date fcDesde, Date fcHasta, Integer cdRamo, Integer cdAseguradora, Integer cdCompania, int first, int pageSize, Sort sort) {
        Pageable pageable = sort == null ? PageRequest.of(first / pageSize, pageSize) : PageRequest.of(first / pageSize, pageSize, sort);
        return vPolizasDAO.searchVPolizas(cdCliente, polizaSelected, fcDesde, fcHasta, cdRamo, cdAseguradora, cdCompania, pageable);
    }

    public FormaPago getFormaPagoByCotizacion(Integer cdCompania, Integer cdCotizacion, boolean vam) {
        return vam ? this.polizaJdbcDAO.getFormaPagoByCotizacionVAM(cdCompania, cdCotizacion) : this.polizaJdbcDAO.getFormaPagoByCotizacion(cdCompania, cdCotizacion);
    }

    public List<Financiamiento> getFinanciamientosByFp(Integer cdCompania, Integer cdFormaPago) {
        return this.polizaJdbcDAO.getFinanciamientosByFp(cdCompania, cdFormaPago);
    }

    public List<FormaPrima> getFormaPrimaByUbc(Integer cdCompania, Integer cdUbicacion) {
        return this.polizaJdbcDAO.getFormaPrimaByUbc(cdCompania, cdUbicacion);
    }

    public List<ExclusionesNegocio> getExclusionByUbc(Integer cdCompania, Integer cdUbicacion) {
        return this.polizaJdbcDAO.getExclusionByUbc(cdCompania, cdUbicacion);
    }

    public List<ExclusionCobertura> getExclusionCobertura(Integer cdCompania, Integer cdCodNegocio) {
        return this.polizaJdbcDAO.getExclusionCobertura(cdCompania, cdCodNegocio);
    }

    public List<ExclusionCobertura> getExclusionRamo(Integer cdCompania, Integer cdRamoCotizacion) {
        return this.polizaJdbcDAO.getExclusionRamo(cdCompania, cdRamoCotizacion);
    }

    public Map<String, Object> otrosExclusiones(Integer cdCompania, Integer cdRamosCotizacion) {
        Map<String, Object> resp = new HashMap<>();
        List<ExclusionCobertura> exclusionCoberturas = new ArrayList<>();
        getCoberturasByRamoCot(cdCompania, cdRamosCotizacion).forEach(c -> getExclusionCobertura(cdCompania, c.getCdCobNegocio()).forEach(exclusionCobertura -> {
            exclusionCobertura.setNmCobertura(c.getNmCobertura());
            exclusionCoberturas.add(exclusionCobertura);
        }));
        resp.put("exclusiones", exclusionCoberturas);
        return resp;
    }

    //beneficiario
    public List<String> getBeneficiario(Integer cdCompania, Integer cdRamoCotizacion) {
        return this.vPolizasDAO.findBeneficiario(cdCompania, cdRamoCotizacion);
    }

    public Map<String, Object> cargarPago(Integer cdCompania, Integer cdCotizacion, boolean vam) {
        Map<String, Object> resp = new HashMap<>();
        BigDecimal totalPago = BigDecimal.ZERO;
        BigDecimal totalSaldo = BigDecimal.ZERO;
        FormaPago formaPago = getFormaPagoByCotizacion(cdCompania, cdCotizacion, vam);
        List<Financiamiento> financiamientoList = getFinanciamientosByFp(cdCompania, formaPago.getCdFormaPago());
        financiamientoList.sort(Comparator.comparing(Financiamiento::getFcVencimiento, Comparator.nullsFirst(Comparator.naturalOrder())));

        for (Financiamiento f : financiamientoList) {
            switch (f.getFrmFinanciamiento()) {
                case "CI":
                    f.setFrmFinanciamiento("CUOTA INICIAL");
                    break;
                case "L":
                    f.setFrmFinanciamiento("LETRA");
                    break;
                case "C":
                    f.setFrmFinanciamiento("CUOTA");
                    break;
                case "PF":
                    f.setFrmFinanciamiento("PAGO FACTURA");
                    break;
                default:
                    break;
            }
            if (f.getValor() != null) totalPago = totalPago.add(f.getValor());
            if (f.getSaldoPago() != null) totalSaldo = totalSaldo.add(f.getSaldoPago());
        }

        resp.put("item", formaPago);
        resp.put("financiamientoList", financiamientoList);
        resp.put("totalPago", totalPago);
        resp.put("totalSaldo", totalSaldo);
        return resp;
    }

    public JasperPrint printPolizaAsegurados(Map<String, Object> params) {
        String path = "poliza/poliza.jasper";
        try {
            return report.init(path, params);
        } catch (Exception ex) {
            log.info("Error al generar reporte:" + ex);
        }
        return null;
    }

    public ResponseEntity<byte[]> exportExcel(ObjectNode item) throws IOException {
        boolean aseg = item.get("aseg").asBoolean();
        boolean extras = item.get("extras").asBoolean();
        int tipo = item.get("tipo").asInt();
        Integer cdComp = item.path(CD_COMPANIA).asInt();
        Integer cdObjetoCotizacion = item.path("cdObjetoCotizacion").asInt();
        ObjectNode query = (ObjectNode) item.get("query1");
        List<String> colnames = generateCols(aseg, extras, tipo);
        ByteArrayOutputStream stream;
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            XSSFSheet sheet = workbook.createSheet("Datos");
            int rownum = 0;
            XSSFRow header = sheet.createRow(rownum++);
            int colnumH = 0;
            for (String h : colnames) {
                Cell cell = header.createCell(colnumH++);
                cell.setCellValue(h);
            }

            if (extras) {
                List<Subobjetos> deps = polizaContenidoService.getSubobjetosByObtCot(cdComp, cdObjetoCotizacion);
                addExtras(deps, sheet, rownum, aseg);
            } else {
                Page<BrkTObjCotizacion> polizas = polizaContenidoService.getPolizas(query);
                List<BrkTObjCotizacion> list = polizas.getContent();
                addCotizaciones(list, sheet, rownum, aseg, tipo);
            }
            for (int i = 0; i < 14; i++) {
                sheet.autoSizeColumn(i);
            }
            stream = new ByteArrayOutputStream();
            workbook.write(stream);
        }
        final HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.set(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"" + "Export.xlsx" + "\"");
        return new ResponseEntity<>(stream.toByteArray(), headers, HttpStatus.OK);
    }

    public void addExtras(List<Subobjetos> deps, XSSFSheet sheet, int rownum, boolean aseg) {
        for (int i = 0; i < deps.size(); i++) {
            XSSFRow row = sheet.createRow(rownum++);
            Subobjetos subObj = deps.get(i);
            if (aseg) {
                addCelda(row, String.valueOf(i + 1), 0);//item
                addCelda(row, "", 1);//deducible(no hay ese campo)
                addCelda(row, getValue(subObj.getCedulaS()), 2);//cedula
                addCelda(row, getValue(subObj.getDscSubobjeto()), 3);//dependencia
                addCelda(row, getValue(subObj.getFcNacimiento()), 4);//fc nacimiento
                addCelda(row, edad(subObj.getFcNacimiento()), 5);//edad
                addCelda(row, getValue(subObj.getObsSubobjeto()), 6);//parentesco
                addCelda(row, getValue(subObj.getBeneficio()), 7);//beneficio
                addCelda(row, getValue(subObj.getActivo()), 8);//activo
            } else {
                addCelda(row, getValue(subObj.getDscSubobjeto()), 0);//item
                addCelda(row, getValue(subObj.getTotAseActual()), 1);//val aseg
                addCelda(row, getValue(subObj.getTasa()), 2);//tasa
                addCelda(row, getValue(subObj.getTotPriActual()), 3);//prima
            }
        }
    }

    public void addCotizaciones(List<BrkTObjCotizacion> list, XSSFSheet sheet, int rownum, boolean aseg, int tipo) {
        for (BrkTObjCotizacion brkTObjCotizacion : list) {
            XSSFRow row = sheet.createRow(rownum++);
            if (aseg) {
                addCelda(row, getValue(brkTObjCotizacion.getItem()), 0);//item
                addCelda(row, getValue(brkTObjCotizacion.getCedulaO()), 1);//cedula
                addCelda(row, getValue(brkTObjCotizacion.getDscObjeto()), 2);//apellidos nombres
                addCelda(row, getValue(brkTObjCotizacion.getFcNacimiento()), 3);//fc nacimiento
                addCelda(row, edad(brkTObjCotizacion.getFcNacimiento()), 4);//edad
                addCelda(row, getValue(brkTObjCotizacion.getTotPriActual()), 5);//prima
                addCelda(row, getValue((brkTObjCotizacion.getFcInicio())), 6);//fc desde
                addCelda(row, getValue((brkTObjCotizacion.getFcFin())), 7);//fc fin
            } else {
                if (tipo == 1) {
                    addCelda(row, getValue(brkTObjCotizacion.getItem()), 0);//item
                    addCelda(row, getValue(brkTObjCotizacion.getDscObjeto()), 1);//obj aseg
                    addCelda(row, getValue(brkTObjCotizacion.getTotAseActual()), 2);//val aseg
                    addCelda(row, getValue(brkTObjCotizacion.getTasa()), 3);//tasa
                    addCelda(row, getValue(brkTObjCotizacion.getTotPriActual()), 4);//prima
                    addCelda(row, getValue(brkTObjCotizacion.getItemAseg()), 5);//item aseg
                    addCelda(row, getValue(brkTObjCotizacion.getVehiculo().getMarca()), 6);//marca
                    addCelda(row, getValue(brkTObjCotizacion.getVehiculo().getModelo()), 7);//modelo
                    addCelda(row, getValue(brkTObjCotizacion.getVehiculo().getAnioDeFabricacion()), 8);//anio
                    addCelda(row, getValue(brkTObjCotizacion.getVehiculo().getPlaca()), 9);//placa
                    addCelda(row, getValue(brkTObjCotizacion.getVehiculo().getNoDeMotor()), 10);//motor
                    addCelda(row, getValue(brkTObjCotizacion.getVehiculo().getNoDeChasis()), 11);//chasis
                    addCelda(row, getValue(brkTObjCotizacion.getVehiculo().getColor()), 12);//color
                    addCelda(row, getValue(brkTObjCotizacion.getObsObjeto()), 13);//obs
                } else {
                    addCelda(row, getValue(brkTObjCotizacion.getItem()), 0);//item
                    addCelda(row, getValue(brkTObjCotizacion.getUbicacion().getDscUbicacion()), 1);//ubicacion
                    addCelda(row, getValue(brkTObjCotizacion.getDscObjeto()), 2);//obj aseg
                    addCelda(row, getValue(brkTObjCotizacion.getTrayecto()), 3);//embarque
                    addCelda(row, getValue(brkTObjCotizacion.getTrHasta()), 4);//destino
                    addCelda(row, getValue(brkTObjCotizacion.getTotAseActual()), 5);//val aseg
                    addCelda(row, getValue(brkTObjCotizacion.getTasa()), 6);//tasa
                    addCelda(row, getValue(brkTObjCotizacion.getTotPriActual()), 7);//prima
                    addCelda(row, getValue(brkTObjCotizacion.getObsObjeto()), 8);//obs
                }
            }
        }
    }

    public List<String> generateCols(boolean aseg, boolean extras, int tipo) {
        List<String> colnames = new ArrayList<>();//nombres de las columnas del excel
        if (extras) {
            if (aseg) {
                colnames.add("Item");
                colnames.add("Deducible");
                colnames.add("Cédula");
                colnames.add("Dependiente/Beneficiario");
                colnames.add("Fc.Nacimiento");
                colnames.add("Edad");
                colnames.add("Parentesco/Relación");
                colnames.add("%Ben(Vida)");
                colnames.add("Activo");
            } else {
                colnames.add("Item");
                colnames.add("Valor Asegurado($)");
                colnames.add("Tasa");
                colnames.add(PRIMA);
            }
        } else {
            if (aseg) {
                colnames.add("Item");
                colnames.add("Cédula");
                colnames.add("Apellidos_Nombres");
                colnames.add("Fc.Nacimiento");
                colnames.add("Edad");
                colnames.add("Prima");
                colnames.add("Fc.Desde");
                colnames.add("Fc.Hasta");
            } else {
                if (tipo == 1) {
                    colnames.add("Item");
                    colnames.add("Objeto_Asegurado");
                    colnames.add("Val_Aseg");
                    colnames.add("Tasa");
                    colnames.add(PRIMA);
                    colnames.add("ItemAseg");
                    colnames.add("Marca");
                    colnames.add("Modelo");
                    colnames.add("Año");
                    colnames.add("Placa");
                    colnames.add("Motor");
                    colnames.add("Chasis");
                    colnames.add("Color");
                    colnames.add("Observaciones");
                } else {
                    colnames.add("Item");
                    colnames.add("Ubicación");
                    colnames.add("Objeto_Asegurado");
                    colnames.add("Embarque");
                    colnames.add("Destino");
                    colnames.add("Val_Asegurado($)");
                    colnames.add("Tasa");
                    colnames.add(PRIMA);
                    colnames.add("Observaciones");
                }

            }
        }
        return colnames;
    }

    public void addCelda(XSSFRow row, String valor, int index) {
        XSSFCell cell = row.createCell(index, STRING);
        String value = valor != null ? valor : "";
        cell.setCellType(STRING);
        cell.setCellValue(value);
    }

    public String getValue(Object val) {
        SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
        if (!ObjectUtils.isEmpty(val)) {
            switch (val.getClass().getSimpleName()) {
                case "String":
                case "BigDecimal":
                case "Integer":
                    return val.toString();
                case "Date":
                case "Timestamp":
                    return formatter.format((Date) val);
                case "Boolean":
                    return (boolean) val ? "SI" : "NO";
                default:
                    return "";
            }
        } else {
            return "";
        }
    }

    public String edad(Date fn) {
        LocalDate now = new LocalDate();
        if (!ObjectUtils.isEmpty(fn)) {
            LocalDate fnn = new LocalDate(fn);
            Years edad = Years.yearsBetween(fnn, now);
            return String.valueOf(edad.getYears());
        } else {
            return "";
        }
    }

    public String buildFileNameVam(String id, Integer cdRamo, Integer cdRamoCotizacion, Integer cdCompania) {
        var rc = dao.findByCdRamoCotizacionAndCdCompania(cdRamoCotizacion, cdCompania);
        var date1 = HelperUtil.formatDate(rc.getFcDesde());
        var date2 = HelperUtil.formatDate(rc.getFcHasta());
        return ramoSrv.findOne(cdRamo).getNmRamo() + "-" + id + "-" + date1 + "-" + date2;
    }
}
