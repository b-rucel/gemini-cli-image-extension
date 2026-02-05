import { getAccessToken } from './auth.js';
import fs from 'fs/promises';
import path from 'path';
export async function generateImage(prompt, count = 1, modelId = 'imagen-3.0-generate-001') {
    const token = await getAccessToken();
    // Use brucelim-com as default project, or allow override via env
    const projectId = process.env['GOOGLE_CLOUD_PROJECT'] || 'brucelim-com';
    const location = process.env['GOOGLE_CLOUD_LOCATION'] || 'us-central1';
    const isGemini = modelId.toLowerCase().startsWith('gemini');
    const method = isGemini ? 'generateContent' : 'predict';
    // Vertex AI URL
    const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${modelId}:${method}`;
    let payload;
    if (isGemini) {
        // Gemini generateContent payload
        payload = {
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                candidateCount: count,
            }
        };
    }
    else {
        // Imagen predict payload
        payload = {
            instances: [{ prompt }],
            parameters: {
                sampleCount: count,
            },
        };
    }
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            const errorText = await response.text();
            let errorJson;
            try {
                errorJson = JSON.parse(errorText);
            }
            catch {
                errorJson = { error: { message: errorText } };
            }
            if (response.status === 403 && errorText.includes('aiplatform.googleapis.com')) {
                throw new Error(`Vertex AI API is not enabled in project "${projectId}". Please enable it at: https://console.cloud.google.com/apis/library/aiplatform.googleapis.com?project=${projectId}`);
            }
            throw new Error(`Vertex AI request failed (${response.status}): ${errorJson.error?.message || errorText}`);
        }
        const data = await response.json();
        const files = [];
        const outputDir = path.join(process.cwd(), 'oauth-generated-images');
        await fs.mkdir(outputDir, { recursive: true });
        // Helper to save base64
        const saveImage = async (base64Data, index) => {
            const buffer = Buffer.from(base64Data, 'base64');
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `img-${timestamp}-${index + 1}.png`;
            const filepath = path.join(outputDir, filename);
            await fs.writeFile(filepath, buffer);
            files.push(filepath);
        };
        if (isGemini) {
            // Parse Gemini response
            // Structure: candidates[].content.parts[].inlineData.data
            const candidates = data.candidates || [];
            for (let i = 0; i < candidates.length; i++) {
                const parts = candidates[i].content?.parts || [];
                for (const part of parts) {
                    if (part.inlineData && part.inlineData.data) {
                        await saveImage(part.inlineData.data, i);
                    }
                }
            }
        }
        else {
            // Parse Imagen response
            const predictions = data.predictions || [];
            for (let i = 0; i < predictions.length; i++) {
                const prediction = predictions[i];
                if (prediction.bytesBase64Encoded) {
                    await saveImage(prediction.bytesBase64Encoded, i);
                }
            }
        }
        if (files.length === 0) {
            throw new Error('No image data found in Vertex AI response.');
        }
        return files;
    }
    catch (error) {
        console.error('Image generation failed:', error);
        throw error;
    }
}
