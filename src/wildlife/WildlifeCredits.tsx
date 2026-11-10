// Source credits shown at the bottom of the wildlife pages
const WildlifeCredits = () => (
  <footer className="mt-16 border-t border-[#e2dccf] pt-6 text-xs leading-relaxed text-[#8a8278]">
    Species data from{" "}
    <a
      href="https://www.inaturalist.org"
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-2"
    >
      iNaturalist
    </a>{" "}
    and{" "}
    <a
      href="https://www.wikipedia.org"
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-2"
    >
      Wikipedia
    </a>{" "}
    (CC BY-SA). Reference photos © their photographers, used under their
    licenses. Place names ©{" "}
    <a
      href="https://www.openstreetmap.org/copyright"
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-2"
    >
      OpenStreetMap contributors
    </a>
    .
  </footer>
);

export default WildlifeCredits;
