'use server';

/**
 * @fileOverview Implements a text translation flow using Genkit.
 *
 * - translateText - A function that translates a list of texts to a target language.
 * - TranslateTextInput - The input type for the translateText function.
 * - TranslateTextOutput - The return type for the translateText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateTextInputSchema = z.object({
  texts: z.array(z.string()).describe('A list of text strings to be translated.'),
  targetLanguage: z.string().describe('The target language for translation (e.g., "Surigaonon").'),
});
export type TranslateTextInput = z.infer<typeof TranslateTextInputSchema>;

const TranslateTextOutputSchema = z.object({
  translations: z.array(z.string()).describe('The list of translated text strings.'),
});
export type TranslateTextOutput = z.infer<typeof TranslateTextOutputSchema>;


export async function translateText(input: TranslateTextInput): Promise<TranslateTextOutput> {
  return translateTextFlow(input);
}


const translateTextPrompt = ai.definePrompt({
  name: 'translateTextPrompt',
  input: {schema: TranslateTextInputSchema},
  output: {schema: TranslateTextOutputSchema},
  prompt: `Translate the following English texts to {{targetLanguage}}. Return the translations in the same order as the input.

Input Texts:
{{#each texts}}
- "{{this}}"
{{/each}}
`,
});

const translateTextFlow = ai.defineFlow(
  {
    name: 'translateTextFlow',
    inputSchema: TranslateTextInputSchema,
    outputSchema: TranslateTextOutputSchema,
  },
  async (input) => {
    const {output} = await translateTextPrompt(input);
    return output!;
  }
);
