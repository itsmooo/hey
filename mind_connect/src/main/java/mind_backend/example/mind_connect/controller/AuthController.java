package mind_backend.example.mind_connect.controller;

import mind_backend.example.mind_connect.entity.User;
import mind_backend.example.mind_connect.entity.Therapist;
import mind_backend.example.mind_connect.service.UserService;
import mind_backend.example.mind_connect.service.TherapistService;
import mind_backend.example.mind_connect.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

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

            logger.info("Login attempt - Email: {}, UserType: {}", email, userType);

            if (email == null || password == null) {
                return ResponseEntity.badRequest().body("Email and password are required");
            }

            // Check if user exists first
            if ("therapist".equals(userType)) {
                if (!therapistService.getTherapistByEmail(email).isPresent()) {
                    return ResponseEntity.badRequest().body("Therapist not found");
                }
            } else {
                if (!userService.getUserByEmail(email).isPresent()) {
                    return ResponseEntity.badRequest().body("User not found");
                }
            }

            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
            );

            logger.info("Authentication successful for user: {}", email);

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
            logger.error("Login failed for email: {}, error: {}", loginRequest.get("email"), e.getMessage(), e);
            return ResponseEntity.badRequest().body("Invalid credentials: " + e.getMessage());
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
