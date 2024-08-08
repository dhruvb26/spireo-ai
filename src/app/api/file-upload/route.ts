"use server";
import { NextResponse } from "next/server";
import { getAccessToken, getLinkedInId } from "@/actions/user";
import { checkAccess } from "@/actions/user";
import { getServerAuthSession } from "@/server/auth";

export async function POST(req: Request) {
  try {
    const hasAccess = await checkAccess();

    if (!hasAccess) {
      return NextResponse.json({ error: "Not authorized!" }, { status: 401 });
    }

    const session = await getServerAuthSession();

    if (!session) {
      return NextResponse.json({ error: "Not authorized!" }, { status: 401 });
    }

    const userId = session.user.id;
    const accessToken = await getAccessToken(userId);
    const linkedInId = await getLinkedInId(userId);

    if (!accessToken || !linkedInId) {
      return NextResponse.json(
        { error: "Missing access token or LinkedIn ID" },
        { status: 400 },
      );
    }

    // Initialize upload for document
    const initResponse = await fetch(
      "https://api.linkedin.com/rest/documents?action=initializeUpload",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0",
          "LinkedIn-Version": "202406",
        },
        body: JSON.stringify({
          initializeUploadRequest: {
            owner: `urn:li:person:${linkedInId}`,
          },
        }),
      },
    );

    if (!initResponse.ok) {
      const errorData = await initResponse.json();
      throw new Error(`LinkedIn API error: ${JSON.stringify(errorData)}`);
    }

    const initData = await initResponse.json();
    const {
      value: { uploadUrl, document: documentUrn },
    } = initData;

    // Get the file from the request
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Check file size and type
    if (file.size > 100 * 1024 * 1024) {
      // 100MB limit
      return NextResponse.json(
        { error: "File size exceeds 100MB limit" },
        { status: 400 },
      );
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Unsupported file type. Only PDF, PPTX, and DOCX are allowed",
        },
        { status: 400 },
      );
    }

    // Upload the file to LinkedIn
    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/octet-stream",
        "LinkedIn-Version": "202406",
        Authorization: `Bearer ${accessToken}`,
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed with status: ${uploadResponse.status}`);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Document uploaded successfully",
        documentUrn: documentUrn,
      },
      { status: 200 },
    );
  } catch (err: any) {
    console.error("Error in POST handler", err);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: err.message,
      },
      { status: 500 },
    );
  }
}
