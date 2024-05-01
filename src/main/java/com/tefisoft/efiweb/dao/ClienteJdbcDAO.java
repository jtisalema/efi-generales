package com.tefisoft.efiweb.dao;

import com.tefisoft.efiweb.dto.ClienteGenWeb;
import com.tefisoft.efiweb.entidad.BrkTNotificaciones;
import com.tefisoft.efiweb.entidad.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.util.ObjectUtils;

import javax.sql.DataSource;
import java.io.Serializable;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author dacopanCM on 07/08/17.
 */
@Repository
public class ClienteJdbcDAO implements Serializable {
    private JdbcTemplate jdbcTemplate;
    private static final String Q_EJEC_NOTI = "SELECT N.DSC_NOTIFIC, N.ORDEN, N.ABREV, E.CD_NOTIFIC, E.ACTIVA, E.CD_COMPANIA, E.CD_EJECUTIVO FROM BRK_T_NOTIFICACIONES N, BRK_T_NOT_EJECUTIVOS E WHERE (E.CD_NOTIFIC = N.CD_NOTIFIC) AND (E.CD_EJECUTIVO = ?) AND (E.CD_COMPANIA = ?) ORDER BY n.ORDEN";
    private static final String Q_CLI_CONTAC_WEB = "SELECT C.*, C.NM_ASEGURADO as NM_EJECUTIVO, C.AP_ASEGURADO as AP_EJECUTIVO FROM BRK_T_CLI_CONTAC_WEB C WHERE CD_ADICIONAL LIKE ?";
    private static final String JOIN_CONTACT_PORTAL = "SELECT C.CEDULA ,C.NM_ASEGURADO, C.AP_ASEGURADO FROM BRK_T_CLI_CONTAC_WEB C, BRK_T_USUARIO_PORTAL_WEB P WHERE C.CD_ADICIONAL LIKE ? AND P.CD_ADICIONAL LIKE ?";
    private static final String JOIN_ASEG_PORTAL = "SELECT C.CEDULA ,C.NM_ASEGURADO, C.AP_ASEGURADO FROM BRK_T_CLI_VAM_WEB C, BRK_T_USUARIO_PORTAL_WEB P WHERE C.CD_ADICIONAL LIKE ? AND P.CD_ADICIONAL LIKE ?";

    @SuppressWarnings("SpringJavaAutowiringInspection")
    @Autowired
    public void setDataSource(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    public List<BrkTNotificaciones> getNotificaciones(Integer cdEjecutivo, Integer cdCompania) {
        return this.jdbcTemplate.query(Q_EJEC_NOTI, new Object[]{cdEjecutivo, cdCompania}, new BeanPropertyRowMapper<>(BrkTNotificaciones.class));
    }

    public List<ClienteGenWeb> getAsociadosGenWeb(Integer cdAdicional, boolean activo) {
        return this.jdbcTemplate.query(Q_CLI_CONTAC_WEB, new Object[]{cdAdicional}, new BeanPropertyRowMapper<>(ClienteGenWeb.class));
    }

    public List<Usuario> getNameUserContactPortal(Integer cdAdicional) {
        return this.jdbcTemplate.query(JOIN_CONTACT_PORTAL, new Object[]{cdAdicional, cdAdicional}, new BeanPropertyRowMapper<>(Usuario.class));
    }

    public List<Usuario> getNameUserAsegPortal(Integer cdAdicional) {
        return this.jdbcTemplate.query(JOIN_ASEG_PORTAL, new Object[]{cdAdicional, cdAdicional}, new BeanPropertyRowMapper<>(Usuario.class));
    }

}
