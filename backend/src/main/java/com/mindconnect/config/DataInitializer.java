package com.mindconnect.config;

import com.mindconnect.entity.Role;
import com.mindconnect.entity.Motivation;
import com.mindconnect.entity.Therapist;
import com.mindconnect.repository.RoleRepository;
import com.mindconnect.repository.MotivationRepository;
import com.mindconnect.repository.TherapistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private MotivationRepository motivationRepository;

    @Autowired
    private TherapistRepository therapistRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialize roles
        if (roleRepository.count() == 0) {
            roleRepository.save(new Role("ADMIN", "Administrator"));
            roleRepository.save(new Role("USER", "Regular User"));
            roleRepository.save(new Role("THERAPIST", "Therapist"));
        }

        // Initialize sample therapists
        if (therapistRepository.count() == 0) {
            Therapist therapist1 = new Therapist();
            therapist1.setFirstName("Dr. Sarah");
            therapist1.setLastName("Johnson");
            therapist1.setEmail("sarah.johnson@mindconnect.com");
            therapist1.setPassword(passwordEncoder.encode("password123"));
            therapist1.setSpecialization("Anxiety and Depression");
            therapist1.setQualification("PhD in Clinical Psychology");
            therapist1.setExperience(8);
            therapist1.setPhone("+1-555-0101");
            therapist1.setBio("Specialized in cognitive behavioral therapy with 8 years of experience helping individuals overcome anxiety and depression.");
            therapist1.setRating(4.8);
            therapistRepository.save(therapist1);

            Therapist therapist2 = new Therapist();
            therapist2.setFirstName("Dr. Michael");
            therapist2.setLastName("Chen");
            therapist2.setEmail("michael.chen@mindconnect.com");
            therapist2.setPassword(passwordEncoder.encode("password123"));
            therapist2.setSpecialization("Trauma and PTSD");
            therapist2.setQualification("MD, Psychiatrist");
            therapist2.setExperience(12);
            therapist2.setPhone("+1-555-0102");
            therapist2.setBio("Board-certified psychiatrist specializing in trauma recovery and PTSD treatment using evidence-based approaches.");
            therapist2.setRating(4.9);
            therapistRepository.save(therapist2);

            Therapist therapist3 = new Therapist();
            therapist3.setFirstName("Dr. Emily");
            therapist3.setLastName("Rodriguez");
            therapist3.setEmail("emily.rodriguez@mindconnect.com");
            therapist3.setPassword(passwordEncoder.encode("password123"));
            therapist3.setSpecialization("Family and Relationship Therapy");
            therapist3.setQualification("LMFT, Licensed Marriage and Family Therapist");
            therapist3.setExperience(6);
            therapist3.setPhone("+1-555-0103");
            therapist3.setBio("Licensed therapist focusing on family dynamics, couples counseling, and relationship building.");
            therapist3.setRating(4.7);
            therapistRepository.save(therapist3);
        }

        // Initialize motivational content
        if (motivationRepository.count() == 0) {
            Motivation quote1 = new Motivation();
            quote1.setTitle("Daily Inspiration");
            quote1.setContent("The greatest revolution of our generation is the discovery that human beings, by changing the inner attitudes of their minds, can change the outer aspects of their lives.");
            quote1.setType(Motivation.ContentType.QUOTE);
            quote1.setAuthor("William James");
            quote1.setCategory("Inspiration");
            motivationRepository.save(quote1);

            Motivation tip1 = new Motivation();
            tip1.setTitle("Breathing Exercise");
            tip1.setContent("Try the 4-7-8 breathing technique: Inhale for 4 counts, hold for 7 counts, exhale for 8 counts. Repeat 3-4 times to reduce anxiety and promote relaxation.");
            tip1.setType(Motivation.ContentType.TIP);
            tip1.setAuthor("MindConnect Team");
            tip1.setCategory("Anxiety Relief");
            motivationRepository.save(tip1);

            Motivation article1 = new Motivation();
            article1.setTitle("Understanding Mental Health");
            article1.setContent("Mental health includes our emotional, psychological, and social well-being. It affects how we think, feel, and act. It also helps determine how we handle stress, relate to others, and make choices.");
            article1.setType(Motivation.ContentType.ARTICLE);
            article1.setAuthor("Mental Health Foundation");
            article1.setCategory("Education");
            motivationRepository.save(article1);

            Motivation exercise1 = new Motivation();
            exercise1.setTitle("Gratitude Practice");
            exercise1.setContent("Each morning, write down three things you're grateful for. This simple practice can significantly improve your mood and overall mental well-being.");
            exercise1.setType(Motivation.ContentType.EXERCISE);
            exercise1.setAuthor("MindConnect Team");
            exercise1.setCategory("Gratitude");
            motivationRepository.save(exercise1);

            Motivation quote2 = new Motivation();
            quote2.setTitle("Strength in Vulnerability");
            quote2.setContent("Vulnerability is not weakness; it's our greatest measure of courage.");
            quote2.setType(Motivation.ContentType.QUOTE);
            quote2.setAuthor("Brené Brown");
            quote2.setCategory("Courage");
            motivationRepository.save(quote2);
        }
    }
}
