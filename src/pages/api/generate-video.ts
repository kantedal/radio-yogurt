// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import ffmpeg_static from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";
import background from "";
type Data = {};
const createVideo = async (soundSrc: string) => {
  return new Promise<string>((resolve, reject) => {
    let duration = "";
    const outputpath = "src/pages/api/output.mp4";
    ffmpeg()
      .setFfmpegPath(ffmpeg_static as any)
      .addInput(path.join(process.cwd(), "src/pages/api/background.png"))
      .addInput(soundSrc)
      .size("1080x1350")

      .on("end", async () => {
        console.log("Processing finished");
        resolve(outputpath);
      })
      .on("codecData", (data) => {
        duration = data.duration;
      })
      .on("error", (err) => {
        reject(err);
      })
      .save(path.join(process.cwd(), outputpath));
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let videoBuffer: Buffer;
  try {
    const soundSrc = path.join(process.cwd(), "src/pages/api/sound.mp3");
    const outputpath = await createVideo(soundSrc);

    videoBuffer = fs.readFileSync(outputpath);
    res.setHeader("Content-Type", "video/mp4");
    return res.status(200).send(videoBuffer);
  } catch (err) {
    console.log(err);
  }

  res.status(500).json({ error: "Some error" });
}
