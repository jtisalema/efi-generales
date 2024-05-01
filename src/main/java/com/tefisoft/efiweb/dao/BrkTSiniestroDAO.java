package com.tefisoft.efiweb.dao;

import com.tefisoft.efiweb.entidad.BrkTSiniestro;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

/**
 * @author dacopanCM on 25/08/17.
 */
@Repository
public interface BrkTSiniestroDAO extends IGenericDao<BrkTSiniestro> {

    @EntityGraph(value = "graph.BrkTSiniestro.general", type = EntityGraph.EntityGraphType.LOAD)
    @Query("select s from BrkTSiniestro s join s.estadoActivo t LEFT JOIN s.ramosCotizacion b " +
            "WHERE (s.flgAmv IS NULL or s.flgAmv !=1)  AND t.activo = 1 " +
            "AND (:cdCliente IS NULL OR s.cdCliente = :cdCliente)" +
            "AND (:cdCompania IS NULL OR s.cdCompania = :cdCompania) " +
            "AND (:numSiniestro IS NULL OR s.numSiniestro=:numSiniestro) " +
            "AND (:poliza IS NULL OR s.poliza=:poliza) " +
            "AND (:cdRamo IS NULL OR s.ramo.id = :cdRamo) " +
            "AND (:cdAseguradora IS NULL OR s.aseguradora.id = :cdAseguradora) " +
            "AND (:fcDesde IS NULL OR s.fcSiniestro BETWEEN :fcDesde AND :fcHasta)" +
            "AND (:anio IS NULL OR s.anoSiniestro = :anio) " +
            // si tiene rol de eejcutivo o agente
            "AND (:cdEjecutivo IS NULL OR b.cdEjecutivo= :cdEjecutivo) " +
            "AND (:cdPool IS NULL OR b.cdAgente in (:cdAgente))")
    Page<BrkTSiniestro> findGenerales(@Param("cdCliente") Integer cdCliente, @Param("cdCompania") Integer cdCompania, @Param("numSiniestro") Integer numSiniestro, @Param("poliza") String poliza,
                                      @Param("cdRamo") Integer cdRamo,
                                      @Param("cdAseguradora") Integer cdAseguradora, @Param("fcDesde") Date fcDesde, @Param("fcHasta") Date fcHasta, @Param("anio") Integer anio, @Param("cdEjecutivo") Integer cdEjecutivo, @Param("cdAgente") List<Integer> cdAgente,
                                      @Param("cdPool") Integer cdPool, Pageable pageable);


    @EntityGraph(value = "graph.BrkTSiniestro.general", type = EntityGraph.EntityGraphType.LOAD)
    @Query("select s from BrkTSiniestro s WHERE s.cdReclamo = :cdReclamo AND s.numSiniestro = :numSiniestro AND s.cdCliente =:cdCliente")
    List<BrkTSiniestro> findSiniestro(@Param("cdReclamo") Integer cdReclamo,@Param("numSiniestro") Integer numSiniestro,@Param("cdCliente") Integer cdCliente);
}
