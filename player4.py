import time
from enum import Enum

class PlayerStatus(Enum):
    NORMAL = "normal"
    STOPPED = "stopped"
    SLOW_MOTION = "in slow motion"
    INVISIBLE = "invisible"
    SPEED_BOOST = "speed++"
    BLOCKED = "blocked by an obstacle"

class Player:
    def __init__(self, name):
        self.name = name
        self.status = PlayerStatus.NORMAL
        self.position = [0, 0]  # (x, y) coordinates, y being vertical

    def move_left(self):
        if self.status == PlayerStatus.BLOCKED:
            print(f"{self.name} is blocked and cannot move left.")
        if self.status == PlayerStatus.STOPPED:
            print(f"{self.name} is stopped and cannot move left.")
        else:
            self.position[0] -= 1
            print(f"{self.name} moves left. New position: {self.position}")

    def move_right(self):
        if self.status == PlayerStatus.BLOCKED:
            print(f"{self.name} is blocked and cannot move right.")
        if self.status == PlayerStatus.STOPPED:
            print(f"{self.name} is stopped and cannot move right.")
        else:
            self.position[0] += 1
            print(f"{self.name} moves right. New position: {self.position}")

    def move_forward(self):
        if self.status == PlayerStatus.BLOCKED:
            print(f"{self.name} is blocked and cannot move forward.")
        if self.status == PlayerStatus.STOPPED:
            print(f"{self.name} is stopped and cannot move forward.")
        else:
            self.position[1] += 1
            print(f"{self.name} moves forward. New position: {self.position}")

    def move_backward(self):
        if self.status == PlayerStatus.BLOCKED:
            print(f"{self.name} is blocked and cannot move backward.")
        if self.status == PlayerStatus.STOPPED:
            print(f"{self.name} is stopped and cannot move backward.")
        else:
            self.position[1] -= 1
            print(f"{self.name} moves backward. New position: {self.position}")

    def jump(self):  # Saute en hauteur de 2, en avant de 2 et redescends en hauteur de 2  
        if self.status == PlayerStatus.BLOCKED:
            print(f"{self.name} is blocked and cannot jump.")
        if self.status == PlayerStatus.STOPPED:
            print(f"{self.name} is stopped and cannot jump.")
        else:
            print(f"{self.name} jumps!")
            # Simulate jump by moving up and down on the Y axis
            self.position[1] += 2  # Simulate upward jump
            self.position[0] += 2  # Simulate forward jump
            print(f"{self.name} is at position: {self.position} - Jumping")
            time.sleep(0.5)  # Short delay to simulate the jump
            self.position[1] -= 2  # Simulate landing
            print(f"{self.name} lands. New position: {self.position}")

# Example usage
def main():
    player = Player("Martin")

    player.move_left()   # Move left
    player.jump()        # Player jumps
    player.move_right()  # Move right
    player.jump()        # Player jumps again

if __name__ == "__main__":
    main()
