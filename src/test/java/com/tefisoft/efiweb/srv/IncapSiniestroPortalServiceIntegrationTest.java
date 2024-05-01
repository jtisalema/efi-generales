package com.tefisoft.efiweb.srv;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class IncapSiniestroPortalServiceIntegrationTest {

    @Autowired
    private IncapSiniestroPortalService incapSiniestroPortalService;

    @Test
    void cronIncapSiniestroToNotify() {
        Assertions.assertDoesNotThrow(() -> incapSiniestroPortalService.cronIncapSiniestroToNotify());
    }

}
