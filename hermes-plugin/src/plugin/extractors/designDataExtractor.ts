import { extractScreenshot } from './screenshotExtractor';
import { extractHierarchy } from './hierarchyExtractor';
import { extractMeasurements } from './measurementsExtractor';
import { extractStyles } from './stylesExtractor';
import { extractStructure } from './structureExtractor';
import { DesignData, ExportOptions, NodeData } from '../../types';
import { SceneNode } from '../../figma-types';

/**
 * Extracts all design data from the selected nodes based on the provided options
 * @param selection The selected Figma nodes
 * @param options Export options that determine what data to extract
 * @returns A promise that resolves to the extracted design data
 */
export async function extractDesignData(
  selection: readonly SceneNode[],
  options: ExportOptions
): Promise<DesignData> {
  const designData: DesignData = {
    timestamp: new Date().toISOString(),
    nodes: []
  };

  // Process each selected node
  for (const node of selection) {
    const nodeData: NodeData = {
      id: node.id,
      name: node.name,
      type: node.type,
    };

    // Extract screenshot if requested
    if (options.includeScreenshot) {
      nodeData.screenshot = await extractScreenshot(node);
    }

    // Extract component hierarchy if requested
    if (options.includeHierarchy) {
      nodeData.hierarchy = extractHierarchy(node);
    }

    // Extract measurements if requested
    if (options.includeMeasurements) {
      nodeData.measurements = extractMeasurements(node);
    }

    // Extract styles if requested
    if (options.includeStyles) {
      nodeData.styles = extractStyles(node);
    }

    // Extract structure if requested
    if (options.includeStructure) {
      nodeData.structure = extractStructure(node);
    }

    designData.nodes.push(nodeData);
  }

  return designData;
} 