package com.mindconnect.controller;

import com.mindconnect.entity.User;
import com.mindconnect.entity.Therapist;
import com.mindconnect.service.UserService;
import com.mindconnect.service.TherapistService;
import com.mindconnect.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private TherapistService therapistService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        try {
            String email = loginRequest.get("email");
            String password = loginRequest.get("password");
            String userType = loginRequest.get("userType"); // "user" or "therapist"

            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
            );

            String token = jwtUtil.generateToken(email);
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("userType", userType);

            if ("therapist".equals(userType)) {
                Therapist therapist = therapistService.getTherapistByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Therapist not found"));
                response.put("user", therapist);
            } else {
                User user = userService.getUserByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
                response.put("user", user);
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid credentials");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            return ResponseEntity.ok(createdUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/register-therapist")
    public ResponseEntity<?> registerTherapist(@RequestBody Therapist therapist) {
        try {
            Therapist createdTherapist = therapistService.createTherapist(therapist);
            return ResponseEntity.ok(createdTherapist);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
