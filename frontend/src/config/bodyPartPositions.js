/**
 * Body Part Positioning Configuration
 *
 * Defines the absolute positioning for each body part within the 110px x 90px container.
 * Adjust these values to position body parts correctly for the "puzzle assembly" effect.
 *
 * Structure:
 * {
 *   "Body Part Name": {
 *     top: "px or %",      // Distance from top of container
 *     left: "px or %",     // Distance from left of container
 *     width: "px or %",    // Width of the image (optional, defaults to auto for aspect ratio)
 *     height: "px or %",   // Height of the image (optional, defaults to auto for aspect ratio)
 *     zIndex: number       // Layer order (higher = on top)
 *   }
 * }
 */

export const bodyPartPositions = {
  // Kingston the Koel
  "Kingston's Feet": {
    top: "60%",
    left: "0",
    width: "100%",
    height: "auto",
    zIndex: 1,
  },
  "Kingston's Body": {
    top: "0",
    left: "0",
    width: "100%",
    height: "auto",
    zIndex: 2,
  },

  // Corey the Hermit Crab
  "Corey's Claw": {
    top: "50%",
    left: "10%",
    width: "40%",
    height: "auto",
    zIndex: 2,
  },
  "Corey's Shell": {
    top: "10%",
    left: "20%",
    width: "60%",
    height: "auto",
    zIndex: 1,
  },

  // Sally the Snail
  "Sally's Body": {
    top: "40%",
    left: "0",
    width: "80%",
    height: "auto",
    zIndex: 1,
  },
  "Sally's Shell": {
    top: "0",
    left: "30%",
    width: "60%",
    height: "auto",
    zIndex: 2,
  },
  "Sally's Antennae": {
    top: "0",
    left: "20%",
    width: "50%",
    height: "auto",
    zIndex: 3,
  },
};

/**
 * Get positioning style for a body part by name
 * @param {string} bodyPartName - The name of the body part
 * @returns {object} Style object with position, dimensions, and z-index
 */
export function getBodyPartStyle(bodyPartName) {
  const config = bodyPartPositions[bodyPartName];
  if (!config) {
    // Default positioning if not configured
    return {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: 'auto',
      zIndex: 1,
    };
  }

  return {
    position: 'absolute',
    top: config.top,
    left: config.left,
    width: config.width,
    height: config.height,
    zIndex: config.zIndex,
  };
}
