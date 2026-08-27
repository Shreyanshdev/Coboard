import { z } from "zod";
export type ToolType = "select" | "hand" | "pencil" | "highlighter" | "rectangle" | "circle" | "line" | "arrow" | "text" | "eraser" | "laser" | "image";
export interface Point {
    x: number;
    y: number;
}
export type FontFamily = "handwriting" | "kalam" | "architect" | "chillax" | "mono" | "sans";
export interface ElementBinding {
    elementId: string;
    focus?: number;
    gap?: number;
}
export interface CanvasElement {
    id: string;
    type: ToolType;
    x: number;
    y: number;
    width?: number;
    height?: number;
    points?: Point[];
    text?: string;
    strokeColor: string;
    fillColor: string;
    strokeWidth: number;
    roughness: number;
    strokeStyle?: "solid" | "dashed" | "dotted";
    edges?: "round" | "sharp";
    arrowhead?: "sharp" | "sketchy" | "dot" | "bar";
    arrowType?: "straight" | "curved";
    opacity?: number;
    fontFamily?: FontFamily;
    imageUrl?: string;
    dataUrl?: string;
    startBinding?: ElementBinding;
    endBinding?: ElementBinding;
    isMagicShape?: boolean;
    createdAt: number;
}
export declare const CreateUserSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
}, z.core.$strip>;
export declare const SigninUserSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const CreateRoomSchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodString;
}, z.core.$strip>;
export declare const BindingSchema: z.ZodObject<{
    elementId: z.ZodString;
    focus: z.ZodOptional<z.ZodNumber>;
    gap: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const ElementSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<{
        arrow: "arrow";
        circle: "circle";
        eraser: "eraser";
        hand: "hand";
        highlighter: "highlighter";
        image: "image";
        laser: "laser";
        line: "line";
        pencil: "pencil";
        rectangle: "rectangle";
        select: "select";
        text: "text";
    }>;
    x: z.ZodNumber;
    y: z.ZodNumber;
    width: z.ZodOptional<z.ZodNumber>;
    height: z.ZodOptional<z.ZodNumber>;
    points: z.ZodOptional<z.ZodArray<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, z.core.$strip>>>;
    text: z.ZodOptional<z.ZodString>;
    strokeColor: z.ZodString;
    fillColor: z.ZodString;
    strokeWidth: z.ZodNumber;
    roughness: z.ZodNumber;
    strokeStyle: z.ZodOptional<z.ZodEnum<{
        dashed: "dashed";
        dotted: "dotted";
        solid: "solid";
    }>>;
    edges: z.ZodOptional<z.ZodEnum<{
        round: "round";
        sharp: "sharp";
    }>>;
    arrowhead: z.ZodOptional<z.ZodEnum<{
        bar: "bar";
        dot: "dot";
        sharp: "sharp";
        sketchy: "sketchy";
    }>>;
    arrowType: z.ZodOptional<z.ZodEnum<{
        curved: "curved";
        straight: "straight";
    }>>;
    opacity: z.ZodOptional<z.ZodNumber>;
    fontFamily: z.ZodOptional<z.ZodEnum<{
        architect: "architect";
        chillax: "chillax";
        handwriting: "handwriting";
        kalam: "kalam";
        mono: "mono";
        sans: "sans";
    }>>;
    imageUrl: z.ZodOptional<z.ZodString>;
    dataUrl: z.ZodOptional<z.ZodString>;
    startBinding: z.ZodOptional<z.ZodObject<{
        elementId: z.ZodString;
        focus: z.ZodOptional<z.ZodNumber>;
        gap: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    endBinding: z.ZodOptional<z.ZodObject<{
        elementId: z.ZodString;
        focus: z.ZodOptional<z.ZodNumber>;
        gap: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    isMagicShape: z.ZodOptional<z.ZodBoolean>;
    createdAt: z.ZodNumber;
}, z.core.$strip>;
export type WSMessageType = "JOIN_ROOM" | "LEAVE_ROOM" | "DRAW_ELEMENT" | "UPDATE_ELEMENT" | "DELETE_ELEMENT" | "CLEAR_CANVAS" | "CURSOR_MOVE" | "ROOM_SNAPSHOT" | "USER_JOINED" | "USER_LEFT";
export interface WSMessage {
    type: WSMessageType;
    roomId: string;
    userId?: string;
    userName?: string;
    payload?: any;
}
//# sourceMappingURL=index.d.ts.map