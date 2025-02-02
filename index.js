import { NextResponse } from "next/server";
import satori from "satori";

var file = null;

async function load_font() {
    if (!file) {
        file = await fetch(
            "https://rsms.me/inter/font-files/Inter-Regular.woff2"
        ).then((res) => res.arrayBuffer())
    }
    return file
}

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
                    data: await load_font(),
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
