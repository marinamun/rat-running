import { Link } from "react-router-dom";

import animalsHero from "../assets/animalsHero.png";
import learnIcon from "../assets/learnIcon.png";
import animalsIcon from "../assets/animalsIcon.png";
import helpIcon from "../assets/helpIcon.png";
import volunteerIcon from "../assets/volunteerIcon.png";
import shopIcon from "../assets/shopIcon.png";

const Homepage = () => {
  return (
    <div className="min-h-screen bg-white font-mono text-black">
      {/* =========================================================
          HEADER
      ========================================================= */}
      <header className="w-full">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
          {/* LOGO */}
          <Link
            to="/"
            className="flex flex-col text-sm font-bold leading-[0.9]"
          >
            <span>PAWS</span>
            <span>& CLAWS</span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden items-center gap-8 text-xs uppercase md:flex">
            <Link to="/learn" className="transition-opacity hover:opacity-50">
              Learn
            </Link>

            <Link to="/animals" className="transition-opacity hover:opacity-50">
              Animals
            </Link>

            <Link to="/about" className="transition-opacity hover:opacity-50">
              About
            </Link>
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-5 text-xs uppercase">
            <button className="hidden transition-opacity hover:opacity-50 md:block">
              Search
            </button>

            <button className="transition-opacity hover:opacity-50">
              Menu
            </button>
          </div>
        </div>

        <div className="border-b border-black" />
      </header>

      {/* =========================================================
          MAIN
      ========================================================= */}
      <main>
        {/* =======================================================
            HERO
        ======================================================= */}
        <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-16 md:grid-cols-2 md:gap-8 md:py-24 lg:px-10 lg:py-28">
          {/* HERO TEXT */}
          <div className="flex flex-col items-start">
            {/* BREADCRUMB */}
            <div className="mb-8 flex items-center gap-2 text-[10px] uppercase tracking-wider text-gray">
              <Link to="/learn" className="transition-colors hover:text-black">
                Explore
              </Link>

              <span>/</span>

              <Link to="/learn" className="transition-colors hover:text-black">
                Learn
              </Link>

              <span>/</span>

              <Link to="/about" className="transition-colors hover:text-black">
                Care
              </Link>
            </div>

            {/* HERO HEADING */}
            <h1 className="max-w-2xl text-5xl font-bold leading-[0.9] tracking-[-0.06em] sm:text-6xl md:text-6xl lg:text-7xl xl:text-8xl">
              THE ANIMAL
              <br />
              WORLD IS WORTH
              <br />
              KNOWING.
            </h1>

            {/* HERO DESCRIPTION */}
            <p className="mt-8 max-w-md text-sm leading-relaxed text-gray">
              Free resources on wildlife, zoology, ethology and animal welfare —
              for curious minds and kinder actions.
            </p>

            {/* HERO CTA */}
            <Link
              to="/learn"
              className="mt-8 border-b border-black pb-1 text-xs uppercase transition-opacity hover:opacity-50"
            >
              Explore resources →
            </Link>
          </div>

          {/* HERO ILLUSTRATION */}
          <div className="flex items-center justify-center md:justify-end">
            <img
              src={animalsHero}
              alt="Illustration of different animals"
              className="w-full max-w-md object-contain lg:max-w-lg"
            />
          </div>
        </section>

        {/* =======================================================
            DIVIDER
        ======================================================= */}
        <div className="border-b border-black" />

        {/* =======================================================
            MAIN NAVIGATION
        ======================================================= */}
        <section className="mx-auto grid max-w-7xl grid-cols-1 px-6 sm:grid-cols-2 lg:grid-cols-5 lg:px-10">
          {/* LEARN */}
          <div className="border-b border-black py-10 sm:border-r sm:px-6 lg:border-b-0">
            <div className="flex h-24 items-center justify-center">
              <img
                src={learnIcon}
                alt=""
                className="h-full w-auto object-contain"
              />
            </div>

            <h3 className="mt-10 text-sm font-bold uppercase">Learn</h3>

            <p className="mt-3 max-w-[180px] text-xs leading-relaxed text-gray">
              Free educational resources.
            </p>

            <Link
              to="/learn"
              className="mt-6 inline-block text-sm transition-opacity hover:opacity-50"
            >
              →
            </Link>
          </div>

          {/* ANIMALS */}
          <div className="border-b border-black py-10 sm:px-6 lg:border-b-0 lg:border-r">
            <div className="flex h-24 items-center justify-center">
              <img
                src={animalsIcon}
                alt=""
                className="h-full w-auto object-contain"
              />
            </div>

            <h3 className="mt-10 text-sm font-bold uppercase">Animals</h3>

            <p className="mt-3 max-w-[180px] text-xs leading-relaxed text-gray">
              Explore the animal catalogue.
            </p>

            <Link
              to="/animals"
              className="mt-6 inline-block text-sm transition-opacity hover:opacity-50"
            >
              →
            </Link>
          </div>

          {/* HELP */}
          <div className="border-b border-black py-10 sm:border-r sm:px-6 lg:border-b-0">
            <div className="flex h-24 items-center justify-center">
              <img
                src={helpIcon}
                alt=""
                className="h-full w-auto object-contain"
              />
            </div>

            <h3 className="mt-10 text-sm font-bold uppercase">Help</h3>

            <p className="mt-3 max-w-[180px] text-xs leading-relaxed text-gray">
              Support animals and conservation.
            </p>

            <Link
              to="/help"
              className="mt-6 inline-block text-sm transition-opacity hover:opacity-50"
            >
              →
            </Link>
          </div>

          {/* VOLUNTEER */}
          <div className="border-b border-black py-10 sm:px-6 lg:border-b-0 lg:border-r">
            <div className="flex h-24 items-center justify-center">
              <img
                src={volunteerIcon}
                alt=""
                className="h-full w-auto object-contain"
              />
            </div>

            <h3 className="mt-10 text-sm font-bold uppercase">Volunteer</h3>

            <p className="mt-3 max-w-[180px] text-xs leading-relaxed text-gray">
              Give your time and make an impact.
            </p>

            <Link
              to="/volunteer"
              className="mt-6 inline-block text-sm transition-opacity hover:opacity-50"
            >
              →
            </Link>
          </div>

          {/* SHOP */}
          <div className="py-10 sm:px-6">
            <div className="flex h-24 items-center justify-center">
              <img
                src={shopIcon}
                alt=""
                className="h-full w-auto object-contain"
              />
            </div>

            <h3 className="mt-10 text-sm font-bold uppercase">Shop</h3>

            <p className="mt-3 max-w-[180px] text-xs leading-relaxed text-gray">
              Merch that gives back.
            </p>

            <Link
              to="/shop"
              className="mt-6 inline-block text-sm transition-opacity hover:opacity-50"
            >
              →
            </Link>
          </div>
        </section>

        {/* DIVIDER */}
        <div className="border-b border-black" />

        {/* =======================================================
            RESOURCE LIBRARY
        ======================================================= */}
        <section
          id="resources"
          className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28"
        >
          {/* SECTION HEADER */}
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-[10px] uppercase tracking-wider text-gray">
                Curated resources
              </p>

              <h2 className="text-3xl font-bold uppercase tracking-[-0.04em] md:text-5xl">
                From the library
              </h2>
            </div>

            <Link
              to="/learn"
              className="text-xs uppercase transition-opacity hover:opacity-50"
            >
              View all resources →
            </Link>
          </div>

          {/* RESOURCE GRID */}
          <div className="mt-12 grid grid-cols-1 border-t border-black sm:grid-cols-2 lg:grid-cols-4">
            {/* RESOURCE 01 */}
            <div className="border-b border-black py-8 sm:border-r sm:px-6 lg:px-6">
              <span className="text-[10px] uppercase text-gray">Book</span>

              <h3 className="mt-16 text-lg font-bold uppercase leading-tight">
                Animal Behaviour:
                <br />
                An Introduction
              </h3>

              <p className="mt-5 text-xs leading-relaxed text-gray">
                A clear introduction to understanding why animals behave the way
                they do.
              </p>

              <Link
                to="/learn/animal-behaviour"
                className="mt-8 inline-block text-xs uppercase transition-opacity hover:opacity-50"
              >
                Read more →
              </Link>
            </div>

            {/* RESOURCE 02 */}
            <div className="border-b border-black py-8 sm:px-6 lg:border-r lg:px-6">
              <span className="text-[10px] uppercase text-gray">
                Documentary
              </span>

              <h3 className="mt-16 text-lg font-bold uppercase leading-tight">
                Our Planet
              </h3>

              <p className="mt-5 text-xs leading-relaxed text-gray">
                A look at the natural world and the lives that depend on it.
              </p>

              <Link
                to="/learn/our-planet"
                className="mt-8 inline-block text-xs uppercase transition-opacity hover:opacity-50"
              >
                Read more →
              </Link>
            </div>

            {/* RESOURCE 03 */}
            <div className="border-b border-black py-8 sm:border-r sm:px-6 lg:border-b-0 lg:border-r-0">
              <span className="text-[10px] uppercase text-gray">Course</span>

              <h3 className="mt-16 text-lg font-bold uppercase leading-tight">
                Wildlife
                <br />
                Conservation Basics
              </h3>

              <p className="mt-5 text-xs leading-relaxed text-gray">
                Learn about conservation challenges and how you can help.
              </p>

              <Link
                to="/learn/conservation"
                className="mt-8 inline-block text-xs uppercase transition-opacity hover:opacity-50"
              >
                Read more →
              </Link>
            </div>

            {/* RESOURCE 04 */}
            <div className="py-8 sm:px-6">
              <span className="text-[10px] uppercase text-gray">Article</span>

              <h3 className="mt-16 text-lg font-bold uppercase leading-tight">
                The Importance
                <br />
                of Pollinators
              </h3>

              <p className="mt-5 text-xs leading-relaxed text-gray">
                Small creatures, big impact. Discover why pollinators matter.
              </p>

              <Link
                to="/learn/pollinators"
                className="mt-8 inline-block text-xs uppercase transition-opacity hover:opacity-50"
              >
                Read more →
              </Link>
            </div>
          </div>
        </section>

        {/* DIVIDER */}
        <div className="border-b border-black" />

        {/* =======================================================
            ANIMALS
        ======================================================= */}
        <section
          id="animals"
          className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28"
        >
          {/* SECTION HEADER */}
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-[10px] uppercase tracking-wider text-gray">
                Explore the species
              </p>

              <h2 className="text-3xl font-bold uppercase tracking-[-0.04em] md:text-5xl">
                Animals
              </h2>
            </div>

            <Link
              to="/animals"
              className="text-xs uppercase transition-opacity hover:opacity-50"
            >
              View all animals →
            </Link>
          </div>

          {/* ANIMAL GRID */}
          <div className="mt-12 grid grid-cols-1 border-t border-black sm:grid-cols-2 lg:grid-cols-5">
            {/* WOLF */}
            <div className="border-b border-black py-8 sm:border-r sm:px-5 lg:border-b-0 lg:px-5">
              <span className="text-[10px] text-gray">01</span>

              <div className="my-12 flex h-32 items-center justify-center">
                {/* animal illustration */}
              </div>

              <h3 className="text-sm font-bold uppercase">Grey Wolf</h3>

              <p className="mt-2 text-xs italic">Canis lupus</p>

              <p className="mt-4 text-[10px] leading-relaxed text-gray">
                MAMMAL / CARNIVORE / ENDANGERED
              </p>

              <Link
                to="/animals/grey-wolf"
                className="mt-6 inline-block text-sm transition-opacity hover:opacity-50"
              >
                →
              </Link>
            </div>

            {/* TURTLE */}
            <div className="border-b border-black py-8 sm:px-5 lg:border-b-0 lg:border-r lg:px-5">
              <span className="text-[10px] text-gray">02</span>

              <div className="my-12 flex h-32 items-center justify-center">
                {/* animal illustration */}
              </div>

              <h3 className="text-sm font-bold uppercase">Green Sea Turtle</h3>

              <p className="mt-2 text-xs italic">Chelonia mydas</p>

              <p className="mt-4 text-[10px] leading-relaxed text-gray">
                REPTILE / MARINE / ENDANGERED
              </p>

              <Link
                to="/animals/green-sea-turtle"
                className="mt-6 inline-block text-sm transition-opacity hover:opacity-50"
              >
                →
              </Link>
            </div>

            {/* OWL */}
            <div className="border-b border-black py-8 sm:border-r sm:px-5 lg:border-b-0 lg:px-5">
              <span className="text-[10px] text-gray">03</span>

              <div className="my-12 flex h-32 items-center justify-center">
                {/* animal illustration */}
              </div>

              <h3 className="text-sm font-bold uppercase">Barn Owl</h3>

              <p className="mt-2 text-xs italic">Tyto alba</p>

              <p className="mt-4 text-[10px] leading-relaxed text-gray">
                BIRD / NOCTURNAL / VULNERABLE
              </p>

              <Link
                to="/animals/barn-owl"
                className="mt-6 inline-block text-sm transition-opacity hover:opacity-50"
              >
                →
              </Link>
            </div>

            {/* ELEPHANT */}
            <div className="border-b border-black py-8 sm:px-5 lg:border-b-0 lg:border-r lg:px-5">
              <span className="text-[10px] text-gray">04</span>

              <div className="my-12 flex h-32 items-center justify-center">
                {/* animal illustration */}
              </div>

              <h3 className="text-sm font-bold uppercase">African Elephant</h3>

              <p className="mt-2 text-xs italic">Loxodonta africana</p>

              <p className="mt-4 text-[10px] leading-relaxed text-gray">
                MAMMAL / HERBIVORE / VULNERABLE
              </p>

              <Link
                to="/animals/african-elephant"
                className="mt-6 inline-block text-sm transition-opacity hover:opacity-50"
              >
                →
              </Link>
            </div>

            {/* BUTTERFLY */}
            <div className="py-8 sm:px-5 lg:px-5">
              <span className="text-[10px] text-gray">05</span>

              <div className="my-12 flex h-32 items-center justify-center">
                {/* animal illustration */}
              </div>

              <h3 className="text-sm font-bold uppercase">Monarch Butterfly</h3>

              <p className="mt-2 text-xs italic">Danaus plexippus</p>

              <p className="mt-4 text-[10px] leading-relaxed text-gray">
                INSECT / POLLINATOR / ENDANGERED
              </p>

              <Link
                to="/animals/monarch-butterfly"
                className="mt-6 inline-block text-sm transition-opacity hover:opacity-50"
              >
                →
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <div className="border-b border-black" />

      <footer className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12 md:flex-row md:items-end md:justify-between lg:px-10">
        {/* FOOTER BRAND */}
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

        {/* FOOTER NAV */}
        <nav className="flex gap-6 text-xs uppercase">
          <Link to="/learn" className="transition-opacity hover:opacity-50">
            Learn
          </Link>

          <Link to="/animals" className="transition-opacity hover:opacity-50">
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

export default Homepage;
