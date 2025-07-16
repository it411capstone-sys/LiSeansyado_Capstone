'use server';

/**
 * @fileOverview Implements an AI-powered compliance check for admin users.
 *
 * - complianceCheckAdmin -  A function that checks user inputs against regulations.
 * - ComplianceCheckAdminInput - The input type for the complianceCheckAdmin function.
 * - ComplianceCheckAdminOutput - The return type for the complianceCheckAdmin function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ComplianceCheckAdminInputSchema = z.object({
  vesselDetails: z.string().describe('Details of the vessel being registered.'),
  fishingGearDetails: z.string().describe('Details of the fishing gear being registered.'),
  fishermanProfile: z.string().describe('Profile information of the fisherman.'),
});
export type ComplianceCheckAdminInput = z.infer<typeof ComplianceCheckAdminInputSchema>;

const ComplianceCheckAdminOutputSchema = z.object({
  complianceIssues: z
    .array(z.string())
    .describe('List of potential compliance issues identified.'),
  recommendedRegulations:
    z.array(z.string()).describe('List of relevant regulations from RA 8550 and Cantilan ordinances.'),
  suggestedActions:
    z.array(z.string()).describe('List of suggested actions for ensuring compliance.'),
});
export type ComplianceCheckAdminOutput = z.infer<typeof ComplianceCheckAdminOutputSchema>;

export async function complianceCheckAdmin(input: ComplianceCheckAdminInput): Promise<ComplianceCheckAdminOutput> {
  return complianceCheckAdminFlow(input);
}

const complianceCheckPrompt = ai.definePrompt({
  name: 'complianceCheckPrompt',
  input: {schema: ComplianceCheckAdminInputSchema},
  output: {schema: ComplianceCheckAdminOutputSchema},
  prompt: `You are an AI assistant that reviews vessel and fishing gear registration data and identifies potential compliance issues based on RA 8550 and Cantilan ordinances.

  Analyze the following information and provide a list of compliance issues, recommended regulations, and suggested actions.

  Vessel Details: {{{vesselDetails}}}
  Fishing Gear Details: {{{fishingGearDetails}}}
  Fisherman Profile: {{{fishermanProfile}}}

  Compliance Issues:
  - (List any potential compliance issues identified)

  Recommended Regulations:
  - (List relevant regulations from RA 8550 and Cantilan ordinances)

  Suggested Actions:
  - (List suggested actions for ensuring compliance)
  `,
});

const complianceCheckAdminFlow = ai.defineFlow(
  {
    name: 'complianceCheckAdminFlow',
    inputSchema: ComplianceCheckAdminInputSchema,
    outputSchema: ComplianceCheckAdminOutputSchema,
  },
  async input => {
    const {output} = await complianceCheckPrompt(input);
    return output!;
  }
);
