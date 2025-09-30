package com.gamestore.backend.service;

import com.gamestore.backend.dto.LoginRequestDTO;
import com.gamestore.backend.dto.RegisterRequestDTO;
import com.gamestore.backend.model.User;
import com.gamestore.backend.repository.UserRepository;
import com.gamestore.backend.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthenticationService {

    // Εδω γίνεται dependency injection μέσω constructor. Αυτο ειναι η προτεινόμενη πρακτική.
    // Γιατί constructor injection?
    // 1. Ασφάλεια: Οι εξαρτήσεις είναι final και δεν μπορούν να αλλάξουν μετά την αρχικοποίηση.
    // 2. Ευκολία στο testing: Μπορούμε εύκολα να περάσουμε mock αντικείμενα κατά τη διάρκεια των tests.
    // 3. Καθαρότητα: Είναι ξεκάθαρο ποιες εξαρτήσεις χρειάζεται η κλάση για να λειτουργήσει.
    // 4. Αποφυγή NullPointerExceptions: Εξασφαλίζει ότι όλες οι εξαρτήσεις είναι αρχικοποιημένες πριν χρησιμοποιηθούν.

    // Οι εξαρτήσεις δηλώνονται ως final για να εξασφαλίσουμε ότι θα αρχικοποιηθούν μία φορά μέσω του constructor.
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    // Constructor Injection
    // Αντί για @Autowired, το Spring θα "δει" αυτόν τον public constructor και θα περάσει αυτόματα
    // τα απαραίτητα "υλικά" (beans) ως ορίσματα.
    public AuthenticationService(
            UserRepository userRepository, // Ζητάμε από το Spring το UserRepository που φτιάξαμε.
            PasswordEncoder passwordEncoder, // Ζητάμε από το Spring το εργαλείο κρυπτογράφησης που φτιάξαμε.
            AuthenticationManager authenticationManager, // Ζητάμε το AuthenticationManager, το επίσημο εργαλείο του Spring για την επαλήθευση στοιχείων.
            JwtUtil jwtUtil // Ζητάμε το εργαλείο "JwtUtil", για τη δημιουργία των tokens.
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    public void registerUser(RegisterRequestDTO registerRequest) {
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
        userRepository.save(newUser);
    }

    // Η "Συνταγή" για το Login
    /**
     * Επαληθεύει τα στοιχεία ενός χρήστη και, αν είναι σωστά, δημιουργεί και επιστρέφει ένα JWT token.
     * @param loginRequest Το DTO που περιέχει το email και τον (ακατέργαστο) κωδικό του χρήστη.
     * @return Ένα string που είναι το υπογεγραμμένο JWT token.
     */
    public String loginUser(LoginRequestDTO loginRequest) {
        // Βήμα 1: Η Επαλήθευση των credentials (email/password)
        // Δίνουμε στο AuthenticationManager (που ειναι στο SecurityConfig) το email και τον κωδικό που έδωσε ο χρήστης.
        // Αυτόματα, το Spring Security θα:
        //   1. Βρει τον χρήστη στη βάση με βάση το email.
        //   2. Πάρει τον κρυπτογραφημένο κωδικό από τη βάση.
        //   3. Κρυπτογραφήσει τον κωδικό που έδωσε ο χρήστης τώρα.
        //   4. Συγκρίνει τα δύο hashes. Αν δεν ταιριάζουν, θα "πετάξει" ένα σφάλμα (Exception).
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        // Βήμα 2: Φέρνουμε το User entity ΜΙΑ ΦΟΡΑ από τη βάση.
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found after successful authentication"));

        // Βήμα 3: Δημιουργούμε ένα αντικείμενο UserDetails από το User entity.
        // Αυτό είναι το αντικείμενο που καταλαβαίνει το Spring Security.
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole()))
        );

        // Βήμα 4: Δημιουργούμε τα extra claims που θέλουμε στο token.
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("username", user.getUsername());

        // Προσθέτουμε τον ρόλο στα claims
        extraClaims.put("role", user.getRole());

        // Βήμα 5: Δημιουργία του Token, δίνοντας το UserDetails αντικείmeno.
        return jwtUtil.generateToken(extraClaims, userDetails);
    }
}