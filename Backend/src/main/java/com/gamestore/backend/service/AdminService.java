package com.gamestore.backend.service;

import com.gamestore.backend.dto.UserManagementDTO;
import com.gamestore.backend.model.Game;
import com.gamestore.backend.model.User;
import com.gamestore.backend.repository.GameRepository;
import com.gamestore.backend.repository.UserLibraryRepository;
import com.gamestore.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final GameRepository gameRepository;
    private final UserLibraryRepository userLibraryRepository;

    public AdminService(UserRepository userRepository, GameRepository gameRepository, UserLibraryRepository userLibraryRepository) {
        this.userRepository = userRepository;
        this.gameRepository = gameRepository;
        this.userLibraryRepository = userLibraryRepository;
    }



    // Μέθοδοι για Διαχείριση των Χρηστών

    // Επιστρέφει όλους τους χρήστες
    //public List<User> getAllUsers() {return userRepository.findAll(); }

    public List<UserManagementDTO> getAllUsers() {
        return userRepository.findAll().stream().map(this::mapToUserManagementDTO).collect(Collectors.toList());
    }

    private UserManagementDTO mapToUserManagementDTO(User user) {
        UserManagementDTO dto = new UserManagementDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        return dto;
    }
    // Διαγραφή χρήστη
    @Transactional // Εξασφαλίζει ότι όλες οι σχετικές διαγραφές γίνονται μαζί
    public void deleteUser(Long userId) {
        // Με τις ρυθμίσεις cascade στο User.java, αρκεί να διαγράψουμε τον χρήστη
        // και το Hibernate θα αναλάβει να καθαρίσει όλες τις σχετικές εγγραφές.
        userRepository.deleteById(userId);
    }

    // Διαγραφή παιχνιδιού από τη βιβλιοθήκη ενός συγκεκριμένου χρήστη
    @Transactional
    public void deleteGameFromUserLibrary(Long userId, Long gameId) {
        // Η μέθοδος deleteByUser_IdAndGame_Id είναι η πιο αποτελεσματική
        // Βεβαιώσου ότι υπάρχει στο UserLibraryRepository σου.
        userLibraryRepository.deleteByUser_IdAndGame_Id(userId, gameId);
    }

    // Μέθοδοι για Διαχείριση των Παιχνιδιών
    // Προσθέτει ένα νέο παιχνίδι
    public Game addGame(Game game) {
        // Εδώ θα μπορούσαμε να έχουμε και DTOs, αλλά για απλότητα χρησιμοποιούμε το Entity
        return gameRepository.save(game);
    }
    // Ενημερώνει ένα υπάρχον παιχνίδι
    @Transactional
    public Game updateGame(Long gameId, Game updatedGameDetails) {
        Game gameToUpdate = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found with id: " + gameId));

        // Ενημερώνουμε τα πεδία χρησιμοποιώντας τα νέα setters από το Game.java
        gameToUpdate.setName(updatedGameDetails.getName());
        gameToUpdate.setDescription(updatedGameDetails.getDescription());
        gameToUpdate.setCategory(updatedGameDetails.getCategory());
        gameToUpdate.setPrice(updatedGameDetails.getPrice());
        gameToUpdate.setOriginalPrice(updatedGameDetails.getOriginalPrice());
        gameToUpdate.setImageUrl(updatedGameDetails.getImageUrl());
        gameToUpdate.setDeveloper(updatedGameDetails.getDeveloper());
        gameToUpdate.setPublisher(updatedGameDetails.getPublisher());
        gameToUpdate.setReleaseDate(updatedGameDetails.getReleaseDate());
        gameToUpdate.setDiscountPercentage(updatedGameDetails.getDiscountPercentage());

        return gameRepository.save(gameToUpdate);
    }

    // Διαγράφει ένα παιχνίδι οριστικά
    @Transactional
    public void deleteGame(Long gameId) {
        // Με τις ρυθμίσεις cascade στο Game.java, το Hibernate θα καθαρίσει αυτόματα
        // όλες τις εγγραφές που σχετίζονται με αυτό το παιχνίδι.
        gameRepository.deleteById(gameId);
    }

}