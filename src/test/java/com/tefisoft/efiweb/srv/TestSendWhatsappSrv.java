package com.tefisoft.efiweb.srv;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TestSendWhatsappSrv {

    @InjectMocks
    SendWhatsappSrv sendWhatsappSrv;


    @ParameterizedTest
    @CsvSource(value = {
            "59365 489,065489", "+59398746  231,098746231", "69875++13578,6987513578", "0593471485,0593471485"
    })
    void itHastoConvertPreffix593To0(String phone, String phoneExpected) {
        // when
        var result = sendWhatsappSrv.handlePhonePreffix0(phone);
        // then
        Assertions.assertThat(result)
                .isEqualTo(phoneExpected);
    }


}