ALTER TABLE `members` ADD `isAdopted` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `members` ADD `parent1` integer REFERENCES members(id);--> statement-breakpoint
ALTER TABLE `members` ADD `parent2` integer REFERENCES members(id);