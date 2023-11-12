import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { RecipeValidator } from "@/lib/validators/recipe-form";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { title, cooktime, ingredients, instructions, content } =
      RecipeValidator.parse(body);

    const session = await getAuthSession();
    console.log("your title", session?.user.username);
    const username = session?.user.username;
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // verify user is subscribed to passed subreddit id
    const accountVerified = await db.user.findFirst({
      where: {
        username,
      },
    });

    if (!accountVerified) {
      return new Response("You have not created an account", { status: 403 });
    }

    await db.recipe.create({
      data: {
        title,
        cooktime,
        ingredients,
        instructions,
        content,
        authorId: session.user.id,
      },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response(
      "Could not create recipe at this time. Please try again later",
      { status: 500 }
    );
  }
}
