package com.tefisoft.efiweb.srv;

import com.tefisoft.efiweb.dao.BrkCompaniaDAO;
import com.tefisoft.efiweb.dao.BrkTAseguradorasDAO;
import com.tefisoft.efiweb.dao.BrkTRamosDAO;
import com.tefisoft.efiweb.entidad.BrkTAseguradoras;
import com.tefisoft.efiweb.entidad.BrkTRamos;
import com.tefisoft.efiweb.entidad.Compania;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author dacopanCM on 14/08/17.
 */
@Service
public class CompaniaService {

    private final BrkCompaniaDAO dao;
    private final BrkTRamosDAO ramosDAO;
    private final BrkTAseguradorasDAO aseguradorasDAO;

    public CompaniaService(BrkCompaniaDAO dao, BrkTRamosDAO ramosDAO, BrkTAseguradorasDAO aseguradorasDAO) {
        this.dao = dao;
        this.ramosDAO = ramosDAO;
        this.aseguradorasDAO = aseguradorasDAO;
    }

    public List<Compania> getAllCompanias() {
        List<Compania> l = dao.findAll();
        l.sort(Comparator.comparing(Compania::getCdCompania, Comparator.nullsFirst(Comparator.naturalOrder())));
        return l;
    }

    public List<BrkTRamos> getAllRamos() {
        List<BrkTRamos> l = ramosDAO.findAll();
        l.sort(Comparator.comparing(BrkTRamos::getNmAlias, Comparator.nullsFirst(Comparator.naturalOrder())));
        return l;
    }

    public List<BrkTAseguradoras> getAllAseguradoras() {

        return aseguradorasDAO.findAll().stream().filter(a -> ObjectUtils.isEmpty(a.getEstado()) || !a.getEstado().equals("X"))
                .filter(a -> !a.getNmAlias().toLowerCase().contains("actual") && !a.getNmAlias().toLowerCase().contains("renova"))
                .sorted(Comparator.comparing(BrkTAseguradoras::getNmAlias, Comparator.nullsFirst(Comparator.naturalOrder()))).collect(Collectors.toList());
    }
}
