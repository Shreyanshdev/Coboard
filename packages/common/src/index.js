import { z } from "zod";
// Zod Validation Schemas
export const CreateUserSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(6),
    name: z.string().min(1)
});
export const SigninUserSchema = z.object({
    username: z.string().min(3),
    password: z.string().min(6)
});
export const CreateRoomSchema = z.object({
    name: z.string().min(2).max(50),
    slug: z.string().min(2).max(50)
});
export const BindingSchema = z.object({
    elementId: z.string(),
    focus: z.number().optional(),
    gap: z.number().optional()
});
export const ElementSchema = z.object({
    id: z.string(),
    type: z.enum([
        "select",
        "hand",
        "pencil",
        "highlighter",
        "rectangle",
        "circle",
        "line",
        "arrow",
        "text",
        "eraser",
        "laser",
        "image"
    ]),
    x: z.number(),
    y: z.number(),
    width: z.number().optional(),
    height: z.number().optional(),
    points: z.array(z.object({ x: z.number(), y: z.number() })).optional(),
    text: z.string().optional(),
    strokeColor: z.string(),
    fillColor: z.string(),
    strokeWidth: z.number(),
    roughness: z.number(),
    strokeStyle: z.enum(["solid", "dashed", "dotted"]).optional(),
    edges: z.enum(["round", "sharp"]).optional(),
    arrowhead: z.enum(["sharp", "sketchy", "dot", "bar"]).optional(),
    arrowType: z.enum(["straight", "curved"]).optional(),
    opacity: z.number().optional(),
    fontFamily: z.enum(["handwriting", "kalam", "architect", "chillax", "mono", "sans"]).optional(),
    imageUrl: z.string().optional(),
    dataUrl: z.string().optional(),
    startBinding: BindingSchema.optional(),
    endBinding: BindingSchema.optional(),
    isMagicShape: z.boolean().optional(),
    createdAt: z.number()
});
