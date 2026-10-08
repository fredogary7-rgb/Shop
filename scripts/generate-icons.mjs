import sharp from "sharp";

// Icône Apple Touch (iPhone / iPad) — fond sombre plein, iOS arrondit les coins
await sharp("public/logo-mark.svg")
  .resize(180, 180)
  .flatten({ background: "#111111" })
  .png()
  .toFile("src/app/apple-icon.png");

// Emblème carré (fond transparent)
await sharp("public/logo-mark.svg")
  .resize(512, 512)
  .png()
  .toFile("public/logo-mark.png");

// Logo horizontal — texte foncé, fond transparent
await sharp("public/logo.svg")
  .resize(1560, 360)
  .png()
  .toFile("public/logo.png");

// Logo horizontal — texte clair, fond sombre
await sharp("public/logo-light.svg")
  .resize(1560, 360)
  .flatten({ background: "#111111" })
  .png()
  .toFile("public/logo-light.png");

console.log("✅ Icônes PNG générées (apple-icon + logo-mark + logo + logo-light)");
