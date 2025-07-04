package mind_backend.example.mind_connect.repository;

import mind_backend.example.mind_connect.entity.Journal;
import mind_backend.example.mind_connect.entity.Journal.MoodLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.time.LocalDateTime;

@Repository
public interface JournalRepository extends JpaRepository<Journal, Long> {
    List<Journal> findByUserId(Long userId);
    List<Journal> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Journal> findByMood(MoodLevel mood);
    List<Journal> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    List<Journal> findByUserIdAndCreatedAtBetween(Long userId, LocalDateTime start, LocalDateTime end);
}
