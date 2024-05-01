package com.tefisoft.efiweb.srv;

import com.tefisoft.efiweb.dao.BrkTCiudadesDAO;
import com.tefisoft.efiweb.entidad.BrkTCiudades;
import org.springframework.stereotype.Service;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author dacopanCM on 10/06/18.
 */
@Service
public class CiudadService implements Serializable {

    private final BrkTCiudadesDAO dao;

    public CiudadService(BrkTCiudadesDAO dao) {
        this.dao = dao;
    }

    public List<BrkTCiudades> findProvincias() {
        Map<Integer, BrkTCiudades> map = new HashMap<>();
        List<BrkTCiudades> list = dao.findAllProvincias();
        list.forEach(c -> map.put(c.getCdProvincia(), c));
        return new ArrayList<>(map.values());
    }

    public List<BrkTCiudades> findCiudades() {
        return null;//todo
    }
}
