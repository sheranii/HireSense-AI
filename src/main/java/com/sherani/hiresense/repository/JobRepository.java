package com.sherani.hiresense.repository;

import com.sherani.hiresense.entity.Job;
import com.sherani.hiresense.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByActiveTrue();

    List<Job> findByPostedBy(User user);

    List<Job> findByTitleContainingIgnoreCaseAndActiveTrue(String keyword);
}
