"""
Script để thêm slug field cho categories trong MongoDB
Chạy: python update-categories-slug.py
"""

from pymongo import MongoClient
from datetime import datetime

# Kết nối MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['shopprr']
categories_collection = db['categories']

# Category mappings với slug
category_mappings = [
    {"name": "Shirts & Polos", "slug": "shirts-polos"},
    {"name": "Bottoms", "slug": "bottoms"},
    {"name": "Outerwear", "slug": "outerwear"},
    {"name": "Innerwear & Underwear", "slug": "innerwear-underwear"},
    {"name": "Shoes", "slug": "shoes"},
    {"name": "Accessories", "slug": "accessories"},
    {"name": "Sportswear", "slug": "sportswear"},
    {"name": "Formal Wear", "slug": "formal-wear"},
    {"name": "Casual Wear", "slug": "casual-wear"},
    {"name": "Winter Collection", "slug": "winter-collection"},
    {"name": "Summer Collection", "slug": "summer-collection"}
]

print("🔄 Updating categories with slug field...\n")

for mapping in category_mappings:
    result = categories_collection.update_many(
        {"name": mapping["name"]},
        {
            "$set": {
                "slug": mapping["slug"],
                "updatedAt": datetime.now()
            }
        }
    )
    
    if result.modified_count > 0:
        print(f'✅ Updated "{mapping["name"]}" with slug: "{mapping["slug"]}"')
    else:
        print(f'⏭️  Skipped "{mapping["name"]}" (not found or already updated)')

print("\n✨ Done! All categories updated with slug field.")
print("\n📋 Current categories:")

for category in categories_collection.find({}, {"name": 1, "slug": 1, "_id": 0}):
    print(f"  • {category.get('name')} → {category.get('slug', 'NO SLUG')}")

client.close()
