import { NextResponse } from "next/server";
import { getAccessToken, getLinkedInId, checkAccess } from "@/actions/user";
import { getServerAuthSession } from "@/server/auth";
import { updateDownloadUrl } from "@/actions/draft";
export const maxDuration = 60;

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

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const postId = formData.get("postId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > 100 * 1024 * 1024) {
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

    // Poll for document status until it's AVAILABLE
    let documentData;
    let retries = 0;
    const maxRetries = 10;
    const retryInterval = 2000; // 2 seconds

    console.log(
      `Starting polling for document status. Document URN: ${documentUrn}`,
    );

    while (retries < maxRetries) {
      const getDocumentUrl = `https://api.linkedin.com/rest/documents/${documentUrn}`;
      console.log(`Polling attempt ${retries + 1}. URL: ${getDocumentUrl}`);

      const documentResponse = await fetch(getDocumentUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "LinkedIn-Version": "202406",
        },
      });

      if (!documentResponse.ok) {
        console.error(
          `GET document failed with status: ${documentResponse.status}`,
        );
        throw new Error(
          `GET document failed with status: ${documentResponse.status}`,
        );
      }

      documentData = await documentResponse.json();
      console.log(`Document status: ${documentData.status}`);

      if (documentData.status === "AVAILABLE") {
        console.log("Document is now available. Exiting polling loop.");
        break;
      }

      console.log(`Document not yet available. Retrying in ${retryInterval}ms`);
      await new Promise((resolve) => setTimeout(resolve, retryInterval));
      retries++;
    }

    if (!documentData || documentData.status !== "AVAILABLE") {
      console.error("Document processing timed out or failed");
      throw new Error("Document processing timed out or failed");
    }

    console.log("Document processing completed successfully");

    if (postId) {
      await updateDownloadUrl(postId, documentData.downloadUrl);
      console.log(`Updated download URL for post ${postId}`);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Document uploaded successfully",
        documentUrn: documentUrn,
        downloadUrl: documentData.downloadUrl,
      },
      { status: 200 },
    );
  } catch (err: any) {
    console.error("Error in file upload:", err);
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
