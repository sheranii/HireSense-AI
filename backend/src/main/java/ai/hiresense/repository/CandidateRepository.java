package ai.hiresense.repository;

import ai.hiresense.entity.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    Optional<Candidate> findByEmail(String email);
    List<Candidate> findByCurrentStage(String currentStage);
    List<Candidate> findByAiRecommendation(String aiRecommendation);
    List<Candidate> findAllByOrderByAiMatchScoreDesc();
}

