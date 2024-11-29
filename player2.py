import time
from enum import Enum
from datetime import datetime, timedelta

class PlayerStatus(Enum):
    NORMAL = "normal"
    STOPPED = "stopped"
    SLOW_MOTION = "in slow motion"
    INVISIBLE = "invisible"
    SPEED_BOOST = "speed++"
    BLOCKED = "blocked by an obstacle"

class PowerType(Enum):
    BONUS = "bonus"
    MALUS = "malus"

class Power:
    def __init__(self, name, power_type, casting_time, cooldown):
        self.name = name
        self.type = power_type
        self.casting_time = casting_time  # in seconds
        self.cooldown = cooldown          # in seconds
        self.last_used_time = datetime.min  # Last time the power was used

    def activate(self, target):
        current_time = datetime.now()
        time_since_last_use = (current_time - self.last_used_time).total_seconds()

        if time_since_last_use < self.cooldown:
            print(f"{self.name} is still in cooldown. Wait {self.cooldown - time_since_last_use:.2f} seconds.")
            return

        print(f"Preparing {self.name}... (casting time: {self.casting_time} seconds)")
        time.sleep(self.casting_time)  # Simulating casting time

        # Power is now activated
        print(f"{self.name} activated on {target.name}!")
        self.last_used_time = datetime.now()  # Reset cooldown timer

        if self.type == PowerType.BONUS:
            target.apply_bonus(self)
        elif self.type == PowerType.MALUS:
            target.apply_malus(self)

class Player:
    def __init__(self, name):
        self.name = name
        self.status = PlayerStatus.NORMAL

    def apply_bonus(self, power):
        print(f"{self.name} receives a bonus from {power.name}!")
        # Apply the effect of the bonus here (e.g., change player status)

    def apply_malus(self, power):
        print(f"{self.name} is affected by a malus from {power.name}!")
        # Apply the effect of the malus here (e.g., slow down the player)

class Evilman:
    def __init__(self, name="Evilman"):
        self.name = name
        # Powers :
        self.slowmotion_power = Power("Slow Motion Trap", PowerType.MALUS, 3, 8)  # 3 seconds casting, 8 seconds cooldown
        self.block_power = Power("Block Path", PowerType.MALUS, 2, 10)       # 2 seconds casting, 10 seconds cooldown
        self.stop_power = Power("Stop", PowerType.MALUS, 5, 10)              # 5 seconds casting, 10 seconds cooldown 

    def use_slowmotion_power(self, player):
        print(f"{self.name} tries to use malus power: {self.malus_power.name} on {player.name}")
        self.slowmotion_power.activate(player)

    def use_block_power(self, player):
        print(f"{self.name} tries to block {player.name}'s path with {self.block_power.name}")
        self.block_power.activate(player)
    
    def use_stop_power(self, player):
        print(f"{self.name} tries to stop {player.name} with {self.stop_power.name}")
        self.stop_power.activate(player)

class Protector:
    def __init__(self, name="Protector"):
        self.name = name
        # Powers :
        self.speed_power = Power("Speed Boost", PowerType.BONUS, 2, 5)                  # 2 seconds casting, 5 seconds cooldown
        self.invisibleshield_power = Power("Invisible Shield", PowerType.BONUS, 1, 7)   # 1 second casting, 7 seconds cooldown
        self.stop_evilman_power = Power("Stop Evilman", PowerType.BONUS, 5, 10)         # 5 second casting, 10 seconds cooldown

    def use_speed_power(self, player):
        print(f"{self.name} tries to use bonus power: {self.speed_power.name} on {player.name}")
        self.speed_power.activate(player)

    def use_invisibleshield_power(self, player):
        print(f"{self.name} tries to protect {player.name} with {self.invisibleshield_power.name}")
        self.invisibleshield_power.activate(player)
    
    def use_stop_evilman_power(self, player):
        print(f"{self.name} tries to protect {player.name} with {self.stop_evilman_power.name}")
        self.stop_evilman_power.activate(player)

# Main code to simulate interaction
def main():
    # Create actors
    player = Player("Alex")
    evilman = Evilman()
    protector = Protector()

    # Evilman uses a malus power on the player
    evilman.use_slowmotion_power(player)  # Slow motion trap, 3 seconds casting, 8 seconds cooldown
    time.sleep(4)                    # Simulating time passage
    evilman.use_slowmotion_power(player)  # Still in cooldown

    # Protector uses a bonus power on the player
    protector.use_speed_power(player)  # Speed Boost, 2 seconds casting, 5 seconds cooldown
    time.sleep(6)                      # Simulating time passage
    protector.use_speed_power(player)  # Can be used again after cooldown

    # Evilman tries to block the player
    evilman.use_block_power(player)     # Block path, 2 seconds casting, 10 seconds cooldown

    # Protector protects the player with a shield
    protector.use_invisibleshield_power(player)  # Invisible shield, 1 second casting, 7 seconds cooldown

    # Evilman tries to stop the player
    evilman.use_stop_power(player)     # Player stopped, 5 seconds casting, 10 seconds cooldown

    # Protector helps the player stopping Evilman
    protector.use_stop_evilman_power(player)  # Stop Evilman, 5 second casting, 10 seconds cooldown



if __name__ == "__main__":
    main()
