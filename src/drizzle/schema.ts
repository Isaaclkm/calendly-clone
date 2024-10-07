import { DAYS_OF_WEEK_IN_ORDER } from "@/app/data/constants";
import { relations } from "drizzle-orm";
import { index } from "drizzle-orm/mysql-core";
import { pgTable, uuid, text, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";

const createdAt = timestamp("createdAt").notNull().defaultNow()
const updatedAt = timestamp("updateddAt").notNull().defaultNow().$onUpdate(() => new Date())


export const EventTable = pgTable("events", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(), 
    description: text("description"),
    durationInMinutes: integer("durationInMinutes").notNull(),
    clerkUserId: text("clerkUserId").notNull(),
    isActive: boolean("isActive").notNull().default(true),
    createdAt, 
    updatedAt,
})

export const ScheduleTable = pgTable("schedules", { 
    id: uuid("id").primaryKey().defaultRandom(),
    timezone: text("timezone").notNull(),
    clerkUserId: text("clerkUserId").notNull().unique(),
    createdAt,
    updatedAt,
})

export const scheduleRelations = relations(ScheduleTable, ({many}) => ({
    availabilities: many(ScheduleAvailabilityTable)
}))

export const scheduleDayOfWeekEnum = pgEnum("day", DAYS_OF_WEEK_IN_ORDER)

export const ScheduleAvailabilityTable = pgTable("scheduleAvailabilities", 
{
    id: uuid("id").primaryKey().defaultRandom(),
    scheduleId: uuid("scheduleId")
        .notNull()
        .references(() => ScheduleTable.id, { onDelete: "cascade"}),
    startTime: text("startTime").notNull(),
    endTime: text("endTime").notNull(),
    dayOfWeek: scheduleDayOfWeekEnum("dayOfWeek").notNull(),
},
 (table: any) => ({
        scheduleIdIndex: index("scheduleIdIndex").on(table.scheduleId),
  })
)

export const ScheduleAvailabilityRelations = relations
(ScheduleAvailabilityTable, ({ one }) => ({
    schedule: one(ScheduleTable, {
        fields: [ScheduleAvailabilityTable.scheduleId],
        references: [ScheduleTable.id]
    })
}))