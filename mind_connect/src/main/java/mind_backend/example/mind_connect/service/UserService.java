package mind_backend.example.mind_connect.service;

import mind_backend.example.mind_connect.entity.User;
import mind_backend.example.mind_connect.entity.Role;
import mind_backend.example.mind_connect.repository.UserRepository;
import mind_backend.example.mind_connect.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    @Lazy
    private PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        // Check if password is null or empty
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Password cannot be null or empty");
        }
        
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // Set role based on userType if provided, otherwise default to USER
        if (user.getRole() == null) {
            String roleName = "USER"; // Default role
            if (user.getUserType() != null && !user.getUserType().isEmpty()) {
                roleName = user.getUserType().toUpperCase();
            }
            
            Role userRole = roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.findByName("USER")
                    .orElseThrow(() -> new RuntimeException("Default role not found")));
            user.setRole(userRole);
        }
        
        return userRepository.save(user);
    }

    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setPhone(userDetails.getPhone());
        user.setAge(userDetails.getAge());
        user.setEmergencyContact(userDetails.getEmergencyContact());

        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }

        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public List<User> getUsersByRole(String roleName) {
        return userRepository.findByRole_Name(roleName);
    }
}
