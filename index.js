import { NextResponse } from "next/server";
import satori from "satori";

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  if (req.method !== "POST") {
    return new NextResponse("Only POST requests are allowed", { status: 405 });
  }

  try {
    const { jsx, width = 600, height = 400 } = await req.json();
    if (!jsx) {
      return new NextResponse("Missing JSX input", { status: 400 });
    }

    const svg = await satori(eval(jsx), {
      width: parseInt(width, 10),
      height: parseInt(height, 10),
      fonts: [
        {
          name: "Inter",
          data: await fetch(
            "https://rsms.me/inter/font-files/Inter-Regular.woff2"
          ).then((res) => res.arrayBuffer()),
          weight: 400,
          style: "normal",
        },
      ],
    });

    return new NextResponse(svg, {
      headers: { "Content-Type": "image/svg+xml" },
    });
  } catch (error) {
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}
