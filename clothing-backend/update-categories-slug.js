// Script để thêm slug cho categories trong MongoDB
// Chạy script này bằng: mongosh shopprr update-categories-slug.js

// Connect to database
const db = db.getSiblingDB('shopprr');

// Category mappings với slug
const categoryMappings = [
    { name: "Shirts & Polos", slug: "shirts-polos" },
    { name: "Bottoms", slug: "bottoms" },
    { name: "Outerwear", slug: "outerwear" },
    { name: "Innerwear & Underwear", slug: "innerwear-underwear" },
    { name: "Shoes", slug: "shoes" },
    { name: "Accessories", slug: "accessories" },
    { name: "Sportswear", slug: "sportswear" },
    { name: "Formal Wear", slug: "formal-wear" },
    { name: "Casual Wear", slug: "casual-wear" },
    { name: "Winter Collection", slug: "winter-collection" },
    { name: "Summer Collection", slug: "summer-collection" }
];

print("🔄 Updating categories with slug field...\n");

categoryMappings.forEach(mapping => {
    const result = db.categories.updateMany(
        { name: mapping.name },
        { 
            $set: { 
                slug: mapping.slug,
                updatedAt: new Date()
            } 
        }
    );
    
    if (result.modifiedCount > 0) {
        print(`✅ Updated "${mapping.name}" with slug: "${mapping.slug}"`);
    } else {
        print(`⏭️  Skipped "${mapping.name}" (not found or already updated)`);
    }
});

print("\n✨ Done! All categories updated with slug field.");
print("\n📋 Current categories:");
db.categories.find({}, { name: 1, slug: 1, _id: 0 }).forEach(printjson);
