package edu.internet2.tier.shibboleth.admin.ui.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class RootUiViewController {

    @RequestMapping("/")
    public String index() {
        return "index";
    }
}
