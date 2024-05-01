package com.tefisoft.efiweb.srv;

import com.tefisoft.efiweb.dao.DetalleDocumentoSiniestroJDBC;
import com.tefisoft.efiweb.dao.DetalleDocumentoSiniestroRepository;
import com.tefisoft.efiweb.dto.RecetaMedicinaContinuaDTO;
import com.tefisoft.efiweb.entidad.BrkTAseguradoras;
import com.tefisoft.efiweb.entidad.DetalleDocumentoSiniestro;
import com.tefisoft.efiweb.enums.TipoNotificacionEnum;
import lombok.RequiredArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.time.Clock;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import static com.tefisoft.efiweb.util.VariablesSiniestro.FECHA_EMISION;
import static com.tefisoft.efiweb.util.VariablesSiniestro.NOMBRE_DOCUMENTO;

@Service
@RequiredArgsConstructor
@CommonsLog
public class DetalleDocumentoSiniestroService {

    private final AseguradoraSrv aseguradoraSrv;
    private final DetalleDocumentoSiniestroJDBC detalleDocumentoSiniestroJDBC;
    private final SendWhatsappSrv sendWhatsappSrv;
    private final DetalleDocumentoSiniestroRepository detalleDocumentoSiniestroRepository;
    private final Clock clock;

    @Value("${app.whatsapp.receta.daysToNotify}")
    private long daysToNotifyReceta;

    @Scheduled(cron = "0 0 7 * * *")
    public void cronRecetetasToNotify() {
        log.info("Ejecutando cron caducidad de la receta");
        var aseguradoras = aseguradoraSrv.findAllHowNeedNotify(daysToNotifyReceta);
        var idsAseguradoras = aseguradoras.stream()
                .map(BrkTAseguradoras::getCdAseguradora)
                .collect(Collectors.toList());
        var recetasToNotify = detalleDocumentoSiniestroJDBC.getRecetaMedicinaContinuaList().stream()
                .filter(receta -> !ObjectUtils.isEmpty(receta.getCdReclamo()) && !ObjectUtils.isEmpty(receta.getCdCompania()))
                .filter(receta -> idsAseguradoras.contains(receta.getCdAseguradora()))
                .filter(receta -> isNeededToNotify(receta, aseguradoras))
                .collect(Collectors.toList());

        sendWhatsappSrv.sendMessagesInList(recetasToNotify,
                TipoNotificacionEnum.RECETA_CADUCAR,
                (receta, dataMsj) -> {
                    dataMsj.put(NOMBRE_DOCUMENTO, receta.getNmDocumento());
                    dataMsj.put(FECHA_EMISION, receta.getFcCaducDocumento().toString());
                });
    }

    public boolean isNeededToNotify(RecetaMedicinaContinuaDTO receta, List<BrkTAseguradoras> aseguradoras) {
        long daysLeftToExpireReceta;
        Long diasVigenciaReceta = aseguradoras.stream()
                .filter(aseguradora -> receta.getCdAseguradora().equals(aseguradora.getCdAseguradora()))
                .findFirst()
                .map(BrkTAseguradoras::getDiasVigFact)
                .orElse(null);
        try {
            daysLeftToExpireReceta = getDaysLeftToExpireReceta(diasVigenciaReceta, receta.getFcCaducDocumento());
        } catch (Exception ex) {
            log.error(ex.getMessage());
            return false;
        }
        return daysLeftToExpireReceta == daysToNotifyReceta;
    }

    public long getDaysLeftToExpireReceta(Long diasVigenciaReceta, LocalDate fechaEmision) {
        if (Arrays.asList(diasVigenciaReceta, fechaEmision).contains(null)) {
            throw new IllegalArgumentException("Los días de vigencia o la fecha de emisión no deben ser nulos");
        }
        var today = LocalDate.now(clock);
        var dateToExpire = fechaEmision.plusDays(diasVigenciaReceta);
        return ChronoUnit.DAYS.between(today, dateToExpire);
    }

    public void deleteAllByCdArchivo(Integer cdArchivo) {
        try {
            detalleDocumentoSiniestroRepository.deleteAllByCdArchivo(cdArchivo);
        } catch (Exception ex) {
            log.error("Error in deleteAllByCdArchivo :: " + ex.getMessage());
        }
    }

    public void deleteAllByCdArchivoIn(List<Integer> cdsArchivos) {
        if (ObjectUtils.isEmpty(cdsArchivos)) return;
        var cdsFiltered = cdsArchivos.stream().filter(Objects::nonNull).collect(Collectors.toList());
        detalleDocumentoSiniestroRepository.deleteAllByCdArchivoIn(cdsFiltered);
    }

    public DetalleDocumentoSiniestro save(DetalleDocumentoSiniestro item) {
        return detalleDocumentoSiniestroRepository.save(item);
    }

    public List<DetalleDocumentoSiniestro> findAllByCdReclamoAndCdArchivoIn(Integer cdReclamo, List<Integer> cdsArchivos) {
        return detalleDocumentoSiniestroRepository.findAllByCdReclamoAndCdArchivoIn(cdReclamo, cdsArchivos);
    }

}
