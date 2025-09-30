package com.gamestore.backend.service;

import com.gamestore.backend.dto.ChangePasswordRequestDTO;
import com.gamestore.backend.dto.UserDTO;
import com.gamestore.backend.model.User;
import com.gamestore.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    // Χρησιμοποιούμε constructor injection, που είναι η προτεινόμενη και πιο ασφαλής πρακτική
    // αντί για το @Autowired σε κάθε πεδίο.
    /* Αντι για constructor injection, μπορούμε να χρησιμοποιήσουμε και field injection
       με @Autowired πάνω από το πεδίο, αλλά δεν είναι η προτεινόμενη πρακτική.
       Οριστε το field injection:
       private UserRepository userRepository;
     */
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }


    /**
     * Ανακτά τα δεδομένα ενός χρήστη με βάση το email του.
     * @param email Το email του χρήστη προς αναζήτηση.
     * @return Ένα UserDTO με τα δημόσια δεδομένα του χρήστη.
     * @throws RuntimeException αν ο χρήστης δεν βρεθεί.
     */
    public UserDTO getUserByEmail(String email) {
        // Βρίσκουμε το User entity από τη βάση δεδομένων.
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        // Το μετατρέπουμε σε DTO και το επιστρέφουμε.
        return mapToDTO(user);
    }

    /**
     * Βοηθητική (private) μέθοδος που μετατρέπει ένα User entity σε UserDTO.
     * @param user Το User entity από τη βάση δεδομένων.
     * @return Το αντίστοιχο UserDTO.
     */
    private UserDTO mapToDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setEmail(user.getEmail());
        return userDTO;
    }

    // μεθοδος αλλαγης κωδικου
    public void changePassword(String userEmail, ChangePasswordRequestDTO request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 1. Έλεγχος αν ο τρέχων κωδικός είναι σωστός
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Incorrect current password.");
        }

        // 2. Έλεγχος αν ο νέος κωδικός και η επιβεβαίωση ταιριάζουν
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("New passwords do not match.");
        }

        // 3. Κρυπτογράφηση και αποθήκευση του νέου κωδικού
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

}