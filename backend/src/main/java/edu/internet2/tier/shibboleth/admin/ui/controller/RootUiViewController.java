package edu.internet2.tier.shibboleth.admin.ui.controller;

import com.google.common.io.ByteStreams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Controller;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.Charset;

@Controller
public class RootUiViewController {

    @Value("classpath:/resources/index.html")
    Resource indexHtmlResource;

    @RequestMapping("/")
    //@ResponseBody
    public void index(HttpServletRequest request, HttpServletResponse response) throws IOException {
        //TODO: Use Jsoup lib to inject context path into DOM before writing to response buffer

        final String ctxPath = request.getContextPath();

        //This does not work! In order form Angular to kick in we need to redirect to index.html
        String indexHtmlAsString = StreamUtils.copyToString(indexHtmlResource.getInputStream(), Charset.defaultCharset());
        //byte[] indexHtmlBytes = ByteStreams.toByteArray(indexHtmlResource.getInputStream());
        response.setHeader("Content-Type", "text/html");
        response.getWriter().print(indexHtmlAsString);
        //os.write(ctxPath.getBytes(), 0, ctxPath.length());
    }
}
