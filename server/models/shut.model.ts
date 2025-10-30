import mongoose, { Document, Model, Schema } from "mongoose";
import './tags.model'

// Define subdocument interface for FUQs (frequently asked questions)
interface Fuq {
  question: string;
  answer: string;
}

// Define main document interface
export interface IShut {
  _id: string;
  question: string;
  answer: string;
  titleQuestion?: string;
  titleStatment?: string;
  tags?: mongoose.Types.ObjectId[];
  tag?: string; 
  date?: Date;
  messagesId?: mongoose.Types.ObjectId[];
  fuqs?: Fuq[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Extend Mongoose Document for type-safe queries
export type ShutDocument = IShut & Document;

// Define schema
const shutSchema = new Schema<ShutDocument>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    titleQuestion: { type: String },
    titleStatment: { type: String },
    tags: [{ type: Schema.Types.ObjectId, ref: "tag" }],
    tag: { type: String },
    date: { type: Date, required: true, default: Date.now },
    messagesId: [{ type: Schema.Types.ObjectId, ref: "whatsappmsg" }],
    fuqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

// Create or reuse model
export const ShutModel: Model<ShutDocument> = 
mongoose.models.shut || mongoose.model<ShutDocument>("shut", shutSchema);
// export const ShutModel: Model<ShutDocument> =
//   mongoose.models["qa"] || mongoose.model("qa", shutSchema)

export default ShutModel;
