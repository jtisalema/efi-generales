package com.tefisoft.efiweb.dao;

import com.tefisoft.efiweb.entidad.BrkTUbicacion;
import com.tefisoft.efiweb.entidad.BrkTVPolizas;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @author dacopanCM on 14/08/17.
 */
public interface BrkTVPolizasDAO extends IGenericDao<BrkTVPolizas> {
    @Query("select b from BrkTVPolizas b " +
            "WHERE b.factAseg IS NOT NULL AND b.cdCliente = :cdCliente " +
            "AND b.poliza=:poliza " +
            "AND (:fcDesde IS NULL OR trunc(b.fcDesde) BETWEEN :fcDesde AND :fcHasta) " +
            "AND (:fcDesde IS NULL OR trunc(b.fcHasta) BETWEEN :fcDesde AND :fcHasta) " +
            "AND (:cdRamo IS NULL OR b.cdRamo = :cdRamo) " +
            "AND (:cdAseguradora IS NULL OR b.cdAseguradora = :cdAseguradora) " +
            "AND (:cdCompania IS NULL OR b.compania.id= :cdCompania)")
    @EntityGraph(value = "graph.BrkTVPolizas.basic", type = EntityGraph.EntityGraphType.LOAD)
    Page<BrkTVPolizas> searchVPolizas(@Param("cdCliente") Integer cdCliente, @Param("poliza") String poliza, @Param("fcDesde") Date fcDesde, @Param("fcHasta") Date fcHasta,
                                      @Param("cdRamo") Integer cdRamo, @Param("cdAseguradora") Integer cdAseguradora, @Param("cdCompania") Integer cdCompania, Pageable pageable);

    @EntityGraph(value = "graph.BrkTUbicacion.vam", type = EntityGraph.EntityGraphType.LOAD)
    @Query("SELECT c from BrkTUbicacion c WHERE c.activo = 1 AND c.cdCompania = ?2 AND c.cdRamoCotizacion =?1 ORDER BY c.item")
    List<BrkTUbicacion> findVAMGrp(Integer cdRamosCotizacion, Integer cdCompania);

    @Query(value = "SELECT distinct cd_agente from BRK_V_SUBAGENTES c WHERE c.cd_pool = :cdPool", nativeQuery = true)
    ArrayList<Integer> findPools(@Param("cdPool") Integer cdPool);

    @Query(nativeQuery = true, value = " SELECT nvl(u.nm_cliente, u.dsc_ubicacion) FROM brk_t_ubicacion u where u.cd_beneficiarios is not null and ( u.cd_compania = ? ) and ( u.cd_ramo_cotizacion = ?) ")
    List<String> findBeneficiario(@Param("cdCompania") Integer cdCompania, @Param("cdRamoCotizacion") Integer cdRamoCotizacion);
}
