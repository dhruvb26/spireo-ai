import { NextResponse } from "next/server";

const LINKEDIN_URLS = ["https://www.linkedin.com/in/garyvaynerchuk/"];

export async function GET() {
  const posts = [];

  try {
    for (const url of LINKEDIN_URLS) {
      try {
        const response = await fetch(
          `https://fresh-linkedin-profile-data.p.rapidapi.com/get-profile-posts?linkedin_url=${encodeURIComponent(url)}`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-key":
                "043a625255msh91a33243b22a5d6p1b5611jsn09304ae17781",
              "x-rapidapi-host": "fresh-linkedin-profile-data.p.rapidapi.com",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        posts.push(...data.data);
      } catch (error) {
        console.error(`Error fetching posts for ${url}:`, error);
        // Continue to the next URL if there's an error with the current one
      }
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error in GET function:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
