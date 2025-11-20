import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class TestBCrypt {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        String rawPassword = "password123";
        String hashFromDB = "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIeWPyS2mC";
        
        System.out.println("Testing BCrypt password verification:");
        System.out.println("Raw password: " + rawPassword);
        System.out.println("Hash from DB: " + hashFromDB);
        
        boolean matches = encoder.matches(rawPassword, hashFromDB);
        System.out.println("Verification result: " + matches);
        
        if (!matches) {
            System.out.println("\nGenerating new hash for '" + rawPassword + "':");
            String newHash = encoder.encode(rawPassword);
            System.out.println("New hash: " + newHash);
        }
    }
}
