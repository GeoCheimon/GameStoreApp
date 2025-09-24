package com.gamestore.backend.service;

import com.gamestore.backend.dto.LoginRequestDTO;
import com.gamestore.backend.dto.RegisterRequestDTO;
import com.gamestore.backend.model.User;
import com.gamestore.backend.repository.UserRepository;
import com.gamestore.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    // Οι Εξαρτήσεις (Τα "Υλικά" της Συνταγής)
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Ζητάμε από το Spring το εργαλείο κρυπτογράφησης που φτιάξαμε

    // Ζητάμε από το Spring το AuthenticationManager που φτιάξαμε στο SecurityConfig.
    // Αυτό είναι το επίσημο εργαλείο του Spring για την επαλήθευση στοιχείων.
    @Autowired
    private AuthenticationManager authenticationManager;

    // Ζητάμε το εργαλείο "JwtUtil", για τη δημιουργία των tokens.
    @Autowired
    private JwtUtil jwtUtil;

    public User registerUser(RegisterRequestDTO registerRequest) {
        // Έλεγχος αν το email υπάρχει ήδη για να αποφύγουμε διπλούς λογαριασμούς
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            // Αν υπάρχει, "πετάμε" ένα σφάλμα που θα πιάσει ο Controller
            throw new RuntimeException("Email is already in use!");
        }

        // Δημιουργούμε ένα νέο User Entity-model από τα δεδομένα που έδωσε ο χρήστης
        User newUser = new User();
        newUser.setUsername(registerRequest.getUsername());
        newUser.setEmail(registerRequest.getEmail());

        // Κρυπτογραφούμε τον κωδικό που έδωσε ο χρήστης πριν τον αποθηκεύσουμε
        newUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        // Ορίζουμε τον προεπιλεγμένο ρόλο για κάθε νέο χρήστη
        newUser.setRole("ROLE_USER");

        // Αποθηκεύουμε τον νέο χρήστη στη βάση δεδομένων και επιστρέφουμε το αποθηκευμένο αντικείμενο
        return userRepository.save(newUser);
    }

    // Η "Συνταγή" για το Login
    /**
     * Επαληθεύει τα στοιχεία ενός χρήστη και, αν είναι σωστά, δημιουργεί και επιστρέφει ένα JWT token.
     * @param loginRequest Το DTO που περιέχει το email και τον (ακατέργαστο) κωδικό του χρήστη.
     * @return Ένα string που είναι το υπογεγραμμένο JWT token.
     */
    public String loginUser(LoginRequestDTO loginRequest) {
        // Βήμα 1: Η Επαλήθευση
        // Δίνουμε στο AuthenticationManager (που ειναι στο SecurityConfig) το email και τον κωδικό που έδωσε ο χρήστης.
        // Αυτόματα, το Spring Security θα:
        //   1. Βρει τον χρήστη στη βάση με βάση το email.
        //   2. Πάρει τον κρυπτογραφημένο κωδικό από τη βάση.
        //   3. Κρυπτογραφήσει τον κωδικό που έδωσε ο χρήστης τώρα.
        //   4. Συγκρίνει τα δύο hashes. Αν δεν ταιριάζουν, θα "πετάξει" ένα σφάλμα (Exception).
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        // Βήμα 2: Επίσημη Αναγνώριση
        // Αν ο παραπάνω έλεγχος πετύχει (δεν πετάξει σφάλμα), σημαίνει ότι ο χρήστης είναι ο σωστός.
        // Αποθηκεύουμε την "ταυτότητά" του στο SecurityContextHolder.
        SecurityContextHolder.getContext().setAuthentication(authentication);
        //Τι κάνει αυτό; Κρατάει την "ταυτότητα" του χρήστη για όλη τη διάρκεια του αιτήματος (request).
        // Έτσι, αν μέσα σε αυτό το αίτημα χρειαστεί να ξέρουμε ποιος είναι ο χρήστης,
        // μπορούμε να το βρούμε εύκολα από το SecurityContextHolder.

        // "Ολη τη διάρκεια του αιτήματος (request)" σημαίνει όσο ειναι συνδεδεμένος ο χρηστης;
        // Οχι. Σημαίνει μόνο για το συγκεκριμένο αίτημα. Αν ο χρήστης κάνει ένα νέο αίτημα,
        // θα χρειαστεί να ξανακάνει login ή να στείλει το JWT

        // Βήμα 3: Δημιουργία του "Διαβατηρίου"

        // Βρίσκουμε τον χρήστη από τη βάση για να πάρουμε το username ---
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found after successful authentication"));

        // Καλούμε το JwtUtil για να δημιουργήσει ένα νέο token με βάση το email του χρήστη και το επιστρέφουμε.
        // --- CHANGE: Δίνουμε και το username στη μέθοδο generateToken ---
        return jwtUtil.generateToken(user.getEmail(), user.getUsername());
    }
}