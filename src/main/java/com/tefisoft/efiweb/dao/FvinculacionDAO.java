package com.tefisoft.efiweb.dao;

import com.tefisoft.efiweb.entidad.BrkTFvinculacion;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author dacopanCM on 07/08/17.
 */
@Repository
public interface FvinculacionDAO extends IGenericDao<BrkTFvinculacion> {

    @EntityGraph(value = "graph.Fvinculacion.basic", type = EntityGraph.EntityGraphType.LOAD)
    List<BrkTFvinculacion> findByCdCliente(Integer cdCliente);

    @EntityGraph(value = "graph.Fvinculacion.allNodes", type = EntityGraph.EntityGraphType.LOAD)
    BrkTFvinculacion findBycdFvinculacion(Integer cdFvinculacion);
}
