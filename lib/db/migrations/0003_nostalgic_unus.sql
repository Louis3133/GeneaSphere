CREATE TABLE `members` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`born` integer NOT NULL,
	`death` integer,
	`threesId` integer NOT NULL,
	FOREIGN KEY (`threesId`) REFERENCES `threes`(`id`) ON UPDATE no action ON DELETE no action
);
