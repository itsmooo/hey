package mind_backend.example.mind_connect.repository;

import mind_backend.example.mind_connect.entity.Motivation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MotivationRepository extends JpaRepository<Motivation, Long> {
    List<Motivation> findByType(Motivation.ContentType type);
    List<Motivation> findByCategory(String category);
}
