
// src/ai/flows/automated-vlog-generation.ts
'use server';

/**
 * @fileOverview Generates automated visual summaries (vlogs) of popular or local areas.
 *
 * - generateVlog - A function that generates a vlog based on a location and trending topics.
 * - GenerateVlogInput - The input type for the generateVlog function.
 * - GenerateVlogOutput - The return type for the generateVlog function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

const GenerateVlogInputSchema = z.object({
  location: z.string().describe('The location for which to generate the vlog.'),
  trendingTopics: z
    .string()
    .describe('Trending topics in the specified location.'),
});
export type GenerateVlogInput = z.infer<typeof GenerateVlogInputSchema>;

const GenerateVlogOutputSchema = z.object({
  vlogTitle: z.string().describe('The title of the generated vlog.'),
  vlogDescription: z.string().describe('A short description of the vlog.'),
  vlogVideo: z
    .string()
    .describe(
      'A data URI of the generated vlog video, using Base64 encoding. Expected format: \'data:video/mp4;base64,<encoded_data>\'.' // data URI for video/mp4
    ),
});
export type GenerateVlogOutput = z.infer<typeof GenerateVlogOutputSchema>;

export async function generateVlog(input: GenerateVlogInput): Promise<GenerateVlogOutput> {
  return generateVlogFlow(input);
}

const vlogContentPrompt = ai.definePrompt({
  name: 'vlogContentPrompt',
  input: {schema: GenerateVlogInputSchema},
  output: {schema: z.object({
      vlogTitle: z.string().describe("The title of the generated vlog."),
      vlogDescription: z.string().describe("A short description of the vlog."),
      videoPrompt: z.string().describe("A detailed prompt for a video generation model to create a visual summary of the vlog content."),
    })
  },
  prompt: `You are an AI assistant that generates content for automated vlogs of local areas.

  Based on the location and trending topics, create a compelling vlog title, description, and a video generation prompt.

  Location: {{{location}}}
  Trending Topics: {{{trendingTopics}}}

  Instructions:
  1.  Come up with a vlog title that captures the essence of the location and trending topics.
  2.  Write a concise vlog description (around 50 words) summarizing the content.
  3.  Create a detailed prompt for a video generation model. The prompt should describe a video, about 5 seconds long, that visually represents the location and trending topics. For example: "A cinematic 5-second video showing [description of scenes related to topics] in [location]."

  Output the vlog title, description, and video prompt in the required format.
  `,
});

const generateVlogFlow = ai.defineFlow(
  {
    name: 'generateVlogFlow',
    inputSchema: GenerateVlogInputSchema,
    outputSchema: GenerateVlogOutputSchema,
  },
  async input => {
    const {output: vlogContent} = await vlogContentPrompt(input);

    if (!vlogContent) {
      throw new Error('Failed to generate vlog content.');
    }
    
    let { operation } = await ai.generate({
        model: googleAI.model('veo-2.0-generate-001'),
        prompt: vlogContent.videoPrompt,
        config: {
          durationSeconds: 5,
          aspectRatio: '16:9',
        },
      });

      if (!operation) {
        throw new Error('Expected the model to return an operation');
      }

      // Wait until the operation completes.
      while (!operation.done) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        operation = await ai.checkOperation(operation);
      }

      if (operation.error) {
        throw new Error('failed to generate video: ' + operation.error.message);
      }

      const video = operation.output?.message?.content.find((p) => !!p.media);
      if (!video || !video.media) {
        throw new Error('Failed to find the generated video');
      }

      const fetch = (await import('node-fetch')).default;
      const videoDownloadResponse = await fetch(
        `${video.media.url}&key=${process.env.GEMINI_API_KEY}`
      );
      if (
        !videoDownloadResponse ||
        videoDownloadResponse.status !== 200 ||
        !videoDownloadResponse.body
      ) {
        throw new Error('Failed to fetch video');
      }
      
      const videoBuffer = await videoDownloadResponse.arrayBuffer();
      const base64Video = Buffer.from(videoBuffer).toString('base64');

    return {
      vlogTitle: vlogContent.vlogTitle,
      vlogDescription: vlogContent.vlogDescription,
      vlogVideo: `data:video/mp4;base64,${base64Video}`,
    };
  }
);
