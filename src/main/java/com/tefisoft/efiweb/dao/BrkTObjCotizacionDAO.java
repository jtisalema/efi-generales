package com.tefisoft.efiweb.dao;

import com.tefisoft.efiweb.entidad.BrkTObjCotizacion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * @author dacopanCM on 15/08/17.
 */
@Repository
public interface BrkTObjCotizacionDAO extends IGenericDao<BrkTObjCotizacion> {

    @EntityGraph(value = "graph.ObjCotizacion.vehiculo", type = EntityGraph.EntityGraphType.LOAD)
    @Query("SELECT c from BrkTObjCotizacion c join c.ramosCotizacion a WHERE a.cdCompania = ?2 AND a.cdRamoCotizacion =?1 AND (?3 =null OR c.dscObjeto like ?3) AND (?4 =null OR c.vehiculo.marca like ?4) AND (?5 =null OR c.vehiculo.modelo like ?5) AND (?6 =null OR c.vehiculo.placa like ?6) AND (?7 =null OR c.vehiculo.noDeMotor like ?7) AND (?8 =null OR c.vehiculo.noDeChasis like ?8)")
    Page<BrkTObjCotizacion> findVehiculos(Integer cdRamosCotizacion, Integer cdCompania, Object dscObjeto, Object marca, Object modelo, Object placa, Object noDeMotor, Object noDeChasis, Pageable pageable);

    @EntityGraph(value = "graph.ObjCotizacion.general", type = EntityGraph.EntityGraphType.LOAD)
    @Query("SELECT c from BrkTObjCotizacion c join c.ramosCotizacion a WHERE a.cdCompania = ?2 AND a.cdRamoCotizacion =?1 AND (?3 =null OR c.ubicacion.dscUbicacion like ?3) AND (?4 =null OR c.dscObjeto like ?4) ORDER BY c.ubicacion.dscUbicacion")
    Page<BrkTObjCotizacion> findGenerales(Integer cdRamosCotizacion, Integer cdCompania, Object dscUbicacion, Object dscObjeto, Pageable pageable);

    @EntityGraph(value = "graph.ObjCotizacion.vam", type = EntityGraph.EntityGraphType.LOAD)
    @Query("SELECT c from BrkTObjCotizacion c join c.ubicacion a WHERE a.cdCompania = ?2 AND a.cdUbicacion =?1 AND (?3 =null OR c.cedulaO like ?3) AND (?4 =null OR c.dscObjeto like ?4) ORDER BY a.dscUbicacion, c.dscObjeto")
    Page<BrkTObjCotizacion> findVAM(Integer cdUbicacion, Integer cdCompania, Object cedulaO, Object nombre, Pageable pageable);

}
