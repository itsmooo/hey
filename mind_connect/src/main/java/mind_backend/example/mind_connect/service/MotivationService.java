package mind_backend.example.mind_connect.service;

import mind_backend.example.mind_connect.entity.Motivation;
import mind_backend.example.mind_connect.entity.Motivation.ContentType;
import mind_backend.example.mind_connect.repository.MotivationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MotivationService {

    @Autowired
    private MotivationRepository motivationRepository;

    public List<Motivation> getAllMotivations() {
        return motivationRepository.findAll();
    }

    public List<Motivation> getActiveMotivations() {
        return motivationRepository.findAll();
    }

    public Optional<Motivation> getMotivationById(Long id) {
        return motivationRepository.findById(id);
    }

    public List<Motivation> getMotivationsByType(ContentType type) {
        return motivationRepository.findByType(type);
    }

    public List<Motivation> getMotivationsByCategory(String category) {
        return motivationRepository.findByCategory(category);
    }

    public Motivation createMotivation(Motivation motivation) {
        return motivationRepository.save(motivation);
    }

    public Motivation updateMotivation(Long id, Motivation motivationDetails) {
        Motivation motivation = motivationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Motivation content not found"));

        motivation.setTitle(motivationDetails.getTitle());
        motivation.setContent(motivationDetails.getContent());
        motivation.setType(motivationDetails.getType());
        motivation.setAuthor(motivationDetails.getAuthor());
        motivation.setCategory(motivationDetails.getCategory());
        motivation.setActive(motivationDetails.getActive());

        return motivationRepository.save(motivation);
    }

    public void deleteMotivation(Long id) {
        motivationRepository.deleteById(id);
    }

    public Motivation toggleActive(Long id) {
        Motivation motivation = motivationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Motivation content not found"));
        
        motivation.setActive(!motivation.getActive());
        return motivationRepository.save(motivation);
    }
}
