package com.tefisoft.efiweb.dao;

import com.tefisoft.efiweb.entidad.DocDigital;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DocDigitalRepository extends IGenericDao<DocDigital> {
    @Query(nativeQuery = true, value = "select aplica_subcarpeta from BRK_T_DOC_DIGITAL where CD_RAMO = :ramo")
    Integer getSubCarpeta(@Param("ramo") Integer cdRamo);

    @Query(nativeQuery = true, value = "SELECT F_CONSULTA_SUBCARPETA(:cdCompania,:cdFinanciamiento,:cdRamoCotizacion) FROM dual")
    String fConsultaSubcarpeta(@Param("cdCompania") Integer cdCompania, @Param("cdFinanciamiento") Integer cdFinanciamiento, @Param("cdRamoCotizacion") Integer cdRamoCotizacion);

}
