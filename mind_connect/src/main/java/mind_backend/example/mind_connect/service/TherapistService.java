package mind_backend.example.mind_connect.service;

import mind_backend.example.mind_connect.entity.Therapist;
import mind_backend.example.mind_connect.repository.TherapistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TherapistService {

    @Autowired
    private TherapistRepository therapistRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Therapist> getAllTherapists() {
        return therapistRepository.findAll();
    }

    public Optional<Therapist> getTherapistById(Long id) {
        return therapistRepository.findById(id);
    }

    public Optional<Therapist> getTherapistByEmail(String email) {
        return therapistRepository.findByEmail(email);
    }

    public List<Therapist> getAvailableTherapists() {
        return therapistRepository.findByAvailableTrue();
    }

    public List<Therapist> getTherapistsBySpecialization(String specialization) {
        return therapistRepository.findBySpecialization(specialization);
    }

    public Therapist createTherapist(Therapist therapist) {
        if (therapistRepository.existsByEmail(therapist.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        if (therapist.getPassword() == null || therapist.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Password cannot be null or empty");
        }
        
        therapist.setPassword(passwordEncoder.encode(therapist.getPassword()));
        return therapistRepository.save(therapist);
    }

    public Therapist updateTherapist(Long id, Therapist therapistDetails) {
        Therapist therapist = therapistRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Therapist not found"));

        therapist.setFirstName(therapistDetails.getFirstName());
        therapist.setLastName(therapistDetails.getLastName());
        therapist.setSpecialization(therapistDetails.getSpecialization());
        therapist.setQualification(therapistDetails.getQualification());
        therapist.setExperience(therapistDetails.getExperience());
        therapist.setPhone(therapistDetails.getPhone());
        therapist.setBio(therapistDetails.getBio());
        therapist.setAvailable(therapistDetails.getAvailable());

        if (therapistDetails.getPassword() != null && !therapistDetails.getPassword().isEmpty()) {
            therapist.setPassword(passwordEncoder.encode(therapistDetails.getPassword()));
        }

        return therapistRepository.save(therapist);
    }

    public void deleteTherapist(Long id) {
        therapistRepository.deleteById(id);
    }

    public Therapist updateAvailability(Long id, Boolean available) {
        Therapist therapist = therapistRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Therapist not found"));
        
        therapist.setAvailable(available);
        return therapistRepository.save(therapist);
    }
}
