import { AssemblyAI } from'assemblyai';

const client = new AssemblyAI({
    apiKey: 'c1db9f2624cf4cbdae6f61f0e6ee20d6',
});

//function to generate transcript
export const transcribeVideo = async (videoUrl2:string) => {
    try {
        // Request parameters
        const data = { audio_url: videoUrl2 };
        const transcript = await client.transcripts.create(data);

        // Polling for transcript completion
        let transcriptData;
        do {
            transcriptData = await client.transcripts.get(transcript.id);
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds
        } while (transcriptData.status !== 'completed');

        // Process the transcript
        const transcriptText = transcriptData.text;
        const paragraphs = transcriptText?.split('. ').map(p => p.trim()).filter(p => p.length > 0).join('\n\n');
        // console.log(paragraphs);

        if (transcriptText) console.log("Transcript generated: ", paragraphs);

        return paragraphs;

    } catch (error) {
        console.error("Error during transcription:", error);
    }
};