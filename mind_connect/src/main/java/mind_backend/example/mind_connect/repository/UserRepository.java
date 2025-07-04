package mind_backend.example.mind_connect.repository;

import mind_backend.example.mind_connect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByRole_Name(String roleName);
    boolean existsByEmail(String email);
}
