import { exec, spawn } from "child_process";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import util from "util";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../supabase/supabaseClient";

const execPromise = util.promisify(exec);

/**
 * Creates a video from a list of image URLs and an audio URL using FFmpeg
 *
 * @param imageUrls Array of image URLs to use as frames
 * @param audioUrl URL of the audio track to use as background
 * @returns URL to the generated MP4 video file
 */
export async function createVideoFromImagesAndAudio(
	imageUrls: string[],
	audioUrl: string,
): Promise<string> {
  console.log('started generating music video')
	const tempDir = path.join(
		process.env.TMPDIR || "/tmp",
		`birthday-video-${uuidv4()}`,
	);
	fs.mkdirSync(tempDir, { recursive: true });

	try {
		const validImageUrls = imageUrls.filter(
			(url) => url && typeof url === "string",
		);

		// Download and process images
		const imageFiles = await Promise.all(
			validImageUrls.map(async (url, i) => {
				try {
					const response = await fetch(url);
					if (!response.ok)
						throw new Error(`Failed to fetch image: ${response.status}`);

					const buffer = await response.arrayBuffer();
					const outputPath = path.join(
						tempDir,
						`image${String(i).padStart(3, "0")}.jpg`,
					);

					await sharp(Buffer.from(buffer))
						.resize(576, 1024) // 9:16 aspect ratio
						.jpeg()
						.toFile(outputPath);

					return outputPath;
				} catch (err) {
					return null;
				}
			}),
		).then((files) => files.filter(Boolean) as string[]);

		if (imageFiles.length === 0) {
			throw new Error("No valid images could be processed");
		}

		// Download audio
		const audioResponse = await fetch(audioUrl);
		if (!audioResponse.ok) {
			throw new Error(`Failed to fetch audio: ${audioResponse.status}`);
		}

		const audioBuffer = await audioResponse.arrayBuffer();
		const audioPath = path.join(tempDir, "audio.mp3");
		fs.writeFileSync(audioPath, Buffer.from(audioBuffer));

		// Get audio duration
		const { stdout } = await execPromise(
			`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${audioPath}"`,
		);
		const audioDuration = Number.parseFloat(stdout.trim());

		if (isNaN(audioDuration) || audioDuration <= 0) {
			throw new Error("Invalid audio duration detected");
		}

		// Calculate framerate based on audio duration and number of images
		const imageDuration = audioDuration / imageFiles.length;
		const framerate = 1 / imageDuration;
		const outputPath = path.join(tempDir, "output.mp4");

		// Construct FFmpeg command
		const ffmpegArgs = [
			"-y",
			"-framerate",
			`${framerate}`,
			"-i",
			path.join(tempDir, "image%03d.jpg"),
			"-i",
			audioPath,
			"-c:v",
			"libx264",
			"-profile:v",
			"baseline",
			"-level",
			"3.0",
			"-pix_fmt",
			"yuv420p",
			"-c:a",
			"aac",
			"-strict",
			"experimental",
			"-b:a",
			"192k",
			"-t",
			`${audioDuration}`,
			"-map",
			"0:v",
			"-map",
			"1:a",
			outputPath,
		];

		return new Promise((resolve, reject) => {
			const ffmpeg = spawn("ffmpeg", ffmpegArgs);
			let stderr = "";

			ffmpeg.stderr.on("data", (data) => {
				stderr += data.toString();
			});

			ffmpeg.on("close", async (code) => {
				if (code !== 0) {
					reject(new Error(`FFmpeg process failed with code ${code}`));
					return;
				}

				try {
					const videoBuffer = fs.readFileSync(outputPath);
					const { data, error } = await supabase()
						.storage.from("videos")
						.upload(`${uuidv4()}.mp4`, videoBuffer);
					if (error) {
						throw new Error(error.message);
					}
					const { data: signedUrlData } = await supabase()
						.storage.from("videos")
						.createSignedUrl(data.path, 999999);

					if (!signedUrlData) {
						throw new Error("Failed to create signed URL");
					}

					resolve(signedUrlData.signedUrl);
				} catch (err) {
          console.error(err)
					reject(
						new Error(
							`Failed to read output video: ${err instanceof Error ? err.message : String(err)}`,
						),
					);
				}
			});
		});
	} catch (error) {
		throw error;
	} finally {
		// Uncomment to enable cleanup
		// fs.rmSync(tempDir, { recursive: true, force: true });
	}
}
