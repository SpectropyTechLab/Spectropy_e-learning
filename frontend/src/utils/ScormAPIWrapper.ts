// src/utils/ScormAPIWrapper.ts
import axios from "axios";

interface ScormData {
    [key: string]: string;
}

class ScormAPI {
    private data: ScormData = {};
    private initialized = false;
    private userId: number;
    private contentId: number;

    constructor(userId: number, contentId: number) {
        this.userId = userId;
        this.contentId = contentId;
    }

    LMSInitialize() {
        this.initialized = true;
        console.log("SCORM initialized");
        return "true";
    }

    LMSSetValue(name: string, value: string) {
        if (!this.initialized) return "false";
        console.log("SetValue:", name, value);
        this.data[name] = value;
        return "true";
    }

    LMSGetValue(name: string) {
        return this.data[name] || "";
    }

    async LMSCommit() {
        console.log("Committing SCORM data:", this.data);

        try {
            await axios.post("/api/scorm/commit", {
                userId: this.userId,
                contentId: this.contentId,
                data: this.data,
                attemptNo: 1, // or dynamic attempt number if you implement multiple
            });
            return "true";
        } catch (error) {
            console.error("Failed to commit SCORM data:", error);
            return "false";
        }
    }


    LMSFinish() {
        console.log("SCORM session finished");
        this.LMSCommit();
        return "true";
    }
}

export default ScormAPI;
