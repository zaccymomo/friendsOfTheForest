// S3 Asset URLs for Friends of the Forest
// These URLs are used throughout the backend and sent to frontend via API responses

const S3_BASE_URL = 'https://forestfriends.s3.ap-southeast-1.amazonaws.com';

// Trail Assets
const trailAssets = {
  coastalTrailMap: `${S3_BASE_URL}/coastalTrailMap.jpeg`,
};

// General Assets
const generalAssets = {
  stickerBookBackground: `${S3_BASE_URL}/stickerBookBackground.png`,
};

// Forest Friend Outlines and Body Parts
const forestFriendAssets = {
  spider: {
    outline: `${S3_BASE_URL}/SpiderOutline.png`,
    legs: `${S3_BASE_URL}/SpiderLegs.png`,
    head: `${S3_BASE_URL}/SpiderHead.png`,
    body: `${S3_BASE_URL}/SpiderBody.png`,
  },
  otter: {
    outline: `${S3_BASE_URL}/OtterOutline.png`,
    tail: `${S3_BASE_URL}/OtterTail.png`,
    head: `${S3_BASE_URL}/OtterHead.png`,
    body: `${S3_BASE_URL}/OtterBody.png`,
  },
  lizard: {
    outline: `${S3_BASE_URL}/LizardOutline.png`,
    tail: `${S3_BASE_URL}/LizardTail.png`,
    head: `${S3_BASE_URL}/LizardHead.png`,
    body: `${S3_BASE_URL}/LizardBody.png`,
  },
  lion: {
    outline: `${S3_BASE_URL}/LionOutline.png`,
    tail: `${S3_BASE_URL}/LionTail.png`,
    head: `${S3_BASE_URL}/LionHead.png`,
    body: `${S3_BASE_URL}/LionBody.png`,
  },
  koel: {
    outline: `${S3_BASE_URL}/KoelOutline.png`,
    tail: `${S3_BASE_URL}/KoelTail.png`,
    headBody: `${S3_BASE_URL}/KoelHeadBody.png`,
    claws: `${S3_BASE_URL}/KoelClaws.png`,
  },
  beetle: {
    outline: `${S3_BASE_URL}/BeetleOutline.png`,
    head: `${S3_BASE_URL}/BeetleHead.png`,
    body: `${S3_BASE_URL}/BeetleBody.png`,
    antenna: `${S3_BASE_URL}/BeetleAntenna.png`,
  },
};

// Helper function to get all body parts for a specific friend
const getBodyParts = (friendName) => {
  const normalizedName = friendName.toLowerCase();
  return forestFriendAssets[normalizedName] || null;
};

// Helper function to get a specific body part URL
const getBodyPartUrl = (friendName, partName) => {
  const parts = getBodyParts(friendName);
  if (!parts) return null;
  return parts[partName] || null;
};

module.exports = {
  S3_BASE_URL,
  trailAssets,
  generalAssets,
  forestFriendAssets,
  getBodyParts,
  getBodyPartUrl,
};
