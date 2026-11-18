package ai.hiresense.repository;

import ai.hiresense.entity.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    List<Assessment> findByCandidateId(Long candidateId);
    List<Assessment> findByStatus(String status);
    List<Assessment> findAllByOrderByCreatedAtDesc();
}

