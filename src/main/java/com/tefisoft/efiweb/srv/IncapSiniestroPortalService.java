package com.tefisoft.efiweb.srv;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tefisoft.efiweb.dao.IncapSiniestroPortalJDBC;
import com.tefisoft.efiweb.dto.IncapSiniestroPortalDTO;
import com.tefisoft.efiweb.enums.TextResponseEnum;
import com.tefisoft.efiweb.enums.TipoNotificacionEnum;
import com.tefisoft.efiweb.exc.CustomException;
import com.tefisoft.efiweb.util.HelperUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import javax.annotation.PostConstruct;
import javax.transaction.Transactional;
import java.time.Clock;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.tefisoft.efiweb.util.VariablesSiniestro.DAYS_TO_EXPIRE;

@Service
@RequiredArgsConstructor
@CommonsLog
public class IncapSiniestroPortalService {

    private final IncapSiniestroPortalJDBC incapSiniestroPortalJDBC;
    private final SendWhatsappSrv sendWhatsappSrv;
    private final Clock clock;
    private LocalStorageSrv storageService;

    @Value("${app.whatsapp.siniestro.daysToNotify}")
    private List<Long> daysToNotify;
    @Value("${app.data}")
    private String defaultServerFilesPath;

    private static final String CD_COMPANIA = "cdCompania";
    private static final String CD_RECLAMO = "cdReclamo";
    private static final String CD_SINIESTRO = "cdSiniestro";
    private static final String ARCHIVO_ADJUNTO = "archivoAdjunto";


    @PostConstruct
    void init() {
        this.storageService = new LocalStorageSrv(".mp4,.jpg,.jpeg,.png,.pdf", defaultServerFilesPath);
    }

    @Scheduled(cron = "0 0 8 * * *")
    public void cronIncapSiniestroToNotify() {
        log.info("Ejecutando cron caducidad del siniestro");
        Long lastDayToNotify = this.getLastDayToNotify();
        var lastDateToNotify = LocalDate.now(clock).minusDays(lastDayToNotify);
        var daysToNotifyWithoutLastDay = daysToNotify.stream()
                .filter(day -> !day.equals(lastDayToNotify))
                .collect(Collectors.toList());

        var incapSiniestroPortalList = incapSiniestroPortalJDBC.getIncapSiniestroFcPrimeraFacturaGreaterEquals(lastDateToNotify);
        incapSiniestroPortalList.forEach(this::setDaysFromFcPrimeraFactura);

        // notificacion por caducar
        var incapsSiniestrosToExpire = incapSiniestroPortalList.stream()
                .filter(incapSiniestro -> !incapSiniestro.isCaducado())
                .filter(incapSiniestro -> daysToNotifyWithoutLastDay.contains(incapSiniestro.getDaysFromFcPrimeraFactura()))
                .collect(Collectors.toList());
        sendWhatsappSrv.sendMessagesInList(incapsSiniestrosToExpire,
                TipoNotificacionEnum.SINIESTRO_CADUCIDAD,
                (incapSiniestroPortalDTO, dataMsg) -> dataMsg.put(DAYS_TO_EXPIRE, "han transcurrido " +
                        incapSiniestroPortalDTO.getDaysFromFcPrimeraFactura() + " días.")
        );

        // notificacion caducado
        var incapsSiniestrosExpired = incapSiniestroPortalList.stream()
                .filter(incapSiniestro -> !incapSiniestro.isCaducado())
                .filter(incapSiniestro -> incapSiniestro.getDaysFromFcPrimeraFactura() >= lastDayToNotify)
                .collect(Collectors.toList());

        var cdsIncapSiniestros = incapsSiniestrosExpired.stream()
                .map(IncapSiniestroPortalDTO::getCdIncSiniestro)
                .collect(Collectors.toList());
        this.updateCaducadoInCdsIncapSiniestros(cdsIncapSiniestros);

        sendWhatsappSrv.sendMessagesInList(incapsSiniestrosExpired,
                TipoNotificacionEnum.SINIESTRO_CADUCIDAD,
                (incapSiniestroPortalDTO, dataMsg) -> dataMsg.put(DAYS_TO_EXPIRE, "ha caducado.")
        );
    }

    public void setDaysFromFcPrimeraFactura(IncapSiniestroPortalDTO incapSiniestroPortalDTO) {
        var today = LocalDate.now(clock);
        if (incapSiniestroPortalDTO == null || incapSiniestroPortalDTO.getFcPrimeraFactura() == null) return;
        long daysFromFcPrimeraFactura = ChronoUnit.DAYS.between(incapSiniestroPortalDTO.getFcPrimeraFactura(), today);
        incapSiniestroPortalDTO.setDaysFromFcPrimeraFactura(daysFromFcPrimeraFactura);
    }

    public Long getLastDayToNotify() {
        return daysToNotify.stream().max(Long::compareTo).orElse(0L);
    }

