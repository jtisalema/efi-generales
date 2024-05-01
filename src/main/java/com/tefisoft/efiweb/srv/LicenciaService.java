package com.tefisoft.efiweb.srv;

import com.tefisoft.efiweb.dao.BrkCompaniaDAO;
import com.tefisoft.efiweb.dao.LicenciaDao;
import com.tefisoft.efiweb.entidad.Compania;
import com.tefisoft.efiweb.entidad.LicenciaWeb;
import com.tefisoft.efiweb.exc.CustomException;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Optional;


/**
 * @author dacopanCM on 24/03/18.
 */
@Service
public class LicenciaService {

    private final Log log = LogFactory.getLog(getClass());

    private final LicenciaDao licenciaDao;
    private final BrkCompaniaDAO companiaDAO;

    public LicenciaService(LicenciaDao licenciaDao, BrkCompaniaDAO companiaDAO) {
        this.licenciaDao = licenciaDao;
        this.companiaDAO = companiaDAO;
    }

    public boolean isLicenseValid() {
        try {
            LicenciaWeb lic = licenciaDao.findById(8888).orElse(null);
            if (lic == null) return false;

            Optional<Compania> compania = companiaDAO.findAll().stream().filter(c -> c.getRefMatriz() == null).findFirst();
            if (compania.isPresent()) {
                String token = compania.get().getRuc() + "_" + new SimpleDateFormat("YYYY-MM-dd").format(lic.getFcCaduca()) + "blk" + 0;
                if (new BCryptPasswordEncoder().matches(token, lic.getLic())) {
                    if (lic.getFcCaduca().compareTo(new java.util.Date()) >= 0) return true;
                    else throw new CustomException("Licencia Caducada");
                } else throw new CustomException("Licencia Alterada");
            } else throw new CustomException("No existe compania matriz");
        } catch (Exception ex) {
            log.error("isLicenseValid: " + ex.getMessage(), ex);
            return false;
        }
    }

    public void saveLicense(Date fcCaduca, int premium) {
        LicenciaWeb lic = licenciaDao.findById(8888).orElse(null);
        if (lic == null) lic = new LicenciaWeb(8888, null, null, null, null);

        Optional<Compania> compania = companiaDAO.findAll().stream().filter(c -> c.getRefMatriz() == null).findFirst();
        if (compania.isPresent()) {
            lic.setFcCaduca(fcCaduca);
            //lic.setPremium(premium);
            String token = compania.get().getRuc() + "_" + new SimpleDateFormat("YYYY-MM-dd").format(lic.getFcCaduca()) + "blk" + 0;
            lic.setLic(new BCryptPasswordEncoder().encode(token));
            lic.setFcModifica(new java.util.Date());
            lic.setRuc(compania.get().getRuc());
            licenciaDao.save(lic);
        } else throw new CustomException("No existe compania matriz");

    }

    public LicenciaWeb currentLic() {
        return licenciaDao.findById(8888).orElse(null);
    }

    public String rucMatriz() {
        Optional<Compania> compania = companiaDAO.findAll().stream().filter(c -> c.getRefMatriz() == null).findFirst();
        return compania.map(Compania::getRuc).orElse(null);
    }
}
