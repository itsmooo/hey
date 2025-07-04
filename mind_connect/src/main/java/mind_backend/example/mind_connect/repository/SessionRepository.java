package mind_backend.example.mind_connect.repository;

import mind_backend.example.mind_connect.entity.Session;
import mind_backend.example.mind_connect.entity.Session.SessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.time.LocalDateTime;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    List<Session> findByUserId(Long userId);
    List<Session> findByTherapistId(Long therapistId);
    List<Session> findByStatus(SessionStatus status);
    List<Session> findBySessionDateBetween(LocalDateTime start, LocalDateTime end);
    List<Session> findByUserIdAndStatus(Long userId, SessionStatus status);
    List<Session> findByTherapistIdAndStatus(Long therapistId, SessionStatus status);
}
