import { generateImage } from '../dist/imageGen.js';

async function test() {
  console.log('Starting image generation test...');

  try {
    // Test 1: Default Imagen Model
    console.log('\n--- Testing Default (Imagen 3) ---');
    const prompt1 = 'a futuristic city with neon lights, digital art style';
    const files1 = await generateImage(prompt1, 1);
    console.log('SUCCESS (Imagen)!');
    console.log('Generated files:', files1);

    // Test 2: Gemini Model
    console.log('\n--- Testing Gemini 2.5 Flash Image ---');
    const prompt2 = 'a cute robot eating a banana, carton style';
    const files2 = await generateImage(prompt2, 1, 'gemini-2.5-flash-image');
    console.log('SUCCESS (Gemini)!');
    console.log('Generated files:', files2);

    // // Test 3: Gemini 3 Model
    // console.log('\n--- Testing gemini-3-pro-image-preview ---');
    // const prompt3 = 'a futuristic city with neon lights, digital art style';
    // const files3 = await generateImage(prompt3, 1, 'gemini-3-pro-image-preview');
    // console.log('SUCCESS (Gemini 3)!');
    // console.log('Generated files:', files3);


  } catch (error) {
    console.error('FAILED!');
    console.error(error);
    process.exit(1);
  }
}

test();
