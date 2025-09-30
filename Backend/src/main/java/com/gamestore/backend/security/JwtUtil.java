package com.gamestore.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil { // Αυτό ειναι για την δημιουργία του JWT token

    //Ένα μυστικό κλειδί για την υπογραφή του token. ΠΡΕΠΕΙ να είναι πιο περίπλοκο σε πραγματική εφαρμογή.
    // Η μεταβλητή για το μυστικό κλειδί. Είναι 'final' γιατί θα αρχικοποιηθεί μία φορά στον constructor.
    private final String secretKey;

    // Constructor Injection
    // Αντί για @Autowired σε πεδίο, το Spring θα καλέσει αυτόν τον constructor.
    // Θα διαβάσει την τιμή από το application.properties και θα την περάσει ως όρισμα.
    // Αυτό λύνει οριστικά την προειδοποίηση "is never assigned".
    public JwtUtil(@Value("${jwt.secret.key}") String secretKey) {
        this.secretKey = secretKey;
    }
    // Εξάγει το username (που είναι το email) από το JWT token.
    public String extractUsername(String token) {
        // Καλεί τη γενική μέθοδο extractClaim για να πάρει το "subject" του token.
        return extractClaim(token, Claims::getSubject);
    }

    // Ελέγχει αν ένα token είναι έγκυρο
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        // Ένα token είναι έγκυρο αν το username μέσα σε αυτό ταιριάζει με το username του χρήστη
        // ΚΑΙ αν το token δεν έχει λήξει.
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }


    // Η κύρια μέθοδος που χτίζει το JWT token, επιτρέποντας και extra claims.
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername()) // Ορίζουμε το email ως το κύριο αναγνωριστικό (subject).
                .setIssuedAt(new Date(System.currentTimeMillis())) // Ημερομηνία δημιουργίας.
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // Ημερομηνία λήξης (24 ώρες).
                .signWith(getSignInKey(), SignatureAlgorithm.HS256) // Υπογράφουμε το token με το μυστικό κλειδί.
                .compact();
    }

    // --- ΒΟΗΘΗΤΙΚΕΣ (PRIVATE) ΜΕΘΟΔΟΙ ΓΙΑ ΤΗΝ ΑΝΑΓΝΩΣΗ ΤΟΥ TOKEN ---

    // Μια γενική μέθοδος που μπορεί να εξάγει οποιαδήποτε πληροφορία (claim) από το token.
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        // Παίρνουμε ΟΛΕΣ τις πληροφορίες από το token.
        final Claims claims = extractAllClaims(token);
        // Εφαρμόζουμε τη συνάρτηση για να πάρουμε τη συγκεκριμένη πληροφορία που θέλουμε.
        return claimsResolver.apply(claims);
    }

    // "Αποκωδικοποιεί" το token, επαληθεύει την υπογραφή του και επιστρέφει όλες τις πληροφορίες του.
    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder() // Ξεκινάμε τη διαδικασία "parsing" (ανάλυσης).
                .setSigningKey(getSignInKey()) // Δίνουμε το κλειδί για να γίνει η επαλήθευση της υπογραφής.
                .build()
                .parseClaimsJws(token) // Αναλύουμε το token.
                .getBody(); // Παίρνουμε το "σώμα" του, που περιέχει τα claims.
    }

    // Ελέγχει αν η ημερομηνία λήξης του token είναι στο παρελθόν.
    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    // Μετατρέπει το μυστικό κλειδί (που είναι String) σε ένα κρυπτογραφικό αντικείμενο Key.
    private Key getSignInKey() {
        // Παίρνουμε το secretKey από το application.properties.
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        // Το μετατρέπουμε σε ένα κλειδί κατάλληλο για τον αλγόριθμο HS256.
        return Keys.hmacShaKeyFor(keyBytes);
    }
}