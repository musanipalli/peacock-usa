import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

// Helper to convert file to base64
const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]); // remove prefix "data:image/jpeg;base64,"
    reader.onerror = error => reject(error);
});

export const VideoGenerator: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [apiKeySelected, setApiKeySelected] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    useEffect(() => {
        const checkKey = async () => {
            if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
                setApiKeySelected(true);
            }
        };
        checkKey();
    }, []);

    const handleSelectKey = async () => {
        if (!window.aistudio) {
            setError("AI Studio environment not found.");
            return;
        }
        await window.aistudio.openSelectKey();
        setApiKeySelected(true); // Assume success to re-render UI
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setVideoUrl(null); // Reset video if new image is uploaded
            setError(null);
        }
    };

    const handleGenerateVideo = async () => {
        if (!imageFile || !prompt) {
            setError("Please upload an image and provide a prompt.");
            return;
        }
        if (!apiKeySelected) {
            setError("Please select an API key first.");
            return;
        }

        setIsLoading(true);
        setLoadingMessage('Initializing video generation...');
        setError(null);
        setVideoUrl(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const imageBase64 = await toBase64(imageFile);

            setLoadingMessage('Sending request to Veo model...');
            let operation = await ai.models.generateVideos({
                model: 'veo-3.1-fast-generate-preview',
                prompt,
                image: {
                    imageBytes: imageBase64,
                    mimeType: imageFile.type,
                },
                config: {
                    numberOfVideos: 1,
                    resolution: '720p', // Defaulting to 720p for faster generation
                    aspectRatio: aspectRatio,
                }
            });

            setLoadingMessage('Video is generating... This can take a few minutes. Please wait.');
            while (!operation.done) {
                await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
                operation = await ai.operations.getVideosOperation({ operation: operation });
            }

            setLoadingMessage('Finalizing video...');
            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (!downloadLink) {
                throw new Error("Generation finished, but no video link was found.");
            }

            const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
            if (!videoResponse.ok) {
                throw new Error(`Failed to download video: ${videoResponse.statusText}`);
            }
            
            const videoBlob = await videoResponse.blob();
            const url = URL.createObjectURL(videoBlob);
            setVideoUrl(url);

        } catch (err: any) {
            console.error("Video generation failed:", err);
            const errorMessage = err.message || "An unknown error occurred.";
            setError(`Generation failed: ${errorMessage}`);

            if (errorMessage.includes("Requested entity was not found.")) {
                setApiKeySelected(false);
                setError('Your API Key seems invalid. Please re-select a valid API key and try again.');
            }

        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    };

    const renderContent = () => {
        if (!apiKeySelected) {
            return (
                <div className="text-center bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold font-serif mb-4">API Key Required</h2>
                    <p className="text-gray-600 mb-6">
                        This feature uses the Veo video generation model, which requires an API key with billing enabled.
                    </p>
                    <button onClick={handleSelectKey} className="bg-peacock-magenta text-white py-2 px-6 rounded-full font-bold transition-colors hover:bg-peacock-sapphire">
                        Select API Key
                    </button>
                    <p className="text-xs text-gray-500 mt-4">
                        For more information on billing, visit <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-peacock-sapphire hover:underline">ai.google.dev/gemini-api/docs/billing</a>.
                    </p>
                </div>
            );
        }

        return (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold font-serif mb-6">Create Your Video</h2>
                    <div className="space-y-6">
                        {/* Image Upload */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">1. Upload an Image</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="mx-auto h-32 w-auto rounded-md" />
                                    ) : (
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    )}
                                    <div className="flex text-sm text-gray-600">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-peacock-sapphire hover:text-peacock-magenta focus-within:outline-none">
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            </div>
                        </div>
                        {/* Prompt */}
                        <div>
                            <label htmlFor="prompt" className="text-sm font-medium text-gray-700 block mb-2">2. Describe the Video</label>
                            <textarea
                                id="prompt"
                                name="prompt"
                                rows={4}
                                className="w-full p-2 border rounded-md focus:ring-peacock-magenta focus:border-peacock-magenta"
                                placeholder="e.g., The person in the image is now walking through a futuristic city at night."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                        </div>
                        {/* Aspect Ratio */}
                         <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">3. Choose Aspect Ratio</label>
                            <div className="flex space-x-4">
                                <label className="flex items-center"><input type="radio" name="aspectRatio" value="16:9" checked={aspectRatio === '16:9'} onChange={() => setAspectRatio('16:9')} className="h-4 w-4 text-peacock-magenta focus:ring-peacock-magenta border-gray-300" /> <span className="ml-2">Landscape (16:9)</span></label>
                                <label className="flex items-center"><input type="radio" name="aspectRatio" value="9:16" checked={aspectRatio === '9:16'} onChange={() => setAspectRatio('9:16')} className="h-4 w-4 text-peacock-magenta focus:ring-peacock-magenta border-gray-300" /> <span className="ml-2">Portrait (9:16)</span></label>
                            </div>
                        </div>
                        {/* Generate Button */}
                        <button
                            onClick={handleGenerateVideo}
                            disabled={isLoading || !imageFile || !prompt}
                            className="w-full bg-peacock-magenta text-white py-3 rounded-full font-bold transition-colors hover:bg-peacock-sapphire disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Generating...' : 'Generate Video'}
                        </button>
                    </div>
                </div>

                <div className="bg-gray-100 p-8 rounded-lg flex items-center justify-center">
                    {isLoading ? (
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-peacock-magenta mx-auto"></div>
                            <p className="mt-4 font-semibold">{loadingMessage}</p>
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-600 bg-red-100 p-4 rounded-md">
                            <h3 className="font-bold">Error</h3>
                            <p>{error}</p>
                        </div>
                    ) : videoUrl ? (
                        <video src={videoUrl} controls autoPlay loop className="w-full rounded-lg shadow-md"></video>
                    ) : (
                        <div className="text-center text-gray-500">
                             <svg className="mx-auto h-20 w-20 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                            <p className="mt-4">Your generated video will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-6xl mx-auto">
                 <button onClick={onBack} className="text-peacock-sapphire hover:underline mb-6 font-medium">&larr; Back to Home</button>
                 <h1 className="text-3xl font-bold font-serif mb-8 text-peacock-dark">AI Video Generator</h1>
                 {renderContent()}
            </div>
        </div>
    );
};