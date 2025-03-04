// The figma object is available in the plugin context
// We need to import the HTML from the bundled UI file
// This will be provided by the webpack configuration

import * as ui from '../ui/ui';

/**
 * Shows the plugin UI with default settings
 */
export function showUI() {
  const options = {
    width: 340,
    height: 500,
    themeColors: true
  };

  // The figma object and __html__ are globally available in the plugin context
  // as defined in our figma-types.ts file
  figma.showUI(__html__, options);
} 