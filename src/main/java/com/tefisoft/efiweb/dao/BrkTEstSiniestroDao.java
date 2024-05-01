package com.tefisoft.efiweb.dao;

import com.tefisoft.efiweb.entidad.BrkTEstSiniestro;

import java.util.List;

public interface BrkTEstSiniestroDao extends IGenericDao<BrkTEstSiniestro> {
    List<BrkTEstSiniestro> findAllByTipoIn(List<String> tipos);
}
