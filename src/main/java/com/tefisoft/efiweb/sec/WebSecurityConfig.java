package com.tefisoft.efiweb.sec;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {


    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .authorizeRequests()
                .anyRequest().permitAll()

                .and().cors().and()

                .logout()
                .invalidateHttpSession(true)
                .permitAll()

                .and()

                .sessionManagement()//https://github.com/spring-projects/spring-boot/issues/1537
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .maximumSessions(4)
                .maxSessionsPreventsLogin(false)
                .expiredUrl("/expired")
                .and()
                .and()

                .exceptionHandling()
                .accessDeniedPage("/error")

                .and().csrf()
                .ignoringAntMatchers( "/**")
                .and();
    }




    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
