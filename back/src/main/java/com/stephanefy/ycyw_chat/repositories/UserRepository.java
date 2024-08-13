package com.stephanefy.ycyw_chat.repositories;

import com.stephanefy.ycyw_chat.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, String> {
    User findByUsername(String username);

    @Query("FROM User u WHERE u.role = SUPPORT")
    User findSupportDetails();
}
