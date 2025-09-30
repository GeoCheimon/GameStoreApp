package com.gamestore.backend.service;

import com.gamestore.backend.dto.GameDTO;
import com.gamestore.backend.model.User;
import com.gamestore.backend.model.UserLibraryItem;
import com.gamestore.backend.repository.UserLibraryRepository;
import com.gamestore.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LibraryService {

    private final UserLibraryRepository userLibraryRepository;
    private final UserRepository userRepository;
    private final GameService gameService; // Για να επαναχρησιμοποιήσουμε τη λογική mapToDTO

    public LibraryService(UserLibraryRepository userLibraryRepository, UserRepository userRepository, GameService gameService) {
        this.userLibraryRepository = userLibraryRepository;
        this.userRepository = userRepository;
        this.gameService = gameService;
    }

    /**
     * Επιστρέφει τη λίστα των παιχνιδιών που έχει αγοράσει ένας χρήστης.
     * @param userEmail Το email του συνδεδεμένου χρήστη.
     * @return Μια λίστα από GameDTOs.
     */
    public List<GameDTO> getOwnedGames(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return userLibraryRepository.findByUser_Id(user.getId())
                .stream()
                .map(UserLibraryItem::getGame) // Παίρνουμε το Game από κάθε εγγραφή της βιβλιοθήκης
                .map(gameService::MapToDTO) // Μετατρέπουμε κάθε Game σε GameDTO
                .collect(Collectors.toList());
    }
}