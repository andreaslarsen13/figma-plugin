import { SceneNode, ExportSettingsImage } from '../../figma-types';

/**
 * Extracts a screenshot from a Figma node
 * @param node The Figma node to extract a screenshot from
 * @returns A promise that resolves to a base64 encoded image
 */
export async function extractScreenshot(node: SceneNode): Promise<string> {
  try {
    // Create a temporary export setting
    const exportSettings: ExportSettingsImage = {
      format: 'PNG',
      constraint: { type: 'SCALE', value: 2 }
    };

    // Get the image bytes
    const bytes = await node.exportAsync(exportSettings);
    
    // Convert to base64
    const base64 = figma.base64Encode(bytes);
    
    return `data:image/png;base64,${base64}`;
  } catch (error) {
    console.error('Error extracting screenshot:', error);
    return '';
  }
} 