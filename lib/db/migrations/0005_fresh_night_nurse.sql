CREATE TABLE `unions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`person1` integer NOT NULL,
	`person2` integer NOT NULL,
	`status` text,
	FOREIGN KEY (`person1`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`person2`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action
);
