// This file uses server-side code.
'use server';

/**
 * @fileOverview Provides AI-powered compliance suggestions for fisherfolk based on their vessel and gear specifics.
 *
 * - complianceSuggestion - A function that generates compliance suggestions.
 * - ComplianceSuggestionInput - The input type for the complianceSuggestion function.
 * - ComplianceSuggestionOutput - The return type for the complianceSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ComplianceSuggestionInputSchema = z.object({
  vesselType: z.string().describe('The type of vessel used for fishing.'),
  gearType: z.string().describe('The type of fishing gear being used.'),
  fishermanProfile: z.string().describe('Details about the fisherman profile, including experience and location.'),
});
export type ComplianceSuggestionInput = z.infer<typeof ComplianceSuggestionInputSchema>;

const ComplianceSuggestionOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of compliance suggestions based on the input.'),
  relevantRegulations: z.array(z.string()).describe('A list of relevant regulations from RA 8550 and Cantilan ordinances.'),
  necessaryActions: z.array(z.string()).describe('A list of necessary actions for compliance.'),
});
export type ComplianceSuggestionOutput = z.infer<typeof ComplianceSuggestionOutputSchema>;

export async function complianceSuggestion(input: ComplianceSuggestionInput): Promise<ComplianceSuggestionOutput> {
  return complianceSuggestionFlow(input);
}

const complianceSuggestionPrompt = ai.definePrompt({
  name: 'complianceSuggestionPrompt',
  input: {schema: ComplianceSuggestionInputSchema},
  output: {schema: ComplianceSuggestionOutputSchema},
  prompt: `You are an AI assistant specializing in providing regulatory compliance suggestions for fisherfolk in Cantilan, Philippines.

  Based on the fisherfolk's vessel type, fishing gear, and profile, provide suggestions for regulatory compliance, reference relevant regulations, and suggest necessary actions.

  Vessel Type: {{{vesselType}}}
  Gear Type: {{{gearType}}}
  Fisherman Profile: {{{fishermanProfile}}}

  Provide the suggestions, relevant regulations (citing RA 8550 and Cantilan ordinances where possible), and necessary actions in a clear and concise manner.
  Format the output in JSON format according to the schema description.
  `, config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const complianceSuggestionFlow = ai.defineFlow(
  {
    name: 'complianceSuggestionFlow',
    inputSchema: ComplianceSuggestionInputSchema,
    outputSchema: ComplianceSuggestionOutputSchema,
  },
  async input => {
    const {output} = await complianceSuggestionPrompt(input);
    return output!;
  }
);
