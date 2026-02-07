// Example usage of the Music Handler API

// Example 1: Upload music from URL
const uploadFromUrl = {
  url: "https://example.com/sample-music.mp4",
  title: "Sample Song",
  artist: "Sample Artist"
};

console.log("1. Upload from URL:");
console.log("POST /rpc/uploadMusicFromUrl");
console.log(JSON.stringify(uploadFromUrl, null, 2));
console.log();

// Example 2: Upload music from file
const uploadFromFile = {
  filePath: "/home/user/Downloads/my-music.mp4",
  fileName: "my-music.mp4",
  title: "My Favorite Song",
  artist: "Favorite Artist"
};

console.log("2. Upload from File:");
console.log("POST /rpc/uploadMusicFromFile");
console.log(JSON.stringify(uploadFromFile, null, 2));
console.log();

// Example 3: Get all music
console.log("3. Get All Music:");
console.log("POST /rpc/getAllMusic");
console.log("{}");
console.log();

// Example 4: Get music by ID
const getMusicById = {
  id: "abc123"
};

console.log("4. Get Music by ID:");
console.log("POST /rpc/getMusicById");
console.log(JSON.stringify(getMusicById, null, 2));
console.log();

// Example 5: Update music
const updateMusic = {
  id: "abc123",
  title: "Updated Title",
  artist: "Updated Artist"
};

console.log("5. Update Music:");
console.log("POST /rpc/updateMusic");
console.log(JSON.stringify(updateMusic, null, 2));
console.log();

// Example 6: Delete music
const deleteMusic = {
  id: "abc123"
};

console.log("6. Delete Music:");
console.log("POST /rpc/deleteMusic");
console.log(JSON.stringify(deleteMusic, null, 2));
console.log();

// Using fetch (for browser or Node.js)
async function exampleApiCall() {
  try {
    const response = await fetch("http://localhost:3000/rpc/uploadMusicFromUrl", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: "https://example.com/music.mp4",
        title: "Test Song",
        artist: "Test Artist"
      }),
    });

    const data = await response.json();
    console.log("Response:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Uncomment to run:
// exampleApiCall();
