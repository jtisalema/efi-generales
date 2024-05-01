package com.tefisoft.efiweb.srv;

import com.tefisoft.efiweb.dao.DetalleDocumentoSiniestroJDBC;
import com.tefisoft.efiweb.dto.RecetaMedicinaContinuaDTO;
import com.tefisoft.efiweb.entidad.BrkTAseguradoras;
import com.tefisoft.efiweb.enums.TipoNotificacionEnum;
import com.tefisoft.efiweb.interfaces.AditionalMessageProperties;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.BDDMockito;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.util.Pair;
import org.springframework.data.util.ReflectionUtils;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;

@ExtendWith(MockitoExtension.class)
class DetalleDocumentoSiniestroServiceTest {

    @InjectMocks
    private DetalleDocumentoSiniestroService detalleDocumentoSiniestroService;
    @Mock
    private AseguradoraSrv aseguradoraSrv;
    @Mock
    private DetalleDocumentoSiniestroJDBC detalleDocumentoSiniestroJDBC;
    @Mock
    private SendWhatsappSrv sendWhatsappSrv;
    @Mock
    private SiniestroPortalSrv siniestroPortalSrv;

    private final Long daysToNotify = 5L;
    private RecetaMedicinaContinuaDTO recetaDTO;

    @BeforeEach
    void setUp() throws NoSuchFieldException {
        ReflectionUtils.setField(detalleDocumentoSiniestroService.getClass().getDeclaredField("daysToNotifyReceta")
                , detalleDocumentoSiniestroService
                , daysToNotify);

        recetaDTO = new RecetaMedicinaContinuaDTO("Documento de prueba", 65,
                LocalDate.now().minusDays(15), null, null, 666);
    }


    @Test
    @DisplayName("El cálculo de los días restantes para que la receta expire es menor a los días para notificar")
    void daysLeftToExpireIsLessThanDaysToExpire() {
        // given
        var diasVigenciaReceta = 18L;
        // when
        var daysLeftToExpire = detalleDocumentoSiniestroService.getDaysLeftToExpireReceta(diasVigenciaReceta, recetaDTO.getFcCaducDocumento());
        //then
        Assertions.assertThat(daysLeftToExpire).isLessThan(daysToNotify);
    }

    @Test
    @DisplayName("El cálculo de los días restantes para que la receta expire es mayor a los días para notificar")
    void daysLeftToExpireIsGreaterThanDaysToExpire() {
        // given
        var diasVigenciaReceta = 30L;
        // when
        var daysLeftToExpire = detalleDocumentoSiniestroService.getDaysLeftToExpireReceta(diasVigenciaReceta, recetaDTO.getFcCaducDocumento());
        //then
        Assertions.assertThat(daysLeftToExpire).isGreaterThan(daysToNotify);
    }

    @Test
    @DisplayName("El cálculo de los días restantes para que la receta expire es igual a los días para notificar")
    void daysLeftToExpireIsEqualsThanDaysToExpire() {
        // given
        var diasVigenciaReceta = 20L;
        // when
        var daysLeftToExpire = detalleDocumentoSiniestroService.getDaysLeftToExpireReceta(diasVigenciaReceta, recetaDTO.getFcCaducDocumento());
        //then
        Assertions.assertThat(daysLeftToExpire).isEqualTo(daysToNotify);
    }


    @Test
    void isCdReclamoAndCdCompaniaFiltered() {
        //given
        var r1 = new RecetaMedicinaContinuaDTO("doc 1", 65, LocalDate.now(), 1, 1, 666);
        var r2 = new RecetaMedicinaContinuaDTO("doc 2", 65, LocalDate.now(), 2, 2, 666);
        var r3 = new RecetaMedicinaContinuaDTO("doc 3", 65, LocalDate.now(), 3, 1, 666);
        var r4 = new RecetaMedicinaContinuaDTO("doc 4", 65, LocalDate.now(), 1, 1, 666);
        var listaRecetas = List.of(r1, r2, r3, r4);
        //when
        Set<Pair<Integer, Integer>> recetasGrouped = listaRecetas.stream()
                .map(receta -> Pair.of(receta.getCdReclamo(), receta.getCdCompania()))
                .collect(Collectors.toSet());
        //then
        Assertions.assertThat(recetasGrouped).hasSizeLessThan(listaRecetas.size());
    }

    @Test
    @SuppressWarnings("unchecked")
    void testForCronRecetasPorCaducar() {
        //given
        var a1 = BrkTAseguradoras.builder().cdAseguradora(65).diasVigFact(17L).build();
        var a2 = BrkTAseguradoras.builder().cdAseguradora(67).diasVigFact(33L).build();
        var a3 = BrkTAseguradoras.builder().cdAseguradora(66).diasVigFact(18L).build();
        var listaAseguradoras = Arrays.asList(a1, a2, a3);

        var m1 = new RecetaMedicinaContinuaDTO("COPIA DE LA CEDULA DE IDENTIDAD A COLOR, PARIDA DE NACIMIENTO ORIGINAL, O PASAPORTE ORIGINAL DE LOS BENEFICIARIOS LEGALES",
                65, LocalDate.of(2023, 5, 3), 984069, 2, 666);
        var listaRecetasFiltered = List.of(m1);
        Map<String, String> dataMesaje = new HashMap<>();
        dataMesaje.put("item", " 0");
        dataMesaje.put("estado", "POR_REGULARIZAR");
        dataMesaje.put("ramo", "GASTOS MÉDICOS MAYORES-MEDICA/GM21C22753");
        dataMesaje.put("incapacidad", "GRIPE");
        dataMesaje.put("mail", "cristian.paguay.17@gmail.com");
        dataMesaje.put("phone", "593969189156");
        dataMesaje.put("numSiniestro", "663189");
        dataMesaje.put("paciente", "MANANGON PADILLA CYNTHIA ELIZABETH");

        BDDMockito.given(aseguradoraSrv.findAllHowNeedNotify(daysToNotify))
                .willReturn(listaAseguradoras);
        BDDMockito.given(detalleDocumentoSiniestroJDBC.getRecetaMedicinaContinuaList())
                .willReturn(Collections.singletonList(m1));
        BDDMockito.given(siniestroPortalSrv.findDataByMensaje(2, 984069, 666))
                .willReturn(dataMesaje);
        //when
        detalleDocumentoSiniestroService.cronRecetetasToNotify();
        //then
        Mockito.verify(sendWhatsappSrv).sendMessagesInList(
                eq(listaRecetasFiltered),
                eq(TipoNotificacionEnum.RECETA_CADUCAR),
                any(AditionalMessageProperties.class)
        );
    }

}
