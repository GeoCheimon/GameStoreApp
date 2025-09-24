package com.gamestore.backend.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil { // Αυτό ειναι για την δημιουργία του JWT token

    // Ένα μυστικό κλειδί για την υπογραφή του token. ΠΡΕΠΕΙ να είναι πιο περίπλοκο σε πραγματική εφαρμογή.
    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    // Δημιουργεί ένα νέο JWT token για έναν χρήστη
    // Η μέθοδος δέχεται πλέον και το username
    public String generateToken(String email, String username) {
        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);
        // Το token λήγει σε 24 ώρες
        long expMillis = nowMillis + 1000 * 60 * 60 * 24;
        Date exp = new Date(expMillis);

        return Jwts.builder()
                .setSubject(email) // Το email του χρήστη είναι το "subject" του token
                .claim("username", username) // Προσθέτουμε το username ως επιπλέον claim
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(key)
                .compact();
    }
}