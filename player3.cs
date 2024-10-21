using System;
using System.Threading;

public enum PlayerStatus
{
    NORMAL,
    STOPPED,
    SLOW_MOTION,
    INVISIBLE,
    SPEED_BOOST,
    BLOCKED
}

public enum PowerType
{
    BONUS,
    MALUS
}

public class Power
{
    public string Name { get; private set; }
    public PowerType Type { get; private set; }
    public int CastingTime { get; private set; } // In seconds
    public int Cooldown { get; private set; }    // In seconds
    private DateTime LastUsedTime;

    public Power(string name, PowerType type, int castingTime, int cooldown)
    {
        Name = name;
        Type = type;
        CastingTime = castingTime;
        Cooldown = cooldown;
        LastUsedTime = DateTime.MinValue;
    }

    public void Activate(Player target)
    {
        TimeSpan timeSinceLastUse = DateTime.Now - LastUsedTime;

        if (timeSinceLastUse.TotalSeconds < Cooldown)
        {
            Console.WriteLine($"{Name} is still in cooldown. Wait {Cooldown - timeSinceLastUse.TotalSeconds:F2} seconds.");
            return;
        }

        Console.WriteLine($"Preparing {Name}... (casting time: {CastingTime} seconds)");
        Thread.Sleep(CastingTime * 1000); // Simulate casting time

        // Power is now activated
        Console.WriteLine($"{Name} activated on {target.Name}!");
        LastUsedTime = DateTime.Now; // Reset cooldown timer

        if (Type == PowerType.BONUS)
        {
            target.ApplyBonus(this);
        }
        else if (Type == PowerType.MALUS)
        {
            target.ApplyMalus(this);
        }
    }
}

public class Player
{
    public string Name { get; private set; }
    public PlayerStatus Status { get; private set; }

    public Player(string name)
    {
        Name = name;
        Status = PlayerStatus.NORMAL;
    }

    public void ApplyBonus(Power power)
    {
        Console.WriteLine($"{Name} receives a bonus from {power.Name}!");
        // Apply the bonus effect here (e.g., change player status)
    }

    public void ApplyMalus(Power power)
    {
        Console.WriteLine($"{Name} is affected by a malus from {power.Name}!");
        // Apply the malus effect here (e.g., slow down the player)
    }
}

public class Evilman
{
    public string Name { get; private set; }
    public Power SlowMotionPower { get; private set; }
    public Power BlockPower { get; private set; }
    public Power StopPower { get; private set; }

    public Evilman(string name = "Evilman")
    {
        Name = name;
        SlowMotionPower = new Power("Slow Motion Trap", PowerType.MALUS, 3, 8);
        BlockPower = new Power("Block Path", PowerType.MALUS, 2, 10);
        StopPower = new Power("Stop", PowerType.MALUS, 5, 10);
    }

    public void UseSlowMotionPower(Player player)
    {
        Console.WriteLine($"{Name} tries to use malus power: {SlowMotionPower.Name} on {player.Name}");
        SlowMotionPower.Activate(player);
    }

    public void UseBlockPower(Player player)
    {
        Console.WriteLine($"{Name} tries to block {player.Name}'s path with {BlockPower.Name}");
        BlockPower.Activate(player);
    }

    public void UseStopPower(Player player)
    {
        Console.WriteLine($"{Name} tries to stop {player.Name} with {StopPower.Name}");
        StopPower.Activate(player);
    }
}

public class Protector
{
    public string Name { get; private set; }
    public Power SpeedPower { get; private set; }
    public Power InvisibleShieldPower { get; private set; }
    public Power StopEvilmanPower { get; private set; }

    public Protector(string name = "Protector")
    {
        Name = name;
        SpeedPower = new Power("Speed Boost", PowerType.BONUS, 2, 5);
        InvisibleShieldPower = new Power("Invisible Shield", PowerType.BONUS, 1, 7);
        StopEvilmanPower = new Power("Stop Evilman", PowerType.BONUS, 5, 10);
    }

    public void UseSpeedPower(Player player)
    {
        Console.WriteLine($"{Name} tries to use bonus power: {SpeedPower.Name} on {player.Name}");
        SpeedPower.Activate(player);
    }

    public void UseInvisibleShieldPower(Player player)
    {
        Console.WriteLine($"{Name} tries to protect {player.Name} with {InvisibleShieldPower.Name}");
        InvisibleShieldPower.Activate(player);
    }

    public void UseStopEvilmanPower(Player player)
    {
        Console.WriteLine($"{Name} tries to protect {player.Name} with {StopEvilmanPower.Name}");
        StopEvilmanPower.Activate(player);
    }
}

class Program
{
    static void Main(string[] args)
    {
        // Create actors
        Player player = new Player("Alex");
        Evilman evilman = new Evilman();
        Protector protector = new Protector();

        // Evilman uses a malus power on the player
        evilman.UseSlowMotionPower(player);  // Slow motion trap, 3 seconds casting, 8 seconds cooldown
        Thread.Sleep(4000);                  // Simulating time passage
        evilman.UseSlowMotionPower(player);  // Still in cooldown

        // Protector uses a bonus power on the player
        protector.UseSpeedPower(player);     // Speed Boost, 2 seconds casting, 5 seconds cooldown
        Thread.Sleep(6000);                  // Simulating time passage
        protector.UseSpeedPower(player);     // Can be used again after cooldown

        // Evilman tries to block the player
        evilman.UseBlockPower(player);       // Block path, 2 seconds casting, 10 seconds cooldown

        // Protector protects the player with a shield
        protector.UseInvisibleShieldPower(player);  // Invisible shield, 1 second casting, 7 seconds cooldown

        // Evilman tries to stop the player
        evilman.UseStopPower(player);        // Player stopped, 5 seconds casting, 10 seconds cooldown

        // Protector helps the player by stopping Evilman
        protector.UseStopEvilmanPower(player);  // Stop Evilman, 5 seconds casting, 10 seconds cooldown
    }
}
