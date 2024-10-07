"use server"

import { db } from "@/drizzle/db"
import { EventTable } from "@/drizzle/schema"
import { eventFormSchema } from "@/schema/events"
import { auth } from "@clerk/nextjs/server"
import "use-server"
import { any, z } from "zod"

export async function createEvent(
    unsafeData: z.infer<typeof eventFormSchema>
) {
    const { userId } = auth()
    const { success, data } = eventFormSchema.safeParse(unsafeData)

    if(!success || userId == null) {
        return { error: true };
    }

    await db.insert(EventTable).values({...data, clerkUserId: userId })
}