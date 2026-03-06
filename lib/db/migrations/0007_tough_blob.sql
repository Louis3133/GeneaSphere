PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_threes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text NOT NULL,
	`isPublic` integer NOT NULL,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_threes`("id", "name", "slug", "description", "isPublic", "userId") SELECT "id", "name", "slug", "description", "isPublic", "userId" FROM `threes`;--> statement-breakpoint
DROP TABLE `threes`;--> statement-breakpoint
ALTER TABLE `__new_threes` RENAME TO `threes`;--> statement-breakpoint
PRAGMA foreign_keys=ON;