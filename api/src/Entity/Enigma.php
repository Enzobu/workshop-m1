<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Enum\DifficultyType;
use App\Enum\StatusType;
use App\Repository\EnigmaRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EnigmaRepository::class)]
#[ApiResource]
class Enigma
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 255, enumType: StatusType::class)]
    private ?StatusType $status = null;

    #[ORM\Column(length: 255, enumType: DifficultyType::class)]
    private ?DifficultyType $difficulty = null;

    /**
     * @var Collection<int, Game>
     */
    #[ORM\ManyToMany(targetEntity: Game::class, inversedBy: 'enigmas')]
    private Collection $games;

    #[ORM\Column]
    private ?int $number = null;

    public function __construct()
    {
        $this->games = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

        public function getStatus(): ?StatusType
    {
        return $this->status;
    }

    public function setStatus(StatusType $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getDifficulty(): ?DifficultyType
    {
        return $this->difficulty;
    }

    public function setDifficulty(DifficultyType $difficulty): static
    {
        $this->difficulty = $difficulty;

        return $this;
    }

    /**
     * @return Collection<int, Game>
     */
    public function getGames(): Collection
    {
        return $this->games;
    }

    public function addGame(Game $game): static
    {
        if (!$this->games->contains($game)) {
            $this->games->add($game);
        }

        return $this;
    }

    public function removeGame(Game $game): static
    {
        $this->games->removeElement($game);

        return $this;
    }

    public function getNumber(): ?int
    {
        return $this->number;
    }

    public function setNumber(int $number): static
    {
        $this->number = $number;

        return $this;
    }
}
