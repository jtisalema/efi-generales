package com.tefisoft.efiweb.ctrl;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tefisoft.efiweb.dto.ClienteGenWeb;
import com.tefisoft.efiweb.entidad.Usuario;
import com.tefisoft.efiweb.exc.CustomException;
import com.tefisoft.efiweb.srv.ClienteService;
import com.tefisoft.efiweb.srv.DetalleDocumentoSiniestroService;
import com.tefisoft.efiweb.srv.IncapSiniestroPortalService;
import com.tefisoft.efiweb.srv.UsuarioSrv;
import lombok.RequiredArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CommonsLog
@RequiredArgsConstructor
@RestController
public class IndexCtrl {

    @Value("${app.login.admin.username}")
    String adminUsername;

    @Value("${app.broker}")
    String brokerName;

    private final UsuarioSrv usuarioSrv;
    private final ClienteService clienteService;
    private final IncapSiniestroPortalService incapSiniestroPortalService;
    private final DetalleDocumentoSiniestroService detalleDocumentoSiniestroService;


    @PostMapping("/api/enki")
    public Map<String, Object> jedai(HttpServletRequest request) {
        String username = request.getHeader("X-JEDAI");
        if (username == null) {
            throw new UsernameNotFoundException("no te hagas el vivo chch");
        }
        var admin = Usuario.builder().id(66666666).clave(brokerName).usuario(adminUsername).rolWeb("ROLE_ADMIN").build();
        var usuario = usuarioSrv.findByUsuario(username);
        if (usuario != null) {
            usuario.setClave(brokerName); //para q no se vaya la clave cifrada del user
            // y aprovevho para mandar el nombre del broker
        } else if (username.equals(adminUsername)) { // pa saber q si es el admin
            usuario = admin;
        } else {
            throw new UsernameNotFoundException("no te hagas el vivo chch");
        }

        List<String> userRoles = new ArrayList<>();


        if (ObjectUtils.isEmpty(usuario.getRolWeb())) {
            userRoles.add("ROLE_USUARIO");
        }

        if (!ObjectUtils.isEmpty(usuario.getRolWeb())) {
            userRoles.add(usuario.getRolWeb());
        }

        if (usuario.getCdEjecutivoAdm() != null) {
            userRoles.add("ROLE_EJECUTIVO");
            userRoles.add("ROLE_BROKER");
        }

        if (usuario.getCdPool() != null) {
            userRoles.add("ROLE_AGENTE");
            userRoles.add("ROLE_BROKER");
        }

        if (usuario.getCdPersAdm() != null) {
            userRoles.add("ROLE_PERSONAL_ADM");
            userRoles.add("ROLE_BROKER");
            userRoles.addAll(usuarioSrv.getRoles(usuario.getTpPersAdm()));
        }

        return Map.of("user", usuario, "roles", userRoles);
    }

    @GetMapping("/login")
    public Map<String, String> login() {

        Map<String, String> res = new HashMap<>();
        res.put("msg", "Debe iniciar sesión");
        return res;
    }

    @PostMapping("/api/resetpass")
    public ResponseEntity<?> resetPasswd(@RequestBody ObjectNode user) {
        try {
            usuarioSrv.envioCredenciales(user);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (CustomException e) {
            log.error("Error al recuperar el password", e);
            throw new CustomException(e.getMessage());
        } catch (Exception e) {
            log.error("Error al recuperar el password", e);
            return new ResponseEntity<>(HttpStatus.OK);
        }
    }

    @PostMapping("/api/enki/asociados")
    public List<ClienteGenWeb> getAsociados(@RequestBody ObjectNode item) {
        return clienteService.getAsociadosGenWeb(item.get("cdAdicional").asInt(), true);
    }

    @PostMapping("/api/run-crons")
    public void runCrons(@RequestBody ObjectNode item) {
        var name = item.get("name").asText();
        switch (name) {
            case "caducidad":
                incapSiniestroPortalService.cronIncapSiniestroToNotify();
                break;
            case "receta":
                detalleDocumentoSiniestroService.cronRecetetasToNotify();
                break;
        }
    }
}
