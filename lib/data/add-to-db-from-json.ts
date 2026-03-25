import { connectToMongodb } from '@/server/connect'
import MamarModel from '@/server/models/mamar.model'
import json from './קריאות-חדשות-בתורה.json'


export default async function addToDb() {
   await connectToMongodb()
   await MamarModel.create(json)
}