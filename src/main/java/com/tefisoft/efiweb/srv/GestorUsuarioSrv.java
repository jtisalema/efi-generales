package com.tefisoft.efiweb.srv;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tefisoft.efiweb.dao.PolizaJdbcDAO;
import com.tefisoft.efiweb.dao.UsuarioDAO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@AllArgsConstructor
public class GestorUsuarioSrv {

    private final PolizaJdbcDAO polizaJdbcDAO;
    private final UsuarioDAO usuarioDAO;
    private final ObjectMapper mapper;

    public ObjectNode search(ObjectNode item) {
        String cdContratante = item.get("cdContratante").asText();
        String nmContacto = item.get("nmContacto").asText().toUpperCase();
        String apContacto = item.get("apContacto").asText().toUpperCase();
        String correo = item.get("correo").asText().toLowerCase();
        String nmContratante = item.get("nmContratante").asText().toUpperCase();
        String apContratante = item.get("apContratante").asText().toUpperCase();
        String cedula = item.get("cedula").asText();
        int pageSize = item.get("pageSize").asInt();
        int page = item.get("page").asInt() + 1; // por paginacion manual

        cdContratante += "%";
        nmContacto = "%" + nmContacto + "%";
        apContacto = "%" + apContacto + "%";
        nmContratante = "%" + nmContratante + "%";
        apContratante = "%" + apContratante + "%";
        cedula += "%";
        correo += "%";

        var pageIni = (page * pageSize) - pageSize + 1;
        var pageFin = pageSize * page;

        ObjectNode data = mapper.createObjectNode();
        try {
            ArrayNode lista = mapper.valueToTree(
                    polizaJdbcDAO.getGestorUsuarios(cdContratante, nmContacto, apContacto, cedula, nmContratante, apContratante, correo, pageFin, pageIni)
            );
            var count = (double) polizaJdbcDAO.getGestorUsuariosCount(cdContratante, nmContacto, apContacto, cedula, nmContratante, apContratante, correo) / pageSize;
            data.put("totalPages", (int) Math.ceil(count));
            data.set("data", lista);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return data;
    }

    private final String TEMP_EMAIL = null;
    private final String AS_USUARIO = "PORTALES";
    private final int CD_COMPANIA = 1;

    public String crearUsuariosWeb(List<ObjectNode> items) {
        Integer cdCliente;
        String correo;
        Integer cdEjecutivo;
        String cedula;
        StringBuilder asError = new StringBuilder();
        for (ObjectNode i : items) {
            cdCliente = i.get("cdCliente").asInt();
            cdEjecutivo = i.get("cdEjecutivo").asInt();
            cedula = i.get("cedula").asText();
            correo = TEMP_EMAIL != null ? TEMP_EMAIL : i.get("correo").asText();
            asError.append(usuarioDAO.spCreaUsuarioWeb(CD_COMPANIA, cdCliente, correo, cdEjecutivo, AS_USUARIO, cedula)).append("\n");
        }
        return asError.toString();
    }

    public String inactivarUsuariosWeb(List<ObjectNode> items) {
        Integer cdCliente;
        String correo;
        Integer cdEjecutivo;
        String cedula;
        StringBuilder asError = new StringBuilder();
        for (ObjectNode i : items) {
            cdCliente = i.get("cdCliente").asInt();
            cdEjecutivo = i.get("cdEjecutivo").asInt();
            cedula = i.get("cedula").asText();
            correo = TEMP_EMAIL != null ? TEMP_EMAIL : i.get("correo").asText();
            asError.append(usuarioDAO.spInacUsuarioWeb(CD_COMPANIA, cdCliente, correo, cdEjecutivo, cedula)).append("\n");
        }
        return asError.toString();
    }

}
