import mongoose, { Document, Model, Schema } from "mongoose";

export type MamarBlock =
  | { id: string; type: "paragraph"; text: string }
  | { id: string; type: "list"; ordered: boolean; items: string[] }
  | { id: string; type: "heading"; level: 3; text: string };

export type MamarSection = {
  id: string;
  title: string;
  blocks: MamarBlock[];
};

export interface IMamar {
  _id: string;
  slug: string;
  title: string;
  image: string;
  isActive: boolean;
  author: string;
  publishedAt: string;
  tags: string[];
  sections?: MamarSection[];
  content?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type MamarDocument = IMamar & Document;

const blockSchema = new Schema<MamarBlock>(
  {
    id: { type: String, required: true },
    type: { type: String, required: true, enum: ["paragraph", "list", "heading"] },
    text: { type: String },
    ordered: { type: Boolean },
    items: [{ type: String }],
    level: { type: Number },
  },
  { _id: false }
);

blockSchema.pre("validate", function () {
  if (this.type === "paragraph") {
    if (typeof this.text !== "string" || this.text.length === 0) {
      this.invalidate("text", "Paragraph blocks require non-empty text.");
    }
  }

  if (this.type === "heading") {
    if (this.level !== 3) {
      this.invalidate("level", "Heading blocks must have level 3.");
    }
    if (typeof this.text !== "string" || this.text.length === 0) {
      this.invalidate("text", "Heading blocks require non-empty text.");
    }
  }

  if (this.type === "list") {
    if (typeof this.ordered !== "boolean") {
      this.invalidate("ordered", "List blocks require ordered boolean.");
    }
    if (!Array.isArray(this.items)) {
      this.invalidate("items", "List blocks require items array.");
    }
  }
});

const sectionSchema = new Schema<MamarSection>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    blocks: { type: [blockSchema], required: true, default: [] },
  },
  { _id: false }
);

const mamarSchema = new Schema<MamarDocument>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    image: { type: String },
    isActive: { type: Boolean, default: true },
    publishedAt: { type: String, required: true },
    tags: { type: [String], required: true, default: [] },
    sections: { type: [sectionSchema], default: [] },
    content: { type: String },
  },
  { timestamps: true }
);

export const MamarModel: Model<MamarDocument> =
  mongoose.models.mamar || mongoose.model<MamarDocument>("mamar", mamarSchema);

export default MamarModel;
