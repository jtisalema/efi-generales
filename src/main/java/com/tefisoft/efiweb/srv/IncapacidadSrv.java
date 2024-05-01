package com.tefisoft.efiweb.srv;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tefisoft.efiweb.dao.BrkTAseguradorasDAO;
import com.tefisoft.efiweb.dao.BrkTIncapacidadDao;
import com.tefisoft.efiweb.dao.SiniestroJdbcDao;
import com.tefisoft.efiweb.entidad.BrkTAseguradoras;
import com.tefisoft.efiweb.entidad.BrkTIncapacidad;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class IncapacidadSrv {

    private final BrkTIncapacidadDao brkTIncapacidadDao;
    private final BrkTAseguradorasDAO brkTAseguradorasDAO;
    private final SiniestroJdbcDao siniestroJdbcDao;

    public List<BrkTIncapacidad> searchIncapacidadByName(ObjectNode item) {
        String name = item.path("name").asText();
        return brkTIncapacidadDao.searchIncapacidadesByName(name.trim());
    }

    public BrkTIncapacidad getIncapacidad(Integer id) {
        return brkTIncapacidadDao.findByCdIncapacidad(id).orElse(null);
    }

    public Map<String, Object> getData(Integer cdAseg, Integer cdRamoCotizacion, Integer cdUbicacion, Integer cdRamo) {
        BrkTAseguradoras aseg = brkTAseguradorasDAO.findById(cdAseg).orElse(null);
        List<Map<String, Object>> list = siniestroJdbcDao.getData(cdRamoCotizacion, cdUbicacion, cdRamo);

        return Map.of("aseguradora", aseg != null ? aseg.getNmAseguradora() : "", "ramo",
                !list.isEmpty() ? list.get(0).get("NM_RAMO") : "",
                "plan", !list.isEmpty() ? list.get(0).get("DSC_PLAN") : "");
    }
}
