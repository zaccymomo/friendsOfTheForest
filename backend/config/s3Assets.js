// S3 Asset URLs for Friends of the Forest
// These URLs are used throughout the backend and sent to frontend via API responses

const S3_BASE_URL = 'https://forestfriends.s3.ap-southeast-1.amazonaws.com';

// Trail Assets
const trailAssets = {
  coastalTrailMap: `${S3_BASE_URL}/coastalTrailMap.jpeg`,
};

// General Assets
const generalAssets = {
  stickerBookBackground: `${S3_BASE_URL}/stickerBookBackground.png?v=2`,
};

// Forest Friend Outlines and Body Parts
const forestFriendAssets = {
  spider: {
    outline: `${S3_BASE_URL}/SpiderOutline.png`,
    full: `${S3_BASE_URL}/spiderFULL.png`,
    legs: `${S3_BASE_URL}/SpiderLegs.png`,
    legsZoomed: `${S3_BASE_URL}/zoomed/spiderLegsZoomed.png`,
    head: `${S3_BASE_URL}/SpiderHead.png`,
    headZoomed: `${S3_BASE_URL}/zoomed/spiderHeadZoomed.png`,
    body: `${S3_BASE_URL}/SpiderBody.png`,
    bodyZoomed: `${S3_BASE_URL}/zoomed/spiderBodyZoomed.png`,
  },
  otter: {
    outline: `${S3_BASE_URL}/OtterOutline.png`,
    full: `${S3_BASE_URL}/otterFULL.png`,
    tail: `${S3_BASE_URL}/OtterTail.png`,
    tailZoomed: `${S3_BASE_URL}/zoomed/otterTailZoomed.png`,
    head: `${S3_BASE_URL}/OtterHead.png`,
    headZoomed: `${S3_BASE_URL}/zoomed/otterHeadZoomed.png`,
    body: `${S3_BASE_URL}/OtterBody.png`,
    bodyZoomed: `${S3_BASE_URL}/zoomed/otterBodyZoomed.png`,
  },
  lizard: {
    outline: `${S3_BASE_URL}/LizardOutline.png`,
    full: `${S3_BASE_URL}/lizardFULL.png`,
    tail: `${S3_BASE_URL}/LizardTail.png`,
    tailZoomed: `${S3_BASE_URL}/zoomed/lizardTailZoomed.png`,
    head: `${S3_BASE_URL}/LizardHead.png`,
    headZoomed: `${S3_BASE_URL}/zoomed/lizardHeadZoomed.png`,
    body: `${S3_BASE_URL}/LizardBody.png`,
    bodyZoomed: `${S3_BASE_URL}/zoomed/lizardBodyZoomed.png`,
  },
  lion: {
    outline: `${S3_BASE_URL}/LionOutline.png`,
    full: `${S3_BASE_URL}/lionFULL.png`,
    tail: `${S3_BASE_URL}/LionTail.png`,
    tailZoomed: `${S3_BASE_URL}/zoomed/lionTailZoomed.png`,
    head: `${S3_BASE_URL}/LionHead.png`,
    headZoomed: `${S3_BASE_URL}/zoomed/lionHeadZoomed.png`,
    body: `${S3_BASE_URL}/LionBody.png`,
    bodyZoomed: `${S3_BASE_URL}/zoomed/lionBodyZoomed.png`,
  },
  koel: {
    outline: `${S3_BASE_URL}/KoelOutline.png`,
    full: `${S3_BASE_URL}/koelFULL.png`,
    tail: `${S3_BASE_URL}/KoelTail.png`,
    tailZoomed: `${S3_BASE_URL}/zoomed/koelTailZoomed.png`,
    headBody: `${S3_BASE_URL}/KoelHeadBody.png`,
    headBodyZoomed: `${S3_BASE_URL}/zoomed/koelBodyAndHeadZoomed.png`,
    claws: `${S3_BASE_URL}/KoelClaws.png`,
    clawsZoomed: `${S3_BASE_URL}/zoomed/koelFeetZoomed.png`,
  },
  beetle: {
    outline: `${S3_BASE_URL}/BeetleOutline.png`,
    full: `${S3_BASE_URL}/beetleFULL.png`,
    head: `${S3_BASE_URL}/BeetleHead.png`,
    headZoomed: `${S3_BASE_URL}/zoomed/beetleHeadZoomed.png`,
    body: `${S3_BASE_URL}/BeetleBody.png`,
    bodyZoomed: `${S3_BASE_URL}/zoomed/beetleBodyAndLegsZoomed.png`,
    antenna: `${S3_BASE_URL}/BeetleAntenna.png`,
    antennaZoomed: `${S3_BASE_URL}/zoomed/beetleAntennaZoomed.png`,
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
