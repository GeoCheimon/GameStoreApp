    package com.gamestore.backend.controller;

    import com.gamestore.backend.dto.LoginRequestDTO;
    import com.gamestore.backend.dto.LoginResponseDTO;
    import com.gamestore.backend.dto.RegisterRequestDTO;
    import com.gamestore.backend.service.AuthenticationService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    // @RestController: Δηλώνει ότι αυτή η κλάση είναι ένας Controller που χειρίζεται web requests
    // και οι απαντήσεις του θα είναι σε μορφή JSON.
    @RestController
    // @RequestMapping: Ορίζει ότι όλα τα endpoints σε αυτή την κλάση θα ξεκινούν με το πρόθεμα /api/auth.
    @RequestMapping("/api/authentication")
    // @CrossOrigin: Επιτρέπει στο frontend μας (που τρέχει στο localhost:5173) να επικοινωνεί με αυτό το API.
    @CrossOrigin(origins = "http://localhost:5173")
    public class AuthenticationController {
        @Autowired // Dependency Injection ("field injection"): Ζητάμε από το Spring να μας δώσει το AuthenticationService.
        private AuthenticationService authenticationService;

        @PostMapping("/register") //Ορίζει ότι αυτή η μέθοδος θα εκτελείται όταν έρχεται ένα POST request στο /api/auth/register
        public ResponseEntity<?> registerUser(@RequestBody RegisterRequestDTO registerRequest) {
            // @RequestBody: Λέει στο Spring να πάρει το JSON σώμα του request και να το μετατρέψει
            // αυτόματα σε ένα αντικείμενο τύπου RegisterRequestDTO.

            try {
                // Καλούμε το service για να εκτελέσει την πραγματική λογική της εγγραφής.
                authenticationService.registerUser(registerRequest);

                // ResponseEntity.ok(...): Αν όλα πάνε καλά, επιστρέφουμε μια απάντηση με status code 200 (OK)
                // και ένα μήνυμα επιτυχίας στο σώμα της απάντησης.
                return ResponseEntity.ok("User registered successfully!");
            } catch (RuntimeException e) {
                // Αν το service "πετάξει" ένα σφάλμα (π.χ., "Email is already in use!"),
                // το "πιάνουμε" εδώ.

                // ResponseEntity.badRequest().body(...): Επιστρέφουμε μια απάντηση με status code 400 (Bad Request)
                // και το μήνυμα του σφάλματος στο σώμα, ώστε το frontend να ξέρει τι πήγε στραβά.
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        }

        // --- NEW: Το endpoint για το Login ---
        /**
         * Χειρίζεται τα POST requests στη διεύθυνση /api/authentication/login.
         * @param loginRequest Το DTO που περιέχει το email και τον κωδικό του χρήστη από το σώμα του request.
         * @return Ένα ResponseEntity που περιέχει το JWT token αν η σύνδεση είναι επιτυχής,
         * ή ένα μήνυμα σφάλματος αν αποτύχει.
         */
        @PostMapping("/login")
        public ResponseEntity<?> loginUser(@RequestBody LoginRequestDTO loginRequest) {
            try {
                // 1. Καλούμε το service για να εκτελέσει τη λογική του login και να μας δώσει το token.
                String token = authenticationService.loginUser(loginRequest);

                // 2. Αν όλα πάνε καλά, δημιουργούμε ένα LoginResponseDTO που περιέχει το token
                //    και το επιστρέφουμε με status 200 OK. Το frontend θα λάβει ένα JSON της μορφής:
                //    { "jwtToken": "ey..." }
                return ResponseEntity.ok(new LoginResponseDTO(token));
            } catch (Exception e) {
                // 3. Αν το authenticationManager στο service αποτύχει (π.χ., λάθος κωδικός),
                //    θα "πετάξει" ένα exception. Το "πιάνουμε" εδώ.
                //    Επιστρέφουμε ένα status 401 Unauthorized με ένα σαφές μήνυμα σφάλματος.
                return ResponseEntity.status(401).body("Invalid email or password");
            }
        }
    }