    public void updateCaducadoInCdsIncapSiniestros(List<Integer> cdsIncapSiniestros) {
        incapSiniestroPortalJDBC.updateCaducadoByCdsIncapSiniestros(cdsIncapSiniestros);
    }

    @Transactional
    @SuppressWarnings("unchecked")
    public String notifyIncapSiniestroLiquidado(ObjectNode siniestroLiquidadoInfo) {
        try {
            if (ObjectUtils.isEmpty(siniestroLiquidadoInfo)) {
                throw new CustomException("La solicitud no puede ser vacía");
            }
            HelperUtil.validateRequiredDataNodeField(siniestroLiquidadoInfo, ARCHIVO_ADJUNTO);
            String archivoAdjuntoPath = siniestroLiquidadoInfo.path(ARCHIVO_ADJUNTO).asText();
            log.info("try send liquidado " + archivoAdjuntoPath + "\n" + siniestroLiquidadoInfo);
            var locationFolder = archivoAdjuntoPath.split("/SINIESTROS/");
            var docs = (List<LocalStorageSrv.FileDoc>) storageService.loadFiles(locationFolder[0], "siniestro", locationFolder[1], "", "liquidacion").get("docs");
            if (docs.isEmpty()) {
                throw new CustomException("No se encontró archivos a enviar en liquidación.");
            }

            HelperUtil.validateRequiredDataNodeField(siniestroLiquidadoInfo, CD_COMPANIA, true);
            HelperUtil.validateRequiredDataNodeField(siniestroLiquidadoInfo, CD_RECLAMO, true);
            HelperUtil.validateRequiredDataNodeField(siniestroLiquidadoInfo, CD_SINIESTRO, true);
            HelperUtil.validateRequiredDataNodeField(siniestroLiquidadoInfo, "cdRamoCotizacion", true);

            int cdCompania = siniestroLiquidadoInfo.path(CD_COMPANIA).asInt();
            int cdReclamo = siniestroLiquidadoInfo.path(CD_RECLAMO).asInt();
            int cdIncSiniestro = siniestroLiquidadoInfo.path(CD_SINIESTRO).asInt();

            var incapSiniestroPortalList = incapSiniestroPortalJDBC.updateLiquidado(cdIncSiniestro);

            if (!incapSiniestroPortalList) {
                throw new CustomException("No se pudo actualizar el estado del siniestro :: " + cdIncSiniestro);
            }

            HelperUtil.validateRequiredDataNodeField(siniestroLiquidadoInfo, "contratante");
            HelperUtil.validateRequiredDataNodeField(siniestroLiquidadoInfo, "titular");
            HelperUtil.validateRequiredDataNodeField(siniestroLiquidadoInfo, "numeroLiquidacion");
            HelperUtil.validateRequiredNestedDataFields(siniestroLiquidadoInfo, "valorAcreditado", Arrays.asList("valorPresentado", "gastosNoCubiertos", "deducible", "valorElegible", "copagoAsumido", "valorAcreditado"));

            var siniestroFilteredData = sendWhatsappSrv.processData(cdReclamo, cdCompania, cdIncSiniestro);
            var combinedDataForEmail = combineData(siniestroFilteredData, siniestroLiquidadoInfo);
            var attachmentFiles = new HashMap<String, byte[]>();

            double fileSize = storageService.getMbFileSize(docs);

            if (fileSize >= 25) {
                throw new CustomException("El tamaño total de los archivos excede el límite de 25 MB");
            }

            for (LocalStorageSrv.FileDoc fileDoc : docs) {
                var filePath = fileDoc.getPath();
                var fileResource = storageService.loadAsResourceByPath(filePath);
                byte[] bytes = fileResource.getInputStream().readAllBytes();
                attachmentFiles.put(fileResource.getFilename(), bytes);
            }

            sendWhatsappSrv.sendNotificationToEmail(combinedDataForEmail, TipoNotificacionEnum.SINIESTRO_LIQUIDADO, attachmentFiles);
            return HelperUtil.constructTextResponse(TextResponseEnum.OK, "El siniestro ha sido liquidado");
        } catch (Exception e) {
            throw new CustomException(e.getMessage());
        }
    }

    private Map<String, Object> combineData(Map.Entry<String, Map<String, String>> processDataResult, ObjectNode toValidateData) {
        Map<String, Object> combinedData = new HashMap<>();
        if (processDataResult != null && processDataResult.getValue() != null) {
            combinedData.putAll(processDataResult.getValue());
        }
        if (toValidateData == null) {
            return combinedData;
        }
        toValidateData.fields().forEachRemaining(entry -> {
            String key = entry.getKey();
            JsonNode valueNode = entry.getValue();
            Object convertValue = 0;
            if (valueNode.isDouble()) convertValue = valueNode.asDouble();
            if (valueNode.isInt()) convertValue = valueNode.asInt();
            if (valueNode.isTextual()) convertValue = valueNode.asText();
            if (valueNode.isObject() || valueNode.isArray()) convertValue = valueNode;
            combinedData.put(key, convertValue);
        });
        return combinedData;
    }
}
