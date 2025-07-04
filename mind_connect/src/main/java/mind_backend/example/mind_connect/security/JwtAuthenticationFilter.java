package mind_backend.example.mind_connect.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        boolean shouldSkip = path.startsWith("/api/sessions/");
        logger.info("JWT Filter - Path: {}, Should Skip: {}", path, shouldSkip);
        return shouldSkip;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String email = null;

        logger.info("Processing request: {} {}", request.getMethod(), request.getRequestURI());

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            logger.info("Token found: {}", token.substring(0, Math.min(20, token.length())) + "...");
            try {
                email = jwtUtil.getEmailFromToken(token);
                logger.info("Email extracted from token: {}", email);
            } catch (Exception e) {
                logger.error("Cannot get email from token", e);
            }
        } else {
            logger.info("No Authorization header found for: {}", request.getRequestURI());
        }

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                logger.info("User details loaded for: {}", email);
                
                if (jwtUtil.validateToken(token) && !jwtUtil.isTokenExpired(token)) {
                    UsernamePasswordAuthenticationToken authToken = 
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    logger.info("Authentication set for user: {}", email);
                } else {
                    logger.warn("Token validation failed for user: {}", email);
                }
            } catch (Exception e) {
                logger.error("Error loading user details for: {}", email, e);
            }
        } else if (email == null) {
            logger.info("No email extracted from token for: {}", request.getRequestURI());
        } else {
            logger.info("Authentication already exists for user: {}", email);
        }

        filterChain.doFilter(request, response);
    }
}
