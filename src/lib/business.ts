export const CONTACT = {
  name: "Restoran Kvaka",
  street: "Žorovica ul. 3",
  city: "47000 Karlovac",
  phoneDisplay: "047 416 616",
  phoneIntl: "+385 47 416 616",
  phoneHref: "tel:+38547416616",
  email: "info@restoran-kvaka.hr",
  lat: 45.4952234,
  lon: 15.5361421,
} as const;

export const MAP_SRC = `https://www.openstreetmap.org/export/embed.html?bbox=${
  CONTACT.lon - 0.004
}%2C${CONTACT.lat - 0.0025}%2C${CONTACT.lon + 0.004}%2C${CONTACT.lat + 0.0025}&layer=mapnik&marker=${
  CONTACT.lat
}%2C${CONTACT.lon}`;

export const OPENING_HOURS = [
  { short: "Pon", day: "Ponedjeljak", hours: "Zatvoreno" },
  { short: "Uto", day: "Utorak", hours: "09 – 22" },
  { short: "Sri", day: "Srijeda", hours: "09 – 22" },
  { short: "Čet", day: "Četvrtak", hours: "09 – 22" },
  { short: "Pet", day: "Petak", hours: "09 – 22" },
  { short: "Sub", day: "Subota", hours: "09 – 22" },
  { short: "Ned", day: "Nedjelja", hours: "09 – 21" },
] as const;
