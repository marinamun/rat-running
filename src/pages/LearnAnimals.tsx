import { useState } from "react";
import { Link } from "react-router-dom";

const animals = [
  {
    id: 1,
    name: "Grey Wolf",
    scientificName: "Canis lupus",
    category: "Mammal",
    habitat: "Forests / Grasslands / Tundra",
    status: "Least Concern",
    description:
      "Grey wolves are highly social carnivores that live in family groups called packs. They communicate through vocalisations, body language and scent marking.",
    facts: [
      "Wolves live in social family groups.",
      "They have an excellent sense of smell.",
      "They communicate through howls, body language and scent.",
    ],
    image: "/animals/wolf.png",
  },
  {
    id: 2,
    name: "Giraffe",
    scientificName: "Giraffa camelopardalis",
    category: "Mammal",
    habitat: "Savanna / Woodland",
    status: "Vulnerable",
    description:
      "Giraffes are the tallest living land animals. Their long necks allow them to reach vegetation high above the ground.",
    facts: [
      "Giraffes have unique coat patterns.",
      "They can sleep for very short periods.",
      "Their tongues can be around 45 cm long.",
    ],
    image: "/animals/giraffe.png",
  },
  {
    id: 3,
    name: "Orca",
    scientificName: "Orcinus orca",
    category: "Mammal",
    habitat: "Oceans",
    status: "Data Deficient",
    description:
      "Orcas are highly intelligent marine mammals that live in complex social groups. Different populations can develop distinct hunting behaviours and vocal traditions.",
    facts: [
      "Orcas are the largest members of the dolphin family.",
      "They live in complex social groups.",
      "Different groups can have distinct vocalisations.",
    ],
    image: "/animals/orca.png",
  },
  {
    id: 4,
    name: "Hamster",
    scientificName: "Cricetinae",
    category: "Mammal",
    habitat: "Grasslands / Deserts",
    status: "Varies by species",
    description:
      "Hamsters are small rodents known for their expandable cheek pouches, which they use to carry food.",
    facts: [
      "Hamsters use cheek pouches to transport food.",
      "Many species are primarily nocturnal.",
      "There are several different hamster species.",
    ],
    image: "/animals/hamster.png",
  },
  {
    id: 5,
    name: "Brown Bear",
    scientificName: "Ursus arctos",
    category: "Mammal",
    habitat: "Forests / Mountains / Tundra",
    status: "Least Concern",
    description:
      "Brown bears are large omnivorous mammals found across parts of Europe, Asia and North America. Their diets vary greatly depending on their environment and season.",
    facts: [
      "Brown bears are omnivores.",
      "Their diet changes with the seasons.",
      "They can enter periods of winter dormancy.",
    ],
    image: "/animals/brown-bear.png",
  },
  {
    id: 6,
    name: "Green Sea Turtle",
    scientificName: "Chelonia mydas",
    category: "Reptile",
    habitat: "Tropical / Subtropical Oceans",
    status: "Endangered",
    description:
      "Green sea turtles spend much of their lives in the ocean but return to land to lay their eggs.",
    facts: [
      "They migrate long distances.",
      "Females return to beaches to lay eggs.",
      "They are named for the colour of their body fat.",
    ],
    image: "/animals/green-turtle.png",
  },
  {
    id: 7,
    name: "Barn Owl",
    scientificName: "Tyto alba",
    category: "Bird",
    habitat: "Grasslands / Farmland / Woodland",
    status: "Least Concern",
    description:
      "Barn owls are nocturnal birds of prey recognised by their heart-shaped facial discs and remarkably effective hearing.",
    facts: [
      "Their facial disc helps direct sound toward their ears.",
      "They are primarily nocturnal hunters.",
      "They can hunt using sound as well as sight.",
    ],
    image: "/animals/barn-owl.png",
  },
  {
    id: 8,
    name: "African Elephant",
    scientificName: "Loxodonta africana",
    category: "Mammal",
    habitat: "Savanna / Woodland",
    status: "Endangered",
    description:
      "African elephants are highly social herbivores with complex family structures. They use their trunks for feeding, drinking, communication and many other tasks.",
    facts: [
      "Elephants live in complex social groups.",
      "Their trunks have thousands of muscles.",
      "They communicate using sounds and physical signals.",
    ],
    image: "/animals/elephant.png",
  },
  {
    id: 9,
    name: "Red Fox",
    scientificName: "Vulpes vulpes",
    category: "Mammal",
    habitat: "Forests / Grasslands / Urban Areas",
    status: "Least Concern",
    description:
      "Red foxes are adaptable carnivorous mammals found across a wide range of habitats, including cities and other human-dominated environments.",
    facts: [
      "Red foxes are highly adaptable.",
      "They have excellent hearing.",
      "They use a wide range of vocalisations.",
    ],
    image: "/animals/red-fox.png",
  },
  {
    id: 10,
    name: "Monarch Butterfly",
    scientificName: "Danaus plexippus",
    category: "Insect",
    habitat: "Grasslands / Meadows / Forest Edges",
    status: "Endangered",
    description:
      "Monarch butterflies are famous for their long-distance migrations. Their life cycle spans several generations during the annual migration.",
    facts: [
      "Monarchs undergo long-distance migrations.",
      "Their larvae feed primarily on milkweed.",
      "Their bright colours provide a warning to predators.",
    ],
    image: "/animals/monarch.png",
  },
  {
    id: 11,
    name: "Ring-tailed Lemur",
    scientificName: "Lemur catta",
    category: "Mammal",
    habitat: "Dry Forests / Scrubland",
    status: "Endangered",
    description:
      "Ring-tailed lemurs are social primates native to Madagascar. Their distinctive striped tails are used as visual signals within their groups.",
    facts: [
      "They are native to Madagascar.",
      "They live in social groups.",
      "Their tails are not prehensile.",
    ],
    image: "/animals/lemur.png",
  },
  {
    id: 12,
    name: "Axolotl",
    scientificName: "Ambystoma mexicanum",
    category: "Amphibian",
    habitat: "Freshwater",
    status: "Critically Endangered",
    description:
      "Axolotls are aquatic salamanders famous for retaining juvenile characteristics throughout adulthood and their remarkable ability to regenerate body tissues.",
    facts: [
      "Axolotls remain aquatic throughout their lives.",
      "They can regenerate several types of tissue.",
      "They are native to Mexico.",
    ],
    image: "/animals/axolotl.png",
  },
  {
    id: 13,
    name: "Tarsier",
    scientificName: "Tarsiidae",
    category: "Mammal",
    habitat: "Tropical Forests / Southeast Asia",
    status: "Varies by species",

    description:
      "It’s probably the Iron Man of the cute-animal world: the tarsier. These tiny primates live in the forests of Southeast Asia and are famous for their enormous eyes, powerful legs and surprisingly impressive hunting skills.",

    facts: [
      "Tarsiers are tiny primates found in Southeast Asia.",
      "Their huge eyes help them hunt at night.",
      "They can leap several times their own body length.",
    ],

    story:
      "For a long time, scientists weren't quite sure where tarsiers belonged on the primate family tree. They seemed to have some things in common with lemurs and lorises — but then there was the nose problem. Unlike lemurs and lorises, tarsiers have a dry nose, like monkeys and apes. Today, tarsiers are recognised as their own distinct branch of the primate lineage.",

    image:
      "https://cdn.britannica.com/28/148328-050-961326DE/eye-structure-tarsier-light-levels-animal.jpg?w=400&h=300&c=crop",
  },
];

