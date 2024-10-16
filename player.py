class Player:
    def __init__(self, name, objective):
        self.name = name              # Name of the player
        self.objective = objective    # Player's objective (reach my job)
        self.position = [0, 0]        # Player's position on the map (x, y)

    def move_left(self):
        """
        Move the player to the left (decreases the x-coordinate).
        """
        self.position[0] -= 1
        print(f"{self.name} moves left. New position: {self.position}")
    
    def move_right(self):
        """
        Move the player to the right (increases the x-coordinate).
        """
        self.position[0] += 1
        print(f"{self.name} moves right. New position: {self.position}")
    
    def move_forward(self):
        """
        Move the player forward (increases the y-coordinate).
        """
        self.position[1] += 1
        print(f"{self.name} moves forward. New position: {self.position}")
    
    def move_backward(self):
        """
        Move the player backward (decreases the y-coordinate).
        """
        self.position[1] -= 1
        print(f"{self.name} moves backward. New position: {self.position}")
    
    def jump(self):
        """
        Make the player jump (this could be more complex depending on game logic).
        """
        print(f"{self.name} jumps!")
    
    def dash(self):
        """
        Make the player dash, moving quickly forward by 2 units.
        """
        self.position[1] += 2
        print(f"{self.name} dashes forward. New position: {self.position}")

# Example usage in main.py would be similar to:
# player.move_left(), player.jump(), etc.
