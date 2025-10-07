<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Enum\GameDifficultyType;
use App\Enum\GameStatusType;
use App\Repository\GameRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: GameRepository::class)]
#[ApiResource]
class Game
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, enumType: GameStatusType::class)]
    private ?GameStatusType $status = null;

    #[ORM\Column(length: 255, enumType: GameDifficultyType::class)]
    private ?GameDifficultyType $difficulty = null;

    #[ORM\Column]
    private ?int $maxPlayer = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $startedAt = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $endAt = null;

    #[ORM\Column]
    private ?int $serverVersion = null;

    /**
     * @var Collection<int, Player>
     */
    #[ORM\OneToMany(targetEntity: Player::class, mappedBy: 'gameId')]
    private Collection $players;

    /**
     * @var Collection<int, Event>
     */
    #[ORM\OneToMany(targetEntity: Event::class, mappedBy: 'gameId')]
    private Collection $events;

    public function __construct()
    {
        $this->players = new ArrayCollection();
        $this->events = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStatus(): ?GameStatusType
    {
        return $this->status;
    }

    public function setStatus(GameStatusType $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getDifficulty(): ?GameDifficultyType
    {
        return $this->difficulty;
    }

    public function setDifficulty(GameDifficultyType $difficulty): static
    {
        $this->difficulty = $difficulty;

        return $this;
    }

    public function getMaxPlayer(): ?int
    {
        return $this->maxPlayer;
    }

    public function setMaxPlayer(int $maxPlayer): static
    {
        $this->maxPlayer = $maxPlayer;

        return $this;
    }

    public function getStartedAt(): ?\DateTimeImmutable
    {
        return $this->startedAt;
    }

    public function setStartedAt(\DateTimeImmutable $startedAt): static
    {
        $this->startedAt = $startedAt;

        return $this;
    }

    public function getEndAt(): ?\DateTimeImmutable
    {
        return $this->endAt;
    }

    public function setEndAt(\DateTimeImmutable $endAt): static
    {
        $this->endAt = $endAt;

        return $this;
    }

    public function getServerVersion(): ?int
    {
        return $this->serverVersion;
    }

    public function setServerVersion(int $serverVersion): static
    {
        $this->serverVersion = $serverVersion;

        return $this;
    }

    /**
     * @return Collection<int, Player>
     */
    public function getPlayers(): Collection
    {
        return $this->players;
    }

    public function addPlayer(Player $player): static
    {
        if (!$this->players->contains($player)) {
            $this->players->add($player);
            $player->setGameId($this);
        }

        return $this;
    }

    public function removePlayer(Player $player): static
    {
        if ($this->players->removeElement($player)) {
            // set the owning side to null (unless already changed)
            if ($player->getGameId() === $this) {
                $player->setGameId(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Event>
     */
    public function getEvents(): Collection
    {
        return $this->events;
    }

    public function addEvent(Event $event): static
    {
        if (!$this->events->contains($event)) {
            $this->events->add($event);
            $event->setGameId($this);
        }

        return $this;
    }

    public function removeEvent(Event $event): static
    {
        if ($this->events->removeElement($event)) {
            // set the owning side to null (unless already changed)
            if ($event->getGameId() === $this) {
                $event->setGameId(null);
            }
        }

        return $this;
    }
}
