package com.tefisoft.efiweb.dao;

import com.tefisoft.efiweb.dto.RamosRamgrp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RamosRamgrpDao extends JpaRepository<RamosRamgrp, Integer> {

}
