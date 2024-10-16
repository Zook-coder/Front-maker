class Protector:
    def __init__(self, name, power):
        self.name = name              # Name of the protector
        self.power = power            # Special power of the protector
    
    def help_player(self, player):
        """
        Help the player to reach his job.
        """
        print(f"{self.name} uses {self.power} to help {player.name} reach his job.")
    
    def counter_evilman(self, evilman):
        """
        Counter the actions of Evilman to protect the player.
        """
        print(f"{self.name} uses {self.power} to counter {evilman.name} and protect the player.")

