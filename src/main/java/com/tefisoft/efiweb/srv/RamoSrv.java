package com.tefisoft.efiweb.srv;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tefisoft.efiweb.dao.BrkTRamosDAO;
import com.tefisoft.efiweb.entidad.BrkTRamos;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RamoSrv  {
    private final BrkTRamosDAO ramoDAO;

    public List<BrkTRamos> findAll() {
        return ramoDAO.findAll();
    }

    public Page<BrkTRamos> findAllPage(ObjectNode item) {
        Integer page = item.get("page").asInt();
        Integer pageSize = item.get("pageSize").asInt();
        ArrayNode sorted = (ArrayNode) item.get("sorted");
        ArrayNode filtered = (ArrayNode) item.get("filtered");
        Pageable pageable;
        Sort sort;
        if (sorted.size() > 0) {
            sort = Sort.by(sorted.get(0).get("desc").asBoolean() ? Sort.Direction.ASC : Sort.Direction.DESC, sorted.get(0).get("id").asText());
            pageable = PageRequest.of(page, pageSize, sort);
        } else {
            pageable = PageRequest.of(page, pageSize);
        }
        String nmRamo = null;
        if (filtered.size() > 0) {
            for (int i = 0; i < filtered.size(); i++) {
                switch (filtered.get(i).get("id").asText()) {
                    case "nmRamo":
                        nmRamo = filtered.get(i).get("value").asText();
                        break;
                }
            }
            return ramoDAO.searchRamos(nmRamo, pageable);
        } else {
            return ramoDAO.findAll(pageable);
        }

    }

    public BrkTRamos findOne(Integer cdRamo) {
        return ramoDAO.findByCdRamo(cdRamo).orElse(null);
    }

    public BrkTRamos findOneByRamoCotizacion(Integer cdRamoCotizacion, Integer cdCompania) {
        return ramoDAO.findByCdRamoCotizacion(cdRamoCotizacion, cdCompania).orElse(null);
    }
}
