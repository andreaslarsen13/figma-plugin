import { SceneNode, FrameNode } from '../../figma-types';
import { HierarchyData } from '../../types';

/**
 * Extracts hierarchy information from a Figma node
 * @param node The Figma node to extract hierarchy from
 * @returns Hierarchy data for the node
 */
export function extractHierarchy(node: SceneNode): HierarchyData {
  const hierarchyData: HierarchyData = {};
  
  // Get parent information if available
  if (node.parent) {
    hierarchyData.parent = node.parent.id;
  }
  
  // Get children information if available
  if ('children' in node) {
    const frameNode = node as FrameNode;
    hierarchyData.children = frameNode.children.map(child => child.id);
  }
  
  // Get component properties if available
  if ('componentProperties' in node && node.componentProperties) {
    hierarchyData.componentProperties = {};
    
    for (const [key, value] of Object.entries(node.componentProperties)) {
      hierarchyData.componentProperties[key] = value;
    }
  }
  
  // Get variant properties if available
  if ('variantProperties' in node && node.variantProperties) {
    hierarchyData.variantProperties = {};
    
    for (const [key, value] of Object.entries(node.variantProperties)) {
      if (typeof value === 'string') {
        hierarchyData.variantProperties[key] = value;
      }
    }
  }
  
  return hierarchyData;
} 