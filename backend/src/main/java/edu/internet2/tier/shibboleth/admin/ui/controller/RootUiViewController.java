package edu.internet2.tier.shibboleth.admin.ui.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.URISyntaxException;
import java.util.stream.Collectors;

@Controller
public class RootUiViewController {

    @RequestMapping("/")
    public String index() {
        return "redirect:/index.html";
    }

    @RequestMapping(value = {"**/index.html", "/dashboard/**", "/metadata/**"})
    public void indexHtml(HttpServletRequest request, HttpServletResponse response) throws IOException, URISyntaxException {
        //This method is necessary in order for Angular framework to honor dynamic ServletContext
        //under which shib ui application is deployed, both during initial index.html load and subsequest page refreshes
        String content = new BufferedReader(new InputStreamReader(this.getClass()
                .getResourceAsStream("/resources/index.html")))
                .lines()
                .collect(Collectors.joining("\n"));

        content = content.replaceFirst("<base[^>]+>", "<base href=\"" + request.getContextPath() + "/\">");
        response.setContentType("text/html");
        try (OutputStream writer = response.getOutputStream()) {
            writer.write(content.getBytes());
        }
    }
}