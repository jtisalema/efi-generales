package com.tefisoft.efiweb.srv;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tefisoft.efiweb.dao.*;
import com.tefisoft.efiweb.dto.ClienteGenWeb;
import com.tefisoft.efiweb.entidad.*;
import com.tefisoft.efiweb.util.HelperUtil;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.util.List;
import java.util.stream.Collectors;

/**
 * @author dacopanCM on 23/06/17.
 */
@Service
public class ClienteService extends GenericService<BrkTClientes, ClienteDAO> {
    private final EjecutivoDAO ejecutivoDAO;
    private final ClienteJdbcDAO clienteJdbcDAO;
    private final FvinculacionDAO fvinculacionDAO;
    private final BrkTCliTelefonosDao brkTCliTelefonosDao;

    public ClienteService(ClienteDAO dao, EjecutivoDAO ejecutivoDAO, ClienteJdbcDAO clienteJdbcDAO, FvinculacionDAO fvinculacionDAO, BrkTCliTelefonosDao brkTCliTelefonosDao) {
        super(dao);
        this.ejecutivoDAO = ejecutivoDAO;
        this.clienteJdbcDAO = clienteJdbcDAO;
        this.fvinculacionDAO = fvinculacionDAO;
        this.brkTCliTelefonosDao = brkTCliTelefonosDao;
    }

    public BrkTClientes findBasicById(Integer id) {
        return dao.findByCdCliente(id);
    }

    public BrkTEjecutivos getEjecutivoById(Integer cdEjecutivo) {
        return ejecutivoDAO.findEjecutivoByCd(cdEjecutivo);
    }

    public List<BrkTNotificaciones> getEjecutivoNotificaciones(Integer cdEjecutivo, Integer cdCompania) {
        return clienteJdbcDAO.getNotificaciones(cdEjecutivo, cdCompania);
    }

    public List<BrkTFvinculacion> getVinculacionByCliente(Integer cdCliente) {
        return fvinculacionDAO.findByCdCliente(cdCliente);
    }

    public BrkTFvinculacion getVinculacionByCd(Integer cdFvinculacion) {
        return fvinculacionDAO.findBycdFvinculacion(cdFvinculacion);
    }

    public void saveTelefono(BrkTCliTelefonos fono) {
        brkTCliTelefonosDao.save(fono);
    }

    public List<BrkTClientes> searchClientes(ObjectNode query) {
        String clt = query.path("cliente").asText();
        return dao.searchClientes(clt.trim().toUpperCase(), PageRequest.of(0, 20)).getContent();
    }

    public List<ClienteGenWeb> getAsociadosGenWeb(Integer cdAdicional, boolean activo) {
        return clienteJdbcDAO.getAsociadosGenWeb(cdAdicional, activo).stream().filter(a -> !HelperUtil.isEmpty(a.getNmAsegurado()) || !HelperUtil.isEmpty(a.getApAsegurado())).collect(Collectors.toList());
    }
}
