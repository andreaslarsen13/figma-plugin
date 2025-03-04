import { SceneNode, FrameNode } from '../../figma-types';
import { MeasurementsData } from '../../types';

/**
 * Extracts measurement information from a Figma node
 * @param node The Figma node to extract measurements from
 * @returns Measurement data for the node
 */
export function extractMeasurements(node: SceneNode): MeasurementsData {
  const measurements: MeasurementsData = {
    x: node.x,
    y: node.y,
    width: node.width,
    height: node.height
  };
  
  // Add rotation if available
  if ('rotation' in node) {
    measurements.rotation = node.rotation;
  }
  
  // Add padding if available (for auto layout frames)
  if ('paddingLeft' in node || 'paddingRight' in node || 
      'paddingTop' in node || 'paddingBottom' in node) {
    const frameNode = node as FrameNode;
    measurements.padding = {};
    
    if ('paddingTop' in frameNode && typeof frameNode.paddingTop === 'number') {
      measurements.padding.top = frameNode.paddingTop;
    }
    
    if ('paddingRight' in frameNode && typeof frameNode.paddingRight === 'number') {
      measurements.padding.right = frameNode.paddingRight;
    }
    
    if ('paddingBottom' in frameNode && typeof frameNode.paddingBottom === 'number') {
      measurements.padding.bottom = frameNode.paddingBottom;
    }
    
    if ('paddingLeft' in frameNode && typeof frameNode.paddingLeft === 'number') {
      measurements.padding.left = frameNode.paddingLeft;
    }
  }
  
  // Add margin information if available
  // Note: Figma doesn't have direct margin properties, but we can calculate them
  // based on the node's position relative to its parent and siblings
  if (node.parent && 'children' in node.parent) {
    const parent = node.parent as FrameNode;
    const siblings = parent.children;
    
    // This is a simplified approach - a more comprehensive solution would
    // need to consider layout modes, constraints, etc.
    measurements.margin = {};
    
    // Calculate top margin (distance from top of parent or previous sibling)
    const nodeIndex = siblings.indexOf(node);
    if (nodeIndex > 0) {
      const prevSibling = siblings[nodeIndex - 1];
      measurements.margin.top = node.y - (prevSibling.y + prevSibling.height);
    } else {
      measurements.margin.top = node.y - parent.y;
    }
    
    // Calculate left margin (distance from left of parent or previous sibling)
    measurements.margin.left = node.x - parent.x;
  }
  
  return measurements;
} 