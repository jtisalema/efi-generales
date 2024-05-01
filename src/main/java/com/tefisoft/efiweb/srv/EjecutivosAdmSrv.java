package com.tefisoft.efiweb.srv;

import com.tefisoft.efiweb.dao.EjecutivoAdmDao;
import com.tefisoft.efiweb.dao.EjecutivoAdmJdbcDao;
import com.tefisoft.efiweb.entidad.EjecutivosAdm;
import com.tefisoft.efiweb.entidad.IBrkTEjecutivosAdm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * @author dacopanCM on 28/06/17.
 */
@Service
@Transactional(readOnly = true)
public class EjecutivosAdmSrv implements Serializable {

    private static final long serialVersionUID = -5635402165738484695L;
    private final EjecutivoAdmJdbcDao dao;
    private final transient EjecutivoAdmDao ejecutivoAdmDao;


    @Autowired
    public EjecutivosAdmSrv(EjecutivoAdmJdbcDao dao, EjecutivoAdmDao ejecutivoAdmDao) {
        this.dao = dao;
        this.ejecutivoAdmDao = ejecutivoAdmDao;
    }

    public List<IBrkTEjecutivosAdm> findByCltId(Integer cltId) {
        return dao.findByCltId(cltId);
    }

    public String findTelefonos(Integer ejecutivoAdmId) {
        return dao.findTelefonos(ejecutivoAdmId);
    }

    public String findEmail(Integer ejecutivoAdmId) {
        return dao.findEmail(ejecutivoAdmId);
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

    public String getCorreos(Integer cdEjecutivo) {
        return ejecutivoAdmDao.F_BUSCA_CORREO_EJECLI(cdEjecutivo);
    }

    public String getTelefonos(Integer cdEjecutivo) {
        return ejecutivoAdmDao.F_BUSCA_TELEF_EJECLI(cdEjecutivo);
    }
}
