package com.tefisoft.efiweb.srv;

import com.tefisoft.efiweb.dao.DocDigitalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@CommonsLog
public class DocDigitalSrv {

    private final DocDigitalRepository docDigitalRepository;

    public Integer getSubCarpeta(Integer cdRamo) {
        return docDigitalRepository.getSubCarpeta(cdRamo);
    }

    public String findSubcarpeta(Integer cdCompania, Integer cdFinanciamiento, Integer cdRamoCotizacion) {
        return docDigitalRepository.fConsultaSubcarpeta(cdCompania, cdFinanciamiento, cdRamoCotizacion);
    }

    public String validarSubCarpeta(Integer cdRamo, Integer cdCompania, Integer cdRamoCotizacion) {
        try {
            Integer subCarpeta = getSubCarpeta(cdRamo);
            if (subCarpeta == 1) {
                //obtener los datos para consultar lo que se necesita
                return findSubcarpeta(cdCompania, 0, cdRamoCotizacion);
            }
        } catch (Exception e) {
            log.info("Error:: " + e.getMessage());
        }
        return "";
    }

}
