import mongoose, { Document, Schema, Model } from "mongoose";

export interface ITag {
   _id: string;
  name: string;
  description?: string;
  coverImage?: string;
  parent?: mongoose.Types.ObjectId;
  topicImages?: string[];
  popular?: boolean;
  children?: mongoose.Types.ObjectId[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const TagSchema = new Schema<ITag>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    coverImage: { type: String },
    parent: { type: Schema.Types.ObjectId, ref: "tag" },
    topicImages: [{ type: String }],
    popular: { type: Boolean },
    children: [{ type: Schema.Types.ObjectId, ref: "tag" }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const TagModel: Model<ITag> = mongoose.models?.tag || mongoose.model<ITag>("tag", TagSchema);

export default TagModel;
