package com.mindconnect.repository;

import com.mindconnect.entity.Therapist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface TherapistRepository extends JpaRepository<Therapist, Long> {
    Optional<Therapist> findByEmail(String email);
    List<Therapist> findByAvailable(Boolean available);
    List<Therapist> findBySpecialization(String specialization);
    boolean existsByEmail(String email);
}
