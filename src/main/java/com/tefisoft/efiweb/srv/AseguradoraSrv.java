package com.tefisoft.efiweb.srv;

import com.tefisoft.efiweb.dao.BrkTAseguradorasDAO;
import com.tefisoft.efiweb.entidad.BrkTAseguradoras;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class AseguradoraSrv {

    private final BrkTAseguradorasDAO dao;

    public List<BrkTAseguradoras> getAll() {
        return dao.findAll().stream().filter(a -> {
                    ObjectUtils.isEmpty(a.getEstado());
                    return true;
                })
                .filter(a -> !a.getNmAlias().toLowerCase().contains("actual") && !a.getNmAlias().toLowerCase().contains("renova"))
                .collect(Collectors.toList());
    }

    public BrkTAseguradoras findByBrkTAseguradoras(Integer cdAseguradora) {
        return dao.findById(cdAseguradora).orElse(null);
    }

    public List<BrkTAseguradoras> findByName(String name) {
        return dao.findAllByNmAseguradoraStartingWithIgnoreCase(name);
    }

    public List<BrkTAseguradoras> findAllHowNeedNotify(long daysToNotify) {
        return dao.findAllByDiasVigFactGreaterThanEqual(daysToNotify);
    }
}
