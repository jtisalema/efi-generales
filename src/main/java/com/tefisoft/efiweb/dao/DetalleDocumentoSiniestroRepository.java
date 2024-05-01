package com.tefisoft.efiweb.dao;

import com.tefisoft.efiweb.entidad.DetalleDocumentoSiniestro;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetalleDocumentoSiniestroRepository extends IGenericDao<DetalleDocumentoSiniestro> {
    List<DetalleDocumentoSiniestro> findAllByCdReclamoAndCdArchivoIn(Integer cdReclamo, List<Integer> cdsArchivos);

    @Modifying
    @Query(nativeQuery = true, value = "DELETE FROM BRK_T_DET_BENEF_DOC_SS WHERE CD_ARCHIVO like ?1")
    void deleteAllByCdArchivo(Integer cdArchivo);

    @Modifying
    @Query(nativeQuery = true, value = "DELETE FROM BRK_T_DET_BENEF_DOC_SS WHERE CD_ARCHIVO IN (?1)")
    void deleteAllByCdArchivoIn(List<Integer> cdsArchivos);

}
