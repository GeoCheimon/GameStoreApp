package com.gamestore.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gamestore.backend.dto.LoginRequestDTO;
import com.gamestore.backend.dto.RegisterRequestDTO;
import com.gamestore.backend.model.Game;
import com.gamestore.backend.model.User;
import com.gamestore.backend.model.UserLibraryItem;
import com.gamestore.backend.repository.GameRepository;
import com.gamestore.backend.repository.UserLibraryRepository;
import com.gamestore.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class GameStoreIntegrationTest {

    // Δηλώνουμε τα πεδία(εργαλεία που θα χρησιμοποιήσουμε στα tests) ως final.
    private final MockMvc mockMvc;
    private final ObjectMapper objectMapper;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final GameRepository gameRepository;
    private final UserLibraryRepository userLibraryRepository;

    // Γιατί χρησιμοποιούμε Constructor Injection
    // Το @Autowired στον constructor λέει στο Spring να "περάσει" τα εργαλεία που χρειαζόμαστε.
    // Δηλαδή τα εργαλεία, που έχουμε φτιάξει ως beans (π.χ., το MockMvc, το ObjectMapper, το UserRepository, το PasswordEncoder
    // το GameRepository και το UserLibraryRepository), γίνονται inject στον constructor αυτόματα από το Spring.
    @Autowired
    public GameStoreIntegrationTest(MockMvc mockMvc, ObjectMapper objectMapper, UserRepository userRepository,
                                    PasswordEncoder passwordEncoder, GameRepository gameRepository, UserLibraryRepository userLibraryRepository) {
        this.mockMvc = mockMvc;
        this.objectMapper = objectMapper;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.gameRepository = gameRepository;
        this.userLibraryRepository = userLibraryRepository;
    }
    /*
        Test Case #1: Επιτυχής Εγγραφή και Σύνδεση Χρήστη
        Eίναι επιτυχές το test case γιατι το backend απαντάει με 200 OK
        και μας δίνει πίσω ένα JWT token στο σώμα της απάντησης.
        Αυτό σημαίνει ότι η εγγραφή και η σύνδεση έγιναν επιτυχώς.
     */
    @Test
    void shouldRegisterAndLoginUserSuccessfully() throws Exception {

        // Register εναν καινουργιο χρηστη
        RegisterRequestDTO registerRequest = new RegisterRequestDTO();
        registerRequest.setUsername("testuser2");
        registerRequest.setEmail("testuser2@test.com");
        registerRequest.setPassword("password123");

        // Χρησιμοποιούμε το 'mockMvc' για να κάνουμε ένα POST request στο endpoint εγγραφής.
        // Το περιεχόμενο του request είναι το JSON που προκύπτει από το αντικείμενο 'registerRequest'.
        // Περιμένουμε ότι η απάντηση θα έχει status 200 OK.
        mockMvc.perform(post("/api/authentication/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk());

        // Login με τον καινουργιο χρηστη που μόλις κάναμε register
        LoginRequestDTO loginRequest = new LoginRequestDTO();
        loginRequest.setEmail("testuser2@test.com");
        loginRequest.setPassword("password123");

        // Κάνουμε το POST request στο endpoint σύνδεσης.
        // Περιμένουμε ότι η απάντηση θα έχει status 200 OK και θα περιέχει ένα πεδίο 'jwtToken'.
        mockMvc.perform(post("/api/authentication/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andDo(print())// Εκτυπώνει το request και το response στο console για debugging
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.jwtToken").exists())
                .andExpect(jsonPath("$.jwtToken").isNotEmpty());
    }

    /*
      Test Case #2: Αποτυχία Εγγραφής με Διπλότυπο Email
      Επιβαιβεώνει  ότι το σύστημα απορρίπτει σωστά την προσπάθεια
      δημιουργίας νέου λογαριασμού με ένα email που υπάρχει ήδη στη βάση.
     */
    @Test
    void shouldFailRegistrationWithDuplicateEmail() throws Exception {
        // Arrange: Δημιουργούμε έναν αρχικό χρήστη και τον αποθηκεύουμε στη βάση.
        User existingUser = new User();
        existingUser.setUsername("testuser2");
        existingUser.setEmail("testuser2@test.com");
        existingUser.setPassword(passwordEncoder.encode("password123"));
        existingUser.setRole("ROLE_USER");
        userRepository.save(existingUser);

        // Arrange: Ετοιμάζουμε ένα αίτημα εγγραφής με το ΙΔΙΟ email.
        RegisterRequestDTO duplicateRegisterRequest = new RegisterRequestDTO();
        duplicateRegisterRequest.setUsername("anotheruser");
        duplicateRegisterRequest.setEmail("testuser2@test.com"); // <-- Διπλότυπο email
        duplicateRegisterRequest.setPassword("newpassword");

        // Act & Assert: Εκτελούμε το αίτημα και περιμένουμε σφάλμα.
        mockMvc.perform(post("/api/authentication/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicateRegisterRequest)))
                .andDo(print())
                .andExpect(status().isBadRequest()) // Επιβεβαιώνουμε ότι η απάντηση είναι 400 Bad Request
                .andExpect(content().string("Email is already in use!")); // Επιβεβαιώνουμε ότι το μήνυμα σφάλματος είναι το σωστό.
    }

    // Test Case #3: Πρόσβαση σε Προστατευμένη Διαδρομή με Έγκυρο Token
    /*
        Επιβεβαιώνει ότι ένας χρήστης με έγκυρο JWT token μπορεί να έχει πρόσβαση
        σε μια προστατευμένη διαδρομή και να λάβει τα σωστά δεδομένα.
    */
    @Test
    void shouldAccessProtectedRouteWithValidToken() throws Exception {

        // 1. Δημιουργούμε ένα παιχνίδι
        Game testGame = new Game();
        testGame.setName("Test Game for Library");
        testGame.setCategory("Test");
        testGame.setPrice(19.99);
        gameRepository.save(testGame);

        User user = new User();
        user.setUsername("testuser_protected");
        user.setEmail("protected@test.com");
        user.setPassword(passwordEncoder.encode("password123"));
        user.setRole("ROLE_USER");
        userRepository.save(user);

        LoginRequestDTO loginRequest = new LoginRequestDTO();
        loginRequest.setEmail("protected@test.com");
        loginRequest.setPassword("password123");

        MvcResult loginResult = mockMvc.perform(post("/api/authentication/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String responseString = loginResult.getResponse().getContentAsString();
        String token = objectMapper.readTree(responseString).get("jwtToken").asText();

        mockMvc.perform(get("/api/users/me")
                        .header("Authorization", "Bearer " + token))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("protected@test.com"));
    }

    /*
      Test Case #3 - example 2: Πρόσβαση στη προστατευμένη διαδρομή "My Games" με έγκυρο token
      προσθέτοντας ένα παιχνίδι στη βιβλιοθήκη του χρήστη και επιβεβαιώνοντας ότι
      το παιχνίδι αυτό εμφανίζεται όταν ο χρήστης κάνει αίτημα στο endpoint /api/library.
     */
    @Test
    void shouldAccessLibraryWithValidToken() throws Exception {
        // 1. Δημιουργούμε ένα παιχνίδι
        Game testGame = new Game();
        testGame.setName("Test Game for Library");
        testGame.setCategory("Test");
        testGame.setPrice(19.99);
        gameRepository.save(testGame);

        // 2. Δημιουργούμε έναν χρήστη
        User user = new User();
        user.setUsername("library_user");
        user.setEmail("library@test.com");
        user.setPassword(passwordEncoder.encode("password123"));
        user.setRole("ROLE_USER");
        userRepository.save(user);

        // 3. Προσθέτουμε το παιχνίδι στη βιβλιοθήκη του χρήστη
        UserLibraryItem libraryItem = new UserLibraryItem();
        libraryItem.setUser(user);
        libraryItem.setGame(testGame);
        libraryItem.setPurchaseDate(LocalDateTime.now());
        userLibraryRepository.save(libraryItem);

        // 4. Ετοιμάζουμε το αίτημα για login
        LoginRequestDTO loginRequest = new LoginRequestDTO();
        loginRequest.setEmail("library@test.com");
        loginRequest.setPassword("password123");

        // Κάνουμε login για να πάρουμε το token
        MvcResult loginResult = mockMvc.perform(post("/api/authentication/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String token = objectMapper.readTree(loginResult.getResponse().getContentAsString()).get("jwtToken").asText();

        // Κάνουμε το αίτημα στο endpoint του "My Games" (/api/library)
        mockMvc.perform(get("/api/library")
                        .header("Authorization", "Bearer " + token))
                .andDo(print())
                .andExpect(status().isOk()) // Περιμένουμε επιτυχή απάντηση (200)
                .andExpect(jsonPath("$").isArray()) // Περιμένουμε η απάντηση να είναι ένας πίνακας (array)
                .andExpect(jsonPath("$[0].name").value("Test Game for Library")); // Περιμένουμε το πρώτο παιχνίδι στη λίστα να έχει το σωστό όνομα
    }

    // Test Case #4: Πρόσβαση σε Προστατευμένη Διαδρομή με Μη Έγκυρο Token
    /*
        Επιβεβαιώνει ότι ένας χρήστης με έγκυρο JWT token δεν μπορεί να έχει πρόσβαση
        σε μια διαδρομή που απαιτεί ειδικά δικαιώματα (π.χ., admin).
    */
    @Test
    void shouldDenyAccessToAdminEndpointForRegularUser() throws Exception {
        // Arrange
        User user = new User();
        user.setUsername("regular_user");
        user.setEmail("regular@test.com");
        user.setPassword(passwordEncoder.encode("password123"));
        user.setRole("ROLE_USER");
        userRepository.save(user);

        LoginRequestDTO loginRequest = new LoginRequestDTO();
        loginRequest.setEmail("regular@test.com");
        loginRequest.setPassword("password123");

        // Act
        MvcResult loginResult = mockMvc.perform(post("/api/authentication/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String token = objectMapper.readTree(loginResult.getResponse().getContentAsString()).get("jwtToken").asText();

        // Act & Assert
        mockMvc.perform(get("/api/admin/users")
                        .header("Authorization", "Bearer " + token))
                .andDo(print())
                .andExpect(status().isForbidden());
    }
    /*
      Test Case #5: Αποτυχία Σύνδεσης με Λάθος Κωδικό
      Επιβεβαιώνει ότι το σύστημα απορρίπτει σωστά την προσπάθεια
      σύνδεσης με λάθος κωδικό πρόσβασης.
     */
    @Test
    void shouldFailLoginWithWrongPassword() throws Exception {
        // Δημιουργούμε έναν χρήστη στη βάση.
        User user = new User();
        user.setUsername("testuser_wrongpass");
        user.setEmail("wrongpass@test.com");
        user.setPassword(passwordEncoder.encode("correct_password"));
        user.setRole("ROLE_USER");
        userRepository.save(user);

        // Ετοιμάζουμε ένα αίτημα σύνδεσης με λάθος κωδικό.
        LoginRequestDTO loginRequest = new LoginRequestDTO();
        loginRequest.setEmail("wrongpass@test.com");
        loginRequest.setPassword("wrong_password"); // <-- Λάθος κωδικός

        // Εκτελούμε το αίτημα και περιμένουμε σφάλμα.
        mockMvc.perform(post("/api/authentication/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andDo(print())
                .andExpect(status().isUnauthorized()); // Επιβεβαιώνουμε ότι η απάντηση είναι 401 Unauthorized.
    }

    /*
        Test Case #6: Αποτυχία Πρόσβασης με Άκυρο/Παραποιημένο Token
        Επιβεβαιώνει ότι το σύστημα απορρίπτει σωστά την προσπάθεια
        πρόσβασης με ένα άκυρο ή παραποιημένο JWT token.
    */
    @Test
    void shouldDenyAccessWithInvalidToken() throws Exception {
        // Arrange: Δημιουργούμε ένα άκυρο token (απλά ένα τυχαίο string).
        String invalidToken = "this.is.not.a.valid.token";

        // Act & Assert: Προσπαθούμε να μπούμε σε μια προστατευμένη σελίδα με το άκυρο token.
        mockMvc.perform(get("/api/users/me")
                        .header("Authorization", "Bearer " + invalidToken))
                .andDo(print())
                .andExpect(status().isForbidden()); // Επιβεβαιώνουμε ότι η απάντηση είναι 403 Forbidden.
    }

    /*
      Test Case #7: Αποτυχία Εγγραφής με Μη Έγκυρο Κωδικό
      Σκοπός: Να επιβεβαιώσει ότι το backend απορρίπτει κωδικούς που δεν τηρούν
      τους κανόνες πολυπλοκότητας (π.χ., μήκος, κεφαλαία, ειδικοί χαρακτήρες).
      ΠΕΡΙΜΕΝΟΥΜΕ ΑΥΤΟ ΤΟ TEST ΝΑ ΑΠΟΤΥΧΕΙ ΑΡΧΙΚΑ!
     */
    @Test
    void shouldFailRegistrationWithInvalidPassword() throws Exception {
        // Ετοιμάζουμε ένα αίτημα εγγραφής με έναν αδύναμο κωδικό "pass"
        // που παραβιάζει όλους τους κανόνες που θέλουμε να εφαρμόσουμε.
        RegisterRequestDTO registerRequest = new RegisterRequestDTO();
        registerRequest.setUsername("weak_password_user");
        registerRequest.setEmail("weakpass@test.com");
        registerRequest.setPassword("pass");

        mockMvc.perform(post("/api/authentication/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                // Ο ΣΤΟΧΟΣ ΜΑΣ: Περιμένουμε το backend να μας απαντήσει με σφάλμα 400 Bad Request,
                // επειδή ο κωδικός είναι μη αποδεκτός.
                .andDo(print())
                .andExpect(status().isBadRequest());
    }
}
