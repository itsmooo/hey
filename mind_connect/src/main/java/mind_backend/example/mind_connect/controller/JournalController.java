package mind_backend.example.mind_connect.controller;

import mind_backend.example.mind_connect.entity.Journal;
import mind_backend.example.mind_connect.entity.Journal.MoodLevel;
import mind_backend.example.mind_connect.service.JournalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/journals")
@CrossOrigin(origins = "http://localhost:5173")
public class JournalController {

    @Autowired
    private JournalService journalService;

    @GetMapping
    public List<Journal> getAllJournals() {
        return journalService.getAllJournals();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Journal> getJournalById(@PathVariable Long id) {
        return journalService.getJournalById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public List<Journal> getJournalsByUserId(@PathVariable Long userId) {
        return journalService.getJournalsByUserId(userId);
    }

    @GetMapping("/mood/{mood}")
    public List<Journal> getJournalsByMood(@PathVariable MoodLevel mood) {
        return journalService.getJournalsByMood(mood);
    }

    @PostMapping
    public ResponseEntity<?> createJournal(@RequestBody Journal journal) {
        try {
            Journal createdJournal = journalService.createJournal(journal);
            return ResponseEntity.ok(createdJournal);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateJournal(@PathVariable Long id, @RequestBody Journal journal) {
        try {
            Journal updatedJournal = journalService.updateJournal(id, journal);
            return ResponseEntity.ok(updatedJournal);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJournal(@PathVariable Long id) {
        try {
            journalService.deleteJournal(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
