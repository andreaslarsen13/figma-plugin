import { SceneNode, RGB, RGBA, TextNode, Paint, Effect } from '../../figma-types';
import { StylesData, FillStyle, StrokeStyle, EffectStyle, TypographyStyle } from '../../types';

/**
 * Converts an RGBA color to a hex string
 */
function rgbaToHex(r: number, g: number, b: number, a: number = 1): string {
  const toHex = (value: number) => {
    const hex = Math.round(value * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}${a < 1 ? toHex(a) : ''}`;
}

/**
 * Extracts color information from a Figma color
 */
function extractColor(color: RGB | RGBA): { r: number; g: number; b: number; a: number; hex: string } {
  const r = color.r;
  const g = color.g;
  const b = color.b;
  const a = 'a' in color ? color.a : 1;
  
  return {
    r,
    g,
    b,
    a,
    hex: rgbaToHex(r, g, b, a)
  };
}

/**
 * Extracts fill styles from a Figma node
 */
function extractFills(node: SceneNode): FillStyle[] | undefined {
  if (!('fills' in node) || !node.fills) {
    return undefined;
  }
  
  const fills = node.fills as Paint[];
  if (!Array.isArray(fills) || fills.length === 0) {
    return undefined;
  }
  
  return fills.map((fill: Paint) => {
    const fillStyle: FillStyle = {
      type: fill.type
    };
    
    if (fill.type === 'SOLID') {
      fillStyle.color = extractColor(fill.color as RGB);
    } else if (fill.type === 'GRADIENT_LINEAR' || fill.type === 'GRADIENT_RADIAL' || 
               fill.type === 'GRADIENT_ANGULAR' || fill.type === 'GRADIENT_DIAMOND') {
      fillStyle.gradientStops = fill.gradientStops?.map(stop => ({
        position: stop.position,
        color: extractColor(stop.color)
      }));
    } else if (fill.type === 'IMAGE') {
      fillStyle.imageUrl = '[Image data not available in plugin context]';
      fillStyle.scaleMode = fill.scaleMode;
    }
    
    return fillStyle;
  });
}

/**
 * Extracts stroke styles from a Figma node
 */
function extractStrokes(node: SceneNode): StrokeStyle[] | undefined {
  if (!('strokes' in node) || !node.strokes || 
      !('strokeWeight' in node) || !('strokeAlign' in node)) {
    return undefined;
  }
  
  const strokes = node.strokes as Paint[];
  if (!Array.isArray(strokes) || strokes.length === 0) {
    return undefined;
  }
  
  return strokes.map((stroke: Paint) => {
    if (stroke.type !== 'SOLID') {
      // For simplicity, we're only handling solid strokes
      return {
        color: { r: 0, g: 0, b: 0, a: 1, hex: '#000000' },
        weight: 'strokeWeight' in node ? (node.strokeWeight as number) : 1,
        alignment: 'strokeAlign' in node ? (node.strokeAlign as string) : 'CENTER'
      };
    }
    
    const strokeStyle: StrokeStyle = {
      color: extractColor(stroke.color as RGB),
      weight: 'strokeWeight' in node ? (node.strokeWeight as number) : 1,
      alignment: 'strokeAlign' in node ? (node.strokeAlign as string) : 'CENTER'
    };
    
    if ('dashPattern' in node && node.dashPattern) {
      const dashPattern = node.dashPattern as number[];
      if (Array.isArray(dashPattern) && dashPattern.length > 0) {
        strokeStyle.dashPattern = dashPattern;
      }
    }
    
    return strokeStyle;
  });
}

/**
 * Extracts effect styles from a Figma node
 */
function extractEffects(node: SceneNode): EffectStyle[] | undefined {
  if (!('effects' in node) || !node.effects) {
    return undefined;
  }
  
  const effects = node.effects as Effect[];
  if (!Array.isArray(effects) || effects.length === 0) {
    return undefined;
  }
  
  return effects.map((effect: Effect) => {
    const effectStyle: EffectStyle = {
      type: effect.type
    };
    
    if ('radius' in effect) {
      effectStyle.radius = effect.radius;
    }
    
    if ('color' in effect) {
      effectStyle.color = extractColor(effect.color as RGBA);
    }
    
    if ('offset' in effect) {
      effectStyle.offset = {
        x: effect.offset?.x || 0,
        y: effect.offset?.y || 0
      };
    }
    
    if ('spread' in effect) {
      effectStyle.spread = effect.spread;
    }
    
    return effectStyle;
  });
}

/**
 * Extracts typography styles from a Figma text node
 */
function extractTypography(node: SceneNode): TypographyStyle | undefined {
  if (node.type !== 'TEXT' || !('fontName' in node) || !('fontSize' in node)) {
    return undefined;
  }
  
  const textNode = node as TextNode;
  
  // Ensure fills exist and are an array
  if (!textNode.fills || !Array.isArray(textNode.fills) || textNode.fills.length === 0) {
    return undefined;
  }
  
  const typographyStyle: TypographyStyle = {
    fontFamily: textNode.fontName.family,
    fontSize: textNode.fontSize,
    fontWeight: textNode.fontName.style.includes('Bold') ? 700 : 
                textNode.fontName.style.includes('Medium') ? 500 : 
                textNode.fontName.style.includes('Light') ? 300 : 400,
    color: extractColor((textNode.fills[0] as Paint).color as RGB)
  };
  
  if ('letterSpacing' in textNode) {
    typographyStyle.letterSpacing = textNode.letterSpacing;
  }
  
  if ('lineHeight' in textNode) {
    typographyStyle.lineHeight = textNode.lineHeight;
  }
  
  if ('textAlignHorizontal' in textNode) {
    typographyStyle.textAlign = textNode.textAlignHorizontal;
  }
  
  if ('textCase' in textNode) {
    typographyStyle.textCase = textNode.textCase;
  }
  
  if ('textDecoration' in textNode) {
    typographyStyle.textDecoration = textNode.textDecoration;
  }
  
  return typographyStyle;
}

/**
 * Extracts style information from a Figma node
 * @param node The Figma node to extract styles from
 * @returns Style data for the node
 */
export function extractStyles(node: SceneNode): StylesData {
  const stylesData: StylesData = {};
  
  // Extract fills
  const fills = extractFills(node);
  if (fills) {
    stylesData.fills = fills;
  }
  
  // Extract strokes
  const strokes = extractStrokes(node);
  if (strokes) {
    stylesData.strokes = strokes;
  }
  
  // Extract effects
  const effects = extractEffects(node);
  if (effects) {
    stylesData.effects = effects;
  }
  
  // Extract typography (for text nodes)
  const typography = extractTypography(node);
  if (typography) {
    stylesData.typography = typography;
  }
  
  return stylesData;
} 