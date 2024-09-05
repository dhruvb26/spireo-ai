import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { creators } from "@/server/db/schema";
import { createPost, getAllPosts } from "@/actions/post";
import { env } from "@/env";

const LINKEDIN_URLS = ["https://www.linkedin.com/in/garyvaynerchuk/"];
const RAPIDAPI_KEY = env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = "fresh-linkedin-profile-data.p.rapidapi.com";

export async function GET() {
  if (!RAPIDAPI_KEY) {
    console.error("API key not configured");
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 },
    );
  }

  try {
    const results = await Promise.all(LINKEDIN_URLS.map(fetchLinkedInData));
    return NextResponse.json({ message: "Data fetched successfully", results });
  } catch (error) {
    console.error("Error in GET function:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

async function fetchLinkedInData(url: string) {
  try {
    const creatorData = await fetchCreatorProfile(url);
    await db.insert(creators).values(creatorData).onConflictDoUpdate({
      target: creators.id,
      set: creatorData,
    });

    const posts = await fetchCreatorPosts(url);
    await Promise.all(
      posts.map((post: any) =>
        createPost({ ...post, creatorId: creatorData.id }),
      ),
    );

    return { creator: creatorData, postsCount: posts.length };
  } catch (error) {
    console.error(`Error fetching data for ${url}:`, error);
    return { url, error: (error as Error).message };
  }
}

async function fetchCreatorProfile(url: string) {
  const response = await fetch(
    `https://${RAPIDAPI_HOST}/get-linkedin-profile?linkedin_url=${encodeURIComponent(url)}`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": RAPIDAPI_HOST,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return {
    id: data.data.profile_id,
    profile_url: data.data.linkedin_url,
    full_name: data.data.full_name,
    profile_image_url: data.data.profile_image_url,
    headline: data.data.headline,
  };
}

async function fetchCreatorPosts(url: string) {
  const response = await fetch(
    `https://${RAPIDAPI_HOST}/get-profile-posts?linkedin_url=${encodeURIComponent(url)}`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": RAPIDAPI_HOST,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.data.map((post: any) => ({
    id: post.urn,
    images: post.images,
    document: post.document,
    video: post.video,
    numAppreciations: post.num_appreciations,
    numComments: post.num_comments,
    numEmpathy: post.num_empathy,
    numInterests: post.num_interests,
    numLikes: post.num_likes,
    numReposts: post.num_reposts,
    postUrl: post.post_url,
    reshared: post.reshared,
    text: post.text,
    time: post.time,
    urn: post.urn,
  }));
}

export async function POST() {
  try {
    const posts = await getAllPosts();
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error in POST function:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
