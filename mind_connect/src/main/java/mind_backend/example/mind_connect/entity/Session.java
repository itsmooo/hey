package mind_backend.example.mind_connect.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

@Entity
@Table(name = "sessions")
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    @NotNull
    @JsonIgnoreProperties({"sessions", "hibernateLazyInitializer", "handler"})
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "therapist_id")
    @NotNull
    @JsonIgnoreProperties({"sessions", "hibernateLazyInitializer", "handler"})
    private Therapist therapist;

    @NotNull
    @Column(name = "session_date")
    private LocalDateTime sessionDate;

    @Enumerated(EnumType.STRING)
    private SessionStatus status;

    private String notes;
    private String sessionType; // online, in-person
    private Integer duration; // in minutes

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public enum SessionStatus {
        SCHEDULED, COMPLETED, CANCELLED, NO_SHOW
    }

    // Constructors
    public Session() {
        this.createdAt = LocalDateTime.now();
        this.status = SessionStatus.SCHEDULED;
        this.duration = 60;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Therapist getTherapist() { return therapist; }
    public void setTherapist(Therapist therapist) { this.therapist = therapist; }

    public LocalDateTime getSessionDate() { return sessionDate; }
    public void setSessionDate(LocalDateTime sessionDate) { this.sessionDate = sessionDate; }

    public SessionStatus getStatus() { return status; }
    public void setStatus(SessionStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getSessionType() { return sessionType; }
    public void setSessionType(String sessionType) { this.sessionType = sessionType; }

    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
