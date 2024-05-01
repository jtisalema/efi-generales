package com.tefisoft.efiweb.srv;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tefisoft.efiweb.dao.IncapSiniestroPortalJDBC;
import com.tefisoft.efiweb.dto.IncapSiniestroPortalDTO;
import com.tefisoft.efiweb.enums.TextResponseEnum;
import com.tefisoft.efiweb.enums.TipoNotificacionEnum;
import com.tefisoft.efiweb.exc.CustomException;
import com.tefisoft.efiweb.interfaces.AditionalMessageProperties;
import com.tefisoft.efiweb.util.HelperUtil;

import lombok.extern.apachecommons.CommonsLog;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.util.ReflectionUtils;
import org.springframework.util.ObjectUtils;

import java.time.Clock;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.HashMap;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class IncapSiniestroPortalServiceTest {

    @InjectMocks
    private IncapSiniestroPortalService incapSiniestroPortalService;
    @Mock
    private IncapSiniestroPortalJDBC incapSiniestroPortalJDBC;
    @Mock
    private SendWhatsappSrv sendWhatsappSrv;
    @Mock
    private Clock clock;
    private final List<Long> daysToNofity = Arrays.asList(30L, 60L, 90L);
    private static final ZonedDateTime NOW = ZonedDateTime.of(2023, 5, 12,
            12, 30, 30, 0,
            ZoneId.of("GMT"));

    @BeforeEach
    void setUp() throws NoSuchFieldException {
        ReflectionUtils.setField(incapSiniestroPortalService.getClass().getDeclaredField("daysToNotify"),
                incapSiniestroPortalService,
                daysToNofity);
        when(clock.getZone()).thenReturn(NOW.getZone());
        when(clock.instant()).thenReturn(NOW.toInstant());
    }

    @Test
    @SuppressWarnings("unchecked")
    void cronIncapSiniestroToNotify() {
        // given
        var is1 = new IncapSiniestroPortalDTO(1, 1, 1, NOW.minusDays(30).toLocalDate(), false, 0L);
        var is2 = new IncapSiniestroPortalDTO(2, 2, 1, NOW.minusDays(60).toLocalDate(), false, 0L);
        var is3 = new IncapSiniestroPortalDTO(2, 2, 1, NOW.minusDays(90).toLocalDate(), false, 0L);
        var listIncaps = Arrays.asList(is1, is2, is3);
        var listIncapsSinUltimoDia = Arrays.asList(is1, is2);
        var listIncapsUltimoDia = List.of(is3);
        given(incapSiniestroPortalJDBC.getIncapSiniestroFcPrimeraFacturaGreaterEquals(any()))
                .willReturn(listIncaps);
        // when
        incapSiniestroPortalService.cronIncapSiniestroToNotify();
        // then
        verify(sendWhatsappSrv, times(1))
                .sendMessagesInList(
                        eq(listIncapsSinUltimoDia),
                        eq(TipoNotificacionEnum.SINIESTRO_CADUCIDAD),
                        any(AditionalMessageProperties.class));
        verify(sendWhatsappSrv, times(1))
                .sendMessagesInList(
                        eq(listIncapsUltimoDia),
                        eq(TipoNotificacionEnum.SINIESTRO_CADUCIDAD),
                        any(AditionalMessageProperties.class));
    }

    @CsvSource(value = { "30", "60", "90" }, delimiterString = ",")
    @ParameterizedTest
    void setDaysFromFcPrimeraFactura(Long minusDays) {
        // given
        var is1 = new IncapSiniestroPortalDTO(1, 1, 1, NOW.minusDays(minusDays).toLocalDate(), false, 0L);
        // when
        incapSiniestroPortalService.setDaysFromFcPrimeraFactura(is1);
        // then
        Assertions.assertThat(is1.getDaysFromFcPrimeraFactura()).isEqualTo(minusDays);
    }

    @Test
    void setDaysFromFcPrimeraFacturaHasToDoNothingWhenisNull() {
        // given
        IncapSiniestroPortalDTO is1 = null;
        // when
        incapSiniestroPortalService.setDaysFromFcPrimeraFactura(is1);
        // then
        Assertions.assertThat(is1).isNull();
    }

    @Test
    void setDaysFromFcPrimeraFacturaHasToDoNothingWhenFcPrimeraFacturaisNull() {
        // given
        var is1 = new IncapSiniestroPortalDTO(1, 1, 1, null, false, 0L);
        var is2 = new IncapSiniestroPortalDTO(1, 1, 1, null, false, 0L);
        // when
        incapSiniestroPortalService.setDaysFromFcPrimeraFactura(is1);
        // then
        Assertions.assertThat(is1).isEqualTo(is2);
        Assertions.assertThat(is1.getFcPrimeraFactura()).isNull();
    }

    @Test
    void bbb() {
        String archivoAdjuntoPath = "/docs/8128-COOP.-DE-A-C-POLITECNICA-LTDA/SINIESTROS/5150.0-2024/";
        var storageService = new LocalStorageSrv(".mp4,.jpg,.jpeg,.png,.pdf", "");
        var locationFolder = archivoAdjuntoPath.split("/SINIESTROS/");
        var docs = (List<LocalStorageSrv.FileDoc>) storageService
                .loadFiles(locationFolder[0], "siniestro", locationFolder[1], "", "liquidacion").get("docs");

    }

}