package mind_backend.example.mind_connect.security;

import mind_backend.example.mind_connect.entity.User;
import mind_backend.example.mind_connect.entity.Therapist;
import mind_backend.example.mind_connect.service.UserService;
import mind_backend.example.mind_connect.service.TherapistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.User.UserBuilder;
import org.springframework.stereotype.Service;
import org.springframework.context.annotation.Lazy;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    @Lazy
    private UserService userService;

    @Autowired
    private TherapistService therapistService;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // First try to find as regular user
        Optional<User> user = userService.getUserByEmail(email);
        if (user.isPresent()) {
            UserBuilder builder = org.springframework.security.core.userdetails.User.withUsername(email);
            builder.password(user.get().getPassword());
            builder.roles(user.get().getRole().getName());
            return builder.build();
        }

        // Then try to find as therapist
        Optional<Therapist> therapist = therapistService.getTherapistByEmail(email);
        if (therapist.isPresent()) {
            UserBuilder builder = org.springframework.security.core.userdetails.User.withUsername(email);
            builder.password(therapist.get().getPassword());
            builder.roles("THERAPIST");
            return builder.build();
        }

        throw new UsernameNotFoundException("User not found with email: " + email);
    }
}
