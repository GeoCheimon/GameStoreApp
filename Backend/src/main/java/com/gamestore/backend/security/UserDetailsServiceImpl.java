package com.gamestore.backend.security;

import com.gamestore.backend.model.User;
import com.gamestore.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

// @Service: Δηλώνουμε ότι αυτή η κλάση είναι ένα service του Spring.
// implements UserDetailsService: Αυτό είναι το κλειδί. Υλοποιούμε το interface του Spring Security.
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    // Αυτή είναι η μοναδική μέθοδος που πρέπει να υλοποιήσουμε.
    // Το Spring Security θα την καλέσει αυτόματα κατά το login, δίνοντάς μας το email που έγραψε ο χρήστης.
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1. Χρησιμοποιούμε το UserRepository για να βρούμε τον χρήστη στη βάση με βάση το email.
        User user = userRepository.findByEmail(email)
                // Αν ο χρήστης δεν βρεθεί, "πετάμε" ένα σφάλμα που καταλαβαίνει το Spring Security.
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // 2. Αν ο χρήστης βρεθεί, τον "μετατρέπουμε" σε ένα αντικείμενο UserDetails που καταλαβαίνει το Spring Security.
        // Του δίνουμε το email, τον (κρυπτογραφημένο) κωδικό, και μια (προς το παρόν κενή) λίστα με τους ρόλους.
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                new ArrayList<>() // Αργότερα εδώ θα βάλουμε τους ρόλους (π.χ., "ROLE_USER")
        );
    }
}
