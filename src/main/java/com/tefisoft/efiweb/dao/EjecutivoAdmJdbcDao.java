package com.tefisoft.efiweb.dao;

import com.tefisoft.efiweb.dto.Ejecutivo;
import com.tefisoft.efiweb.entidad.IBrkTEjecutivosAdm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.io.Serializable;
import java.util.List;

/**
 * @author dacopanCM on 27/06/17.
 */
@Repository
public class EjecutivoAdmJdbcDao implements Serializable {

    private JdbcTemplate jdbcTemplate;

    private static final String Q_EJEC_BY_CLT = "SELECT DISTINCT  e.CD_COMPANIA,   e.NM_AGENTE,   e.AP_AGENTE,   e.CD_EJECUTIVO,   b.CD_EJEADM_RAMGRP,   g.NM_RAM_GRUPO,   NVL(e.AP_AGENTE || ' ', '') || e.NM_AGENTE AGENTE, g.NM_RAM_GRUPO || ' / ' || NVL(ciu.NM_CIUDAD, '') AREA FROM BRK_T_CLI_EJECUTIVOS_ADM ea   INNER JOIN BRK_T_EJECUTIVOS_ADM e     ON ea.CD_EJECUTIVO = e.CD_EJECUTIVO   INNER JOIN BRK_T_EJEADM_RAMGRP B     ON b.CD_EJECUTIVO = e.CD_EJECUTIVO   INNER JOIN BRK_T_RAM_GRUPO g     ON g.CD_RAM_GRUPO = b.CD_RAM_GRUPO   INNER JOIN BRK_T_COMPANIA com     ON b.CD_COMPANIA = com.CD_COMPANIA   INNER JOIN BRK_T_CIUDADES ciu ON ciu.CD_CIUDAD = com.CD_CIUDAD WHERE (nvl(ea.ESTADO, '0') <> 'X') AND ea.CD_EJEADM_RAMGRP = b.CD_EJEADM_RAMGRP AND   CD_CLIENTE = ?";
    private static final String Q_EJEC_MAIL = "F_BUSCA_TELEF_EJECLI(?1)";

    @SuppressWarnings("SpringJavaAutowiringInspection")
    @Autowired
    public void setDataSource(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    public List<IBrkTEjecutivosAdm> findByCltId(Integer cltId) {
        return this.jdbcTemplate.query(Q_EJEC_BY_CLT, new Object[]{cltId}, new BeanPropertyRowMapper<>(IBrkTEjecutivosAdm.class));
    }

    public String findEmail(Integer ejecutivoAdmId) {
        SimpleJdbcCall call = new SimpleJdbcCall(jdbcTemplate)
                .withFunctionName("F_BUSCA_CORREO_EJECLI");

        SqlParameterSource paramMap = new MapSqlParameterSource()
                .addValue("AL_EJECUTIVO", ejecutivoAdmId);

        return call.executeFunction(String.class, paramMap);
    }

    public String findTelefonos(Integer ejecutivoAdmId) {
        SimpleJdbcCall call = new SimpleJdbcCall(jdbcTemplate)
                .withFunctionName("F_BUSCA_TELEF_EJECLI");

        SqlParameterSource paramMap = new MapSqlParameterSource()
                .addValue("AL_EJECUTIVO", ejecutivoAdmId);

        return call.executeFunction(String.class, paramMap);
    }

    private static final String FIND_EJECUTIVO = "select distinct e.CD_Ejecutivo as cdEjecutivo, e.NM_AGENTE as nmAgente, e.AP_AGENTE as apAgente, e.CEDULA as cedula, t.MAIL as mail, e.DIRECCION as direccion, e.ESTADO as estado, e.CD_COMPANIA as cdCompania, e.TP_EJECUTIVO as tpEjecutivo, e.CARGO as cargo, t.USUARIO_WEB as usuarioweb ,ROWNUM as rnum " +
            " from BRK_T_TELEFONOS t , BRK_T_EJECUTIVOS_ADM e where e.CD_COMPANIA = t.CD_COMPANIA AND t.CD_TABLA = 11 and (e.CD_EJECUTIVO=t.CD_CODIGO) and (INSTR(t.TP_TELEFONO,'CORREO' )  > 0) and (NVL(t.ESTADO,'0') <> 'X') " +
            " and (e.NM_AGENTE LIKE ?) and (e.AP_AGENTE LIKE ?) and (e.CEDULA LIKE ?) and (t.MAIL LIKE ?) and ( ? = '1' or NVL(e.ESTADO,'0') = ? )";


    public List<Ejecutivo> getEjecutivo(String nmAgente, String apAgente, String cedula, String mail, String tipoEjecutivo, String tipoEjecutivo2) {
        return this.jdbcTemplate.query(FIND_EJECUTIVO, new Object[]{nmAgente, apAgente, cedula, mail, tipoEjecutivo, tipoEjecutivo2}, new BeanPropertyRowMapper<>(Ejecutivo.class));
    }

}
