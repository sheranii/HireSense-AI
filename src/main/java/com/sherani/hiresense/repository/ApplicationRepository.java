package com.sherani.hiresense.repository;

import com.sherani.hiresense.entity.Application;
import com.sherani.hiresense.entity.Job;
import com.sherani.hiresense.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByApplicant(User applicant);
    List<Application> findByJob(Job job);
    boolean existsByApplicantAndJob(User applicant, Job job);
}
