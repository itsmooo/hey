package mind_backend.example.mind_connect.service;

import mind_backend.example.mind_connect.entity.Journal;
import mind_backend.example.mind_connect.entity.Journal.MoodLevel;
import mind_backend.example.mind_connect.repository.JournalRepository;
import mind_backend.example.mind_connect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@Service
public class JournalService {

    @Autowired
    private JournalRepository journalRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Journal> getAllJournals() {
        return journalRepository.findAll();
    }

    public Optional<Journal> getJournalById(Long id) {
        return journalRepository.findById(id);
    }

    public List<Journal> getJournalsByUserId(Long userId) {
        return journalRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Journal> getJournalsByMood(MoodLevel mood) {
        return journalRepository.findByMood(mood);
    }

    public Journal createJournal(Journal journal) {
        // Validate user exists
        userRepository.findById(journal.getUser().getId())
            .orElseThrow(() -> new RuntimeException("User not found"));

        return journalRepository.save(journal);
    }

    public Journal updateJournal(Long id, Journal journalDetails) {
        Journal journal = journalRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Journal not found"));

        journal.setTitle(journalDetails.getTitle());
        journal.setContent(journalDetails.getContent());
        journal.setMood(journalDetails.getMood());
        journal.setTags(journalDetails.getTags());

        return journalRepository.save(journal);
    }

    public void deleteJournal(Long id) {
        journalRepository.deleteById(id);
    }

    public List<Journal> getJournalsInDateRange(Long userId, LocalDateTime start, LocalDateTime end) {
        return journalRepository.findByUserIdAndCreatedAtBetween(userId, start, end);
    }
}
