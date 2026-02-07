import { Blazy } from "../backend-framework/core/blazy-edge/src/core";
import fs from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import { exec } from "node:child_process";
import { title } from "node:process";

const execAsync = promisify(exec);

// Types
type Music = {
    id: string;
    title: string;
    artist: string;
    filePath: string;
    uploadStrategy: "url" | "file";
    createdAt: Date;
    duration?: number;
    format?: string;
};

// In-memory database
const musicDatabase: Music[] = [];

// Upload strategies
interface UploadStrategy {
    upload(data: any): Promise<{ filePath: string; format?: string; duration?: number }>;
}

class UrlUploadStrategy implements UploadStrategy {
    async upload(data: { url: string; title: string }): Promise<{ filePath: string; format?: string; duration?: number }> {
        // Download mp4 file from URL
        const downloadsDir = path.join(process.cwd(), "downloads", "music");

        if (!fs.existsSync(downloadsDir)) {
            fs.mkdirSync(downloadsDir, { recursive: true });
        }

        const fileName = `${Date.now()}-${data.title.replace(/\s+/g, "_")}.mp4`;
        const filePath = path.join(downloadsDir, fileName);

        // Download file using curl or fetch
        try {
            const response = await fetch(data.url);
            if (!response.ok) {
                throw new Error(`Failed to download: ${response.statusText}`);
            }

            const buffer = await response.arrayBuffer();
            fs.writeFileSync(filePath, Buffer.from(buffer));

            return {
                filePath,
                format: "mp4",
            };
        } catch (error) {
            throw new Error(`Failed to download file: ${error.message}`);
        }
    }
}

class FileUploadStrategy implements UploadStrategy {
    async upload(data: { filePath: string; fileName: string }): Promise<{ filePath: string; format?: string; duration?: number }> {

        // Handle file upload from local downloads folder
        const sourceFile = data.filePath;

        if (!fs.existsSync(sourceFile)) {
            throw new Error(`Source file not found: ${sourceFile}`);
        }

        const musicDir = path.join(process.cwd(), "downloads", "music");

        if (!fs.existsSync(musicDir)) {
            fs.mkdirSync(musicDir, { recursive: true });
        }

        const fileName = `${Date.now()}-${data.fileName}`;
        const destPath = path.join(musicDir, fileName);

        // Copy file to music directory
        fs.copyFileSync(sourceFile, destPath);

        const ext = path.extname(fileName).slice(1);

        return {
            filePath: destPath,
            format: ext || "unknown",
        };
    }
}

// Create app instance
const app = new Blazy();

// Upload strategy factory
const uploadStrategies = {
    url: new UrlUploadStrategy(),
    file: new FileUploadStrategy(),
};



app.fromNormalFunc("getAllMusic", () => {
    return {
        music: musicDatabase.map(m => ({
            id: m.id,
            title: m.title,
            artist: m.artist,
            uploadStrategy: m.uploadStrategy,
            createdAt: m.createdAt,
            duration: m.duration,
            format: m.format,
        })),
    };
});

app.post({
    path: "/music/:id",
    handeler: args => {

        const music = musicDatabase.find(m => m.id === args.id);

        if (!music) {
            throw new Error("Music not found");
        }

        return music;

    },
    args: { id: "" }
});

app.post({
    path: "",
    handeler: async args => {
        const { url, title, artist } = args.body;

        try {
            const strategy = uploadStrategies.url;
            const result = await strategy.upload({ url, title });

            const music: Music = {
                id: Math.random().toString(36).substr(2, 9),
                title,
                artist,
                filePath: result.filePath,
                uploadStrategy: "url",
                createdAt: new Date(),
                format: result.format,
                duration: result.duration,
            };

            musicDatabase.push(music);

            return {
                success: true,
                music: {
                    id: music.id,
                    title: music.title,
                    artist: music.artist,
                    uploadStrategy: music.uploadStrategy,
                    createdAt: music.createdAt,
                },
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    },
    args:
    {
        body: {

            url: "",
            title: "",
            artist: ""
        }
    }
},
)

// Upload music from local file
app.fromNormalFunc("uploadMusicFromFile", async (args: { body: { filePath: string; fileName: string; title: string; artist: string } }) => {

    const { filePath, fileName, title, artist } = args.body;

    try {
        const strategy = uploadStrategies.file;
        const result = await strategy.upload({ filePath, fileName });

        const music: Music = {
            id: Math.random().toString(36).substr(2, 9),
            title,
            artist,
            filePath: result.filePath,
            uploadStrategy: "file",
            createdAt: new Date(),
            format: result.format,
            duration: result.duration,
        };

        musicDatabase.push(music);

        return {
            success: true,
            music: {
                id: music.id,
                title: music.title,
                artist: music.artist,
                uploadStrategy: music.uploadStrategy,
                createdAt: music.createdAt,
            },
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
        };
    }
});

// Delete music
app.fromNormalFunc("deleteMusic", (args: { body: { id: string } }) => {
    const index = musicDatabase.findIndex(m => m.id === args.body.id);

    if (index === -1) {
        throw new Error("Music not found");
    }

    const music = musicDatabase[index];

    // Delete file from filesystem
    if (fs.existsSync(music.filePath)) {
        fs.unlinkSync(music.filePath);
    }

    musicDatabase.splice(index, 1);

    return {
        success: true,
        message: "Music deleted successfully",
    };
});

// Update music metadata
app.fromNormalFunc("updateMusic", (args: { body: { id: string; title?: string; artist?: string } }) => {
    const music = musicDatabase.find(m => m.id === args.body.id);

    if (!music) {
        throw new Error("Music not found");
    }

    if (args.body.title) {
        music.title = args.body.title;
    }

    if (args.body.artist) {
        music.artist = args.body.artist;
    }

    return {
        success: true,
        music: {
            id: music.id,
            title: music.title,
            artist: music.artist,
            uploadStrategy: music.uploadStrategy,
            createdAt: music.createdAt,
        },
    };
});

// Export the app
export default app;
export { app, musicDatabase };
