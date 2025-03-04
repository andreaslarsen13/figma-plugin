import { SceneNode, FrameNode } from '../../figma-types';
import { StructureData } from '../../types';

/**
 * Extracts structure information from a Figma node
 * @param node The Figma node to extract structure from
 * @returns Structure data for the node
 */
export function extractStructure(node: SceneNode): StructureData {
  const structureData: StructureData = {};
  
  // Extract auto layout properties if available
  if ('layoutMode' in node) {
    const frameNode = node as FrameNode;
    structureData.layoutMode = frameNode.layoutMode;
    structureData.isAutoLayout = true;
    
    // Extract additional auto layout properties
    if ('layoutAlign' in frameNode && frameNode.layoutAlign) {
      structureData.layoutAlign = frameNode.layoutAlign;
    }
    
    if ('layoutGrow' in frameNode && typeof frameNode.layoutGrow === 'number') {
      structureData.layoutGrow = frameNode.layoutGrow;
    }
    
    if ('primaryAxisSizingMode' in frameNode && frameNode.primaryAxisSizingMode) {
      structureData.primaryAxisSizingMode = frameNode.primaryAxisSizingMode;
    }
    
    if ('counterAxisSizingMode' in frameNode && frameNode.counterAxisSizingMode) {
      structureData.counterAxisSizingMode = frameNode.counterAxisSizingMode;
    }
    
    if ('primaryAxisAlignItems' in frameNode && frameNode.primaryAxisAlignItems) {
      structureData.primaryAxisAlignItems = frameNode.primaryAxisAlignItems;
    }
    
    if ('counterAxisAlignItems' in frameNode && frameNode.counterAxisAlignItems) {
      structureData.counterAxisAlignItems = frameNode.counterAxisAlignItems;
    }
    
    if ('paddingLeft' in frameNode && typeof frameNode.paddingLeft === 'number') {
      structureData.paddingLeft = frameNode.paddingLeft;
    }
    
    if ('paddingRight' in frameNode && typeof frameNode.paddingRight === 'number') {
      structureData.paddingRight = frameNode.paddingRight;
    }
    
    if ('paddingTop' in frameNode && typeof frameNode.paddingTop === 'number') {
      structureData.paddingTop = frameNode.paddingTop;
    }
    
    if ('paddingBottom' in frameNode && typeof frameNode.paddingBottom === 'number') {
      structureData.paddingBottom = frameNode.paddingBottom;
    }
    
    if ('itemSpacing' in frameNode && typeof frameNode.itemSpacing === 'number') {
      structureData.itemSpacing = frameNode.itemSpacing;
    }
  } else {
    structureData.isAutoLayout = false;
  }
  
  // Extract constraints if available
  if ('constraints' in node && node.constraints) {
    structureData.constraints = {
      horizontal: node.constraints.horizontal,
      vertical: node.constraints.vertical
    };
  }
  
  // Extract responsive resize property if available
  if ('constrainProportions' in node && typeof node.constrainProportions === 'boolean') {
    structureData.responsiveResize = node.constrainProportions;
  }
  
  return structureData;
} 