const categories = ["All", "Mammal", "Bird", "Reptile", "Amphibian", "Insect"];

const LearnAnimals = () => {
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filteredAnimals = animals.filter((animal) => {
    const matchesCategory =
      selectedCategory === "All" || animal.category === selectedCategory;

    const matchesSearch =
      animal.name.toLowerCase().includes(search.toLowerCase()) ||
      animal.scientificName.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white font-mono text-black">
      {/* =========================================================
          HEADER
      ========================================================= */}
      <header className="w-full">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
          <Link
            to="/"
            className="flex flex-col text-sm font-bold leading-[0.9]"
          >
            <span>PAWS</span>
            <span>& CLAWS</span>
          </Link>

          <nav className="hidden items-center gap-8 text-xs uppercase md:flex">
            <Link to="/learn" className="transition-opacity hover:opacity-50">
              Learn
            </Link>

            <Link to="/animals" className="font-bold">
              Animals
            </Link>

            <Link to="/about" className="transition-opacity hover:opacity-50">
              About
            </Link>
          </nav>

          <button className="text-xs uppercase transition-opacity hover:opacity-50">
            Menu
          </button>
        </div>

        <div className="border-b border-black" />
      </header>

      {/* =========================================================
          PAGE INTRO
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <div>
            <p className="mb-5 text-[10px] uppercase tracking-wider text-gray">
              Paws & Claws / Catalogue
            </p>

            <h1 className="text-5xl font-bold uppercase leading-[0.9] tracking-[-0.06em] sm:text-6xl md:text-7xl">
              ANIMALS
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-relaxed text-gray">
              Explore the animals that share our planet. Learn about their
              behaviour, habitats, biology and the challenges they face.
            </p>
          </div>

          <p className="max-w-xs text-xs leading-relaxed text-gray md:text-right">
            {filteredAnimals.length} species
            <br />
            currently in the catalogue
          </p>
        </div>
      </section>

      {/* =========================================================
          SEARCH + FILTER
      ========================================================= */}
      <section className="border-y border-black">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-5 lg:flex-row lg:items-center lg:px-10">
          {/* SEARCH */}
          <div className="flex flex-1 items-center border border-black px-4 py-3">
            <span className="mr-3 text-xs">/</span>

            <input
              type="text"
              placeholder="Search animals..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full bg-transparent text-xs outline-none placeholder:text-gray"
            />
          </div>

          {/* CATEGORY FILTER */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`border border-black px-4 py-2 text-[10px] uppercase transition-all ${
                  selectedCategory === category
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-black hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          ANIMAL GRID
      ========================================================= */}
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAnimals.map((animal) => (
            <button
              key={animal.id}
              onClick={() => setSelectedAnimal(animal)}
              className="group text-left"
            >
              <article className="flex h-full flex-col border border-black transition-transform duration-200 hover:-translate-y-1">
                {/* IMAGE AREA */}
                <div className="flex h-64 items-center justify-center border-b border-black p-8">
                  <img
                    src={animal.image}
                    alt={animal.name}
                    className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* CARD CONTENT */}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="mb-2 text-[10px] uppercase text-gray">
                        {animal.category}
                      </p>

                      <h2 className="text-xl font-bold uppercase leading-tight">
                        {animal.name}
                      </h2>

                      <p className="mt-2 text-xs italic text-gray">
                        {animal.scientificName}
                      </p>
                    </div>

                    <span className="text-lg transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </div>

                  <div className="mt-auto pt-8">
                    <div className="border-t border-black pt-4">
                      <p className="text-[10px] uppercase leading-relaxed text-gray">
                        {animal.habitat}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            </button>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredAnimals.length === 0 && (
          <div className="border border-black py-24 text-center">
            <h2 className="text-2xl font-bold uppercase">Nothing found</h2>

            <p className="mt-4 text-xs text-gray">
              Try another animal or category.
            </p>
          </div>
        )}
      </main>

      {/* =========================================================
          ANIMAL MODAL
      ========================================================= */}
      {selectedAnimal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8"
          onClick={() => setSelectedAnimal(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto bg-white"
            onClick={(event) => event.stopPropagation()}
          >
            {/* CLOSE */}
            <button
              onClick={() => setSelectedAnimal(null)}
              className="absolute right-5 top-5 z-10 text-xl transition-opacity hover:opacity-50"
              aria-label="Close"
            >
              ×
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* MODAL IMAGE */}
              <div className="flex min-h-[350px] items-center justify-center border-b border-black p-10 md:border-b-0 md:border-r">
                <img
                  src={selectedAnimal.image}
                  alt={selectedAnimal.name}
                  className="max-h-[350px] max-w-full object-contain"
                />
              </div>

              {/* MODAL CONTENT */}
              <div className="p-8 md:p-10">
                <p className="text-[10px] uppercase tracking-wider text-gray">
                  {selectedAnimal.category}
                </p>

                <h2 className="mt-4 text-4xl font-bold uppercase leading-[0.9] tracking-[-0.04em]">
                  {selectedAnimal.name}
                </h2>

                <p className="mt-3 text-sm italic text-gray">
                  {selectedAnimal.scientificName}
                </p>

                {/* DESCRIPTION */}
                <div className="mt-10 border-t border-black pt-6">
                  <h3 className="text-[10px] font-bold uppercase">About</h3>

                  <p className="mt-4 text-sm leading-relaxed">
                    {selectedAnimal.description}
                  </p>
                </div>

                {/* DETAILS */}
                <div className="mt-8 border-t border-black pt-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-[10px] uppercase text-gray">Habitat</p>

                      <p className="mt-2 text-xs">{selectedAnimal.habitat}</p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase text-gray">
                        Conservation
                      </p>

                      <p className="mt-2 text-xs">{selectedAnimal.status}</p>
                    </div>
                  </div>
                </div>

                {/* FACTS */}
                <div className="mt-8 border-t border-black pt-6">
                  <h3 className="text-[10px] font-bold uppercase">
                    Things to know
                  </h3>

                  <div className="mt-4 space-y-3">
                    {selectedAnimal.facts.map((fact, index) => (
                      <div
                        key={index}
                        className="flex gap-3 text-xs leading-relaxed"
                      >
                        <span className="shrink-0">0{index + 1}</span>

                        <p>{fact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <div className="border-t border-black" />

      <footer className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12 md:flex-row md:items-end md:justify-between lg:px-10">
        <div>
          <Link
            to="/"
            className="flex flex-col text-sm font-bold leading-[0.9]"
          >
            <span>PAWS</span>
            <span>& CLAWS</span>
          </Link>

          <p className="mt-5 text-xs text-gray">
            Curiosity builds kinder worlds.
          </p>
        </div>

        <nav className="flex gap-6 text-xs uppercase">
          <Link to="/learn" className="transition-opacity hover:opacity-50">
            Learn
          </Link>

          <Link to="/animals" className="font-bold">
            Animals
          </Link>

          <Link to="/about" className="transition-opacity hover:opacity-50">
            About
          </Link>
        </nav>
      </footer>
    </div>
  );
};

export default LearnAnimals;
