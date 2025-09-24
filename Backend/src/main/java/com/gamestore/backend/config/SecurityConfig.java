package com.gamestore.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration // Δηλώνει ότι αυτή η κλάση περιέχει ρυθμίσεις για το Spring
@EnableWebSecurity // Ενεργοποιεί το Spring Security στην εφαρμογή
public class SecurityConfig {

    @Bean // Το @Bean λέει στο Spring: "Δημιούργησε αυτό το αντικείμενο και κράτα το διαθέσιμο
    // για να το χρησιμοποιήσουν άλλες κλάσεις"
    //Τι κάνει; Δημιουργεί και επιστρέφει έναν PasswordEncoder που χρησιμοποιεί τον αλγόριθμο
    // bcrypt για την κρυπτογράφηση κωδικών πρόσβασης.
    public PasswordEncoder passwordEncoder() {
        // Χρησιμοποιούμε τον αλγόριθμο bcrypt, που είναι ο πιο ασφαλής και διαδεδομένος
        return new BCryptPasswordEncoder();
    }

    // NEW: Δημιουργούμε το AuthenticationManager. Αυτό είναι το "εργαλείο" του Spring
    // που αναλαμβάνει να ελέγξει αν το email και ο κωδικός που έδωσε ο χρήστης είναι σωστά.
    // Το AuthenticationManager χρειάζεται να το δηλώσουμε εμείς εδώ για να μπορέσει
    // να χρησιμοποιηθεί στο AuthenticationService.
    // Το AuthenticationConfiguration είναι μια κλάση που παρέχει το Spring Security
    // και μας δίνει πρόσβαση στο AuthenticationManager που έχει φτιάξει το ίδιο.
    // Με αυτόν τον τρόπο, δεν χρειάζεται να φτιάξουμε εμείς τον AuthenticationManager από την αρχή.
    // Απλώς ζητάμε από το Spring να μας τον δώσει.
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    /* Το CRSF (Cross-Site Request Forgery) είναι μια επίθεση όπου ένας κακόβουλος χρήστης
     προσπαθεί να εκτελέσει ανεπιθύμητες ενέργειες εκ μέρους ενός αυθεντικοποιημένου χρήστη.
     Σε εφαρμογές που χρησιμοποιούν sessions και cookies, το CSRF protection είναι σημαντικό.
     Ωστόσο, σε ένα stateless API που χρησιμοποιεί JWT για την αυθεντικοποίηση,
     δεν χρειάζεται να ανησυχούμε για το CSRF, γιατί δεν βασιζόμαστε σε cookies για την αυθεντικοποίηση.
     Γι' αυτό και το απενεργοποιούμε εδώ. Αν το αφήσουμε ενεργό, θα μπλοκάρει όλα τα POST, PUT, DELETE requests
     που δεν έχουν το σωστό CSRF token, κάτι που δεν είναι επιθυμητό σε ένα API που χρησιμοποιεί JWT.*/
    /* stateless API σημαινει ότι ο server δεν κρατάει καμία πληροφορία για την κατάσταση (state) του χρήστη
     μεταξύ των αιτημάτων (requests). Κάθε αίτημα είναι ανεξάρτητο και πρέπει να περιέχει όλες τις πληροφορίες
     που χρειάζονται για την επεξεργασία του. */
     /* JWT (JSON Web Token) είναι ένας τρόπος να μεταφέρουμε με ασφάλεια πληροφορίες μεταξύ δύο μερών
     ως έναν κρυπτογραφημένο token. Συνήθως χρησιμοποιείται για την αυθεντικοποίηση και την εξουσιοδότηση χρηστών σε web εφαρμογές.
     Με το JWT, όταν ένας χρήστης συνδεθεί επιτυχώς, ο server δημιουργεί ένα token που περιέχει πληροφορίες για τον χρήστη
     και το στέλνει πίσω στον client. Ο client αποθηκεύει αυτό το token (συνήθως στο local storage ή στα cookies)
     και το στέλνει πίσω σε κάθε επόμενο αίτημα προς τον server για να αποδείξει την ταυτότητά του.
     Επειδή το JWT είναι αυτο-περιεκτικό (self-contained), ο server δεν χρειάζεται να κρατάει καμία πληροφορία για την κατάσταση
     του χρήστη μεταξύ των αιτημάτων, κάνοντας το σύστημα stateless.
     Αντίθετα, σε παραδοσιακές εφαρμογές που χρησιμοποιούν sessions και cookies για την αυθεντικοποίηση,
     ο server κρατάει πληροφορίες για την κατάσταση του χρήστη, κάτι που απαιτεί διαχείριση session και μπορεί να είναι πιο
     περίπλοκο.*/
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(withDefaults()) //Ενσωματωνουμε τη ρύθμιση του CORS στο Security Filter Chain του Spring Security.
                // 1. Απενεργοποιούμε την προστασία CSRF.
                // Είναι απαραίτητο για ένα stateless REST API.
                .csrf(AbstractHttpConfigurer::disable)

                // 2. Ορίζουμε τους κανόνες πρόσβασης (Authorization).
                .authorizeHttpRequests(auth -> auth
                        // Επιτρέπουμε σε ΟΛΟΥΣ την πρόσβαση στα endpoints της αυθεντικοποίησης
                        .requestMatchers("/api/authentication/**").permitAll()
                        // --- FIX 2: Επιτρέπουμε σε ΟΛΟΥΣ την πρόσβαση στα endpoints των παιχνιδιών ---
                        .requestMatchers("/api/games/**").permitAll()
                        // Για όλα τα άλλα requests, απαιτείται έλεγχος ταυτότητας
                        .anyRequest().authenticated()
                );

        return http.build();
    }

    // --- NEW: Ορίζουμε τους κανόνες του CORS για ολόκληρη την εφαρμογή ---
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Επιτρέπουμε αιτήματα ΜΟΝΟ από τη διεύθυνση του frontend μας
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        // Επιτρέπουμε τις πιο συνηθισμένες μεθόδους HTTP
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // Επιτρέπουμε όλα τα headers
        configuration.setAllowedHeaders(List.of("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Εφαρμόζουμε αυτούς τους κανόνες σε όλα τα endpoints του API μας ("/**")
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
