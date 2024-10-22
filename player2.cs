using System;
using System.Threading.Tasks;  // For Task.Delay to simulate time.sleep()

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
    public string Name { get; }
    public PowerType Type { get; }
    public int CastingTime { get; }    // Casting time in milliseconds
    public int Cooldown { get; }       // Cooldown in milliseconds
    private DateTime lastUsedTime;

    public Power(string name, PowerType type, int castingTime, int cooldown)
    {
        Name = name;
        Type = type;
        CastingTime = castingTime;
        Cooldown = cooldown;
        lastUsedTime = DateTime.MinValue;  // Initialized to a time in the past
    }

    public async Task Activate(Player target)
    {
        var currentTime = DateTime.Now;
        var timeSinceLastUse = (currentTime - lastUsedTime).TotalMilliseconds;

        if (timeSinceLastUse < Cooldown)
        {
            Console.WriteLine($"{Name} is still in cooldown. Wait {(Cooldown - timeSinceLastUse) / 1000.0:F2} seconds.");
            return;
        }

        Console.WriteLine($"Preparing {Name}... (casting time: {CastingTime / 1000.0:F2} seconds)");
        await Task.Delay(CastingTime);  // Simulating casting time

        // Power is now activated
        Console.WriteLine($"{Name} activated on {target.Name}!");
        lastUsedTime = DateTime.Now;  // Reset cooldown timer

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
    public string Name { get; }
    public PlayerStatus Status { get; set; }

    public Player(string name)
    {
        Name = name;
        Status = PlayerStatus.NORMAL;  // Player starts in a normal state
    }

    public void ApplyBonus(Power power)
    {
        Console.WriteLine($"{Name} receives a bonus : {power.Name}!");
        // Apply the effect of the bonus here, such as changing the player's status
    }

    public void ApplyMalus(Power power)
    {
        Console.WriteLine($"{Name} is affected by a malus : {power.Name}!");
        // Apply the effect of the malus here, such as slowing down the player
    }
}

public class Evilman
{
    public string Name { get; }
    public Power MalusPower { get; }
    public Power BlockPower { get; }

    public Evilman(string name = "Evilman")
    {
        Name = name;
        SlowMotionPower = new Power("Slow Motion Trap", PowerType.MALUS, 3000, 8000);  // 3 seconds casting, 8 seconds cooldown
        BlockPower = new Power("Block Path", PowerType.MALUS, 2000, 10000);        // 2 seconds casting, 10 seconds cooldown
    }

    public async Task UseSlowMotionPower(Player player)
    {
        Console.WriteLine($"{Name} tries to use Slow Motion power: {SlowMotionPower.Name} on {player.Name}");
        await SlowMotionPower.Activate(player);
    }

    public async Task UseBlockPower(Player player)
    {
        Console.WriteLine($"{Name} tries to block {player.Name}'s path with {BlockPower.Name}");
        await BlockPower.Activate(player);
    }
}

public class Protector
{
    public string Name { get; }
    public Power BonusPower { get; }
    public Power ShieldPower { get; }

    public Protector(string name = "Protector")
    {
        Name = name;
        SpeedPower = new Power("Speed Boost", PowerType.BONUS, 2000, 5000);      // 2 seconds casting, 5 seconds cooldown
        InvisibleShieldPower = new Power("Invisible Shield", PowerType.BONUS, 1000, 7000); // 1 second casting, 7 seconds cooldown
    }

    public async Task UseSpeedPower(Player player)
    {
        Console.WriteLine($"{Name} tries to use Speed Boost power: {SpeedPower.Name} on {player.Name}");
        await SpeedPower.Activate(player);
    }

    public async Task UseInvisibleShieldPower(Player player)
    {
        Console.WriteLine($"{Name} tries to protect {player.Name} with {InvisibleShieldPower.Name}");
        await InvisibleShieldPower.Activate(player);
    }
}

public class Program
{
    public static async Task Main(string[] args)
    {
        // Creating actors
        Player player = new Player("Alex");
        Evilman evilman = new Evilman();
        Protector protector = new Protector();

        // Evilman uses a malus power on the player
        await evilman.UseSlowMotionPower(player);  // Slow motion trap, 3 seconds casting, 8 seconds cooldown
        await Task.Delay(4000);               // Simulating time passage = 4 seconds
        await evilman.UseSlowMotionPower(player);  // Still in cooldown

        // Protector uses a bonus power on the player
        await protector.UseSpeedPower(player);  // Speed Boost, 2 seconds casting, 5 seconds cooldown
        await Task.Delay(6000);                 // Simulating time passage = 6 seconds
        await protector.UseSpeedPower(player);  // Can be used again after cooldown

        // Evilman tries to block the player
        await evilman.UseBlockPower(player);    // Block path, 2 seconds casting, 10 seconds cooldown

        // Protector protects the player with a shield
        await protector.UseInvisibleShieldPower(player); // Invisible shield, 1 second casting, 7 seconds cooldown
    }
}