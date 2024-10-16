
class Evilman:
    def __init__(self, name, power):
        self.name = name              # Name of the Evilman
        self.power = power            # Power of the Evilman

    def counter_player(self, player):
        """
        Counter the actions of the player.
        """
        print(f"{self.name} uses {self.power} to counter {player.name}.")

