/**
 * Export options that determine what data to extract
 */
export interface ExportOptions {
  includeScreenshot: boolean;
  includeHierarchy: boolean;
  includeMeasurements: boolean;
  includeStyles: boolean;
  includeStructure: boolean;
  outputFormat: 'json' | 'markdown' | 'claude';
}

/**
 * Main design data structure
 */
export interface DesignData {
  timestamp: string;
  nodes: NodeData[];
}

/**
 * Data for a single node
 */
export interface NodeData {
  id: string;
  name: string;
  type: string;
  screenshot?: string; // Base64 encoded image
  hierarchy?: HierarchyData;
  measurements?: MeasurementsData;
  styles?: StylesData;
  structure?: StructureData;
}

/**
 * Component hierarchy data
 */
export interface HierarchyData {
  parent?: string;
  children?: string[];
  componentProperties?: Record<string, any>;
  variantProperties?: Record<string, string>;
}

/**
 * Measurements data
 */
export interface MeasurementsData {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  padding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

/**
 * Styles data
 */
export interface StylesData {
  fills?: FillStyle[];
  strokes?: StrokeStyle[];
  effects?: EffectStyle[];
  typography?: TypographyStyle;
}

/**
 * Fill style data
 */
export interface FillStyle {
  type: string;
  color?: {
    r: number;
    g: number;
    b: number;
    a: number;
    hex: string;
  };
  gradientStops?: {
    position: number;
    color: {
      r: number;
      g: number;
      b: number;
      a: number;
      hex: string;
    };
  }[];
  imageUrl?: string;
  scaleMode?: string;
}

/**
 * Stroke style data
 */
export interface StrokeStyle {
  color: {
    r: number;
    g: number;
    b: number;
    a: number;
    hex: string;
  };
  weight: number;
  alignment: string;
  dashPattern?: number[];
}

/**
 * Effect style data
 */
export interface EffectStyle {
  type: string;
  radius?: number;
  color?: {
    r: number;
    g: number;
    b: number;
    a: number;
    hex: string;
  };
  offset?: {
    x: number;
    y: number;
  };
  spread?: number;
}

/**
 * Typography style data
 */
export interface TypographyStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  letterSpacing?: number;
  lineHeight?: number | string;
  textAlign?: string;
  textCase?: string;
  textDecoration?: string;
  color: {
    r: number;
    g: number;
    b: number;
    a: number;
    hex: string;
  };
}

/**
 * Structure data
 */
export interface StructureData {
  layoutMode?: string;
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
  constraints?: {
    horizontal: string;
    vertical: string;
  };
  responsiveResize?: boolean;
  isAutoLayout?: boolean;
} 