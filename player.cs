using System;

public enum PlayerStatus
{
    Normal,
    Stopped,
    SlowMotion,
    Invisible,
    SpeedBoost,
    Blocked
}

public class Player
{
    public string Name { get; set; }
    public string Objective { get; set; }
    public int[] Position { get; set; }
    public PlayerStatus Status { get; set; }

    public Player(string name, string objective)
    {
        Name = name;
        Objective = objective;
        Position = new int[] { 0, 0 };  // x, y coordinates
        Status = PlayerStatus.Normal;
    }

    public void MoveLeft()
    {
        if (IsBlockedOrStopped())
            return;

        Position[0] -= 1;
        Console.WriteLine($"{Name} moves left. New position: [{Position[0]}, {Position[1]}]");
    }

    public void MoveRight()
    {
        if (IsBlockedOrStopped())
            return;

        Position[0] += 1;
        Console.WriteLine($"{Name} moves right. New position: [{Position[0]}, {Position[1]}]");
    }

    public void MoveForward()
    {
        if (IsBlockedOrStopped())
            return;

        Position[1] += 1;
        Console.WriteLine($"{Name} moves forward. New position: [{Position[0]}, {Position[1]}]");
    }

    public void MoveBackward()
    {
        if (IsBlockedOrStopped())
            return;

        Position[1] -= 1;
        Console.WriteLine($"{Name} moves backward. New position: [{Position[0]}, {Position[1]}]");
    }

    public void Jump()
    {
        if (IsBlockedOrStopped())
            return;

        Console.WriteLine($"{Name} jumps!");
    }

    public void Dash()
    {
        if (IsBlockedOrStopped())
            return;

        Position[1] += 2;
        Console.WriteLine($"{Name} dashes forward. New position: [{Position[0]}, {Position[1]}]");
    }

    public void ChangeStatus(PlayerStatus newStatus)
    {
        Status = newStatus;
        Console.WriteLine($"{Name} is now {Status}.");
    }

    private bool IsBlockedOrStopped()
    {
        if (Status == PlayerStatus.Blocked)
        {
            Console.WriteLine($"{Name} is blocked and cannot move.");
            return true;
        }
        if (Status == PlayerStatus.Stopped)
        {
            Console.WriteLine($"{Name} is stopped and cannot move.");
            return true;
        }
        return false;
    }
}

// Example usage
public class Program
{
    public static void Main(string[] args)
    {
        Player player = new Player("Alex", "Find a job");

        player.MoveForward(); // Normal state
        player.ChangeStatus(PlayerStatus.Blocked);
        player.MoveForward(); // Blocked state
        player.ChangeStatus(PlayerStatus.SpeedBoost);
        player.Dash(); // Speed boost state
    }
}
