package com.tefisoft.efiweb.dao;

import com.tefisoft.efiweb.entidad.DocumentoDigital;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentoDigitalRepository extends IGenericDao<DocumentoDigital> {
    List<DocumentoDigital> findAllByCdReclamoAndCdRamoAndCdIncSiniestro(Integer cdReclamo, Integer cdRamo, Integer cdIncSiniestro);

    @Modifying
    @Query(nativeQuery = true, value = "DELETE FROM BRK_T_DOCUMENTO_DIGITAL WHERE CD_ARCHIVO IN (?1)")
    void deleteAllByCdArchivoIn(List<Integer> cdsArchivos);

    @Modifying
    @Query(nativeQuery = true, value = "UPDATE BRK_T_DOCUMENTO_DIGITAL " +
            "SET ESTADO = ?2, OBSERVACIONES = ?3, ID_USUARIO_EJECUTIVO =?4 " +
            "WHERE CD_ARCHIVO = ?1")
    void nativeUpdateEstadoAndObservacionesAndIdEjecutivoByCdArchivo(Integer cdArchivo, String estado, String observaciones, Integer idEjecutivo);

    List<DocumentoDigital> findAllByCdReclamoIsNull();

    @Modifying
    @Query(nativeQuery = true, value = "UPDATE BRK_T_DOCUMENTO_DIGITAL SET ESTADO = ?1 WHERE CD_ARCHIVO IN (?2)")
    void nativeUpdateEstadoByCdArchivoIn(String estado, List<Integer> cdsArchivos);

}
