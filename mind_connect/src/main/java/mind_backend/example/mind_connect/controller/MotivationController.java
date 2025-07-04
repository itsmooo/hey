package mind_backend.example.mind_connect.controller;

import mind_backend.example.mind_connect.entity.Motivation;
import mind_backend.example.mind_connect.entity.Motivation.ContentType;
import mind_backend.example.mind_connect.service.MotivationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/motivations")
@CrossOrigin(origins = "http://localhost:5173")
public class MotivationController {

    @Autowired
    private MotivationService motivationService;

    @GetMapping
    public List<Motivation> getAllMotivations() {
        return motivationService.getAllMotivations();
    }

    @GetMapping("/active")
    public List<Motivation> getActiveMotivations() {
        return motivationService.getActiveMotivations();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Motivation> getMotivationById(@PathVariable Long id) {
        return motivationService.getMotivationById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/type/{type}")
    public List<Motivation> getMotivationsByType(@PathVariable ContentType type) {
        return motivationService.getMotivationsByType(type);
    }

    @GetMapping("/category/{category}")
    public List<Motivation> getMotivationsByCategory(@PathVariable String category) {
        return motivationService.getMotivationsByCategory(category);
    }

    @PostMapping
    public ResponseEntity<?> createMotivation(@RequestBody Motivation motivation) {
        try {
            Motivation createdMotivation = motivationService.createMotivation(motivation);
            return ResponseEntity.ok(createdMotivation);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMotivation(@PathVariable Long id, @RequestBody Motivation motivation) {
        try {
            Motivation updatedMotivation = motivationService.updateMotivation(id, motivation);
            return ResponseEntity.ok(updatedMotivation);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<?> toggleActive(@PathVariable Long id) {
        try {
            Motivation updatedMotivation = motivationService.toggleActive(id);
            return ResponseEntity.ok(updatedMotivation);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMotivation(@PathVariable Long id) {
        try {
            motivationService.deleteMotivation(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
