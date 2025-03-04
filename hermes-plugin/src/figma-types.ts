/**
 * This file contains type definitions for the Figma Plugin API.
 * These are simplified versions of the actual types, focused on what we need for our plugin.
 */

// Basic color types
export type RGB = {
  r: number;
  g: number;
  b: number;
};

export type RGBA = RGB & {
  a: number;
};

// Export settings
export type ExportSettingsImage = {
  format: 'PNG' | 'JPG' | 'SVG' | 'PDF';
  constraint: {
    type: 'SCALE' | 'WIDTH' | 'HEIGHT';
    value: number;
  };
};

// Base node type
export type BaseNode = {
  id: string;
  name: string;
  type: string;
  parent: BaseNode | null;
  removed?: boolean;
};

// Scene node (any visible node)
export type SceneNode = BaseNode & {
  visible: boolean;
  locked: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  constrainProportions?: boolean;
  constraints?: {
    horizontal: string;
    vertical: string;
  };
  exportAsync(settings: ExportSettingsImage): Promise<Uint8Array>;
};

// Frame node
export type FrameNode = SceneNode & {
  children: SceneNode[];
  layoutMode?: 'NONE' | 'HORIZONTAL' | 'VERTICAL';
  layoutAlign?: string;
  layoutGrow?: number;
  primaryAxisSizingMode?: string;
  counterAxisSizingMode?: string;
  primaryAxisAlignItems?: string;
  counterAxisAlignItems?: string;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  itemSpacing?: number;
  fills?: Paint[];
  strokes?: Paint[];
  strokeWeight?: number;
  strokeAlign?: string;
  dashPattern?: number[];
  effects?: Effect[];
};

// Text node
export type TextNode = SceneNode & {
  characters: string;
  fontSize: number;
  fontName: {
    family: string;
    style: string;
  };
  letterSpacing?: number;
  lineHeight?: number | string;
  textAlignHorizontal?: string;
  textCase?: string;
  textDecoration?: string;
  fills: Paint[];
};

// Component node
export type ComponentNode = FrameNode & {
  componentProperties?: Record<string, any>;
};

// Instance node
export type InstanceNode = FrameNode & {
  componentProperties?: Record<string, any>;
  variantProperties?: Record<string, string>;
};

// Paint type (for fills and strokes)
export type Paint = {
  type: 'SOLID' | 'GRADIENT_LINEAR' | 'GRADIENT_RADIAL' | 'GRADIENT_ANGULAR' | 'GRADIENT_DIAMOND' | 'IMAGE' | 'EMOJI';
  visible?: boolean;
  opacity?: number;
  color?: RGB;
  blendMode?: string;
  gradientStops?: {
    position: number;
    color: RGBA;
  }[];
  scaleMode?: string;
};

// Effect type (for shadows, blurs, etc.)
export type Effect = {
  type: 'INNER_SHADOW' | 'DROP_SHADOW' | 'LAYER_BLUR' | 'BACKGROUND_BLUR';
  visible?: boolean;
  radius?: number;
  color?: RGBA;
  offset?: {
    x: number;
    y: number;
  };
  spread?: number;
};

// Figma plugin API types
export interface FigmaPluginAPI {
  showUI(html: string, options?: { width?: number; height?: number; themeColors?: boolean }): void;
  ui: {
    postMessage(message: any): void;
    onmessage: (callback: (event: { data: any }) => void) => void;
    resize(width: number, height: number): void;
  };
  currentPage: {
    selection: SceneNode[];
  };
  base64Encode(data: Uint8Array): string;
  closePlugin(message?: string): void;
} 