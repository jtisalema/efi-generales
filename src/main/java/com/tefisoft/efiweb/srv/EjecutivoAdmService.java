package com.tefisoft.efiweb.srv;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tefisoft.efiweb.dao.EjecutivoAdmDao;
import com.tefisoft.efiweb.dao.EjecutivoAdmJdbcDao;
import com.tefisoft.efiweb.entidad.EjecutivosAdm;
import com.tefisoft.efiweb.entidad.IBrkTEjecutivosAdm;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author dacopanCM on 28/06/17.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EjecutivoAdmService implements Serializable {

    private final EjecutivoAdmJdbcDao ejecutivoAdmJdbcDao;
    private final transient EjecutivoAdmDao ejecutivoAdmDao;
    private final ObjectMapper mapper;

    @Value("${app.mail:na}")
    private String TEMP_EMAIL = "na";


    public List<IBrkTEjecutivosAdm> findByCltId(Integer cltId) {
        return ejecutivoAdmJdbcDao.findByCltId(cltId);
    }

    public String findTelefonos(Integer ejecutivoAdmId) {
        return ejecutivoAdmJdbcDao.findTelefonos(ejecutivoAdmId);
    }

    public String findEmail(Integer ejecutivoAdmId) {
        return ejecutivoAdmJdbcDao.findEmail(ejecutivoAdmId);
    }

    private String getEmailList(Integer ejecutivoAdmId) {
        String emails = findEmail(ejecutivoAdmId);
        String[] emailsList = emails.trim().split(";");
        for (String e : emailsList) {
            if (e.length() > 5 && e.contains("@")) {
                return e.trim();
            }
        }
        return null;
    }

    public String[] findEmailList(Integer cdCliente) {
        List<IBrkTEjecutivosAdm> ejecutivosAdmList = findByCltId(cdCliente);
        List<String> emails = new ArrayList<>();
        ejecutivosAdmList.forEach(e -> {
            String email = getEmailList(e.getCdEjecutivo());
            if (!ObjectUtils.isEmpty(email)) {
                emails.add(email);
            }
        });
        if (!emails.isEmpty()) {
            String[] toEmails = new String[emails.size()];
            return emails.toArray(toEmails);
        } else return null;
    }

    public EjecutivosAdm getEjecutivo(Integer cdEje, Integer cdComp) {
        return ejecutivoAdmDao.findByCdEjecutivoAndCdCompania(cdEje, cdComp);
    }

    public Map<String, Object> findDatos(Integer cdEje, Integer cdComp) {
        Map<String, Object> res = new HashMap<>();
        EjecutivosAdm ejAdm = ejecutivoAdmDao.findByCdEjecutivoAndCdCompania(cdEje, cdComp);
        var correo = ejecutivoAdmDao.F_BUSCA_CORREO_EJECLI(cdEje);
        var telefono = ejecutivoAdmDao.F_BUSCA_TELEF_EJECLI(cdEje);
        if (ejAdm != null) {
            res.put("nombres", ejAdm.getNmAgente() + " " + ejAdm.getApAgente());
            res.put("correos", correo);
            res.put("telefonos", telefono);
        }
        return res;
    }

    public String getCorreos(Integer cdEjecutivo) {
        return ejecutivoAdmDao.F_BUSCA_CORREO_EJECLI(cdEjecutivo);
    }

    public String getTelefonos(Integer cdEjecutivo) {
        return ejecutivoAdmDao.F_BUSCA_TELEF_EJECLI(cdEjecutivo);
    }

    public String desactivarEjecutivoSubAgenteWeb(List<ObjectNode> items, boolean subagente) {

        StringBuilder asError = new StringBuilder();
        for (ObjectNode i : items) {
            var tpPersAdm = subagente ? "" : i.get("tpPersAdm").asText();
            var cdEjecutivo = subagente ? i.get("cdCodigo").asInt() : i.get("cdEjecutivo").asInt();
            var cdCompania = i.get("cdCompania").asInt();
            var mail = !TEMP_EMAIL.equals("na") ? TEMP_EMAIL : i.get("mail").asText();
            var tipoCodigo = "S";

            if (!subagente) {
                if (!ObjectUtils.isEmpty(tpPersAdm)) {
                    tipoCodigo = "P";
                } else {
                    tipoCodigo = "E";
                }
            }

            asError.append(ejecutivoAdmDao.spDesactivar(1, cdCompania, cdEjecutivo, tipoCodigo, mail)).append("\n");
        }
        return asError.toString();
    }

    public String crearEjecutivoSubAgenteWeb(List<ObjectNode> items, boolean subagente) {

        StringBuilder asError = new StringBuilder();
        for (ObjectNode i : items) {
            var tpPersAdm = subagente ? "" : i.get("tpPersAdm").asText();
            var cdEjecutivo = subagente ? i.get("cdCodigo").asInt() : i.get("cdEjecutivo").asInt();
            var cdCompania = i.get("cdCompania").asInt();
            var mail = !TEMP_EMAIL.equals("na") ? TEMP_EMAIL : i.get("mail").asText();
            var tipoCodigo = "S";
            String tipo = " ";

            if (!subagente) {
                if (!ObjectUtils.isEmpty(tpPersAdm)) {
                    tipoCodigo = "P";
                    tipo = ejecutivoAdmDao.findTpPersAdm(tpPersAdm);
                } else {
                    tipoCodigo = "E";
                    tipo = "";
                }
            }

            asError.append(ejecutivoAdmDao.spCrearEjeWeb(1, cdCompania, cdEjecutivo, tipoCodigo, tipo, mail)).append("\n");
        }
        return asError.toString();
    }

    public ObjectNode searchEjecutivo(ObjectNode item) {
        String nmAgente = item.get("nmAgente").asText().toUpperCase().trim();
        String apAgente = item.get("apAgente").asText().toUpperCase().trim();
        String cedula = item.get("cedula").asText();
        String mail = item.get("mail").asText().toLowerCase();
        String tipoEjecutivo = item.get("tipoEjecutivo").asText();
        nmAgente = "%" + nmAgente + "%";
        apAgente = "%" + apAgente + "%";
        cedula += "%";
        mail += "%";

        var data = mapper.createObjectNode();
        try {
            ArrayNode lista = mapper.valueToTree(
                    ejecutivoAdmJdbcDao.getEjecutivo(nmAgente, apAgente, cedula, mail, tipoEjecutivo, tipoEjecutivo));
            data.set("data", lista);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return data;
    }
}
