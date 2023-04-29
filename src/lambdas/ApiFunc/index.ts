import {Context, Handler} from "aws-lambda";
import {PollyClient, SynthesizeSpeechCommand} from "@aws-sdk/client-polly";
import {SynthesizeSpeechCommandInput} from "@aws-sdk/client-polly/dist-types/commands/SynthesizeSpeechCommand";
import * as querystring from "querystring";

export const lambda_handler: Handler = async (event, context: Context) => {
    let text: string | undefined = undefined
    if (event.body) {
        const body = Buffer.from(event.body, "base64").toString("utf-8");
        const query = querystring.parse(body);
        if (typeof query.text === "string") {
            text = query.text;
        }
    }
    if (!text) {
        return {
            statusCode: 422,
        };
    }

    process.stdout.write(`text: ${text}\n`);
    const voice = await getVoice(text);
    return {
        headers: {
            "Content-Type": "audio/mp3",
        },
        statusCode: 200,
        body: Buffer.from(voice).toString("base64"),
        isBase64Encoded: true,
    };
}

const getVoice = async (text: string): Promise<Uint8Array> => {
    const params: SynthesizeSpeechCommandInput = {
        Engine: "neural",
        LanguageCode: "ja-JP",
        VoiceId: "Kazuha",
        OutputFormat: "mp3",
        SampleRate: "8000",
        Text: text,
        TextType: "text",
    };
    const pollyClient = new PollyClient({});
    const res = await pollyClient.send(new SynthesizeSpeechCommand(params));
    return res.AudioStream!.transformToByteArray();
}
