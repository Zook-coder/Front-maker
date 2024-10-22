using System;
using System.Threading;

enum PlayerStatus
{
    Normal,
    Stopped,
    SlowMotion,
    Invisible,
    SpeedBoost,
    Blocked
}

class Player
{
    public string Name { get; private set; }
    public PlayerStatus Status { get; private set; }
    public int[] Position { get; private set; } = new int[2]; // [x, y]

    public Player(string name)
    {
        Name = name;
        Status = PlayerStatus.Normal;
        Position[0] = 0; // X position
        Position[1] = 0; // Y position
    }

    public void MoveLeft()
    {
        if (Status == PlayerStatus.Blocked)
        {
            Console.WriteLine($"{Name} is blocked and cannot move left.");
        }
        else if (Status == PlayerStatus.Stopped)
        {
            Console.WriteLine($"{Name} is stopped and cannot move left.");
        }
        else
        {
            Position[0] -= 1;
            Console.WriteLine($"{Name} moves left. New position: ({Position[0]}, {Position[1]})");
        }
    }

    public void MoveRight()
    {
        if (Status == PlayerStatus.Blocked)
        {
            Console.WriteLine($"{Name} is blocked and cannot move right.");
        }
        else if (Status == PlayerStatus.Stopped)
        {
            Console.WriteLine($"{Name} is stopped and cannot move right.");
        }
        else
        {
            Position[0] += 1;
            Console.WriteLine($"{Name} moves right. New position: ({Position[0]}, {Position[1]})");
        }
    }

    public void MoveForward()
    {
        if (Status == PlayerStatus.Blocked)
        {
            Console.WriteLine($"{Name} is blocked and cannot move forward.");
        }
        else if (Status == PlayerStatus.Stopped)
        {
            Console.WriteLine($"{Name} is stopped and cannot move forward.");
        }
        else
        {
            Position[1] += 1;
            Console.WriteLine($"{Name} moves forward. New position: ({Position[0]}, {Position[1]})");
        }
    }

    public void MoveBackward()
    {
        if (Status == PlayerStatus.Blocked)
        {
            Console.WriteLine($"{Name} is blocked and cannot move backward.");
        }
        else if (Status == PlayerStatus.Stopped)
        {
            Console.WriteLine($"{Name} is stopped and cannot move backward.");
        }
        else
        {
            Position[1] -= 1;
            Console.WriteLine($"{Name} moves backward. New position: ({Position[0]}, {Position[1]})");
        }
    }

    public void Jump()
    {
        if (Status == PlayerStatus.Blocked)
        {
            Console.WriteLine($"{Name} is blocked and cannot jump.");
        }
        else if (Status == PlayerStatus.Stopped)
        {
            Console.WriteLine($"{Name} is stopped and cannot jump.");
        }
        else
        {
            Console.WriteLine($"{Name} jumps!");
            // Simulate jump by moving up and forward
            Position[1] += 2; // Simulate upward jump
            Position[0] += 2; // Simulate forward movement
            Console.WriteLine($"{Name} is at position: ({Position[0]}, {Position[1]}) - Jumping");
            Thread.Sleep(500); // Short delay to simulate jump duration
            Position[1] -= 2; // Simulate landing
            Console.WriteLine($"{Name} lands. New position: ({Position[0]}, {Position[1]})");
        }
    }
}

class Program
{
    static void Main(string[] args)
    {
        Player player = new Player("Martin");

        player.MoveLeft();   // Move left
        player.Jump();       // Player jumps
        player.MoveRight();  // Move right
        player.Jump();       // Player jumps again
    }
}
