import prisma from "@/lib/prisma";
import { getUser } from "@/utils/getUser";

export async function GET(request: Request) {
  try {
    const user = await getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const goals = await prisma.goal.findMany({
      where: {
        userId: user.id,
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(goals);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "An error occurred." }, { status: 500 });
  }
}
