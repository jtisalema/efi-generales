package com.tefisoft.efiweb.ctrl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tefisoft.efiweb.dto.ResultIncapSiniestroPortal;
import com.tefisoft.efiweb.entidad.BrkTClientes;
import com.tefisoft.efiweb.entidad.BrkTIncapacidad;
import com.tefisoft.efiweb.enums.TextResponseEnum;
import com.tefisoft.efiweb.srv.ClienteService;
import com.tefisoft.efiweb.srv.IncapSiniestroPortalService;
import com.tefisoft.efiweb.srv.IncapacidadSrv;
import com.tefisoft.efiweb.srv.SendWhatsappSrv;
import com.tefisoft.efiweb.srv.SiniestroService;
import com.tefisoft.efiweb.util.HelperUtil;

import io.swagger.models.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@CommonsLog
@RequestMapping("/api/siniestros-portal")
public class SiniestrosPortalCtrl {

    private final ClienteService clienteService;
    private final IncapacidadSrv incapacidadSrv;
    private final SendWhatsappSrv sendWhatsappSrv;
    private final IncapSiniestroPortalService incapSiniestroPortalService;
    private final SiniestroService siniestroService;

    @PostMapping("/contratantes")
    public List<BrkTClientes> searchContratantes(@RequestBody ObjectNode query) {
        return clienteService.searchClientes(query);
    }

    @PostMapping("/incapacidades")
    public List<BrkTIncapacidad> searchIncapacidades(@RequestBody ObjectNode body) {
        return incapacidadSrv.searchIncapacidadByName(body);
    }

    @GetMapping("/incapacidad")
    public BrkTIncapacidad getIncapacidad(@RequestParam Integer id) {
        return incapacidadSrv.getIncapacidad(id);
    }

    @GetMapping("/data")
    public Map<String, Object> getData(@RequestParam Integer cdAseguradora, @RequestParam Integer cdRamoCotizacion,
            @RequestParam Integer cdUbicacion, @RequestParam Integer cdRamo) {
        return incapacidadSrv.getData(cdAseguradora, cdRamoCotizacion, cdUbicacion, cdRamo);
    }

    @PostMapping("/send-message")
    public void sendMessage(@RequestBody ObjectNode item) {
        Integer cdCompania = item.path("cdCompania").asInt();
        Integer cdReclamo = item.path("cdReclamo").asInt();
        Integer cdIncSiniestro = item.path("cdIncSiniestro").asInt();
        String tipo = item.path("tipo").asText();
        sendWhatsappSrv.handleMessage(cdCompania, cdReclamo, cdIncSiniestro, tipo);
    }

    @PostMapping("/search")
    public Page<ResultIncapSiniestroPortal> searchSiniestrosPortal(@RequestBody ObjectNode filters) {
        return siniestroService.searchSiniestroModuleGen(filters);
    }

    @PostMapping("/send-notification-liquidado")
    public ResponseEntity<String> sendNotificationLiquidado(@RequestBody ObjectNode siniestroLiquidadoInfo) {
        try {
            String result = incapSiniestroPortalService.notifyIncapSiniestroLiquidado(siniestroLiquidadoInfo);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(HelperUtil.constructTextResponse(TextResponseEnum.ERROR, e.getMessage()));
        }
    }

    @GetMapping("/get-cie10")
    public ResponseEntity<Object> obtenerInformacionCIE10(@RequestParam String textoBuscar) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://cpockets.com/ajaxsearch10?term=" + textoBuscar;
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                Object responseBody = objectMapper.readValue(response.getBody(), Object.class);
                return new ResponseEntity<>(responseBody, HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>("Error al procesar la respuesta JSON", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            return new ResponseEntity<>("Error al obtener información de CIE10", response.getStatusCode());
        }
    }

}
