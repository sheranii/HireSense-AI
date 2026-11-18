package ai.hiresense.repository;

import ai.hiresense.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByJobId(Long jobId);
    long countByJobId(Long jobId);
    List<Application> findByCandidateId(Long candidateId);
    List<Application> findByCandidate_EmailIgnoreCaseOrderByAppliedAtDesc(String email);
    boolean existsByJobIdAndCandidateId(Long jobId, Long candidateId);
    List<Application> findByStage(String stage);
    List<Application> findAllByOrderByAppliedAtDesc();
}

