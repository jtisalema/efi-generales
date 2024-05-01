package com.tefisoft.efiweb.dao;

import com.tefisoft.efiweb.dto.RamGrupo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RamGrupoDao extends JpaRepository<RamGrupo, Integer> {
}
