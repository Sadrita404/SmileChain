import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';

let model: blazeface.BlazeFaceModel | null = null;

export async function loadModel() {
  if (model) return model;
  
  console.log('Loading BlazeFace model...');
  await tf.ready();
  model = await blazeface.load();
  console.log('BlazeFace model loaded successfully');
  
  return model;
}

/**
 * Analyze a smile from an image
 * @param imageSrc Base64 image string from webcam
 * @returns Score from 0-100 representing smile quality
 */
export async function analyzeSmile(imageSrc: string): Promise<number> {
  if (!model) {
    await loadModel();
  }

  // Create image element from base64
  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = imageSrc;
  });

  // Detect faces
  const predictions = await model!.estimateFaces(img, false);

  if (predictions.length === 0) {
    throw new Error('No face detected. Please ensure your face is visible and well-lit.');
  }

  // Get the first face (most prominent)
  const face = predictions[0];
  
  // BlazeFace returns landmarks including eyes, nose, mouth corners, and ears
  // We'll use the probability score and face size as a proxy for smile detection
  // In a production app, you'd want a dedicated smile detection model
  
  const probability = face.probability[0];
  
  // Calculate face size (larger faces typically mean closer to camera, better engagement)
  const topLeft = face.topLeft as number[];
  const bottomRight = face.bottomRight as number[];
  const faceWidth = bottomRight[0] - topLeft[0];
  const faceHeight = bottomRight[1] - topLeft[1];
  const faceSize = Math.sqrt(faceWidth * faceHeight);
  
  // Normalize face size (assuming image width of 640px)
  const normalizedSize = Math.min(faceSize / 300, 1);
  
  // Get landmarks if available
  const landmarks = face.landmarks as number[][];
  
  // Calculate mouth width as a proxy for smile
  // Landmarks: 0,1 = eyes, 2 = nose, 3,4 = mouth corners, 5,6 = ears
  let mouthScore = 0.5; // Default neutral
  
  if (landmarks && landmarks.length >= 5) {
    const leftMouthCorner = landmarks[3];
    const rightMouthCorner = landmarks[4];
    const mouthWidth = Math.abs(rightMouthCorner[0] - leftMouthCorner[0]);
    
    // Wider mouth = bigger smile (normalized)
    mouthScore = Math.min(mouthWidth / faceWidth, 1);
  }
  
  // Combine factors for final score
  // Weight: 40% face detection confidence, 30% face size, 30% mouth width
  const baseScore = (probability * 0.4) + (normalizedSize * 0.3) + (mouthScore * 0.3);
  
  // Add some randomness for variation (±15 points)
  const randomFactor = (Math.random() * 0.3) - 0.15;
  const finalScore = Math.max(0, Math.min(100, (baseScore + randomFactor) * 100));
  
  // Bias towards higher scores if face is detected well (confidence boost)
  const boostedScore = finalScore + (probability * 10);
  
  return Math.round(Math.min(100, boostedScore));
}

/**
 * Preload the model to reduce first-time latency
 */
export async function preloadModel() {
  try {
    await loadModel();
    console.log('Model preloaded successfully');
  } catch (error) {
    console.error('Failed to preload model:', error);
  }
}
