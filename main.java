import javax.swing.*;

public class Main {
    public static void main(String[] args) {
        // Fenster erstellen
        JFrame frame = new JFrame("Ich liebe Lea");
        frame.setSize(300, 200);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setLayout(null);

        // Button erstellen
        JButton button = new JButton("Klick mich");
        button.setBounds(90, 50, 120, 30);
        frame.add(button);

        // Label für den Text
        JLabel label = new JLabel("");
        label.setBounds(90, 100, 200, 30);
        frame.add(label);

        // Klick-Event
        button.addActionListener(e -> label.setText("Ich liebe Lea"));

        // Fenster sichtbar machen
        frame.setVisible(true);
    }
}