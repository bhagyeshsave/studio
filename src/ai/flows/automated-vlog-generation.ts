
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
import {z} from 'genkit';
import wav from 'wav';

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
  visualSummaryImage: z
    .string()
    .describe(
      'A data URI of an image summarizing the vlog content, using Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // data URI
    ),
  narrationAudio: z
    .string()
    .describe(
      'A data URI of the narration audio for the vlog, using Base64 encoding. Expected format: \'data:audio/wav;base64,<encoded_data>\'.' // data URI for audio/wav
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
      visualSummaryImage: z.string().describe("A prompt for an image generation model to create a visual summary of the vlog content."),
      narrationAudioScript: z.string().describe("The script for the narration audio.")
    })
  },
  prompt: `You are an AI assistant that generates content for automated vlogs of local areas.

  Based on the location and trending topics, create a compelling vlog title, description, a prompt for an image generation AI, and a narration audio script.

  Location: {{{location}}}
  Trending Topics: {{{trendingTopics}}}

  Instructions:
  1.  Come up with a vlog title that captures the essence of the location and trending topics.
  2.  Write a concise vlog description (around 50 words) summarizing the content.
  3.  Compose a narration script (around 100 words) to guide the visual summary and provide context to viewers.
  4.  Create a detailed prompt for an image generation model that describes the overall theme and objects for a visual summary image.

  Output the vlog title, description, image prompt, and narration script in the required format.
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

    // Generate the visual summary image
    const {media: visualSummaryImage} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: vlogContent.visualSummaryImage, // Assuming vlogContent.visualSummaryImage contains image generation prompt
      config: {
        responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE, IMAGE only won't work
      },
    });

    if (!visualSummaryImage) {
      throw new Error('Failed to generate visual summary image.');
    }

    // Generate the narration audio from the narration audio script
    const {media: narrationAudioMedia} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {voiceName: 'Algenib'},
          },
        },
      },
      prompt: vlogContent.narrationAudioScript,
    });

    if (!narrationAudioMedia) {
      throw new Error('Failed to generate narration audio.');
    }

    const audioBuffer = Buffer.from(
      narrationAudioMedia.url.substring(narrationAudioMedia.url.indexOf(',') + 1),
      'base64'
    );
    const narrationAudio = 'data:audio/wav;base64,' + (await toWav(audioBuffer));

    return {
      vlogTitle: vlogContent.vlogTitle,
      vlogDescription: vlogContent.vlogDescription,
      visualSummaryImage: visualSummaryImage.url,
      narrationAudio,
    };
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
