import { showUI } from './ui';
import { extractDesignData } from './extractors/designDataExtractor';
import { ExportOptions } from '../types';

// Default export options
const defaultOptions: ExportOptions = {
  includeScreenshot: true,
  includeHierarchy: true,
  includeMeasurements: true,
  includeStyles: true,
  includeStructure: true,
  outputFormat: 'claude'
};

// Show UI when the plugin starts
showUI();

// Handle messages from the UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'export') {
    // Get the current selection
    const selection = figma.currentPage.selection;
    
    // Check if there's a selection
    if (selection.length === 0) {
      figma.ui.postMessage({
        type: 'error',
        message: 'Please select at least one layer to export.'
      });
      return;
    }
    
    try {
      // Extract design data with the provided options
      const options: ExportOptions = {
        ...defaultOptions,
        ...msg.options
      };
      
      const designData = await extractDesignData(selection, options);
      
      // Format the output based on the selected format
      let output = '';
      
      switch (options.outputFormat) {
        case 'json':
          output = JSON.stringify(designData, null, 2);
          break;
          
        case 'markdown':
          output = formatAsMarkdown(designData);
          break;
          
        case 'claude':
          output = formatForClaude(designData);
          break;
          
        default:
          output = JSON.stringify(designData, null, 2);
      }
      
      // Send the data back to the UI
      figma.ui.postMessage({
        type: 'exportComplete',
        data: output
      });
    } catch (error) {
      console.error('Export error:', error);
      figma.ui.postMessage({
        type: 'error',
        message: 'An error occurred during export: ' + (error as Error).message
      });
    }
  } else if (msg.type === 'resize') {
    // Resize the plugin window
    figma.ui.resize(msg.width, msg.height);
  } else if (msg.type === 'close') {
    // Close the plugin
    figma.closePlugin();
  }
};

/**
 * Formats design data as Markdown
 */
function formatAsMarkdown(designData: any): string {
  let markdown = `# Design Specifications\n\n`;
  markdown += `Exported on: ${new Date(designData.timestamp).toLocaleString()}\n\n`;
  
  for (const node of designData.nodes) {
    markdown += `## ${node.name} (${node.type})\n\n`;
    
    if (node.screenshot) {
      markdown += `![${node.name}](${node.screenshot})\n\n`;
    }
    
    if (node.measurements) {
      markdown += `### Measurements\n\n`;
      markdown += `- Position: X: ${node.measurements.x}, Y: ${node.measurements.y}\n`;
      markdown += `- Size: Width: ${node.measurements.width}, Height: ${node.measurements.height}\n`;
      
      if (node.measurements.rotation) {
        markdown += `- Rotation: ${node.measurements.rotation}°\n`;
      }
      
      markdown += `\n`;
    }
    
    if (node.styles && node.styles.fills && node.styles.fills.length > 0) {
      markdown += `### Colors\n\n`;
      
      for (const fill of node.styles.fills) {
        if (fill.color) {
          markdown += `- ${fill.color.hex}\n`;
        }
      }
      
      markdown += `\n`;
    }
    
    if (node.styles && node.styles.typography) {
      markdown += `### Typography\n\n`;
      markdown += `- Font: ${node.styles.typography.fontFamily}\n`;
      markdown += `- Size: ${node.styles.typography.fontSize}px\n`;
      markdown += `- Weight: ${node.styles.typography.fontWeight}\n`;
      
      if (node.styles.typography.color) {
        markdown += `- Color: ${node.styles.typography.color.hex}\n`;
      }
      
      markdown += `\n`;
    }
  }
  
  return markdown;
}

/**
 * Formats design data for Claude
 */
function formatForClaude(designData: any): string {
  let claude = `<design_specs>\n`;
  
  for (const node of designData.nodes) {
    claude += `  <component name="${node.name}" type="${node.type}">\n`;
    
    if (node.screenshot) {
      claude += `    <screenshot>${node.screenshot}</screenshot>\n`;
    }
    
    if (node.measurements) {
      claude += `    <measurements>\n`;
      claude += `      <position x="${node.measurements.x}" y="${node.measurements.y}" />\n`;
      claude += `      <size width="${node.measurements.width}" height="${node.measurements.height}" />\n`;
      
      if (node.measurements.rotation) {
        claude += `      <rotation>${node.measurements.rotation}</rotation>\n`;
      }
      
      if (node.measurements.padding) {
        claude += `      <padding`;
        if (node.measurements.padding.top !== undefined) claude += ` top="${node.measurements.padding.top}"`;
        if (node.measurements.padding.right !== undefined) claude += ` right="${node.measurements.padding.right}"`;
        if (node.measurements.padding.bottom !== undefined) claude += ` bottom="${node.measurements.padding.bottom}"`;
        if (node.measurements.padding.left !== undefined) claude += ` left="${node.measurements.padding.left}"`;
        claude += ` />\n`;
      }
      
      claude += `    </measurements>\n`;
    }
    
    if (node.styles) {
      claude += `    <styles>\n`;
      
      if (node.styles.fills && node.styles.fills.length > 0) {
        claude += `      <fills>\n`;
        
        for (const fill of node.styles.fills) {
          claude += `        <fill type="${fill.type}">\n`;
          
          if (fill.color) {
            claude += `          <color hex="${fill.color.hex}" r="${fill.color.r}" g="${fill.color.g}" b="${fill.color.b}" a="${fill.color.a}" />\n`;
          }
          
          claude += `        </fill>\n`;
        }
        
        claude += `      </fills>\n`;
      }
      
      if (node.styles.typography) {
        claude += `      <typography>\n`;
        claude += `        <font family="${node.styles.typography.fontFamily}" size="${node.styles.typography.fontSize}" weight="${node.styles.typography.fontWeight}" />\n`;
        
        if (node.styles.typography.color) {
          claude += `        <color hex="${node.styles.typography.color.hex}" />\n`;
        }
        
        claude += `      </typography>\n`;
      }
      
      claude += `    </styles>\n`;
    }
    
    if (node.structure) {
      claude += `    <structure>\n`;
      
      if (node.structure.isAutoLayout) {
        claude += `      <autoLayout`;
        if (node.structure.layoutMode) claude += ` mode="${node.structure.layoutMode}"`;
        if (node.structure.itemSpacing !== undefined) claude += ` spacing="${node.structure.itemSpacing}"`;
        claude += ` />\n`;
      }
      
      claude += `    </structure>\n`;
    }
    
    claude += `  </component>\n`;
  }
  
  claude += `</design_specs>`;
  
  return claude;
} 