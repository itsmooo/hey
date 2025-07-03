package com.mindconnect.repository;

import com.mindconnect.entity.Motivation;
import com.mindconnect.entity.Motivation.ContentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MotivationRepository extends JpaRepository<Motivation, Long> {
    List<Motivation> findByActive(Boolean active);
    List<Motivation> findByType(ContentType type);
    List<Motivation> findByCategory(String category);
    List<Motivation> findByActiveOrderByCreatedAtDesc(Boolean active);
}
