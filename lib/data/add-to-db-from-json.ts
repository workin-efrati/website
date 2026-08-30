import { connectToMongodb } from '@/server/connect'
import MamarModel from '@/server/models/mamar.model'
import json from './הלכות-ראש-השנה-החל-בשבת.json'


export default async function addToDb() {
   try {
      console.log('Connecting to database...');
      await connectToMongodb();
      console.log('Connected. Inserting article...');
      const res = await MamarModel.create(json);
      console.log('✅ Article successfully added to database with ID:', res._id);
      process.exit(0);
   } catch (error) {
      console.error('❌ Error adding to database:', error);
      process.exit(1);
   }
}

addToDb();
