package com.tefisoft.efiweb.ctrl;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tefisoft.efiweb.srv.AdministracionHomeSrv;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/config-home")
public class AdministracionHomeCtrl {
    private final AdministracionHomeSrv administracionHomeSrv;

    @PostMapping
    public ObjectNode save(@RequestBody ObjectNode item){
        return administracionHomeSrv.doSave(item);
    }

    @GetMapping
    public ObjectNode findOne(){
        return administracionHomeSrv.find();
    }
}
