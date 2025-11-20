#!/usr/bin/env python3
"""
Script to import JSON data from mongodb_collections folder to shopprr database
"""

import json
import os
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime

# MongoDB connection
MONGODB_URI = "mongodb://localhost:27017/"
DATABASE_NAME = "shopprr"

# Collections to import
COLLECTIONS = [
    "users",
    "products",
    "categories",
    "orders",
    "reviews",
    "testimonials"
]

def convert_mongodb_json(obj):
    """Convert MongoDB Extended JSON to Python objects"""
    if isinstance(obj, dict):
        # Convert $oid to ObjectId
        if "$oid" in obj:
            return ObjectId(obj["$oid"])
        # Convert $date to datetime
        if "$date" in obj:
            return datetime.fromisoformat(obj["$date"].replace('Z', '+00:00'))
        # Recursively convert nested objects
        return {k: convert_mongodb_json(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_mongodb_json(item) for item in obj]
    return obj

def import_collection(db, collection_name):
    """Import a single collection from JSON file"""
    json_file = f"clothing-backend/mongodb_collections/{collection_name}.json"
    
    if not os.path.exists(json_file):
        print(f"⚠️  File not found: {json_file}")
        return False
    
    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if not data:
            print(f"⚠️  No data in {collection_name}.json")
            return False
        
        # Convert MongoDB Extended JSON format
        converted_data = convert_mongodb_json(data)
        
        # Drop existing collection
        db[collection_name].drop()
        print(f"🗑️  Dropped old {collection_name} collection")
        
        # Insert new data
        result = db[collection_name].insert_many(converted_data)
        print(f"✅ Imported {len(result.inserted_ids)} documents to {collection_name}")
        return True
        
    except Exception as e:
        print(f"❌ Error importing {collection_name}: {str(e)}")
        return False

def main():
    print("\n" + "="*50)
    print("   IMPORT DATA TO DATABASE: shopprr")
    print("="*50 + "\n")
    
    # Connect to MongoDB
    try:
        client = MongoClient(MONGODB_URI)
        db = client[DATABASE_NAME]
        
        # Test connection
        client.server_info()
        print(f"✅ Connected to MongoDB: {MONGODB_URI}")
        print(f"📊 Database: {DATABASE_NAME}\n")
        
    except Exception as e:
        print(f"❌ Cannot connect to MongoDB: {str(e)}")
        print("\n💡 Make sure MongoDB is running!")
        return
    
    # Import each collection
    success_count = 0
    for collection_name in COLLECTIONS:
        print(f"\n📦 Importing {collection_name}...")
        if import_collection(db, collection_name):
            success_count += 1
    
    # Summary
    print("\n" + "="*50)
    print(f"   SUMMARY: {success_count}/{len(COLLECTIONS)} collections imported")
    print("="*50)
    
    # Show counts
    print("\n📊 Collection counts:")
    for collection_name in COLLECTIONS:
        count = db[collection_name].count_documents({})
        print(f"   - {collection_name}: {count} documents")
    
    print("\n✅ Done!\n")
    
    client.close()

if __name__ == "__main__":
    main()
