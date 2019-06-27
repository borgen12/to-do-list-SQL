CREATE TABLE "to-dos" (
    "id" serial primary key,
    "task" varchar(300) not null,
    "complete" varchar(200) DEFAULT 'No'
);
