from protector import Protector
from player import Player
from evilman import Evilman

# Creating the objects
protector = Protector(name="Guardian", power="Shield of Light")
player = Player(name="Alex", objective="Find a job")
evilman = Evilman(name="Dark Lord", power="Shadow of Chaos")

# Using the methods
protector.help_player(player)
protector.counter_evilman(evilman)

player.move_forward()
player.dash()
