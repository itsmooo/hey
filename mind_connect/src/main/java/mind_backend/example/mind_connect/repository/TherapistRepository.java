package mind_backend.example.mind_connect.repository;

import mind_backend.example.mind_connect.entity.Therapist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TherapistRepository extends JpaRepository<Therapist, Long> {
    Optional<Therapist> findByEmail(String email);
    List<Therapist> findByAvailableTrue();
    List<Therapist> findBySpecialization(String specialization);
    boolean existsByEmail(String email);
}
