// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import ffmpeg_static from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";
import background from "";
type Data = {};
const createVideo = async (soundSrc: string) => {
  return new Promise((resolve, reject) => {
    let duration = "";

    ffmpeg()
      .setFfmpegPath(ffmpeg_static as any)
      .addInput(path.join(process.cwd(), "src/pages/api/background.png"))
      .addInput(soundSrc)
      .size("1080x1350")

      .on("end", async () => {
        console.log("Processing finished");
        resolve({});
      })
      .on("codecData", (data) => {
        duration = data.duration;
      })
      .on("error", (err) => {
        reject(err);
      })
      .save("output.mp4");
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const soundSrc = path.join(process.cwd(), "src/pages/api/sound.mp3");
    await createVideo(soundSrc);
  } catch (err) {
    console.log(err);
  }
  res.status(200).json({ name: "John Doe" });
}
