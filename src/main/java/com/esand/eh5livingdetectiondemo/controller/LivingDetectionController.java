package com.esand.eh5livingdetectiondemo.controller;

import cn.hutool.http.HttpRequest;
import cn.hutool.http.HttpResponse;
import com.fasterxml.jackson.databind.util.JSONPObject;
import org.apache.commons.lang3.RandomStringUtils;
import org.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import sun.rmi.runtime.Log;

import java.util.HashMap;
import java.util.Map;

@Controller
public class LivingDetectionController {
    //替换成你的APPCODE
    String APPCODE="替换成你的APPCODE";
    @PostMapping("/init")
    @ResponseBody
    public String init(String initMsg){
        HttpResponse httpResponse = HttpRequest.post("https://eface.market.alicloudapi.com/init")
                .form("initMsg", initMsg)
                .header("Authorization", "APPCODE "+APPCODE)
                .header("X-Ca-Nonce", RandomStringUtils.random(8,"1234567890987654321234567890"))
                .header("Content-Type", "application/x-www-form-urlencoded;chart-set:utf-8")
                .execute();
        return  httpResponse.body();
    }

    @PostMapping("/verify")
    @ResponseBody
    public String verify(String token,String verifyMsg){
        Map<String,Object> map = new HashMap<>();
        map.put("token",token);
        map.put("verifyMsg",verifyMsg);
        HttpResponse httpResponse = HttpRequest.post("https://eface.market.alicloudapi.com/verify")
                .form(map)
                .header("Authorization", "APPCODE "+APPCODE)
                .header("X-Ca-Nonce", RandomStringUtils.random(8,"1234567890987654321234567890"))
                .header("Content-Type", "application/x-www-form-urlencoded;chart-set:utf-8")
                .execute();
        return  httpResponse.body();
    }

    @GetMapping("/")
    public String getZimPage() {
        return "index";
    }
}
