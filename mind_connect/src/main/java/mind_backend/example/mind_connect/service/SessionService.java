package mind_backend.example.mind_connect.service;

import mind_backend.example.mind_connect.entity.Session;
import mind_backend.example.mind_connect.entity.Session.SessionStatus;
import mind_backend.example.mind_connect.repository.SessionRepository;
import mind_backend.example.mind_connect.repository.UserRepository;
import mind_backend.example.mind_connect.repository.TherapistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@Service
public class SessionService {

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TherapistRepository therapistRepository;

    public List<Session> getAllSessions() {
        return sessionRepository.findAll();
    }

    public Optional<Session> getSessionById(Long id) {
        return sessionRepository.findById(id);
    }

    public List<Session> getSessionsByUserId(Long userId) {
        return sessionRepository.findByUserId(userId);
    }

    public List<Session> getSessionsByTherapistId(Long therapistId) {
        return sessionRepository.findByTherapistId(therapistId);
    }

    public List<Session> getSessionsByStatus(SessionStatus status) {
        return sessionRepository.findByStatus(status);
    }

    public Session createSession(Session session) {
        // Validate user and therapist exist
        userRepository.findById(session.getUser().getId())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        therapistRepository.findById(session.getTherapist().getId())
            .orElseThrow(() -> new RuntimeException("Therapist not found"));

        return sessionRepository.save(session);
    }

    public Session updateSession(Long id, Session sessionDetails) {
        Session session = sessionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Session not found"));

        session.setSessionDate(sessionDetails.getSessionDate());
        session.setStatus(sessionDetails.getStatus());
        session.setNotes(sessionDetails.getNotes());
        session.setSessionType(sessionDetails.getSessionType());
        session.setDuration(sessionDetails.getDuration());

        return sessionRepository.save(session);
    }

    public Session updateSessionStatus(Long id, SessionStatus status) {
        Session session = sessionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Session not found"));
        
        session.setStatus(status);
        return sessionRepository.save(session);
    }

    public void deleteSession(Long id) {
        sessionRepository.deleteById(id);
    }

    public List<Session> getUpcomingSessions(Long userId) {
        return sessionRepository.findByUserIdAndStatus(userId, SessionStatus.SCHEDULED);
    }

    public List<Session> getSessionsInDateRange(LocalDateTime start, LocalDateTime end) {
        return sessionRepository.findBySessionDateBetween(start, end);
    }
}
