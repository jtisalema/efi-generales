package com.tefisoft.efiweb.ctrl;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tefisoft.efiweb.srv.GestorUsuarioSrv;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("api")
public class GestorUsuarioCtrl {

    private final GestorUsuarioSrv gestorUsuarioSrv;

    @PostMapping("/usuarios-generales-gestor")
    public ObjectNode search(@RequestBody ObjectNode item) {
        return gestorUsuarioSrv.search(item);
    }

    @PostMapping("/usuarios-generales-crear")
    public String crearUsuariosWeb(@RequestBody List<ObjectNode> items) {
        return gestorUsuarioSrv.crearUsuariosWeb(items);
    }

    @PostMapping("/usuarios-generales-desactivar")
    public String desactivarUsuariosWeb(@RequestBody List<ObjectNode> items) {
        return gestorUsuarioSrv.inactivarUsuariosWeb(items);
    }

}
