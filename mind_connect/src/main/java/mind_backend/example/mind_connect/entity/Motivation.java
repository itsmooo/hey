package mind_backend.example.mind_connect.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "motivations")
public class Motivation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    private ContentType type;

    private String author;
    private String category;
    private Boolean active;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public enum ContentType {
        QUOTE, ARTICLE, TIP, EXERCISE, VIDEO, AUDIO
    }

    // Constructors
    public Motivation() {
        this.createdAt = LocalDateTime.now();
        this.active = true;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public ContentType getType() { return type; }
    public void setType(ContentType type) { this.type = type; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
