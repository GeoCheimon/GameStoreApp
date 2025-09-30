package com.gamestore.backend.security;

import com.gamestore.backend.model.User;
import com.gamestore.backend.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

// @Service: Δηλώνουμε ότι αυτή η κλάση είναι ένα service του Spring.
// implements UserDetailsService: Αυτό είναι το κλειδί. Υλοποιούμε το interface του Spring Security.
@Service
@SuppressWarnings("unused")
public class UserDetailsServiceImpl implements UserDetailsService {

    // Δηλώνουμε την εξάρτηση ως 'final' για να εξασφαλίσουμε ότι θα αρχικοποιηθεί μία φορά.
    private final UserRepository userRepository;

    // --- ΔΙΟΡΘΩΣΗ: Χρησιμοποιούμε Constructor Injection ---
    // Αντί για @Autowired, το Spring θα καλέσει αυτόν τον constructor και θα δώσει
    // αυτόματα το UserRepository bean που χρειάζεται.
    // Αυτό λύνει την προειδοποίηση "is never assigned".
    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Αυτή είναι η μοναδική μέθοδος που πρέπει να υλοποιήσουμε.
    // Το Spring Security θα την καλέσει αυτόματα κατά το login, δίνοντάς μας το email που έγραψε ο χρήστης.
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1. Χρησιμοποιούμε το UserRepository για να βρούμε τον χρήστη στη βάση με βάση το email.
        User user = userRepository.findByEmail(email)
                // Αν ο χρήστης δεν βρεθεί, "πετάμε" ένα σφάλμα που καταλαβαίνει το Spring Security.
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // 2. Αν ο χρήστης βρεθεί, τον "μετατρέπουμε" σε ένα αντικείμενο UserDetails που καταλαβαίνει το Spring Security.

        // Δημιουργούμε μια λίστα με τα δικαιώματα (ρόλους) του χρήστη.
        // Παίρνουμε το String του ρόλου από το User entity (π.χ., "ROLE_USER")
        // και το μετατρέπουμε σε αντικείμενο GrantedAuthority που καταλαβαίνει το Spring.
        // Το GrantedAuthority ειναι ενσωματωμένο interface του Spring Security που αναπαριστά
        // ένα δικαίωμα (authority) ή ρόλο (role) που έχει ένας χρήστης.
        // Το SimpleGrantedAuthority είναι μια απλή υλοποίηση του GrantedAuthority που
        // χρησιμοποιείται συχνά για να αναπαραστήσει ρόλους ή δικαιώματα.
        // Εδώ χρησιμοποιούμε Collections.singletonList για να δημιουργήσουμε
        // μια λίστα με ένα μόνο ρόλο, που παίρνουμε από το user.getRole().
        List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority(user.getRole()));
        //    Αυτή η γραμμή παίρνει το απλό κείμενο "ROLE_USER" από το αντικείμενο `user` και το μετατρέπει σε
        //    `SimpleGrantedAuthority`, που είναι η επίσημη κλάση που χρησιμοποιεί το Spring για να αναπαραστήσει έναν ρόλο.

        // Του δίνουμε το email, τον (κρυπτογραφημένο) κωδικό, και την παραπάνω λίστα με τους ρόλους.
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                authorities // <- Η κρίσιμη αλλαγή είναι εδώ!
        );
    }
}
