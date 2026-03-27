package org.ayoub.docline.repository;

import org.ayoub.docline.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.ayoub.docline.model.enums.Role;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    java.util.List<User> findAllByRole(Role role);
    long countByRole(Role role);
}