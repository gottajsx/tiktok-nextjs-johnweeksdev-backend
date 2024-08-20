// https://appwrite.io/docs/references/cloud/server-nodejs/databases#createCollection

const sdk = require("node-appwrite");

require('dotenv').config();

const client = new sdk.Client();

client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.YOUR_PROJECT_ID)
    .setKey(process.env.YOUR_API_KEY);

const databases = new sdk.Databases(client);

var tiktokDatabase;
var profileCollection;

async function prepareDatabase() {
    // tiktok database
    tiktokDatabase = await databases.create(sdk.ID.unique(),'TiktokDatabase');
    
    // profile collection
    profileCollection = await databases.createCollection(tiktokDatabase.$id, sdk.ID.unique(), 'Profile', 
        ['read("any")', 'create("users")', 'update("users")', 'delete("users")'],
    )
    await databases.createStringAttribute(tiktokDatabase.$id, profileCollection.$id, 'image', 30, true);
    await databases.createStringAttribute(tiktokDatabase.$id, profileCollection.$id, 'bio', 80, false);
    await databases.createStringAttribute(tiktokDatabase.$id, profileCollection.$id, 'user_id', 30, true);
    await databases.createStringAttribute(tiktokDatabase.$id, profileCollection.$id, 'name', 50, true);
    await databases.createIndex(tiktokDatabase.$id, profileCollection.$id, 'user_id', 'key', ['user_id'], ['ASC'])
    await databases.createIndex(tiktokDatabase.$id, profileCollection.$id, 'names', 'fulltext', ['name'], ['ASC'])
    
    // like collection
    likeCollection = await databases.createCollection(tiktokDatabase.$id, sdk.ID.unique(), 'Like',
        ['read("any")', 'create("users")', 'update("users")', 'delete("users")'],
    )
    await databases.createStringAttribute(tiktokDatabase.$id, likeCollection.$id, 'user_id', 30, true)
    await databases.createStringAttribute(tiktokDatabase.$id, likeCollection.$id, 'post_id', 30, true)
    await databases.createIndex(tiktokDatabase.$id, likeCollection.$id, 'user_id', 'key', ['user_id'], ['ASC'])
    await databases.createIndex(tiktokDatabase.$id, likeCollection.$id, 'id', 'unique', ['$id'], ['ASC'])
    await databases.createIndex(tiktokDatabase.$id, likeCollection.$id, 'post_id', 'key', ['post_id'], ['ASC'])
    
    // post collection
    postCollection = await databases.createCollection(tiktokDatabase.$id, sdk.ID.unique(), 'Post',
        ['read("any")', 'create("users")', 'update("users")', 'delete("users")'],
    )
    await databases.createStringAttribute(tiktokDatabase.$id, postCollection.$id, 'user_id', 30, true)
    await databases.createStringAttribute(tiktokDatabase.$id, postCollection.$id, 'video_url', 30, true)
    await databases.createStringAttribute(tiktokDatabase.$id, postCollection.$id, 'text', 150, true)
    await databases.createDatetimeAttribute(tiktokDatabase.$id, postCollection.$id, 'created_at', true)
    await databases.createIndex(tiktokDatabase.$id, postCollection.$id, 'user_id', 'key', ['user_id'], ['ASC'])

    // comment collection
    commentCollection = await databases.createCollection(tiktokDatabase.$id, sdk.ID.unique(), 'Comment',
        ['read("any")', 'create("users")', 'update("users")', 'delete("users")'],
    )
    await databases.createStringAttribute(tiktokDatabase.$id, commentCollection.$id, 'user_id', 30, true)
    await databases.createStringAttribute(tiktokDatabase.$id, commentCollection.$id, 'post_id', 30, true)
    await databases.createStringAttribute(tiktokDatabase.$id, commentCollection.$id, 'text', 120, true)
    await databases.createDatetimeAttribute(tiktokDatabase.$id, commentCollection.$id, 'created_at', true)
    await databases.createIndex(tiktokDatabase.$id, commentCollection.$id, 'post_id', 'key', ['post_id'], ['ASC'])
}

async function runAllTasks() {
    await prepareDatabase();
}
runAllTasks();

