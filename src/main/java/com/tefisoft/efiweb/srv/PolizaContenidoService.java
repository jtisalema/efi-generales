package com.tefisoft.efiweb.srv;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tefisoft.efiweb.dao.BrkTObjCotizacionDAO;
import com.tefisoft.efiweb.dao.BrkTRamosDAO;
import com.tefisoft.efiweb.dao.PolizaJdbcDAO;
import com.tefisoft.efiweb.entidad.BrkTObjCotizacion;
import com.tefisoft.efiweb.entidad.BrkTRamos;
import com.tefisoft.efiweb.entidad.Subobjetos;
import com.tefisoft.efiweb.exc.CustomException;
import com.tefisoft.efiweb.util.Ctns;
import lombok.extern.apachecommons.CommonsLog;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author dacopanCM on 15/08/17.
 */
@Service
@CommonsLog
public class PolizaContenidoService extends GenericService<BrkTObjCotizacion, BrkTObjCotizacionDAO> {

    private static final long serialVersionUID = -6480495858981393085L;
    private final PolizaJdbcDAO polizaJdbcDAO;
    private final transient BrkTRamosDAO brkTRamosDAO;
    private final transient UbicacionSrv ubicacionSrv;

    PolizaContenidoService(BrkTObjCotizacionDAO dao, PolizaJdbcDAO polizaJdbcDAO, BrkTRamosDAO brkTRamosDAO, UbicacionSrv ubicacionSrv) {
        super(dao);
        this.polizaJdbcDAO = polizaJdbcDAO;
        this.brkTRamosDAO = brkTRamosDAO;
        this.ubicacionSrv = ubicacionSrv;
    }

    @SuppressWarnings("unchecked")
    private Page<BrkTObjCotizacion> getObjCotVehiculos(Integer cdRamosCotizacion, Object pp1, Object pp2, Integer cdCompania, Pageable pageable) {
        Map<String, Object> filters = (Map<String, Object>) pp2;
        Object o_marca = filters.get("vehiculo.marca");
        Object o_modelo = filters.get("vehiculo.modelo");
        Object o_placa = filters.get("vehiculo.placa");
        Object o_noDeMotor = filters.get("vehiculo.noDeMotor");
        Object o_noDeChasis = filters.get("vehiculo.noDeChasis");

        String marca = null, modelo = null, placa = null, noDeMotor = null, noDeChasis = null;

        if (o_marca != null && !StringUtils.isEmpty(o_marca.toString())) {
            marca = o_marca.toString().toUpperCase() + "%";
        }

        if (o_modelo != null && !StringUtils.isEmpty(o_modelo.toString())) {
            modelo = o_modelo.toString().toUpperCase() + "%";
        }

        if (o_placa != null && !StringUtils.isEmpty(o_placa.toString())) {
            placa = o_placa.toString().toUpperCase() + "%";
        }
        if (o_noDeMotor != null && !StringUtils.isEmpty(o_noDeMotor.toString())) {
            noDeMotor = o_noDeMotor.toString().toUpperCase() + "%";
        }
        if (o_noDeChasis != null && !StringUtils.isEmpty(o_noDeChasis.toString())) {
            noDeChasis = o_noDeChasis.toString().toUpperCase() + "%";
        }


        return dao.findVehiculos(cdRamosCotizacion, cdCompania, pp1, marca, modelo, placa, noDeMotor, noDeChasis, pageable);
    }

    private Page<BrkTObjCotizacion> getObjCotGenerales(Integer cdRamosCotizacion, String dscUbicacion, String dscObjeto, Integer cdCompania, Pageable pageable) {
        return dao.findGenerales(cdRamosCotizacion, cdCompania, dscUbicacion, dscObjeto, pageable);
    }

    private Page<BrkTObjCotizacion> getObjCotVAM(Integer cdUbicacion, Integer cdCompania, Object cedulaO, Object nombre, Pageable pageable) {
        return dao.findVAM(cdUbicacion, cdCompania, cedulaO, nombre, pageable);
    }

