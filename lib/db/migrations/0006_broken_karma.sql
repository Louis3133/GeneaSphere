PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_members` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`born` integer NOT NULL,
	`death` integer,
	`threesId` integer NOT NULL,
	`isAdopted` integer DEFAULT false,
	`parent1` integer,
	`parent2` integer,
	FOREIGN KEY (`threesId`) REFERENCES `threes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`parent1`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`parent2`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_members`("id", "name", "description", "born", "death", "threesId", "isAdopted", "parent1", "parent2") SELECT "id", "name", "description", "born", "death", "threesId", "isAdopted", "parent1", "parent2" FROM `members`;--> statement-breakpoint
DROP TABLE `members`;--> statement-breakpoint
ALTER TABLE `__new_members` RENAME TO `members`;--> statement-breakpoint
PRAGMA foreign_keys=ON;