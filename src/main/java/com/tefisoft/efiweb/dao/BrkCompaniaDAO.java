package com.tefisoft.efiweb.dao;

import com.tefisoft.efiweb.entidad.Compania;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.util.List;

/**
 * @author dacopanCM on 08/08/17.
 */
@Repository
public class BrkCompaniaDAO {
    private JdbcTemplate jdbcTemplate;

    private static final String Q_COMPANIA = "SELECT c.CD_COMPANIA,c.NOMBRE,c.REF_MATRIZ,c.RUC,c.ALIAS_COMPANIA FROM BRK_T_COMPANIA c";

    @SuppressWarnings("SpringJavaAutowiringInspection")
    @Autowired
    public void setDataSource(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    public List<Compania> findAll() {
        return this.jdbcTemplate.query(Q_COMPANIA, new BeanPropertyRowMapper<>(Compania.class));
    }
}
