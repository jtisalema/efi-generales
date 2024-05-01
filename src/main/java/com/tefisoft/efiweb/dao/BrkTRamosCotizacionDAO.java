package com.tefisoft.efiweb.dao;

import com.tefisoft.efiweb.entidad.BrkTRamosCotizacion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

/**
 * @author dacopanCM on 08/08/17.
 */
public interface BrkTRamosCotizacionDAO extends IGenericDao<BrkTRamosCotizacion> {
    @EntityGraph(value = "graph.RamosCotizacion.basic", type = EntityGraph.EntityGraphType.LOAD)
    @Query("select b from BrkTRamosCotizacion b join b.cotizacion a WHERE a.cdCompania = b.cdCompania " +
            "AND b.factAseg IS NOT NULL " +
            "AND (:cdCliente IS NULL OR a.cdCliente = :cdCliente) " +
            "AND (b.poliza IS NOT NULL AND (:poliza IS NULL OR b.poliza=:poliza)) " +
            "AND (:fcDesde IS NULL OR b.fcDesde BETWEEN :fcDesde AND :fcHasta) AND (:cdRamo IS NULL OR b.ramo.cdRamo = :cdRamo) " +
            "AND (:cdAseguradora IS NULL OR a.aseguradora.id = :cdAseguradora) " +
            "AND (:cdCompania IS NULL OR b.cdCompania= :cdCompania) " +
            "AND (b.anexo IS NULL OR LENGTH(b.anexo) = 0) " +
            "AND a.tipo IN ('COTIZACION', 'RENOVACION INI', 'C_MAESTRA', 'RENOVACION MST', 'ANULADA', 'CANCELADA') " +
            // si tiene rol de eejcutivo o agente
            "AND (:cdEjecutivo IS NULL OR b.cdEjecutivo= :cdEjecutivo) " +
            "AND (:cdPool IS NULL OR b.cdAgente IN (:cdAgente)) " +
            "AND (:placa IS NULL OR b.cdRamoCotizacion IN (" +
            "SELECT c.ramosCotizacion.cdRamoCotizacion " +
            "                                     FROM BrkTObjCotizacion as c " +
            "                                     WHERE c.cdCompania = b.cdCompania " +
            "                                       AND (c.cdObjCotizacion IN (SELECT d.objCotizacion.cdObjCotizacion " +
            "                                                                   FROM BrkTObjCarVehiculos as d " +
            "                                                                   WHERE d.cdCompania = c.cdCompania " +
            "                                                                     AND d.placa = :placa)" +
            "OR c.cdObjCotizacion IN (select r.cdObjCotizacion from BrkTCaracteristicas r  join r.rubros s " +
            "                                                        where UPPER(s.dscRubro) = 'PLACA' and " +
            "                                           r.dscCaracteristica = :placa)" +
            ")))")
    Page<BrkTRamosCotizacion> search(@Param("cdCliente") Integer cdCliente, @Param("poliza") String poliza, @Param("fcDesde") Date fcDesde, @Param("fcHasta") Date fcHasta,
                                     @Param("cdRamo") Integer cdRamo, @Param("cdAseguradora") Integer cdAseguradora, @Param("cdCompania") Integer cdCompania,
                                     @Param("cdEjecutivo") Integer cdEjecutivo,
                                     @Param("cdAgente") List<Integer> cdAgente,
                                     @Param("cdPool") Integer cdPool,
                                     @Param("placa") String placa,
                                     Pageable pageable);
    BrkTRamosCotizacion findByCdRamoCotizacionAndCdCompania(Integer cdRamoCotizacion, Integer cdCompania);
}
