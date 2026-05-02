import { getDb } from "../api/queries/connection";
import { rooms, siteSettings } from "./schema";

async function seed() {
  const db = getDb();

  // Seed rooms
  const existingRooms = await db.select().from(rooms);
  if (existingRooms.length === 0) {
    await db.insert(rooms).values([
      {
        name: "Cliffside Suite",
        slug: "cliffside-suite",
        description: "Perched on the edge of the cliff, this extraordinary suite features a private balcony with floor-to-ceiling windows framing uninterrupted Mediterranean views. Hand-painted Vietri ceramic tiles in cobalt and gold adorn the spacious bathroom, while the bedroom opens onto a sun-drenched terrace. Wake to the sound of waves and the scent of lemon blossoms.",
        shortDesc: "Private balconies with floor-to-ceiling sea views and hand-painted Vietri ceramics",
        pricePerNight: "850.00",
        maxGuests: 2,
        imageUrl: "/assets/suite-interior.jpg",
        gallery: JSON.stringify(["/assets/suite-interior.jpg", "/assets/terrace-sunset.jpg"]),
        amenities: JSON.stringify(["Sea View", "Private Balcony", "King Bed", "Air Conditioning", "Free WiFi", "Minibar", "Rain Shower", "Vietri Ceramics"]),
        isFeatured: true,
      },
      {
        name: "Limonaia Deluxe",
        slug: "limonaia-deluxe",
        description: "Housed in a restored 18th-century lemon house, this unique suite combines ancient stone walls with contemporary luxury. The vaulted ceilings and arched windows create a cathedral-like atmosphere, while the private garden offers direct access to our heritage lemon grove. A perfect sanctuary for those seeking authentic Amalfi charm.",
        shortDesc: "Restored lemon house suite with private garden and heritage lemon grove access",
        pricePerNight: "680.00",
        maxGuests: 2,
        imageUrl: "/assets/spa-limonaia.jpg",
        gallery: JSON.stringify(["/assets/spa-limonaia.jpg", "/assets/lemons.jpg"]),
        amenities: JSON.stringify(["Garden View", "Heritage Suite", "King Bed", "Air Conditioning", "Free WiFi", "Fireplace", "Soaking Tub", "Private Garden"]),
        isFeatured: true,
      },
      {
        name: "Terrazza Panorama",
        slug: "terrazza-panorama",
        description: "The jewel of Terrazza di Sole. This expansive suite occupies the top floor with a wraparound terrace offering 270-degree views of the coastline. The outdoor jacuzzi and private dining area make this the ultimate choice for celebrating special moments. Interiors feature locally crafted furniture and original artwork by Amalfi Coast artists.",
        shortDesc: "Top-floor suite with wraparound terrace, jacuzzi, and 270-degree coastal views",
        pricePerNight: "1250.00",
        maxGuests: 3,
        imageUrl: "/assets/terrace-sunset.jpg",
        gallery: JSON.stringify(["/assets/terrace-sunset.jpg", "/assets/dining.jpg"]),
        amenities: JSON.stringify(["Panoramic View", "Private Jacuzzi", "King Bed", "Air Conditioning", "Free WiFi", "Outdoor Dining", "Butler Service", "Original Artwork"]),
        isFeatured: true,
      },
      {
        name: "Coastal Garden Room",
        slug: "coastal-garden",
        description: "Nestled among olive trees and bougainvillea, this ground-floor room opens directly onto a fragrant Mediterranean garden. The private patio is furnished with comfortable loungers perfect for afternoon reading. Inside, crisp white linens and locally woven textiles create a serene, refreshing atmosphere.",
        shortDesc: "Ground-floor room with private garden patio among olive trees",
        pricePerNight: "420.00",
        maxGuests: 2,
        imageUrl: "/assets/lemons.jpg",
        gallery: JSON.stringify(["/assets/lemons.jpg", "/assets/path-of-gods.jpg"]),
        amenities: JSON.stringify(["Garden View", "Private Patio", "Queen Bed", "Air Conditioning", "Free WiFi", "Nespresso Machine", "Walk-in Shower"]),
        isFeatured: false,
      },
    ]);
    console.log("Seeded rooms");
  }

  // Seed site settings
  const existingSettings = await db.select().from(siteSettings);
  if (existingSettings.length === 0) {
    await db.insert(siteSettings).values([
      { key: "hotel_name", value: "Terrazza di Sole" },
      { key: "tagline", value: "La dolce vita, elevated." },
      { key: "contact_email", value: "concierge@terrazzadisole.com" },
      { key: "contact_phone", value: "+39 089 871 211" },
      { key: "address", value: "Via Smeraldo 7, Ravello, Amalfi Coast, Italy" },
    ]);
    console.log("Seeded site settings");
  }

  console.log("Seed complete!");
}

seed().catch(console.error);