    public Page<BrkTObjCotizacion> getObjCotizacion(int type, Integer cdRamosCotizacion, Integer cdCompania, Integer cdUbicacion, int first, int pageSize, Sort sort, Object p1, Object p2) {
        Pageable pageable = sort == null ? PageRequest.of(first / pageSize, pageSize) : PageRequest.of(first / pageSize, pageSize, sort);


        String pp1 = null, pp2 = null;
        if (p1 != null && !StringUtils.isEmpty(p1.toString())) {
            pp1 = "%" + p1.toString().toUpperCase() + "%";
        }
        if (p2 instanceof String && !StringUtils.isEmpty(p2.toString())) {
            pp2 = "%" + p2.toString().toUpperCase() + "%";
        }
        switch (type) {
            case 0:
                return getObjCotGenerales(cdRamosCotizacion, pp1, pp2, cdCompania, pageable);
            case 1:
                return getObjCotVehiculos(cdRamosCotizacion, pp1, p2, cdCompania, pageable);
            case 2:
                return getObjCotVAM(cdUbicacion, cdCompania, pp1, pp2, pageable);
            default:
                throw new CustomException("Ningun Objeto Seleccionado");
        }
    }

    public List<Subobjetos> getSubobjetosByObtCot(Integer cdCompania, Integer cdObjetoCotizacion) {
        return polizaJdbcDAO.getSubobjetosByObtCot(cdCompania, cdObjetoCotizacion);
    }

    public Page<BrkTObjCotizacion> getPolizas(ObjectNode item) {
        Integer cdRamoCotizacion = item.get("cdRamoCotizacion").asInt();
        Integer cdRamo = item.get("cdRamo").asInt();
        Integer cdCompania = item.get("cdCompania").asInt();
        Integer cdUbicacion = item.get("cdUbicacion").asInt();
        String dscObjeto = item.get("dscObjeto").asText();
        String cedulaO = item.get("cedulaO").asText();
        int page = item.get("page").asInt();
        int pageSize = item.get("pageSize").asInt();
        ArrayNode sorted = (ArrayNode) item.get("sorted");

        int type;
        BrkTRamos ramo = brkTRamosDAO.findByCdRamo(cdRamo).orElse(null);
        if (ramo != null && (ramo.getNmRamo().contains(Ctns.KEY_RAMO_VIDA) || ramo.getNmRamo().contains(Ctns.KEY_RAMO_MEDICA))) {
            log.error("Error del sistema al obtener ramo");
            type = 2;
        } else if (ramo != null && ramo.getNmRamo().contains(Ctns.KEY_RAMO_VEHICULO)) {
            type = 1;
        } else {
            type = 0;
        }
        Object p1 = null;
        Object p2 = null;
        switch (type) {
            case 0://generales
                p1 = ubicacionSrv.findByRamoCoti(cdUbicacion, cdCompania).getDscUbicacion();
                p2 = dscObjeto;
                break;
            case 1://vehiculos
                p1 = dscObjeto;
                Map<String, Object> temp = new HashMap<>();
                var vehiculo = item.get("vehiculo");
                temp.put("vehiculo.marca", vehiculo.get("marca").asText());
                temp.put("vehiculo.modelo", vehiculo.get("modelo").asText());
                temp.put("vehiculo.placa", vehiculo.get("placa").asText());
                temp.put("vehiculo.noDeMotor", vehiculo.get("noDeMotor").asText());
                temp.put("vehiculo.noDeChasis", vehiculo.get("noDeChasis").asText());
                p2 = temp;
                break;
            case 2://vam
                p1 = cedulaO;
                p2 = dscObjeto;
                break;
            default:
                break;
        }
        Sort sort = null;
        if (sorted != null && sorted.size() > 0) {
            Sort.Direction dir = sorted.get(0).get("desc").asBoolean() ? Sort.Direction.DESC : Sort.Direction.ASC;
            sort = (sorted.size() > 0) ? Sort.by(dir, sorted.get(0).get("id").asText()) : null;
        }
        return getObjCotizacion(type, cdRamoCotizacion, cdCompania, cdUbicacion, page, pageSize, sort, p1, p2);
    }

    public Map<String, Object> getCelularAndMail(Integer cdReclamo, Integer cdCompania) {
        return polizaJdbcDAO.getCelularAndMail(cdReclamo, cdCompania);
    }
}
