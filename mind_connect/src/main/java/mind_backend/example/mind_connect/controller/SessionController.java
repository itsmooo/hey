package mind_backend.example.mind_connect.controller;

import mind_backend.example.mind_connect.entity.Session;
import mind_backend.example.mind_connect.entity.Session.SessionStatus;
import mind_backend.example.mind_connect.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "http://localhost:5173")
public class SessionController {

    @Autowired
    private SessionService sessionService;

    @GetMapping
    public List<Session> getAllSessions() {
        return sessionService.getAllSessions();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Session> getSessionById(@PathVariable Long id) {
        return sessionService.getSessionById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public List<Session> getSessionsByUserId(@PathVariable Long userId) {
        return sessionService.getSessionsByUserId(userId);
    }

    @GetMapping("/therapist/{therapistId}")
    public List<Session> getSessionsByTherapistId(@PathVariable Long therapistId) {
        return sessionService.getSessionsByTherapistId(therapistId);
    }

    @GetMapping("/user/{userId}/upcoming")
    public List<Session> getUpcomingSessions(@PathVariable Long userId) {
        return sessionService.getUpcomingSessions(userId);
    }

    @PostMapping
    public ResponseEntity<?> createSession(@RequestBody Session session) {
        try {
            Session createdSession = sessionService.createSession(session);
            return ResponseEntity.ok(createdSession);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSession(@PathVariable Long id, @RequestBody Session session) {
        try {
            Session updatedSession = sessionService.updateSession(id, session);
            return ResponseEntity.ok(updatedSession);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateSessionStatus(@PathVariable Long id, @RequestBody SessionStatus status) {
        try {
            Session updatedSession = sessionService.updateSessionStatus(id, status);
            return ResponseEntity.ok(updatedSession);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSession(@PathVariable Long id) {
        try {
            sessionService.deleteSession(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
